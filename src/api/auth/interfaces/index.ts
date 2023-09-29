import { userData } from "@/store/modules/types";
import { Room } from "@/api/chats/interfaces";
import { GetGroup } from "@/api/groups/interfaces";
import { Performance } from "@/api/interfaces";

export type LoginResult = {
  success: boolean;
  data: {
    email: string;
    roles: Array<string>;
    accessToken: string;
    refreshToken: string;
    expires: Date;
    user: userData;
    serverTime: Date;
  };
};

export type UserInfo = {
  success: boolean;
  data: {
    user: userData;
    rooms: Room[];
    groups: GetGroup[];
    performance: Performance;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expires: Date;
    user: userData;
  };
};
