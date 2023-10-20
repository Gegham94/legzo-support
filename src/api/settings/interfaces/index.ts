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

export type ChatTimeoutes = [
  {
    id: number;
    code: string;
    name: string;
    description: string;
    active: boolean;
    value: string;
    default_value: string;
    created_at: string;
    updated_at: string;
  }
];

export type AutoMessage = {
  welcome_message: string;
};
