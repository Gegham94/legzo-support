import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

import type { Column } from "element-plus";
import { onUnmounted } from "vue";

export function useHooks() {
  const reportStore = useReportStore();
  const { chatsSatisfaction } = storeToRefs(reportStore);

  const currentDateCurrentAgentCurrentGroup =
    chatsSatisfaction.value.currentDateCurrentAgentCurrentGroup;
  const compareDateCurrentAgentCurrentGroup =
    chatsSatisfaction.value.compareDateCurrentAgentCurrentGroup;

  const currentDateCompareAgentCurrentGroup =
    chatsSatisfaction.value.currentDateCompareAgentCurrentGroup;
  const compareDateCompareAgentCurrentGroup =
    chatsSatisfaction.value.compareDateCompareAgentCurrentGroup;

  const currentDateCurrentAgentCompareGroup =
    chatsSatisfaction.value.currentDateCurrentAgentCompareGroup;
  const compareDateCurrentAgentCompareGroup =
    chatsSatisfaction.value.compareDateCurrentAgentCompareGroup;

  const currentDateCompareAgentCompareGroup =
    chatsSatisfaction.value.currentDateCompareAgentCompareGroup;
  const compareDateCompareAgentCompareGroup =
    chatsSatisfaction.value.compareDateCompareAgentCompareGroup;

  let data = [];
  let columns: Column<any>[] = [];

  columns.push({
    key: "column-series",
    dataKey: "column-series",
    title: "Series",
    width: 100,
    fixed: true,
    cellRenderer: null
  });

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

  const addColumnsData = (current, compare, series) => {
    if (current?.label?.length) {
      let rowCol = {
        id: `row-${data.length}`,
        dataColParentId: null,
        ["column-series"]: series === "good" ? "Rated good" : "Rated bad",
        ["column-date"]: current?.title.date,
        ["column-group"]: current?.title.group,
        ["column-agent"]: current?.title.agent
      };

      current[series]?.map((count, rowIndex) => {
        const compareCount = compare[series][rowIndex];

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

      console.log("rowCol", rowCol);

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
    compareDateCurrentAgentCurrentGroup,
    "good"
  );
  addColumnsData(
    currentDateCompareAgentCurrentGroup,
    compareDateCompareAgentCurrentGroup,
    "good"
  );
  addColumnsData(
    currentDateCurrentAgentCompareGroup,
    compareDateCurrentAgentCompareGroup,
    "good"
  );
  addColumnsData(
    currentDateCompareAgentCompareGroup,
    compareDateCompareAgentCompareGroup,
    "good"
  );

  addColumnsData(
    currentDateCurrentAgentCurrentGroup,
    compareDateCurrentAgentCurrentGroup,
    "bad"
  );
  addColumnsData(
    currentDateCompareAgentCurrentGroup,
    compareDateCompareAgentCurrentGroup,
    "bad"
  );
  addColumnsData(
    currentDateCurrentAgentCompareGroup,
    compareDateCurrentAgentCompareGroup,
    "bad"
  );
  addColumnsData(
    currentDateCompareAgentCompareGroup,
    compareDateCompareAgentCompareGroup,
    "bad"
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
