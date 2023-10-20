import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

export function useHooks() {
  const reportStore = useReportStore();

  const { chatsDuration } = storeToRefs(reportStore);

  const getTotalSumma = data => {
    return data.reduce((a, b) => a + b, 0);
  };

  return {
    chatsDuration,
    getTotalSumma
  };
}
