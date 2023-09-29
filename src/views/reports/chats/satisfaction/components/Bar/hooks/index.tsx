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
  show: false,
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

  const { chatsSatisfaction, getCurrentDateTo, getCurrentDateFrom } =
    storeToRefs(reportStore);

  const isShowBar = () => {
    return (
      moment(getCurrentDateTo.value).diff(
        moment(getCurrentDateFrom.value),
        "days"
      ) <= 8
    );
  };

  const getName = (title, status) => {
    let name = `${title.date} | ${status}`;
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

  const dataTitles =
    chatsSatisfaction.value.currentDateCurrentAgentCurrentGroup.label;
  const dataSeries = [];

  legendData.map(item => {
    const data = chatsSatisfaction.value[item];

    if (chatsSatisfaction.value[item]?.good?.length) {
      dataSeries.push({
        name: getName(data.title, "Rated good"),
        type: isShowBar() ? "bar" : "line",
        label: labelOption,
        emphasis: {
          focus: "series"
        },
        itemStyle: {
          color: data?.colorGood
        },
        data: data?.good
      });

      dataSeries.push({
        name: getName(data.title, "Rated bad"),
        type: isShowBar() ? "bar" : "line",
        label: labelOption,
        emphasis: {
          focus: "series"
        },
        itemStyle: {
          color: data?.colorBad
        },
        data: data?.bad
      });
    }
  });

  return {
    chatsSatisfaction,
    legendData,
    dataTitles,
    dataSeries
  };
}
