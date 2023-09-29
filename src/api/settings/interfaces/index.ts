export type Groups = {
  id: number;
  name: string;
  status: number;
  created_at: number;
  updated_at: number;
};

export type Template = {
  text: string;
  group_id: number;
  group: {
    created_at: number;
    id: number;
    name: string;
    status: number;
    updated_at: number;
  };
  active: boolean;
  shortcuts: string[];
  user_id: number;
};

export type CreateTemplate = {
  active: boolean;
  group_id: number;
  shortcuts: string[];
  text: string;
};

export type ChatTimeoutes = {
  chat_timeout_transfer: number;
  chat_timeout_inactive: number;
  chat_timeout_close: number;
};

export type AutoMessage = {
  welcome_message: string;
};
