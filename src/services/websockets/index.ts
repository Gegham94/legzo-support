import Echo from "laravel-echo";
import { getToken } from "@/utils/auth";
import { ManagerConnectedEvent } from "@/api/agents/interfaces";
import {
  MessageNewEvent,
  RoomStatusEvent,
  RoomUpdateTagsEvent
} from "@/api/chats/interfaces";
import { useRoomsStore } from "@/store/modules/rooms";
import { useArchiveRoomsStore } from "@/store/modules/archiveRooms";
import { useUserStore, useUserStoreHook } from "@/store/modules/user";
import { storeToRefs } from "pinia";

const wsChannels: Map<string | number, object> = new Map();
const {
  VITE_APP_PUSHER_WSS_HOST,
  VITE_APP_PUSHER_WSS_ENDPOINT,
  VITE_APP_PUSHER_APP_KEY,
  VITE_APP_PUSHER_APP_CLUSTER,
  VITE_APP_PUSHER_WSS_PORT
} = import.meta.env;

let wsHost = VITE_APP_PUSHER_WSS_HOST;
let wsPath = "";

if (wsHost.includes("/")) {
  wsPath = wsHost;
  wsHost = window.location.host;
}

export const echoInit = (): void => {
  const jwt = getToken()?.accessToken;

  if (!jwt) {
    return;
  }

  echoDestroy();

  window.Pusher.logToConsole = false;
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: VITE_APP_PUSHER_APP_KEY,
    cluster: VITE_APP_PUSHER_APP_CLUSTER,
    wsHost,
    wsPath,
    wsPort: VITE_APP_PUSHER_WSS_PORT,
    authEndpoint: VITE_APP_PUSHER_WSS_ENDPOINT,
    forceTLS: true,
    useTLS: false,
    enableStats: false,
    enabledTransports: ["ws"],
    encrypted: true
  });

  window.Echo.connector.pusher.connection.strategy.transports.ws.transport.manager.livesLeft =
    Infinity;
  window.Echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${jwt}`;
};

export const echoDestroy = (): void => {
  wsChannels.clear();
  if (window.Echo) {
    window.Echo.disconnect();
  }
};

export const listenRoomsChannel = (id: number): void => {
  if (!id) return;
  const chanel = `room.${id}`;

  const roomsStore = useRoomsStore();
  const usersStore = useUserStore();
  const { getCurrentUserId } = storeToRefs(usersStore);

  if (wsChannels.has(chanel) || !id || !window.Echo) {
    return;
  }
  const wsChannel = window.Echo.private(chanel);
  wsChannels.set(chanel, wsChannel);

  wsChannel
    .listen("Room\\MessageNewEvent", (response: MessageNewEvent) => {
      roomsStore.addNewMessage(response.message);
      roomsStore.moveRoomToStart(response.message);
    })
    .listen("Room\\RoomTagsEvent", (response: RoomUpdateTagsEvent) => {
      roomsStore.updateRoomTags(response.tags, response.roomId);
    })
    .listen("Room\\RoomChangeStatusEvent", (response: RoomStatusEvent) => {
      switch (response.room.status) {
        case 1:
          roomsStore.addNewRoom(response.room);
          break;
        case 2:
        case 3:
          roomsStore.deleteRoom(response.room);
          break;
        case 4:
          roomsStore.deleteRoom(response.room);
          break;
      }
    })
    .listen(
      "Room\\ManagerConnectedEvent",
      async (response: ManagerConnectedEvent) => {
        if (!response.room.primary_user_id !== getCurrentUserId.value) {
          roomsStore.updateRoom(response.room);
        }
      }
    );
};

export const listenManagersChannel = (): void => {
  const chanel = `managers`;

  if (wsChannels.has(chanel) || !window.Echo) {
    return;
  }

  const roomsArchiveStore = useArchiveRoomsStore();
  const wsChannel = window.Echo.private(chanel);
  wsChannels.set(chanel, wsChannel);

  wsChannel.listen("Room\\RoomTagsEvent", (response: RoomUpdateTagsEvent) => {
    roomsArchiveStore.updateRoomTags(response.tags, response.roomId);
  });
};
export const listenManagerIdChannel = (id: string): void => {
  const chanel = `manager.${id}`;

  if (wsChannels.has(chanel) || !id || !window.Echo) {
    return;
  }

  const roomsStore = useRoomsStore();
  const wsChannel = window.Echo.private(chanel);
  wsChannels.set(chanel, wsChannel);

  wsChannel
    .listen(
      "Room\\ManagerConnectedEvent",
      async (response: ManagerConnectedEvent) => {
        await roomsStore.addNewRoom(response.room);

        if (!response.room.messages?.length) {
          setTimeout(() => {
            roomsStore.fetchRoom(response.room.id, response.room.id);
          }, 500);
        }
      }
    )
    .listen(
      "Room\\ManagerDisconnectedEvent",
      (response: ManagerConnectedEvent) => {
        leaveChannelMessages(`manager.${response.room.id}`);
        roomsStore.deleteRoom(response.room);
      }
    )
    .listen("Managers\\ManagerReadyStatusChangeEvent", response => {
      useUserStoreHook().setUserData(response.manager);
    });
};

export const leaveChannelMessages = (channelId: number | string): void => {
  const wsChannel = wsChannels.get(channelId);

  if (!wsChannel) {
    return;
  }

  wsChannels.delete(channelId);
  window.Echo.leave(channelId);
};
