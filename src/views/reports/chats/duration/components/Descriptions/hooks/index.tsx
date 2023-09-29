import { useReportStore } from "@/store/modules/reports";
import moment from "moment";
import { storeToRefs } from "pinia";

export function useHooks() {
  const reportStore = useReportStore();

  const { chatsDuration } = storeToRefs(reportStore);

  const getTotalSumma = data => {
    return data.reduce((a, b) => a + b, 0);
  };

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
    chatsDuration,
    getTotalTime,
    getTotalSumma
  };
}
