import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useNav } from "@/layout/hooks/useNav";
import { useDark } from "@pureadmin/utils";
import { useRoomsStore } from "@/store/modules/rooms";
import { useUserStore } from "@/store/modules/user";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { Message, MessageCreate, Room } from "@/api/chats/interfaces";
import { useRoomTagsStore } from "@/store/modules/roomTags";

export function useChat() {
  const usersStore = useUserStore();
  const { getCurrentUserId } = storeToRefs(usersStore);

  const { device } = useNav();
  const { isDark } = useDark();

  const roomsStore = useRoomsStore();
  const roomTags = useRoomTagsStore();
  const {
    fetchRooms,
    fetchRoom,
    fetchRemoveRoomsTag,
    fetchCurrentUserDetail,
    setSelectedRoomId
  } = roomsStore;
  const {
    getRooms,
    getRoomMessages,
    getCurrentRoom,
    getCurrentUser,
    getMessageStatus
  } = storeToRefs(roomsStore);

  const transferRoomId = ref(null);
  const transferRoom = async roomId => {
    transferRoomId.value = roomId;
  };

  const prevRoomId = ref(null);

  const rooms = computed(() => {
    return getRooms.value;
  });
  const currentUserId = computed(() => {
    return getCurrentUserId.value;
  });
  const currentUser = computed(() => {
    return getCurrentUser.value;
  });
  const messagesLoaded = computed(() => {
    return getCurrentRoom.value?.messagesLoaded;
  });
  const getMessages = computed(() => {
    return getRoomMessages.value;
  });
  const messageStatus = computed(() => {
    return getMessageStatus.value;
  });
  const screenHeight = computed(() => {
    return device.value === "mobile"
      ? window.innerHeight + "px"
      : "calc(100vh - 100px)";
  });
  const theme = computed(() => {
    return isDark.value ? "dark" : "light";
  });

  const { fetchTags } = roomTags;
  const tagsRoomId = ref(null);
  const setTagsRoomId = async roomId => {
    tagsRoomId.value = roomId;
  };
  const removeRoomTag = async data => {
    await fetchRemoveRoomsTag(data.roomId, data.tagId).catch();
  };
  const closeModalRoom = async () => {
    tagsRoomId.value = null;
    transferRoomId.value = null;
  };

  const fetchRoomId = async () => {
    if (prevRoomId.value) {
      await fetchRoom(prevRoomId.value, getCurrentRoom.value.id).then(
        prevId => (prevRoomId.value = prevId)
      );
    }
  };
  const fetchMessages = async ({ room, options = { reset: false } }) => {
    prevRoomId.value = room.prev;
    if (options.reset) {
      await fetchCurrentUserDetail(room.customer_id);
    }

    await setSelectedRoomId(room.id);
  };
  const sendMessage = async ({
    content,
    roomId,
    files,
    replyMessage,
    privateMessageStatus
  }) => {
    const message = {
      sender_id: currentUserId.value,
      msg: content,
      timestamp: new Date(),
      files: null,
      replyMessage: null,
      reply_id: null,
      message_type: 60
    };

    if (
      privateMessageStatus ||
      messageStatus.value ||
      currentUserId.value !== getCurrentRoom.value.primary_user_id
    ) {
      message.message_type = 90;
    }

    if (files) {
      message.files = files;
    }

    if (replyMessage) {
      message.reply_id = replyMessage.id;
    }

    const { success } = await http.post<MessageCreate, RequestResult<Message>>(
      `/managers/room/${roomId}/messages`,
      {
        data: { ...message }
      }
    );

    if (!success) {
      console.log("success", success);
    }
  };
  const showTyping = async roomId => {
    await http.get(`/managers/room/${roomId}/messages/typing`);
  };
  const openFile = ({ file }) => {
    window.open(file.file.url, "_blank");
  };
  const closeRoom = async roomId => {
    await http.put<void, RequestResult<Room>>(
      `/managers/room/${roomId}/status/3`
    );
  };
  const closeDoneRoom = async roomId => {
    await http.put<void, RequestResult<Room>>(
      `/managers/room/${roomId}/status/2`
    );
  };
  const exitSupervise = async roomId => {
    await http.put<void, RequestResult<Room>>(
      `/managers/exit-supervise${roomId}`
    );
  };

  const menuActionHandler = ({ action, roomId }) => {
    switch (action.name) {
      case "transferTo":
        return transferRoom(roomId);
      case "closeRoom":
        return closeRoom(roomId);
      case "closeDoneRoom":
        return closeDoneRoom(roomId);
      case "addTag":
        return setTagsRoomId(roomId);
      case "exitSupervise":
        return exitSupervise(roomId);
    }
  };

  onMounted(async () => {
    await fetchRooms();
    await fetchTags().catch();
  });

  return {
    rooms,
    screenHeight,
    theme,
    currentUserId,
    currentUser,
    menuActionHandler,
    messagesLoaded,
    getMessages,
    fetchMessages,
    sendMessage,
    showTyping,
    openFile,
    tagsRoomId,
    removeRoomTag,
    transferRoomId,
    closeModalRoom,
    fetchRoomId,
    prevRoomId
  };
}
