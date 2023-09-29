export type Traffic = {
  name: string;
  email: string;
  activity: string[];
  country_code: string;
  group_name: string;
  ip: string;
  chats_count: number;
  id: number;
  managers: [];
  last_page: {
    title: string;
    url: string;
  };
  login: string;
  customer_id: string;
  prefs: {
    browser: string;
    os: string;
    geolocation: {
      city: string;
    };
  };
};

export type TrafficCounter = {
  "all-customers": number;
  chatting: number;
  supervised: number;
  queued: number;
  inactive: number;
};

export type TrafficFilter = {
  id: string;
  label: string;
  icon: string;
  used: boolean;
  isOpen: boolean;
  params: TrafficFilterParams;
};

export type TrafficFilterParams = {
  activityIs?: string[];
  activityIsNot?: string[];
  assignedAgentIs?: string[];
  assignedAgentIsNot?: string[];
  cameFromIsExactly?: string[];
  cameFromIsNot?: string[];
  cameFromContains?: string[];
  cameFromDoesNotContains?: string[];
  cameFromHasAnyValue?: string[];
  cityIsExactly?: string[];
  cityIsNot?: string[];
  cityContains?: string[];
  cityDoesNotContains?: string[];
  cityHasAnyValue?: string[];
  countryIs?: string[];
  countryIsNot?: string[];
  emailIsExactly?: string[];
  emailIsNot?: string[];
  emailContains?: string[];
  emailDoesNotContains?: string[];
  emailHasAnyValue?: string[];
  groupIs?: string[];
  groupIsNot?: string[];
  ip?: string[];
  lastPageIsExactly?: string[];
  lastPageIsNot?: string[];
  lastPageContains?: string[];
  lastPageDoesNotContains?: string[];
  lastPageHasAnyValue?: string[];
  nameIsExactly?: string[];
  nameIsNot?: string[];
  nameContains?: string[];
  nameDoesNotContains?: string[];
  nameHasAnyValue?: string[];
  numberVisitsIsExactly?: number[];
  numberVisitsIsNot?: number[];
  numberVisitsIsGreaterThan?: number[];
  numberVisitsIsGreaterOrEqual?: number[];
  numberVisitsIsLessThan?: number[];
  numberVisitsIsLessOrEqual?: number[];
  numberVisitsIsBetween?: number[];
  returningCustomer?: boolean;
  regionIsExactly?: string[];
  regionIsNot?: string[];
  regionContains?: string[];
  regionDoesNotContains?: string[];
  regionHasAnyValue?: string[];
  webCrawlers?: string[];
  key: string;
};
