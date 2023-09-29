import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

import type { Column } from "element-plus";
import { onUnmounted } from "vue";
import moment from "moment";

export function useHooks() {
  const reportStore = useReportStore();
  const { agentsResponseTime } = storeToRefs(reportStore);

  const currentDateCurrentAgentCurrentGroup =
    agentsResponseTime.value.currentDateCurrentAgentCurrentGroup;
  const compareDateCurrentAgentCurrentGroup =
    agentsResponseTime.value.compareDateCurrentAgentCurrentGroup;

  const currentDateCompareAgentCurrentGroup =
    agentsResponseTime.value.currentDateCompareAgentCurrentGroup;
  const compareDateCompareAgentCurrentGroup =
    agentsResponseTime.value.compareDateCompareAgentCurrentGroup;

  const currentDateCurrentAgentCompareGroup =
    agentsResponseTime.value.currentDateCurrentAgentCompareGroup;
  const compareDateCurrentAgentCompareGroup =
    agentsResponseTime.value.compareDateCurrentAgentCompareGroup;

  const currentDateCompareAgentCompareGroup =
    agentsResponseTime.value.currentDateCompareAgentCompareGroup;
  const compareDateCompareAgentCompareGroup =
    agentsResponseTime.value.compareDateCompareAgentCompareGroup;

  let data = [];
  let columns: Column<any>[] = [];

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

  if (currentDateCurrentAgentCurrentGroup.title.group) {
    columns.push({
      key: "column-group",
      dataKey: "column-group",
      title: "Group",
      width: 178,
      fixed: true,
      cellRenderer: null
    });
  }

  if (currentDateCurrentAgentCurrentGroup.title.agent) {
    columns.push({
      key: "column-agent",
      dataKey: "column-agent",
      title: "Agent",
      width: 178,
      fixed: true,
      cellRenderer: null
    });
  }

  const addColumnsData = (current, compare) => {
    if (current?.label?.length) {
      let rowCol = {
        id: `row-${data.length}`,
        dataColParentId: null,
        ["column-date"]: current?.title.date,
        ["column-group"]: current?.title.group,
        ["column-agent"]: current?.title.agent
      };

      current?.first_response_time?.map((count, rowIndex) => {
        const compareCount = compare.first_response_time[rowIndex];

        let differenceCount = 0;
        if (compareCount !== undefined) {
          differenceCount = count - compareCount;
        }
        rowCol = {
          ...rowCol,
          [`column-${rowIndex}`]: compareCount ? (
            <div class="total-value">
              <div class="current-value">
                <span class="count">{count}</span>
                <span
                  class={
                    differenceCount > 0
                      ? "difference-count text-green-500"
                      : "difference-count text-red-500"
                  }
                >
                  ({differenceCount})
                </span>
              </div>
              <div />
              <div class="current-value">{compareCount}</div>
            </div>
          ) : (
            <div class="compare-value">{getTotalTime([count])}</div>
          )
        };
      });

      data.push(rowCol);
    }
  };

  currentDateCurrentAgentCurrentGroup.label?.map((col, colIndex) => {
    const compareTitle = compareDateCurrentAgentCurrentGroup.label[colIndex];
    columns.push({
      key: `column-${colIndex}`,
      dataKey: `column-${colIndex}`,
      title: compareTitle ? `${col} vs ${compareTitle}` : col,
      width: 178,
      cellRenderer: ({ cellData: description }) => {
        return <>{description}</>;
      }
    });
  });

  addColumnsData(
    currentDateCurrentAgentCurrentGroup,
    compareDateCurrentAgentCurrentGroup
  );
  addColumnsData(
    currentDateCompareAgentCurrentGroup,
    compareDateCompareAgentCurrentGroup
  );
  addColumnsData(
    currentDateCurrentAgentCompareGroup,
    compareDateCurrentAgentCompareGroup
  );
  addColumnsData(
    currentDateCompareAgentCompareGroup,
    compareDateCompareAgentCompareGroup
  );

  onUnmounted(() => {
    columns = [];
    data = [];
  });

  return {
    columns,
    data
  };
}
