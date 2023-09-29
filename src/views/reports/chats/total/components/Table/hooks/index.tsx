import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

import type { Column } from "element-plus";
import { onUnmounted } from "vue";

export function useHooks() {
  const reportStore = useReportStore();
  const { chatsTotal } = storeToRefs(reportStore);

  const currentDateCurrentAgentCurrentGroup =
    chatsTotal.value.currentDateCurrentAgentCurrentGroup;
  const compareDateCurrentAgentCurrentGroup =
    chatsTotal.value.compareDateCurrentAgentCurrentGroup;

  const currentDateCompareAgentCurrentGroup =
    chatsTotal.value.currentDateCompareAgentCurrentGroup;
  const compareDateCompareAgentCurrentGroup =
    chatsTotal.value.compareDateCompareAgentCurrentGroup;

  const currentDateCurrentAgentCompareGroup =
    chatsTotal.value.currentDateCurrentAgentCompareGroup;
  const compareDateCurrentAgentCompareGroup =
    chatsTotal.value.compareDateCurrentAgentCompareGroup;

  const currentDateCompareAgentCompareGroup =
    chatsTotal.value.currentDateCompareAgentCompareGroup;
  const compareDateCompareAgentCompareGroup =
    chatsTotal.value.compareDateCompareAgentCompareGroup;

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

      current?.count?.map((count, rowIndex) => {
        const compareCount = compare.count[rowIndex];

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
            <div class="compare-value">{count}</div>
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
