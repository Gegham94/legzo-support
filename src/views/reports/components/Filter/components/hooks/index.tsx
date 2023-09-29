import { onMounted } from "vue";
import { useReportHook } from "@/store/modules/reports";
export function useFilterHooks() {
  const setVisible = (data, status) => {
    if (!status) {
      useReportHook().setVisible(data);
    } else {
      useReportHook().setVisible("");
    }
  };

  onMounted(() => {
    useReportHook().setVisible("");
  });

  return {
    setVisible
  };
}
