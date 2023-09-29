export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "" | "success" | "warning" | "info" | "danger";
  extra?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
}

export const noticesData: TabItem[] = [
  {
    key: "1",
    name: "Notice",
    list: [
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
        title: "You received 12 new weekly newspapers",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
        title:
          "The front-end expert you recommend has passed the third round of interviews",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png",
        title:
          "This template can distinguish between multiple notification types",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title:
          "Display the processing method when the content of the title exceeds one line. If the content exceeds one line, it will be automatically truncated and the tooltip will be supported to display the full title.",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title:
          "Icons on the left are used to distinguish between different types",
        datetime: "a year ago",
        description: "",
        type: "1"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
        title:
          "Icons on the left are used to distinguish between different types",
        datetime: "a year ago",
        description: "",
        type: "1"
      }
    ]
  },
  {
    key: "2",
    name: "Information",
    list: [
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title:
          "The front-end expert you recommend has passed the third round of interviews",
        datetime: "a year ago",
        description: "",
        type: "2"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title:
          "The front-end expert you recommend has passed the third round of interviews",
        datetime: "a year ago",
        description: "",
        type: "2"
      },
      {
        avatar:
          "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
        title:
          "The front-end expert you recommend has passed the third round of interviews",
        datetime: "a year ago",
        description: "",
        type: "2"
      }
    ]
  },
  {
    key: "3",
    name: "Charge d'affaires",
    list: [
      {
        avatar: "",
        title: "Mission name",
        description: "The task needs to be started before 2022-11-16 20:00",
        datetime: "",
        extra: "Has not started",
        status: "info",
        type: "3"
      },
      {
        avatar: "",
        title: "Mission name",
        description: "The task needs to be started before 2022-11-16 20:00",
        datetime: "",
        extra: "Has not started",
        status: "danger",
        type: "3"
      },
      {
        avatar: "",
        title: "Mission name",
        description: "The task needs to be started before 2022-11-16 20:00",
        datetime: "",
        extra: "Has not started",
        status: "warning",
        type: "3"
      },
      {
        avatar: "",
        title: "Mission name",
        description: "The task needs to be started before 2022-11-16 20:00",
        datetime: "",
        extra: "Has not started",
        type: "3"
      }
    ]
  }
];
