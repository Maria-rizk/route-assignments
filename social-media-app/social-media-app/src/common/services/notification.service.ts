import admin from "firebase-admin";
import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } from "../../config/config.service.js";

/**
 * Push-notification service (Firebase Cloud Messaging).
 *
 * Firebase credentials are optional for local development: if they are not
 * provided in `.env`, this service logs a warning once and no-ops instead of
 * crashing the app on startup.
 */
export class Notification {
  private client: admin.app.App | null = null;

  constructor() {
    const isConfigured = Boolean(FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY);

    if (!isConfigured) {
      console.warn(
        "[notifications] Firebase credentials are not set - push notifications are disabled. " +
          "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env to enable them."
      );
      return;
    }

    this.client = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
    });
  }

  async sendNotification({ token, data }: { token: string; data: { title: string; body: string } }) {
    if (!this.client) {
      console.log(`[notifications] (disabled) would send to ${token}:`, data);
      return null;
    }

    const message = {
      token,
      notification: {
        title: data.title,
        body: data.body,
      },
    };

    return this.client.messaging().send(message);
  }

  async sendNotifications({ tokens, data }: { tokens: string[]; data: { title: string; body: string } }) {
    const results = await Promise.allSettled(tokens.map((token) => this.sendNotification({ token, data })));
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
      console.warn(`[notifications] ${failed.length}/${tokens.length} push notifications failed to send`);
    }
    return results;
  }
}

export const notificationService = new Notification();
