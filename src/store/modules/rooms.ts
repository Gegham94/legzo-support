import { defineStore } from "pinia";
import { store } from "@/store";
import { roomsType } from "./types";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { CustomerDetail, Message, Room, Tag } from "@/api/chats/interfaces";
import { remove } from "lodash";

export const useRoomsStore = defineStore({
  id: "pure-rooms",
  state: (): roomsType => ({
    roomsList: [],
    selectedRoomId: null,
    currentUser: null,
    messageStatus: false,
    dataLoading: false
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
    },
    getMessageStatus() {
      return this.messageStatus;
    }
  },
  actions: {
    async fetchRooms(): Promise<void> {
      const { data } = await http.getList<void, RequestResult<Room[]>>(
        "/managers/rooms"
      );

      this.roomsList = [];

      if (data?.length) {
        data.forEach(room => {
          this.roomsList.push({ ...room, messagesLoaded: !room?.prev });
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
    updateRoom(room: Room): void {
      remove(this.roomsList, ({ id }) => id === room.id);
      this.addNewRoom(room);
    },
    deleteRoom(room: Room): void {
      remove(this.roomsList, ({ id }) => id === room.id);
      if (room.id === this.selectedRoomId) {
        this.selectedRoomId = this.roomsList[0]?.id;
      }
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
    moveRoomToStart(message: Message): void {
      const currentRoomIndex = this.roomsList.findIndex(
        ({ id }) => id === message.room_id
      );

      if (currentRoomIndex >= 0) {
        const currentRoom = this.roomsList[currentRoomIndex];
        currentRoom.lastMessage = message;

        if (currentRoomIndex) {
          this.roomsList.splice(currentRoomIndex, 1);
          this.roomsList.unshift(currentRoom);
        }
      }
    },
    setMessageStatus(status: boolean): void {
      this.MessageStatus = status;
    },
    addNewMessage(message: Message): void {
      const selectedRoom = this.roomsList.find(
        ({ id }) => id === message.room_id
      );

      if (!selectedRoom || !selectedRoom?.messages || !message.id) return;

      if (message?.reply_id) {
        message.reply_message = selectedRoom?.messages?.find(
          ({ id }) => id === message.reply_id
        );
      }

      const selectedMessageIndex = selectedRoom?.messages.findIndex(
        ({ id }) => id === message.id
      );

      if (selectedMessageIndex !== -1) {
        selectedRoom.messages[selectedMessageIndex] = {
          ...selectedRoom.messages[selectedMessageIndex],
          ...message
        };
      } else {
        selectedRoom.messages.push(message);
      }
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
      selectedRoom.lastMessage = message?.msg;
    },

    async fetchRoom(roomId, currentRoomId): Promise<number> {
      const { data } = await http.get<void, RequestResult<Room[]>>(
        `/managers/room/${roomId}`
      );
      const dataRoom = data[0];
      const selectedRoom = this.roomsList.find(
        ({ id }) => id === currentRoomId
      );

      selectedRoom.messagesLoaded =
        !dataRoom?.prev || !dataRoom.messages?.length;

      if (dataRoom.messages?.length) {
        selectedRoom.messages = [...data[0].messages, ...selectedRoom.messages];
      }
      return dataRoom.prev;
    },
    async clearData() {
      this.roomsList = [];
      this.selectedRoomId = null;
      this.currentUser = null;
    }
  }
});

export function useRoomsStoreHook() {
  return useRoomsStore(store);
}
