import { useReportHook } from "@/store/modules/reports";

export function useHooks() {
  const reportStore = useReportHook();
  const { getAgentsActivity } = reportStore;

  return {
    getAgentsActivity
  };
}
