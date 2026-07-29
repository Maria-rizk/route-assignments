import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { APPLICATION_NAME, UPLOADS_DIR } from "../../config/config.service.js";
import { StorageApproachEnum, UploadApproachEnum } from "../enums/index.js";
import { BadRequestException } from "../exception/domain.exception.js";

/**
 * Local disk storage service.
 *
 * This is a drop-in replacement for the old AWS S3 service used by this
 * project. It keeps the exact same method names/shapes so every module
 * (post, comment, chat, user, notification...) keeps working without
 * touching business logic - only the storage backend changes.
 *
 * Files are written under `UPLOADS_DIR` (defaults to `./uploads`), using the
 * same "key" convention the S3 version used:
 *   <APPLICATION_NAME>/<path>/<uuid>__<originalFileName>
 *
 * Those keys are stored in Mongo exactly like before, and served back to
 * clients through the `/uploads/*` route in `app.bootstrap.ts`.
 */

const ROOT = resolve(UPLOADS_DIR);

function buildKey(path: string, originalname: string): string {
  return `${APPLICATION_NAME}/${path}/${randomUUID()}__${originalname}`;
}

function fullPath(key: string): string {
  const target = resolve(ROOT, key);
  // Guard against path traversal outside of the uploads root.
  if (!target.startsWith(ROOT)) {
    throw new BadRequestException("Invalid file key");
  }
  return target;
}

class LocalStorageService {
  async uploadAsset({
    storageApproach = StorageApproachEnum.MEMORY,
    path = "general",
    file,
  }: {
    storageApproach?: StorageApproachEnum;
    path?: string;
    file: Express.Multer.File;
  }): Promise<string> {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    const key = buildKey(path, file.originalname);
    const destination = fullPath(key);
    await mkdir(dirname(destination), { recursive: true });

    if (storageApproach === StorageApproachEnum.MEMORY) {
      await writeFile(destination, file.buffer);
    } else {
      await copyFile(file.path, destination);
      await rm(file.path, { force: true }).catch(() => {});
    }

    return key;
  }

  async uploadLargeAsset({
    storageApproach = StorageApproachEnum.DISK,
    path = "general",
    file,
  }: {
    storageApproach?: StorageApproachEnum;
    path?: string;
    file: Express.Multer.File;
  }): Promise<{ key: string }> {
    const key = await this.uploadAsset({ storageApproach, path, file });
    return { key };
  }

  async uploadAssets({
    uploadApproach = UploadApproachEnum.SMALL,
    storageApproach = StorageApproachEnum.MEMORY,
    path = "general",
    files,
  }: {
    uploadApproach?: UploadApproachEnum;
    storageApproach?: StorageApproachEnum;
    path?: string;
    files: Express.Multer.File[];
  }): Promise<string[]> {
    if (uploadApproach === UploadApproachEnum.LARGE) {
      const results = await Promise.all(
        files.map((file) => this.uploadLargeAsset({ storageApproach, path, file }))
      );
      return results.map((r) => r.key);
    }

    return Promise.all(files.map((file) => this.uploadAsset({ storageApproach, path, file })));
  }

  /**
   * The S3 version returned a pre-signed URL the client could PUT the file
   * to directly. There is no equivalent concept for local disk storage, so
   * this returns a normal API path the client can POST/PUT the file to
   * instead (a regular multipart upload handled by this server).
   */
  async createPreSignedUploadLink({
    path = "general",
    Originalname,
  }: {
    path?: string;
    Originalname: string;
    ContentType?: string | undefined;
    expiresIn?: number;
  }): Promise<{ url: string; key: string }> {
    if (!Originalname) {
      throw new BadRequestException("No file provided");
    }
    const key = buildKey(path, Originalname);
    return { url: `/uploads/direct/${encodeURIComponent(key)}`, key };
  }

  async createPreSignedFetchLink({
    key,
    fileName,
    download,
  }: {
    key: string;
    fileName?: string | undefined;
    download?: string | undefined;
    expiresIn?: number;
  }): Promise<string> {
    const params = new URLSearchParams();
    if (download) params.set("download", download);
    if (fileName) params.set("fileName", fileName);
    const query = params.toString();
    return `/uploads/${key}${query ? `?${query}` : ""}`;
  }

  async getAsset({ Key }: { Key: string }): Promise<{ Body: NodeJS.ReadableStream; ContentType?: string }> {
    const target = fullPath(Key);
    await stat(target); // throws if it doesn't exist
    return { Body: createReadStream(target), ContentType: undefined };
  }

  async deleteAsset({ Key }: { Key: string }): Promise<void> {
    await rm(fullPath(Key), { force: true });
  }

  async deleteAssets({ Keys }: { Keys: { Key: string }[] }): Promise<void> {
    await Promise.all(Keys.map(({ Key }) => this.deleteAsset({ Key })));
  }

  async listFolderDir({ prefix }: { prefix: string }): Promise<{ Contents: { Key: string }[] }> {
    const folder = resolve(ROOT, APPLICATION_NAME, prefix);
    const files: string[] = [];

    async function walk(dir: string) {
      let entries;
      try {
        entries = await readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else files.push(relative(ROOT, full));
      }
    }

    await walk(folder);
    return { Contents: files.map((Key) => ({ Key })) };
  }

  async deleteFolderByPrefix({ prefix }: { prefix: string }): Promise<void> {
    const folder = resolve(ROOT, APPLICATION_NAME, prefix);
    if (!folder.startsWith(ROOT)) {
      throw new BadRequestException("Invalid folder prefix");
    }
    await rm(folder, { recursive: true, force: true });
  }
}

export const storageService = new LocalStorageService();
