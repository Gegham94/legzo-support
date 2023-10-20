<script setup lang="ts">
import ChatContainer from "@/lib/ChatWindow.vue";
import { useChat } from "@/views/chats/active/hooks";
import ChatTags from "../components/ChatTags/index.vue";
import ChatTransfer from "../components/ChatTransfer/index.vue";

defineOptions({
  name: "Chats"
});

const {
  rooms,
  menuActionHandler,
  screenHeight,
  theme,
  currentUserId,
  currentUser,
  getMessages,
  sendMessage,
  fetchMessages,
  showTyping,
  openFile,
  tagsRoomId,
  removeRoomTag,
  transferRoomId,
  closeModalRoom,
  fetchRoomId
} = useChat();

const roomActions = [
  { name: "transferTo", title: "Transfer to ..." },
  { name: "addTag", title: "Add tag" },
  { name: "closeRoom", title: "Close Room" }
];

const menuActions = [
  { name: "transferTo", title: "Transfer to ..." },
  { name: "addTag", title: "Add tag" },
  { name: "closeRoom", title: "Close Room" }
];

const roomSupervisedActions = [
  { name: "transferTo", title: "Transfer to ..." },
  { name: "addTag", title: "Add tag" }
];

const menuSupervisedActions = [
  { name: "transferTo", title: "Transfer to ..." },
  { name: "addTag", title: "Add tag" }
];

const messageSelectionActions = [{ name: "deleteMessages", title: "Delete" }];
</script>

<template>
  <div>
    <chat-tags :roomId="tagsRoomId" @close-modal-room="closeModalRoom" />
    <chat-transfer
      :roomId="transferRoomId"
      @close-modal-room="closeModalRoom"
    />
    <chat-container
      ref="chatWindow"
      :height="screenHeight"
      :theme="theme"
      :current-user-id="currentUserId"
      :current-user="currentUser"
      :rooms="rooms"
      :messages="getMessages"
      :room-supervised-actions="roomSupervisedActions"
      :menu-supervised-actions="menuSupervisedActions"
      :room-actions="roomActions"
      :menu-actions="menuActions"
      :message-selection-actions="messageSelectionActions"
      :captureFiles="''"
      @fetch-room-id="fetchRoomId"
      @remove-room-tag="removeRoomTag"
      @fetch-messages="fetchMessages($event)"
      @send-message="sendMessage($event)"
      @open-file="openFile($event)"
      @room-action-handler="menuActionHandler($event)"
      @menu-action-handler="menuActionHandler($event)"
      @show-typing="showTyping"
    />
  </div>
</template>
