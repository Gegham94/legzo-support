import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import moment from "moment/moment";
import { getTotalTime } from "@/utils/common";

const posList = [
  "left",
  "right",
  "top",
  "bottom",
  "inside",
  "insideTop",
  "insideLeft",
  "insideRight",
  "insideBottom",
  "insideTopLeft",
  "insideTopRight",
  "insideBottomLeft",
  "insideBottomRight"
];
const app = {
  configParameters: {
    rotate: {
      min: -90,
      max: 90
    },
    align: {
      options: {
        left: "left",
        center: "center",
        right: "right"
      }
    },
    verticalAlign: {
      options: {
        top: "top",
        middle: "middle",
        bottom: "bottom"
      }
    },
    position: {
      options: posList.reduce(function (map, pos) {
        map[pos] = pos;
        return map;
      }, {})
    },
    distance: {
      min: 0,
      max: 1000
    }
  },
  config: {
    rotate: 90,
    align: "left",
    verticalAlign: "middle",
    position: "insideBottom",
    distance: 15,
    onChange: function () {}
  }
};

const labelOption = {
  show: true,
  position: app.config.position,
  distance: app.config.distance,
  align: app.config.align,
  verticalAlign: app.config.verticalAlign,
  rotate: app.config.rotate,
  formatter: params => getTotalTime([params.value]),
  fontSize: 12,
  color: "#333",
  rich: {
    name: {}
  }
};

export function useHooks() {
  const reportStore = useReportStore();

  const { chatsDuration, getCurrentDateTo, getCurrentDateFrom } =
    storeToRefs(reportStore);

  const isShowBar = () => {
    return (
      moment(getCurrentDateTo.value).diff(
        moment(getCurrentDateFrom.value),
        "days"
      ) <= 8
    );
  };

  const getName = title => {
    let name = `<div class="flex flex-col"><div class="font-bold">${title.date}</div>`;
    if (title.group) {
      name = `<div class="font-bold">${name}</div><div class="font-bold">${title.group}</div>`;
    }
    if (title.agent) {
      name = `<div class="font-bold">${name}</div><div class="font-bold">${title.agent}</div>`;
    }

    return `${name}</div>`;
  };

  const legendData = [
    "compareDateCompareAgentCompareGroup",
    "compareDateCompareAgentCurrentGroup",
    "compareDateCurrentAgentCompareGroup",
    "compareDateCurrentAgentCurrentGroup",
    "currentDateCompareAgentCompareGroup",
    "currentDateCompareAgentCurrentGroup",
    "currentDateCurrentAgentCompareGroup",
    "currentDateCurrentAgentCurrentGroup"
  ];

  const dataTitles =
    chatsDuration.value.currentDateCurrentAgentCurrentGroup.label;
  const dataSeries = [];

  legendData.map(item => {
    const data = chatsDuration.value[item];
    const formatterData = [];

    data.duration?.forEach((element, index) => {
      formatterData.push({
        name: "time",
        value: element,
        name1: "count",
        value1: data["count"][index]
      });
    });

    if (chatsDuration.value[item]?.duration?.length) {
      dataSeries.push({
        name: getName(data.title),
        type: isShowBar() ? "bar" : "line",
        label: labelOption,
        emphasis: {
          focus: "series"
        },
        itemStyle: {
          color: data?.color,
          shadowBlur: {
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: 10
          }
        },
        data: formatterData,
        seriesLayoutBy: "row",
        legendHoverLink: true,
        showBackground: true
      });
    }
  });

  return {
    chatsDuration,
    legendData,
    dataTitles,
    dataSeries
  };
}
