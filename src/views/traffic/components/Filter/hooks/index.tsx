import { ref } from "vue";

export function useFilterHooks() {
  const filterMatchOptions = [
    {
      value: "match-all",
      label: "Match all filters"
    },
    {
      value: "match-any",
      label: "Match any filters"
    }
  ];
  const isShowFilterButton = ref(true);
  const filterItemsList = [
    {
      label: "Activity",
      icon: "chart",
      id: "activity",
      used: false,
      isOpen: false,
      params: {
        activityIs: [],
        activityIsNot: [],
        key: "is"
      }
    },
    {
      label: "Assigned agent",
      icon: "agent",
      id: "assigned-agent",
      used: false,
      isOpen: false,
      params: {
        assignedAgentIs: [],
        assignedAgentIsNot: [],
        key: "is"
      }
    },
    {
      label: "Group",
      icon: "group",
      id: "group",
      used: false,
      isOpen: false,
      params: {
        groupIs: [],
        groupIsNot: [],
        key: "is"
      }
    },
    {
      label: "Country",
      icon: "location",
      id: "country",
      used: false,
      isOpen: false,
      params: {
        countryIs: [],
        countryIsNot: [],
        key: "is"
      }
    },
    {
      label: "City",
      icon: "location",
      id: "city",
      used: false,
      isOpen: false,
      params: {
        cityIsExactly: [],
        cityIsNot: [],
        cityContains: [],
        cityDoesNotContains: [],
        cityHasAnyValue: [false],
        key: "is exactly"
      }
    },
    {
      label: "Region",
      icon: "location",
      id: "region",
      used: false,
      isOpen: false,
      params: {
        regionIsExactly: [],
        regionIsNot: [],
        regionContains: [],
        regionDoesNotContains: [],
        regionHasAnyValue: [false],
        key: "is exactly"
      }
    },
    {
      label: "Name",
      icon: "agent",
      id: "name",
      used: false,
      isOpen: false,
      params: {
        nameIsExactly: [],
        nameIsNot: [],
        nameContains: [],
        namneDoesNotContains: [],
        nameHasAnyValue: [false],
        key: "is exactly"
      }
    },
    {
      label: "Email",
      icon: "mail",
      id: "email",
      used: false,
      isOpen: false,
      params: {
        emailIsExactly: [],
        emailIsNot: [],
        emailContains: [],
        emailDoesNotContains: [],
        emailHasAnyValue: [false],
        key: "is exactly"
      }
    },
    {
      label: "Returning customer",
      icon: "returning",
      id: "returning-customer",
      used: false,
      isOpen: false,
      params: {
        returningCustomer: true,
        key: "is true"
      }
    },
    // NEED IN FUTURE
    // {
    //   label: "Number of visits",
    //   icon: "visits",
    //   id: "number-of-visits",
    //   used: false,
    //   isOpen: false,
    //   params: {
    //     numberVisitsIsExactly: [],
    //     numberVisitsIsNot: [],
    //     numberVisitsIsGreaterThan: [],
    //     numberVisitsIsGreaterOrEqual: [],
    //     numberVisitsIsLessThan: [],
    //     numberVisitsIsLessOrEqual: [],
    //     numberVisitsIsBetween: [],
    //     key: "is exactly"
    //   }
    // },
    {
      label: "IP address",
      icon: "earth",
      id: "ip",
      used: false,
      isOpen: false,
      params: {
        ip: [],
        key: " - My current IP address"
      }
    },
    {
      label: "Came from",
      icon: "earth",
      id: "came-from",
      used: false,
      isOpen: false,
      params: {
        cameFromIsExactly: [],
        cameFromIsNot: [],
        cameFromContains: [],
        cameFromDoesNotContains: [],
        cameFromHasAnyValue: [false],
        key: "is exactly"
      }
    },
    {
      label: "Last page title",
      icon: "earth",
      id: "last-page-title",
      used: false,
      isOpen: false,
      params: {
        lastPageIsExactly: [],
        lastPageIsNot: [],
        lastPageContains: [],
        lastPageDoesNotContains: [],
        lastPageHasAnyValue: [false],
        key: "is exactly"
      }
    }
  ];
  return {
    filterMatchOptions,
    filterItemsList,
    isShowFilterButton
  };
}
