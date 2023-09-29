import { useReportStore } from "@/store/modules/reports";
import moment from "moment";
import { storeToRefs } from "pinia";

export function useHooks() {
  const reportStore = useReportStore();

  const { getPerformanceCurrent, getPerformanceCompare } =
    storeToRefs(reportStore);

  const cardList = [
    {
      title: "Chats count",
      currentCount: getPerformanceCurrent.value.chats_count,
      compareCount: getPerformanceCompare.value.chats_count,
      difference:
        getPerformanceCurrent.value.chats_count -
        getPerformanceCompare.value.chats_count
    },
    {
      title: "Chats rated good",
      currentCount: getPerformanceCurrent.value.chats_rated_good,
      compareCount: getPerformanceCompare.value.chats_rated_good,
      difference:
        getPerformanceCurrent.value.chats_rated_good -
        getPerformanceCompare.value.chats_rated_good
    },
    {
      title: "Chats rated bad",
      currentCount: getPerformanceCurrent.value.chats_rated_bad,
      compareCount: getPerformanceCompare.value.chats_rated_bad,
      difference:
        getPerformanceCurrent.value.chats_rated_bad -
        getPerformanceCompare.value.chats_rated_bad
    },
    {
      title: "First response chats",
      currentCount: getPerformanceCurrent.value.first_response_chats_count,
      compareCount: getPerformanceCompare.value.first_response_chats_count,
      difference:
        getPerformanceCurrent.value.first_response_chats_count -
        getPerformanceCompare.value.first_response_chats_count
    },
    {
      title: "First response time",
      currentCount: getPerformanceCurrent.value.first_response_time,
      compareCount: getPerformanceCompare.value.first_response_time,
      difference:
        getPerformanceCurrent.value.first_response_time -
        getPerformanceCompare.value.first_response_time
    }
  ];

  const getTotalTime = data => {
    const seconds = data.reduce((a, b) => a + b, 0);
    if (seconds >= 3600) {
      return moment.utc(seconds * 1000).format("H[h] m[m] s[s]");
    } else if (seconds >= 60) {
      return moment.utc(seconds * 1000).format("m[m] s[s]");
    } else {
      return moment.utc(seconds * 1000).format("s[s]");
    }
  };

  return {
    cardList,
    getTotalTime
  };
}
