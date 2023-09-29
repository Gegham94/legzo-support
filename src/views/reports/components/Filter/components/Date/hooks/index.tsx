import { ref, watch } from "vue";
import { useReportStore, useReportHook } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { FormInstance } from "element-plus";
import moment from "moment-timezone";
import { dateType } from "@/store/modules/types";

moment.tz.setDefault("UTC");

export function useHooks(isSinglePeriod = false) {
  const reportStore = useReportStore();
  const reportHook = useReportHook();

  const {
    getCurrentDateCustom,
    getCurrentDateFrom,
    getCurrentDateTo,
    getCurrentDateInterval,
    getCompareDateInterval,
    filters
  } = storeToRefs(reportStore);

  const ruleFormRef = ref<FormInstance>();
  const compareOptions = [
    {
      value: "previous_period",
      label: "Previous period"
    },
    {
      value: "previous_year",
      label: "Previous year"
    },
    {
      value: "custom_period",
      label: "Custom period"
    }
  ];
  const options = [
    {
      value: "today",
      label: "Today"
    },
    {
      value: "yesterday",
      label: "Yesterday"
    },
    {
      value: "last_7_days",
      label: "Last 7 days"
    },
    {
      value: "last_30_days",
      label: "Last 30 days"
    },
    {
      value: "last_month",
      label: "Last month"
    },
    {
      value: "current_month",
      label: "Current month"
    },
    {
      value: "custom_period",
      label: "Custom period"
    }
  ];

  const singleOptions = [
    {
      value: "today",
      label: "Today"
    },
    {
      value: "yesterday",
      label: "Yesterday"
    },
    {
      value: "previous_yesterday",
      label: moment().subtract(2, "day").format("DD-MM-YYYY")
    },
    {
      value: "three_day_before",
      label: moment().subtract(3, "day").format("DD-MM-YYYY")
    },
    {
      value: "custom_day",
      label: "Custom date"
    }
  ];

  const getIntervalDate = (interval): dateType => {
    switch (interval) {
      case "today":
        return {
          from: moment(),
          to: moment(),
          date: moment()
        };

      case "yesterday":
      case "previous_today":
        return {
          from: moment().subtract(1, "day"),
          to: moment().subtract(1, "day"),
          date: moment().subtract(1, "day")
        };
      case "previous_yesterday":
        return {
          from: moment().subtract(2, "day"),
          to: moment().subtract(2, "day"),
          date: moment().subtract(2, "day")
        };
      case "three_day_before":
        return {
          from: moment().subtract(3, "day"),
          to: moment().subtract(3, "day"),
          date: moment().subtract(3, "day")
        };

      case "last_7_days":
        return {
          from: moment().subtract(6, "days"),
          to: moment()
        };
      case "previous_last_7_days":
        return {
          from: moment().subtract(13, "days"),
          to: moment().subtract(6, "days")
        };

      case "last_30_days":
        return {
          from: moment().subtract(30, "days"),
          to: moment()
        };
      case "previous_last_30_days":
        return {
          from: moment().subtract(59, "days"),
          to: moment().subtract(29, "days")
        };

      case "last_month":
        return {
          from: moment().startOf("month").subtract(1, "month"),
          to: moment().endOf("month").subtract(1, "month")
        };
      case "previous_last_month":
        return {
          from: moment().startOf("month").subtract(2, "month"),
          to: moment().startOf("month").subtract(1, "month")
        };

      case "current_month":
        return {
          from: moment().startOf("month"),
          to: moment()
        };
      case "previous_current_month":
        return {
          from: moment().subtract(1, "month").startOf("month"),
          to: moment().subtract(1, "month")
        };

      case "previous_custom_period":
        return {
          from: moment(getCurrentDateFrom.value).subtract(
            moment(getCurrentDateTo.value).diff(
              moment(getCurrentDateFrom.value),
              "days"
            ) + 1,
            "days"
          ),
          to: moment(getCurrentDateFrom.value).subtract(1, "day")
        };
    }
  };

  const compareIntervalCalc = value => {
    if (value !== "custom_period" && value !== "custom_day") {
      const previousPeriod: dateType = getIntervalDate(
        `previous_${getCurrentDateInterval.value}`
      );
      const previousYear: dateType = getIntervalDate(
        getCurrentDateInterval.value
      );

      switch (value) {
        case "previous_period":
          reportHook.setFilterCompareDateFrom(
            previousPeriod.from.startOf("day").unix() * 1000
          );

          if (getCurrentDateInterval.value === "today") {
            reportHook.setFilterCompareDateTo(previousPeriod.to.unix() * 1000);
          } else {
            reportHook.setFilterCompareDateTo(
              previousPeriod.to.endOf("day").unix() * 1000
            );
          }
          break;

        case "previous_year":
          reportHook.setFilterCompareDateFrom(
            previousYear.from.subtract(1, "year").startOf("day").unix() * 1000
          );

          if (getCurrentDateInterval.value === "today") {
            reportHook.setFilterCompareDateTo(
              previousYear.to.subtract(1, "year").unix() * 1000
            );
          } else {
            reportHook.setFilterCompareDateTo(
              previousYear.to.subtract(1, "year").endOf("day").unix() * 1000
            );
          }
          break;
      }
    }
  };

  const dateIntervalCalc = interval => {
    if (interval === "custom_period") {
      reportHook.setFilterCurrentDateFrom(
        moment(getCurrentDateFrom.value).startOf("day").unix() * 1000
      );
      reportHook.setFilterCurrentDateTo(
        moment(getCurrentDateTo.value).endOf("day").unix() * 1000
      );
    } else if (interval === "custom_day") {
      reportHook.setFilterCurrentDateCustom(
        moment(getCurrentDateCustom.value).startOf("day").unix() * 1000
      );
    } else {
      const { from, to, date } = getIntervalDate(interval);

      reportHook.setFilterCurrentDateFrom(from.startOf("day").unix() * 1000);

      if (interval === "today") {
        reportHook.setFilterCurrentDateTo(to.unix() * 1000);
      } else {
        reportHook.setFilterCurrentDateTo(to.endOf("day").unix() * 1000);
      }
      reportHook.setFilterCurrentDateCustom(date?.endOf("day").unix() * 1000);
    }
  };

  const getIntervalLabel = () => {
    return (
      options.find(item => item.value === getCurrentDateInterval.value)
        ?.label ?? "Date"
    );
  };

  watch(getCurrentDateInterval, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      compareIntervalCalc(getCompareDateInterval.value);
    }
  });

  return {
    options: isSinglePeriod ? singleOptions : options,
    compareOptions,
    dateIntervalCalc,
    compareIntervalCalc,
    ruleFormRef,
    getIntervalLabel,
    filters
  };
}
