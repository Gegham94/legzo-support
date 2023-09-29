import { GetAgent } from "@/api/agents/interfaces";
import { Performance } from "@/api/interfaces";

export type BaseGroup = {
  name: string;
  status: number;
  customers?: GetAgent[];
  customersDetail?: GetAgent[];
  users?: GetAgent[];
  onlineStatusCount?: number;
};

export type GetGroup = BaseGroup & {
  id: number;
  created_at: string;
  updated_at: string;
  performance?: Performance;
};
