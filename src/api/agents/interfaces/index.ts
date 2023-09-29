import { GetGroup } from "@/api/groups/interfaces";
import { Room } from "@/api/chats/interfaces";
import { Performance } from "@/api/interfaces";

export type BaseAgent = {
  email: string;
  name: string;
  role: number;
  status: number;
  logging_status: number;
  avatar: string;
  groups: GetGroup[];
  password: string;
  password_confirmation: string;
  params?: {
    readyAfterLogin: boolean;
    maxActiveTickets: number;
  };
};

export type GetAgent = BaseAgent & {
  id: string;
  avatar_link: string;
  onlineStatus: number;
  performance?: Performance;
  created_at?: string;
  updated_at?: string;
};

export type Support = {
  id: number;
  group_id: number;
  customer_id: string;
  status: number;
  created_at: number;
  updated_at: number;
};

export type ManagerStatusResult = {
  success: boolean;
  data: {
    rooms: Room[];
    supportRequests: Support[];
  };
};

export type ManagerConnectedEvent = {
  room: Room;
  manager: GetAgent;
};
