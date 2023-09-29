export type ChatsTotal = {
  interval: number;
  count: number;
};

export type ChatsSatisfaction = {
  interval: string;
  good: number;
  bad: number;
};

export type ChatsDuration = {
  interval: string;
  count: number;
  duration: number;
};

export type ChatsResponseTime = {
  interval: number;
  count: number;
  first_response_time: number;
};

export type TagUsed = {
  name: string;
  count: number;
  percent: string;
};

export type ChatsTags = {
  interval: string;
  tags: TagUsed[];
};

export type TaggedOrNotTaggedChat = {
  count: number;
  percent: string;
};

export type ChatStatus = {
  interval: string;
  tagged?: TaggedOrNotTaggedChat;
  notTagged?: TaggedOrNotTaggedChat;
};
