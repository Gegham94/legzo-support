import { store } from "@/store";
import { reportFilterType } from "./types";
import { defineStore } from "pinia";
import moment from "moment-timezone";
import {
  defaultChatSatisfaction,
  defaultChatTotal,
  defaultChatDuration,
  defaultChatResponseTime
} from "@/constants/common";

moment.tz.setDefault("UTC");

export const useReportStore = defineStore({
  id: "pure-reports",
  state: (): reportFilterType => ({
    filters: {
      filterList: [],
      filterDate: {
        current: {
          from: moment().subtract(6, "days").startOf("day").unix() * 1000,
          to: moment().unix() * 1000,
          interval: "last_7_days",
          date: moment().unix() * 1000
        },
        compare: {
          status: false,
          from: 0,
          to: 0,
          interval: ""
        }
      },
      filterAgents: {
        current: [],
        compare: {
          status: false,
          data: []
        }
      },
      filterGroups: {
        current: [],
        compare: {
          status: false,
          data: []
        }
      },
      filterTags: [],
      filterCountry: [],
      visible: {
        date: false,
        agent: false,
        group: false,
        tag: false,
        country: false
      }
    },
    agentsTotal: {
      performance: {
        currentDateCurrentGroup: {
          chats_count: 0,
          chats_rated_good: 0,
          chats_rated_bad: 0,
          first_response_chats_count: 0,
          first_response_time: 0
        },
        compareDateCurrentGroup: {
          chats_count: 0,
          chats_rated_good: 0,
          chats_rated_bad: 0,
          first_response_chats_count: 0,
          first_response_time: 0
        }
      },
      detailsReport: {
        currentDateCurrentGroup: [],
        compareDateCurrentGroup: []
      }
    },
    agentsResponseTime: {
      currentDateCurrentAgentCurrentGroup: { ...defaultChatResponseTime },
      currentDateCurrentAgentCompareGroup: { ...defaultChatResponseTime },
      currentDateCompareAgentCurrentGroup: { ...defaultChatResponseTime },
      currentDateCompareAgentCompareGroup: { ...defaultChatResponseTime },
      compareDateCurrentAgentCurrentGroup: { ...defaultChatResponseTime },
      compareDateCurrentAgentCompareGroup: { ...defaultChatResponseTime },
      compareDateCompareAgentCurrentGroup: { ...defaultChatResponseTime },
      compareDateCompareAgentCompareGroup: { ...defaultChatResponseTime }
    },
    agentsActivity: [],
    chatsTotal: {
      currentDateCurrentAgentCurrentGroup: { ...defaultChatTotal },
      currentDateCurrentAgentCompareGroup: { ...defaultChatTotal },
      currentDateCompareAgentCurrentGroup: { ...defaultChatTotal },
      currentDateCompareAgentCompareGroup: { ...defaultChatTotal },
      compareDateCurrentAgentCurrentGroup: { ...defaultChatTotal },
      compareDateCurrentAgentCompareGroup: { ...defaultChatTotal },
      compareDateCompareAgentCurrentGroup: { ...defaultChatTotal },
      compareDateCompareAgentCompareGroup: { ...defaultChatTotal },
      currentHours: {
        labelX: [],
        labelY: [],
        count: [],
        maxValue: 0
      }
    },
    chatsSatisfaction: {
      currentDateCurrentAgentCurrentGroup: { ...defaultChatSatisfaction },
      currentDateCurrentAgentCompareGroup: { ...defaultChatSatisfaction },
      currentDateCompareAgentCurrentGroup: { ...defaultChatSatisfaction },
      currentDateCompareAgentCompareGroup: { ...defaultChatSatisfaction },
      compareDateCurrentAgentCurrentGroup: { ...defaultChatSatisfaction },
      compareDateCurrentAgentCompareGroup: { ...defaultChatSatisfaction },
      compareDateCompareAgentCurrentGroup: { ...defaultChatSatisfaction },
      compareDateCompareAgentCompareGroup: { ...defaultChatSatisfaction }
    },
    chatsDuration: {
      currentDateCurrentAgentCurrentGroup: { ...defaultChatDuration },
      currentDateCurrentAgentCompareGroup: { ...defaultChatDuration },
      currentDateCompareAgentCurrentGroup: { ...defaultChatDuration },
      currentDateCompareAgentCompareGroup: { ...defaultChatDuration },
      compareDateCurrentAgentCurrentGroup: { ...defaultChatDuration },
      compareDateCurrentAgentCompareGroup: { ...defaultChatDuration },
      compareDateCompareAgentCurrentGroup: { ...defaultChatDuration },
      compareDateCompareAgentCompareGroup: { ...defaultChatDuration }
    },
    chatsTags: {
      labels: [],
      legend: [],
      series: []
    },
    chatsRatedAgents: []
  }),
  getters: {
    getCurrentDateCustom() {
      return this.filters.filterDate.current.date;
    },
    getCurrentDateFrom() {
      return this.filters.filterDate.current.from;
    },
    getCurrentDateTo() {
      return this.filters.filterDate.current.to;
    },
    getCurrentDateInterval() {
      return this.filters.filterDate.current.interval;
    },
    getCompareDateInterval() {
      return this.filters.filterDate.compare.interval;
    },
    getCompareDateStatus() {
      return this.filters.filterDate.compare.status;
    },
    getCompareDateFrom() {
      return this.filters.filterDate.compare.from;
    },
    getCompareDateTo() {
      return this.filters.filterDate.compare.to;
    },
    getCurrentAgents() {
      return this.filters.filterAgents.current;
    },
    getCompareAgentsData() {
      return this.filters.filterAgents.compare.data;
    },
    getCompareAgentsStatus() {
      return this.filters.filterAgents.compare.status;
    },
    getCurrentGroups() {
      return this.filters.filterGroups.current;
    },
    getCompareGroupsStatus() {
      return this.filters.filterGroups.compare.status;
    },
    getCompareGroupsData() {
      return this.filters.filterGroups.compare.data;
    },
    getTags() {
      return this.filters.filterTags;
    },
    getCountry() {
      return this.filters.filterCountry;
    },
    getFilterList() {
      return this.filters.filterList;
    },
    getPerformanceCurrent() {
      return this.agentsTotal.performance.currentDateCurrentGroup;
    },
    getPerformanceCompare() {
      return this.agentsTotal.performance.compareDateCurrentGroup;
    },
    getRatedAgents() {
      return this.chatsRatedAgents;
    },
    getAgentsActivity() {
      return this.agentsActivity;
    }
  },
  actions: {
    setCurrentDateInterval(data) {
      this.filters.filterDate.current.interval = data;
    },
    setFilterCurrentDateCustom(data) {
      this.filters.filterDate.current.date = data;
    },
    setFilterCurrentDateFrom(data) {
      this.filters.filterDate.current.from = data;
    },
    setFilterCurrentDateTo(data) {
      this.filters.filterDate.current.to = data;
    },
    setFilterCompareDateFrom(data) {
      this.filters.filterDate.compare.from = data;
    },
    setFilterCompareDateTo(data) {
      this.filters.filterDate.compare.to = data;
    },
    setFilterCompareAgentData(data) {
      this.filters.filterAgents.compare.data = data;
    },
    setFilterCompareGroupData(data) {
      this.filters.filterGroups.compare.data = data;
    },
    clearFilterCompareDate() {
      this.filters.filterDate.compare = {
        status: false,
        from: 0,
        to: 0,
        interval: ""
      };
      this.agentsTotal.detailsReport.compareDateCurrentGroup = [];
      this.agentsTotal.performance.compareDateCurrentGroup = {
        chats_count: 0,
        chats_rated_good: 0,
        chats_rated_bad: 0,
        first_response_chats_count: 0,
        first_response_time: 0
      };
    },
    clearFilterAgent() {
      this.filters.filterAgents = {
        current: [],
        compare: {
          status: false,
          data: []
        }
      };
    },
    clearFilterGroup() {
      this.filters.filterGroups = {
        current: [],
        compare: {
          status: false,
          data: []
        }
      };
    },
    clearFilterTag() {
      this.filters.filterTags = [];
    },
    clearFilterCountry() {
      this.filters.filterCountry = [];
    },
    setRatedAgents(data) {
      this.chatsRatedAgents = data;
    },
    setCurrentHoursMaxValue(data) {
      this.chatsTotal.currentHours.maxValue = data;
    },
    setCurrentHours(labelX, labelY, data) {
      this.chatsTotal.currentHours.labelX = labelX;
      this.chatsTotal.currentHours.labelY = labelY;
      this.chatsTotal.currentHours.count = data;
    },
    setCurrentDateCurrentAgentCurrentGroup(data) {
      this.chatsTotal.currentDateCurrentAgentCurrentGroup = data;
    },
    setCurrentDateCurrentAgentCompareGroup(data) {
      this.chatsTotal.currentDateCurrentAgentCompareGroup = data;
    },
    setCurrentDateCompareAgentCurrentGroup(data) {
      this.chatsTotal.currentDateCompareAgentCurrentGroup = data;
    },
    setCurrentDateCompareAgentCompareGroup(data) {
      this.chatsTotal.currentDateCompareAgentCompareGroup = data;
    },
    setCompareDateCurrentAgentCurrentGroup(data) {
      this.chatsTotal.compareDateCurrentAgentCurrentGroup = data;
    },
    setCompareDateCurrentAgentCompareGroup(data) {
      this.chatsTotal.compareDateCurrentAgentCompareGroup = data;
    },
    setCompareDateCompareAgentCurrentGroup(data) {
      this.chatsTotal.compareDateCompareAgentCurrentGroup = data;
    },
    setCompareDateCompareAgentCompareGroup(data) {
      this.chatsTotal.compareDateCompareAgentCompareGroup = data;
    },
    setSatisfactionCurrentDateCurrentAgentCurrentGroup(data) {
      this.chatsSatisfaction.currentDateCurrentAgentCurrentGroup = data;
    },
    setSatisfactionCurrentDateCurrentAgentCompareGroup(data) {
      this.chatsSatisfaction.currentDateCurrentAgentCompareGroup = data;
    },
    setSatisfactionCurrentDateCompareAgentCurrentGroup(data) {
      this.chatsSatisfaction.currentDateCompareAgentCurrentGroup = data;
    },
    setSatisfactionCurrentDateCompareAgentCompareGroup(data) {
      this.chatsSatisfaction.currentDateCompareAgentCompareGroup = data;
    },
    setSatisfactionCompareDateCurrentAgentCurrentGroup(data) {
      this.chatsSatisfaction.compareDateCurrentAgentCurrentGroup = data;
    },
    setSatisfactionCompareDateCurrentAgentCompareGroup(data) {
      this.chatsSatisfaction.compareDateCurrentAgentCompareGroup = data;
    },
    setSatisfactionCompareDateCompareAgentCurrentGroup(data) {
      this.chatsSatisfaction.compareDateCompareAgentCurrentGroup = data;
    },
    setSatisfactionCompareDateCompareAgentCompareGroup(data) {
      this.chatsSatisfaction.compareDateCompareAgentCompareGroup = data;
    },
    setDurationCurrentDateCurrentAgentCurrentGroup(data) {
      this.chatsDuration.currentDateCurrentAgentCurrentGroup = data;
    },
    setDurationCurrentDateCurrentAgentCompareGroup(data) {
      this.chatsDuration.currentDateCurrentAgentCompareGroup = data;
    },
    setDurationCurrentDateCompareAgentCurrentGroup(data) {
      this.chatsDuration.currentDateCompareAgentCurrentGroup = data;
    },
    setDurationCurrentDateCompareAgentCompareGroup(data) {
      this.chatsDuration.currentDateCompareAgentCompareGroup = data;
    },
    setDurationCompareDateCurrentAgentCurrentGroup(data) {
      this.chatsDuration.compareDateCurrentAgentCurrentGroup = data;
    },
    setDurationCompareDateCurrentAgentCompareGroup(data) {
      this.chatsDuration.compareDateCurrentAgentCompareGroup = data;
    },
    setDurationCompareDateCompareAgentCurrentGroup(data) {
      this.chatsDuration.compareDateCompareAgentCurrentGroup = data;
    },
    setDurationCompareDateCompareAgentCompareGroup(data) {
      this.chatsDuration.compareDateCompareAgentCompareGroup = data;
    },
    setResponseTimeCurrentDateCurrentAgentCurrentGroup(data) {
      this.agentsResponseTime.currentDateCurrentAgentCurrentGroup = data;
    },
    setResponseTimeCurrentDateCurrentAgentCompareGroup(data) {
      this.agentsResponseTime.currentDateCurrentAgentCompareGroup = data;
    },
    setResponseTimeCurrentDateCompareAgentCurrentGroup(data) {
      this.agentsResponseTime.currentDateCompareAgentCurrentGroup = data;
    },
    setResponseTimeCurrentDateCompareAgentCompareGroup(data) {
      this.agentsResponseTime.currentDateCompareAgentCompareGroup = data;
    },
    setResponseTimeCompareDateCurrentAgentCurrentGroup(data) {
      this.agentsResponseTime.compareDateCurrentAgentCurrentGroup = data;
    },
    setResponseTimeCompareDateCurrentAgentCompareGroup(data) {
      this.agentsResponseTime.compareDateCurrentAgentCompareGroup = data;
    },
    setResponseTimeCompareDateCompareAgentCurrentGroup(data) {
      this.agentsResponseTime.compareDateCompareAgentCurrentGroup = data;
    },
    setResponseTimeCompareDateCompareAgentCompareGroup(data) {
      this.agentsResponseTime.compareDateCompareAgentCompareGroup = data;
    },
    setVisible(data) {
      Object.keys(this.filters.visible).forEach(
        i => (this.filters.visible[i] = i === data)
      );
    },
    setAgentsPerformanceCurrentDateCurrentGroup(data) {
      this.agentsTotal.performance.currentDateCurrentGroup = data;
    },
    setAgentsPerformanceCompareDateCurrentGroup(data) {
      this.agentsTotal.performance.compareDateCurrentGroup = data;
    },
    setAgentsDetailsCurrentDateCurrentGroup(data) {
      this.agentsTotal.detailsReport.currentDateCurrentGroup = data;
    },
    setAgentsDetailsCompareDateCurrentGroup(data) {
      this.agentsTotal.detailsReport.compareDateCurrentGroup = data;
    },
    setTags(data) {
      this.chatsTags = data;
    },
    setAgentsActivity(data) {
      this.agentsActivity = data;
    },
    setFilterList(data) {
      if (this.filters.filterList.includes(data)) return;
      this.filters.filterList.push(data);
    },
    setFilterAgents(data) {
      if (this.filters.filterAgents.current.includes(data)) return;
      this.filters.filterAgents.current.push(data);
    },
    setFilterGroups(data) {
      if (this.filters.filterGroups.current.includes(data)) return;
      this.filters.filterGroups.current.push(data);
    }
  }
});

export function useReportHook() {
  return useReportStore(store);
}
