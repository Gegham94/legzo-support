import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

import type { Column } from "element-plus";
import { onUnmounted } from "vue";
import { secondsFormatter } from "@/utils/common";

export function useHooks() {
  const reportStore = useReportStore();
  const { agentsTotal } = storeToRefs(reportStore);

  const currentDateCurrentGroup =
    agentsTotal.value.detailsReport.currentDateCurrentGroup;

  const compareDateCurrentGroup =
    agentsTotal.value.detailsReport.compareDateCurrentGroup;

  let data = [];
  let columns: Column<any>[] = [
    {
      key: "email",
      dataKey: "column-agent",
      title: "Agent",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    },
    {
      key: "chats_count",
      dataKey: "column-6",
      title: "Chats count",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    },
    {
      key: "first_response_time",
      dataKey: "column-0",
      title: "First response time",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    },
    {
      key: "accepting_chats_time",
      dataKey: "column-3",
      title: "Accepting chats time",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    },
    {
      key: "not_accepting_chats_time",
      dataKey: "column-4",
      title: "Not accepting chats time",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    },
    {
      key: "logged_in_time",
      dataKey: "column-5",
      title: "Logged in time",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    },
    {
      key: "chatting_time",
      dataKey: "column-2",
      title: "Chatting time",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    },
    {
      key: "chats_rated_bad",
      dataKey: "column-7",
      title: "Chats rated bad",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    },
    {
      key: "chats_rated_good",
      dataKey: "column-8",
      title: "Chats rated good",
      width: 200,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      },
      sortable: true
    }
  ];

  const isTimeField = field => {
    const timeFields = [
      "first_response_time",
      "chatting_time",
      "accepting_chats_time",
      "not_accepting_chats_time",
      "logged_in_time"
    ];

    return timeFields.includes(field);
  };

  const addColumnsData = (current, compare) => {
    if (current?.length) {
      current?.map((item, rowIndex) => {
        let rowCol = {
          id: "row-0",
          parentId: null,
          ["column-agent"]: item.email
        };

        const compareItem = compare.find(el => el.id === item.id);

        const differenceCount = {
          first_response_time: 0,
          first_response_chats_count: 0,
          chatting_time: 0,
          accepting_chats_time: 0,
          not_accepting_chats_time: 0,
          logged_in_time: 0,
          chats_count: 0,
          chats_rated_bad: 0,
          chats_rated_good: 0
        };

        Object.keys(differenceCount).map((key, index) => {
          if (compareItem && (isTimeField(key) || key === "chats_count")) {
            differenceCount[key] = item.stats[key] - compareItem.stats[key];
          }

          rowCol = {
            ...rowCol,
            id: `row-${rowIndex}`,
            [`column-${index}`]:
              compare?.length && (isTimeField(key) || key === "chats_count") ? (
                <div class="total-value">
                  <div class="current-value">
                    <span class="count">
                      {isTimeField(key)
                        ? secondsFormatter(item.stats[key])
                        : item.stats[key]}
                    </span>
                    <span
                      class={
                        differenceCount[key] >= 0
                          ? "difference-count text-green-600"
                          : "difference-count text-red-600"
                      }
                    >
                      <div
                        class={
                          differenceCount[key] >= 0
                            ? "compare-icon text-green-600"
                            : "compare-icon text-red-600"
                        }
                      />
                      {differenceCount[key] !== 0 && isTimeField(key)
                        ? secondsFormatter(differenceCount[key])
                        : differenceCount[key]}
                    </span>
                  </div>
                </div>
              ) : (
                <div class="compare-value">
                  {isTimeField(key)
                    ? `${secondsFormatter(item.stats[key])}`
                    : `${item.stats[key]}`}
                </div>
              )
          };
        });
        data.push(rowCol);
      });
    }
  };

  addColumnsData(currentDateCurrentGroup, compareDateCurrentGroup);

  columns[0].fixed = true;

  onUnmounted(() => {
    columns = [];
    data = [];
  });

  return {
    columns,
    data
  };
}
