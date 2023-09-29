import moment from "moment-timezone";
import { FORMAT_DATETIME_RESPONSE } from "@/constants/date";
import { useUserStore } from "@/store/modules/user";

export const formatLastMessage = (message, username) => {
  if (!message?.created_at || !message?.id) return;

  let content = message?.msg;

  if (message?.files?.length) {
    const file = message?.files[0];
    content = `${file?.name}`;
  }

  const usersStore = useUserStore();
  const { user } = usersStore;

  return {
    ...message,
    ...{
      _id: message?.id,
      content,
      senderId: message?.from_user_id,
      timestamp: moment
        .unix(message?.created_at)
        .format(FORMAT_DATETIME_RESPONSE),
      date: moment.unix(message.created_at).format("DD MMMM YYYY"),
      username: username,
      distributed: true,
      seen: message?.from_user_id === user.id ? message?.seen : null,
      new:
        message?.from_user_id !== user.id &&
        (!message?.seen || !message?.seen[user.id])
    }
  };
};
