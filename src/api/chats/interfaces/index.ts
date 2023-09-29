import { GetAgent } from "@/api/agents/interfaces";

export type Customer = {
  id: string;
  email: string;
  login: string;
  name: string;
  params: any;
  group_id: number;
  user_id: number;
  status: number;
  created_at: number;
  updated_at: number;
};

export type Manager = {
  is_primary: boolean;
  manager: GetAgent;
  manager_id: string;
  room_id: number;
};

export type GetChat = {
  id: number;
  group_id: number;
  customer_id: string;
  status: number;
  managers: Manager[];
  created_at?: number;
  updated_at?: number;
  customer: Customer;
};

export type Message = {
  id: string;
  room_id: number;
  cross_channel_id?: number;
  from_user_id: string;
  user_type: string;
  msg: string;
  message_id: string;
  message_type: string;
  created_at: number;
  updated_at: number;
  reply_id?: string;
  reply_message?: Room;
  files?: File[];
};

export type File = {
  name: string;
  size: number;
  type: string;
  audio: boolean;
  duration: number;
  url: string;
  base64: string;
  progress?: number;
};

export type MessageCreate = {
  msg: string;
  files?: File[];
};

export type Room = {
  id: number;
  prev: number;
  group_id: number;
  customer_id: string;
  status: number;
  created_at: number;
  updated_at: number;
  room_id: number;
  manager_id: string;
  is_primary: boolean;
  primary_user_id: string;
  messages: Message[];
  lastMessage?: Message;
};

export type MessageNewEvent = {
  message: Message;
};

export type RoomUpdateTagsEvent = {
  tags: Tag[];
  roomId: number;
};

export type ManagersUpdateEvent = {
  manager: GetAgent;
};

export type RoomStatusEvent = {
  room: Room;
};

export type Tag = {
  name: string;
  active: boolean;
  id?: number;
};

export type TagCreate = {
  name: string;
};

export type ChatFormQuestions = {
  id: string;
  question: string;
  required: boolean;
  type: string;
  answers: string[];
};

export type ChatForm = {
  id?: number;
  active: boolean;
  info?: string;
  questions?: ChatFormQuestions[];
};

export type CustomerDetail = {
  id: string;
  name: string;
  email: string;
  type: string;
  present: boolean;
  created_at: number;
  last_visit: {
    id: number;
    started_at: string;
    ip: string;
    user_agent: string;
    geolocation: {
      country: string;
      country_code: string;
      region: string;
      city: string;
      timezone: string;
      latitude: string;
      longitude: string;
    };
    last_pages: [
      {
        opened_at: string;
        url: string;
        title: string;
      }
    ];
  };
  statistics: {
    chats_count: number;
    threads_count: number;
    visits_count: number;
    page_views_count: number;
    greetings_shown_count: number;
    greetings_accepted_count: number;
  };
  agent_last_event_created_at: string;
  customer_last_event_created_at: string;
  email_verified: boolean;
};

export type VideoCall = {
  msgCode: number;
  roomId: number;
  userId: string;
  chanelId: string;
};
