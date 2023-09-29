export const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

export const PER_PAGE_COUNT = 25;

export const defaultChatTotal = {
  label: [],
  count: [],
  title: {
    date: "",
    group: "",
    agent: ""
  },
  color: ""
};
export const defaultChatSatisfaction = {
  label: [],
  good: [],
  bad: [],
  title: {
    date: "",
    group: "",
    agent: ""
  },
  colorGood: "",
  colorBad: ""
};

export const defaultChatDuration = {
  label: [],
  count: [],
  duration: [],
  title: {
    date: "",
    group: "",
    agent: ""
  },
  color: ""
};

export const defaultChatResponseTime = {
  label: [],
  count: [],
  first_response_time: [],
  title: {
    date: "",
    group: "",
    agent: ""
  },
  color: ""
};
