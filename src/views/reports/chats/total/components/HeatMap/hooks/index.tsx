import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

export function useHooks() {
  const reportStore = useReportStore();

  const { chatsTotal } = storeToRefs(reportStore);

  const getTotalSumma = data => {
    return data.reduce((a, b) => a + b, 0);
  };
  return {
    chatsTotal,
    getTotalSumma
  };
}
