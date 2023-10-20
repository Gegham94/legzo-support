import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

import type { Column } from "element-plus";
import { onUnmounted } from "vue";
import { getTotalTime } from "@/utils/common";

export function useHooks() {
  const reportStore = useReportStore();
  const { chatsDuration } = storeToRefs(reportStore);

  const currentDateCurrentAgentCurrentGroup =
    chatsDuration.value.currentDateCurrentAgentCurrentGroup;
  const compareDateCurrentAgentCurrentGroup =
    chatsDuration.value.compareDateCurrentAgentCurrentGroup;

  const currentDateCompareAgentCurrentGroup =
    chatsDuration.value.currentDateCompareAgentCurrentGroup;
  const compareDateCompareAgentCurrentGroup =
    chatsDuration.value.compareDateCompareAgentCurrentGroup;

  const currentDateCurrentAgentCompareGroup =
    chatsDuration.value.currentDateCurrentAgentCompareGroup;
  const compareDateCurrentAgentCompareGroup =
    chatsDuration.value.compareDateCurrentAgentCompareGroup;

  const currentDateCompareAgentCompareGroup =
    chatsDuration.value.currentDateCompareAgentCompareGroup;
  const compareDateCompareAgentCompareGroup =
    chatsDuration.value.compareDateCompareAgentCompareGroup;

  let data = [];
  let columns: Column<any>[] = [];

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

      current?.duration?.map((count, rowIndex) => {
        const compareCount = compare.duration[rowIndex];

        let differenceCount = 0;
        if (compareCount !== undefined) {
          differenceCount = count - compareCount;
        }
        rowCol = {
          ...rowCol,
          [`column-${rowIndex}`]:
            compareCount !== undefined ? (
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
