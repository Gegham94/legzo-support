import { defineStore } from "pinia";
import { store } from "@/store";
import { roomsType } from "./types";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { CustomerDetail, Message, Room, Tag } from "@/api/chats/interfaces";

export const useArchiveRoomsStore = defineStore({
  id: "pure-archive-rooms",
  state: (): roomsType => ({
    roomsList: [],
    selectedRoomId: null,
    currentUser: null
  }),
  getters: {
    getRooms() {
      return this.roomsList;
    },
    getRoomMessages() {
      const currentRoom = this.roomsList?.find(
        ({ id }) => id === this.selectedRoomId
      );
      return currentRoom ? currentRoom?.messages : [];
    },
    getCurrentRoom() {
      return this.roomsList?.find(({ id }) => id === this.selectedRoomId);
    },
    getCurrentUser() {
      return this.currentUser;
    }
  },
  actions: {
    async fetchRooms(params, reset = false): Promise<number> {
      const { data, total } = await http.getList<void, RequestResult<Room[]>>(
        "/managers/rooms/archive",
        params
      );

      if (reset) {
        this.roomsList = [];
      }

      if (data?.length) {
        data.forEach(room => {
          this.roomsList.push({ ...room });
        });

        this.roomsList.forEach(room => {
          room.users.forEach(user => {
            room.messages.forEach(message => {
              if (!message?.role) {
                message.role = 0;
              }
              if (user.id == message.from_user_id) {
                message.role = user.role;
              }
            });
          });
        });
      }

      return total;
    },
    async fetchRoom(roomId): Promise<void> {
      const { data } = await http.get<void, RequestResult<Room>>(
        `/managers/room/${roomId}`
      );

      this.addNewRoom(data[0]);
    },
    async fetchCurrentUserDetail(customerId): Promise<void> {
      const { data } = await http.get<void, RequestResult<CustomerDetail>>(
        `/managers/customer/${customerId}`
      );

      this.currentUser = data;
    },
    async fetchRoomsTag(roomId, tagId): Promise<boolean> {
      const { success } = await http.post<void, RequestResult<Message>>(
        `/managers/room/${roomId}/tags/${tagId}`
      );

      return success;
    },
    async fetchRemoveRoomsTag(roomId, tagId): Promise<boolean> {
      const { success } = await http.delete<void, RequestResult<boolean>>(
        `/managers/room/${roomId}/tags/${tagId}`
      );

      return success;
    },
    addNewRoom(room: Room): void {
      if (room.id && !this.roomsList.find(({ id }) => id === room.id)) {
        this.roomsList.unshift(room);
      }
    },
    updateRoomTags(tags: Tag[], roomId: number): void {
      const selectedRoom = this.roomsList.find(({ id }) => id === roomId);

      selectedRoom.tags = tags;
    },
    setSelectedRoomId(roomId: number): void {
      this.selectedRoomId = roomId;
    },
    setRoomPage(page: number): void {
      const selectedRoom = this.roomsList.find(
        ({ id }) => id === this.selectedRoomId
      );

      if (selectedRoom) {
        selectedRoom.page = page;
      }
    },
    async fetchRoomMessages(): Promise<number> {
      const selectedRoom = this.roomsList.find(
        ({ id }) => id === this.selectedRoomId
      );

      const { data } = await http.getList<void, RequestResult<Message[]>>(
        `/managers/cross_room/${this.selectedRoomId}/messages`
      );

      if (data?.length) {
        selectedRoom.messages = [...data];

        selectedRoom.users.forEach(user => {
          selectedRoom.messages.forEach(message => {
            if (!message?.role) {
              message.role = 0;
            }
            if (user.id == message.from_user_id) {
              message.role = user.role;
            }
          });
        });
      }

      return data?.length ?? 0;
    }
  }
});

export function useRoomsStoreHook() {
  return useArchiveRoomsStore(store);
}
