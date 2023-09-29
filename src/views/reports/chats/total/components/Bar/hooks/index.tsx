import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import moment from "moment/moment";

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
  formatter: "{c}",
  fontSize: 12,
  color: "#333",
  rich: {
    name: {}
  }
};

export function useHooks() {
  const reportStore = useReportStore();

  const { chatsTotal, getCurrentDateTo, getCurrentDateFrom } =
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
    let name = title.date;
    if (title.group) {
      name = `${name} | ${title.group}`;
    }
    if (title.agent) {
      name = `${name} | ${title.agent}`;
    }

    return name;
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

  const dataTitles = chatsTotal.value.currentDateCurrentAgentCurrentGroup.label;
  const dataSeries = [];

  legendData.map(item => {
    const data = chatsTotal.value[item];

    if (chatsTotal.value[item]?.count?.length) {
      dataSeries.push({
        name: getName(data.title),
        type: isShowBar() ? "bar" : "line",
        label: labelOption,
        emphasis: {
          focus: "series"
        },
        itemStyle: {
          color: data?.color
        },
        data: data?.count
      });
    }
  });

  return {
    chatsTotal,
    legendData,
    dataTitles,
    dataSeries
  };
}
