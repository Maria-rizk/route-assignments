import { redisclient } from "../../DB/db.redis.js";
import { EmailEnum } from "../enums/email.enum.js";
import { Types } from "mongoose";

/* =========================
   🔐 Types
========================= */

interface SetOptions {
  key: string;
  value: unknown;
  ttl?: number;
}





export class RedisService {
  constructor() {}

  revokeTokenKey = ({
    userId,
    jti,
  }: {
    userId: Types.ObjectId | string;
    jti: string;
  }): string => {
    return `RevokeToken::${userId}::${jti}`;
  };

  otpKey = ({
    email,
    subject = EmailEnum.ConfirmEmail,
  }: {
    email: string;
  subject?: EmailEnum | string;
  }): string => {
    return `OTP::User::${email}::${subject}`;
  };

  blockOtpKey = ({
    email,
    subject = EmailEnum.ConfirmEmail,
  }: {
    email: string;
  subject?: EmailEnum | string;
  }): string => {
    return `OTP::User::${email}::${subject}::Block`;
  };

  maxAttemptOtpKey = ({
    email,
    subject = EmailEnum.ConfirmEmail,
  }:
   {
    email: string;
  subject?: EmailEnum | string;
  }): string => {
    return `OTP::User::${email}::${subject}::MaxTrial`;
  };

  baseRevokeTokenKey = (userId: Types.ObjectId | string): string => {
    return `RevokeToken::${userId}`;
  };

  FCM_key = (userId: Types.ObjectId | string): string => {
    return `user:FCM:${userId}`;
  };


set = async ({
  key,
  value,
  ttl,
}: SetOptions): Promise<void> => {
  try {
    const data = JSON.stringify(value);

    if (ttl !== undefined) {
      await redisclient.set(key, data, { EX: ttl });
    } else {
      await redisclient.set(key, data);
    }
  } catch (error) {
    console.log(`redis set error: ${error}`);
  }
};
  update = async ({
    key,
    value,
    ttl,
  }: SetOptions): Promise<number> => {
    try {
      const exists = await redisclient.exists(key);
      if (!exists) return 0;

      const payload: SetOptions = { key, value };
      if (ttl !== undefined) payload.ttl = ttl;

      await this.set(payload);
      return 1;
    } catch (error) {
      console.log(`redis update error: ${error}`);
      return 0;
    }
  };

get = async <T = unknown>(key: string): Promise<T | null> => {
  try {
    const data = await redisclient.get(key) as string | null;

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  } catch (error) {
    console.log(`fail in redis get operation ${error}`);
    return null;
  }
};
  ttl = async (key: string): Promise<number> => {
    return redisclient.ttl(key);
  };

  exist = async (key: string): Promise<number> => {
    return redisclient.exists(key);
  };

  expire = async ({
    key,
    ttl,
  }: {
    key: string;
    ttl: number;
  }): Promise<number> => {
    return redisclient.expire(key, ttl);
  };

 mGet = async (keys: string[]): Promise<(string | null)[]> => {
  try {
    if (!keys.length) return [];
    return (await redisclient.mGet(keys)) as (string | null)[];
  } catch (error) {
    console.log(`fail in redis mGet operation ${error}`);
    return [];
  }
};

keys = async (prefix: string): Promise<string[]> => {
  try {
    return await redisclient.keys(`${prefix}*`);
  } catch (error) {
    console.log(`fail in redis keys operation ${error}`);
    return [];
  }
};
  deleteKey = async (keys: string[]): Promise<number> => {
    if (!keys.length) return 0;

    return redisclient.del(keys as [string, ...string[]]);
  };

  incr = async (key: string): Promise<number> => {
    return redisclient.incr(key);
  };


  addFCM = async (
    userId: Types.ObjectId | string,
    FCMToken: string
  ) => {
    return redisclient.sAdd(this.FCM_key(userId), FCMToken);
  };

  removeFCM = async (
    userId: Types.ObjectId | string,
    FCMToken: string
  ) => {
    return redisclient.sRem(this.FCM_key(userId), FCMToken);
  };

  getFCMs = async (
    userId: Types.ObjectId | string
  ): Promise<string[]> => {
    return redisclient.sMembers(this.FCM_key(userId));
  };

  hasFCMs = async (
    userId: Types.ObjectId | string
  ): Promise<number> => {
    return redisclient.sCard(this.FCM_key(userId));
  };

  removeFCMUser = async (
    userId: Types.ObjectId | string
  ): Promise<number> => {
    return redisclient.del(this.FCM_key(userId));
  };


 socketkey(userId:Types.ObjectId | string) {
    return `user:sockets:${userId}`;
}
 async  addSocket(userId:Types.ObjectId | string, socketId:string) {
    return await redisclient.sAdd(this.socketkey(userId), socketId);
}

 async  removeSocket(userId:Types.ObjectId | string, socketId:string) {
    return await redisclient.sRem(this.socketkey(userId), socketId);
}

 async  getSockets(userId:Types.ObjectId | string) {
    return await redisclient.sMembers(this.socketkey(userId));
}

 async  hasSockets(userId:Types.ObjectId | string) {
    return await redisclient.sCard( this.socketkey(userId));
}

 async  removeUser(userId:Types.ObjectId | string) {
    return await redisclient.del( this.socketkey(userId));
}
}



export default new RedisService();  