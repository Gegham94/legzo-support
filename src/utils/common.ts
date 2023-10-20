import moment from "moment-timezone";
export const secondsFormatter = seconds => {
  if (seconds >= 86400) {
    return moment.utc(seconds * 1000).format("D[d] H[h] m[m] s[s]");
  } else if (seconds >= 3600) {
    return moment.utc(seconds * 1000).format("H[h] m[m] s[s]");
  } else if (seconds >= 60) {
    return moment.utc(seconds * 1000).format("m[m] s[s]");
  } else {
    return moment.utc(seconds * 1000).format("s[s]");
  }
};

export const getTotalTime = data => {
  const seconds = data.reduce((a, b) => a + b, 0);

  return secondsFormatter(seconds);
};
