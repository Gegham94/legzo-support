import { RouteRecordName } from "vue-router";
import { CustomerDetail, Message, Room } from "@/api/chats/interfaces";
import { Moment } from "moment";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
  inOnline: boolean;
  inOnlineInterval: number;
};

export type filterType = {
  from: number;
  to: number;
  agents: string[];
  groups: string[];
  tags: string[];
  country: string[];
};

export type dateType = {
  from: Moment;
  to: Moment;
  date?: Moment;
};

export type reportFilterType = {
  filters: {
    filterList: string[];
    filterDate: {
      current: {
        from: number;
        to: number;
        date: number;
        interval: string;
      };
      compare: {
        status: boolean;
        from: number;
        to: number;
        interval: string;
      };
    };
    filterAgents: {
      current: string[];
      compare: {
        status: boolean;
        data: string[];
      };
    };
    filterGroups: {
      current: string[];
      compare: {
        status: boolean;
        data: string[];
      };
    };
    filterTags: string[];
    visible: {
      date: boolean;
      agent: boolean;
      group: boolean;
      tag: boolean;
    };
  };
  chatsTotal: {
    currentDateCurrentAgentCurrentGroup: totalData;
    currentDateCurrentAgentCompareGroup: totalData;
    currentDateCompareAgentCurrentGroup: totalData;
    currentDateCompareAgentCompareGroup: totalData;
    compareDateCurrentAgentCurrentGroup: totalData;
    compareDateCurrentAgentCompareGroup: totalData;
    compareDateCompareAgentCurrentGroup: totalData;
    compareDateCompareAgentCompareGroup: totalData;
    currentHours: totalHoursData;
  };
  chatsSatisfaction: {
    currentDateCurrentAgentCurrentGroup: satisfactionData;
    currentDateCurrentAgentCompareGroup: satisfactionData;
    currentDateCompareAgentCurrentGroup: satisfactionData;
    currentDateCompareAgentCompareGroup: satisfactionData;
    compareDateCurrentAgentCurrentGroup: satisfactionData;
    compareDateCurrentAgentCompareGroup: satisfactionData;
    compareDateCompareAgentCurrentGroup: satisfactionData;
    compareDateCompareAgentCompareGroup: satisfactionData;
  };
  chatsDuration: {
    currentDateCurrentAgentCurrentGroup: durationData;
    currentDateCurrentAgentCompareGroup: durationData;
    currentDateCompareAgentCurrentGroup: durationData;
    currentDateCompareAgentCompareGroup: durationData;
    compareDateCurrentAgentCurrentGroup: durationData;
    compareDateCurrentAgentCompareGroup: durationData;
    compareDateCompareAgentCurrentGroup: durationData;
    compareDateCompareAgentCompareGroup: durationData;
  };
  chatsRatedAgents: ratedAgents[];
  chatsTags: {
    labels: string[];
    legend: string[];
    series: string[];
  };
  agentsResponseTime: {
    currentDateCurrentAgentCurrentGroup: responseTimeData;
    currentDateCurrentAgentCompareGroup: responseTimeData;
    currentDateCompareAgentCurrentGroup: responseTimeData;
    currentDateCompareAgentCompareGroup: responseTimeData;
    compareDateCurrentAgentCurrentGroup: responseTimeData;
    compareDateCurrentAgentCompareGroup: responseTimeData;
    compareDateCompareAgentCurrentGroup: responseTimeData;
    compareDateCompareAgentCompareGroup: responseTimeData;
  };
  agentsTotal: {
    performance: {
      currentDateCurrentGroup: AgentsPerformanceTotal;
      compareDateCurrentGroup: AgentsPerformanceTotal;
    };
    detailsReport: {
      currentDateCurrentGroup: AgentsDetailsReport[];
      compareDateCurrentGroup: AgentsDetailsReport[];
    };
  };
  agentsActivity: activityAgents[];
};

export type AgentsDetailsReport = {
  agent_id: string;
  name: string;
  email: string;
  stats: {
    first_response_time: number;
    first_response_chats_count: number;
    chatting_time: number;
    accepting_chats_time: number;
    not_accepting_chats_time: number;
    logged_in_time: number;
    chats_count: number;
    chats_rated_bad: number;
    chats_rated_good: number;
  };
};
export type AgentsPerformanceTotal = {
  chats_count: number;
  chats_rated_good: number;
  chats_rated_bad: number;
  first_response_chats_count: number;
  first_response_time: number;
};
export type AgentsPerformance = {
  accepting_chats_time: number;
  chats_count: number;
  chats_rated_bad: number;
  chats_rated_good: number;
  chatting_time: number;
  first_response_chats_count: number;
  first_response_time: number;
  logged_in_time: number;
  not_accepting_chats_time: number;
};
export type totalData = {
  label: string[];
  count: string[];
  title: {
    date: string;
    group: string;
    agent: string;
  };
  color: string;
};
export type durationData = {
  label: string[];
  duration: number[];
  count: number[];
  title: {
    date: string;
    group: string;
    agent: string;
  };
  color: string;
};
export type responseTimeData = {
  label: string[];
  first_response_time: number[];
  count: number[];
  title: {
    date: string;
    group: string;
    agent: string;
  };
  color: string;
};
export type satisfactionData = {
  label: string[];
  good: string[];
  bad: string[];
  title: {
    date: string;
    group: string;
    agent: string;
  };
  colorGood: string;
  colorBad: string;
};
export type totalHoursData = {
  labelX: string[];
  labelY: string[];
  count: number[];
  maxValue: number;
};
export type chatsTags = {
  name: string;
  count: number;
  percent: string;
};

export type multiType = {
  path: string;
  parentPath: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  user: userData;
};
export type userData = {
  id?: string;
  email?: string;
  name?: string;
  avatar_link?: string;
  role?: number;
  status?: number;
  params: {
    readyAfterLogin: boolean;
    maxActiveTickets: number;
  };
  created_at: number;
  updated_at: number;
  roleLabel: string;
  online_status?: number;
  online?: {
    id: string;
    status: number;
    updated_at: number;
  };
};

export type roomsType = {
  roomsList: Room[];
  selectedRoomId: number;
  currentUser: CustomerDetail;
  controllerMessageStatus: boolean;
  dataLoading: boolean;
};

export type messagesType = {
  messagesList: Message[];
  lastMessage: string;
};

export type ratedAgents = {};

export type activityAgents = {
  agent_id: string;
  activity: Activity[];
  email: string;
  name: string;
  total: {
    accepting_chats: string;
    not_accepting_chats: string;
    logged_out: string;
  };
};

export type Activity = {
  start_time: number;
  end_time: number;
  type: string;
  left: number;
  width: number;
  background: string;
  accepting_time: string;
};
