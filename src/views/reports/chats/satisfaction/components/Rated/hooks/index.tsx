import { useReportHook } from "@/store/modules/reports";

export function useHooks() {
  const reportStore = useReportHook();
  const { getRatedAgents } = reportStore;

  return {
    getRatedAgents
  };
}
