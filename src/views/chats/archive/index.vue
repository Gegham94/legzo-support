<script setup lang="ts">
import ChatContainer from "@/lib/ChatWindow.vue";
import { useChat } from "./hooks";
import ChatTags from "../components/ChatTags/index.vue";

defineOptions({
  name: "Archives"
});

const {
  menuActionHandler,
  screenHeight,
  theme,
  currentUserId,
  currentUser,
  roomId,
  roomsLoaded,
  loadedRooms,
  loadingRooms,
  roomMessage,
  fetchMoreRooms,
  messagesLoaded,
  getMessages,
  fetchMessages,
  openFile,
  tagsRoomId,
  removeRoomTag,
  closeModalRoom,
  fetchRoomId
} = useChat();

const roomActions = [{ name: "addTag", title: "Add tag" }];
const menuActions = [{ name: "addTag", title: "Add tag" }];
</script>

<template>
  <div>
    <chat-tags :roomId="tagsRoomId" @close-modal-room="closeModalRoom" />
    <chat-container
      ref="chatWindow"
      :is-archive="true"
      :height="screenHeight"
      :theme="theme"
      :current-user-id="currentUserId"
      :current-user="currentUser"
      :room-id="roomId"
      :rooms="loadedRooms"
      :loading-rooms="loadingRooms"
      :rooms-loaded="roomsLoaded"
      :messages-loaded="messagesLoaded"
      :messages="getMessages"
      :room-message="roomMessage"
      :room-actions="roomActions"
      :menu-actions="menuActions"
      :captureFiles="''"
      @fetch-room-id="fetchRoomId"
      @fetch-more-rooms="fetchMoreRooms"
      @remove-room-tag="removeRoomTag"
      @fetch-messages="fetchMessages($event)"
      @open-file="openFile($event)"
      @room-action-handler="menuActionHandler($event)"
      @menu-action-handler="menuActionHandler($event)"
    />
  </div>
</template>
