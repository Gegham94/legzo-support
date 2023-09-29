import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref, watchEffect } from "vue";
import { message } from "@/utils/message";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { ChatStatus } from "@/api/reports/interfaces";

export function useHooks() {
  const taggedChatsColor = ref("blue");
  const taggedChatsCount = ref(0);
  const taggedChatsPercent = ref(0);
  const notTaggedChatsColor = ref("yellow");
  const notTaggedChatsCount = ref(0);
  const notTaggedChatsPercent = ref(0);

  const reportStore = useReportStore();
  const { getCurrentDateFrom, getCurrentDateTo, chatsTags } =
    storeToRefs(reportStore);
  const chatParams = reactive({
    tooltip: {
      trigger: "axis"
    },
    legend: {
      data: []
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: []
    },
    yAxis: {
      type: "value"
    },
    series: []
  });

  const fetchTotalChats = async params => {
    try {
      if (params.from && params.to) {
        const { data } = await http.get<void, RequestResult<ChatStatus[]>>(
          "/reports/chats/tagged",
          {
            params: {
              "filters[from]": params.from / 1000,
              "filters[to]": params.to / 1000
            }
          }
        );
        return data;
      }
    } catch (error) {
      message(error, { type: "error" });
    }
  };

  const getTotalChats = async () => {
    fetchTotalChats({
      from: getCurrentDateFrom.value,
      to: getCurrentDateTo.value
    }).then(data => {
      const allChatsCount = data.reduce(
        (total, item) => total + item.tagged.count + item.notTagged.count,
        0
      );
      taggedChatsCount.value = data.reduce(
        (total, item) => total + item.tagged.count,
        0
      );
      notTaggedChatsCount.value = data.reduce(
        (total, item) => total + item.notTagged.count,
        0
      );
      if (allChatsCount !== 0) {
        taggedChatsPercent.value =
          (taggedChatsCount.value / allChatsCount) * 100;
        notTaggedChatsPercent.value =
          (notTaggedChatsCount.value / allChatsCount) * 100;
      }
    });
  };

  watchEffect(newSomething => {
    if (newSomething.length > 0) {
      chatParams.legend.data = chatsTags.value.legend;
      chatParams.xAxis.data = chatsTags.value.labels;
      chatParams.series = chatsTags.value.series;
    }
  });

  onMounted(() => {
    getTotalChats();
  });

  return {
    chatParams,
    taggedChatsColor,
    taggedChatsCount,
    taggedChatsPercent,
    notTaggedChatsColor,
    notTaggedChatsCount,
    notTaggedChatsPercent
  };
}
