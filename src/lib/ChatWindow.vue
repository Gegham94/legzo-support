<template>
  <div class="vac-card-window" :style="[{ height }, cssVars]">
    <div class="vac-chat-container">
      <rooms-list
        v-if="!singleRoomCasted"
        :is-archive="isArchive"
        :current-user-id="currentUserId"
        :rooms="orderedRooms"
        :roomsPrimary="orderedPrimaryRooms"
        :roomsNotPrimary="orderedNotPrimaryRooms"
        :loading-rooms="loadingRoomsCasted"
        :rooms-loaded="roomsLoadedCasted"
        :room="room"
        :room-supervised-actions="roomSupervisedActionsCasted"
        :room-actions="roomActionsCasted"
        :custom-search-room-enabled="customSearchRoomEnabled"
        :text-messages="t"
        :show-search="showSearchCasted"
        :show-add-room="showAddRoomCasted"
        :show-rooms-list="showRoomsList && roomsListOpenedCasted"
        :text-formatting="textFormattingCasted"
        :link-options="linkOptionsCasted"
        :is-mobile="isMobile"
        :scroll-distance="scrollDistance"
        @fetch-room="fetchRoom"
        @fetch-more-rooms="fetchMoreRooms"
        @loading-more-rooms="loadingMoreRooms = $event"
        @add-room="addRoom"
        @search-room="searchRoom"
        @room-action-handler="roomActionHandler"
      >
        <template v-for="el in slots" #[el.slot]="data">
          <slot :name="el.slot" v-bind="data" />
        </template>
      </rooms-list>

      <room
        :is-archive="isArchive"
        :current-user-id="currentUserId"
        :rooms="roomsCasted"
        :room-id="room.id || ''"
        :roomsNotPrimary="orderedNotPrimaryRooms"
        :current-user="currentUser"
        :load-first-room="loadFirstRoomCasted"
        :messages="messagesCasted"
        :room-message="roomMessage"
        :messages-loaded="messagesLoadedCasted"
        :menu-supervised-actions="menuSupervisedActionsCasted"
        :menu-actions="menuActionsCasted"
        :message-actions="messageActionsCasted"
        :message-selection-actions="messageSelectionActionsCasted"
        :auto-scroll="autoScrollCasted"
        :show-send-icon="showSendIconCasted"
        :show-files="showFilesCasted"
        :show-audio="showAudioCasted"
        :audio-bit-rate="audioBitRate"
        :audio-sample-rate="audioSampleRate"
        :show-emojis="showEmojisCasted"
        :show-reaction-emojis="showReactionEmojisCasted"
        :show-new-messages-divider="showNewMessagesDividerCasted"
        :show-footer="showFooterCasted"
        :text-messages="t"
        :single-room="singleRoomCasted"
        :show-rooms-list="showRoomsList && roomsListOpenedCasted"
        :text-formatting="textFormattingCasted"
        :link-options="linkOptionsCasted"
        :is-mobile="isMobile"
        :loading-rooms="loadingRoomsCasted"
        :room-info-enabled="roomInfoEnabledCasted"
        :textarea-action-enabled="textareaActionEnabledCasted"
        :textarea-auto-focus="textareaAutoFocusCasted"
        :user-tags-enabled="userTagsEnabledCasted"
        :emojis-suggestion-enabled="emojisSuggestionEnabledCasted"
        :scroll-distance="scrollDistance"
        :accepted-files="acceptedFiles"
        :capture-files="captureFiles"
        :templates-text="templatesTextCasted"
        :username-options="usernameOptionsCasted"
        :emoji-data-source="emojiDataSource"
        @toggle-rooms-list="toggleRoomsList"
        @toggle-room-info="toggleRoomInfo"
        @room-info="roomInfo"
        @remove-room-tag="removeRoomTag"
        @fetch-messages="fetchMessages"
        @send-message="sendMessage"
        @edit-message="editMessage"
        @delete-message="deleteMessage"
        @open-file="openFile"
        @open-user-tag="openUserTag"
        @open-failed-message="openFailedMessage"
        @menu-action-handler="menuActionHandler"
        @message-action-handler="messageActionHandler"
        @message-selection-action-handler="messageSelectionActionHandler"
        @send-message-reaction="sendMessageReaction"
        @typing-message="typingMessage"
        @show-typing="showTyping"
        @textarea-action-handler="textareaActionHandler"
        @fetch-room-id="fetchRoomId"
      >
        <template v-for="el in slots" #[el.slot]="data">
          <slot :name="el.slot" v-bind="data" />
        </template>
      </room>

      <room-info
        v-if="!singleRoomCasted"
        :is-archive="isArchive"
        :show-room-info="isShowRoomInfo"
        :is-mobile="isMobile"
        :room="room"
        :loading-rooms="loadingRoomsCasted"
        :current-user="currentUser"
        :text-messages="t"
        @toggle-room-info="toggleRoomInfo"
      >
        <template v-for="el in slots" #[el.slot]="data">
          <slot :name="el.slot" v-bind="data" />
        </template>
      </room-info>
    </div>
    <transition name="vac-fade-preview" appear>
      <media-preview
        v-if="showMediaPreview"
        :file="previewFile"
        @close-media-preview="showMediaPreview = false"
      >
        <template v-for="el in slots" #[el.slot]="data">
          <slot :name="el.slot" v-bind="data" />
        </template>
      </media-preview>
    </transition>
  </div>
</template>

<script>
import RoomsList from "./RoomsList/RoomsList.vue";
import Room from "./Room/Room.vue";
import MediaPreview from "./MediaPreview/MediaPreview.vue";
import RoomInfo from "./RoomInfo/index.vue";

import locales from "./locales";
import { defaultThemeStyles, cssThemeVars } from "./themes";
import // roomsValidation,
// partcipantsValidation
"./utils/data-validation";

export default {
  name: "ChatContainer",
  components: {
    RoomsList,
    Room,
    RoomInfo,
    MediaPreview
  },

  props: {
    height: { type: String, default: "600px" },
    isArchive: { type: Boolean, default: false },
    theme: { type: String, default: "light" },
    styles: { type: [Object, String], default: () => ({}) },
    responsiveBreakpoint: { type: Number, default: 900 },
    singleRoom: { type: [Boolean, String], default: false },
    roomsListOpened: { type: [Boolean, String], default: true },
    roomInfoOpened: { type: [Boolean, String], default: true },
    textMessages: { type: [Object, String], default: () => ({}) },
    currentUserId: { type: String, default: "" },
    currentUser: { type: Object, default: () => ({}) },
    rooms: { type: [Array, String], default: () => [] },
    roomsOrder: { type: String, default: "desc" },
    loadingRooms: { type: [Boolean, String], default: false },
    roomsLoaded: { type: [Boolean, String], default: true },
    roomId: { type: [Number, String], default: null },
    loadFirstRoom: { type: [Boolean, String], default: true },
    messages: { type: [Array, String], default: () => [] },
    messagesLoaded: { type: [Boolean, String], default: true },
    roomSupervisedActions: { type: [Array, String], default: () => [] },
    menuSupervisedActions: { type: [Array, String], default: () => [] },
    roomActions: { type: [Array, String], default: () => [] },
    menuActions: { type: [Array, String], default: () => [] },
    messageActions: {
      type: [Array, String],
      default: () => [{ name: "replyMessage", title: "Reply" }]
    },
    messageSelectionActions: { type: [Array, String], default: () => [] },
    autoScroll: {
      type: [Object, String],
      default: () => {
        return {
          send: {
            new: true,
            newAfterScrollUp: true
          },
          receive: {
            new: true,
            newAfterScrollUp: false
          }
        };
      }
    },
    customSearchRoomEnabled: { type: [Boolean, String], default: false },
    showSearch: { type: [Boolean, String], default: true },
    showAddRoom: { type: [Boolean, String], default: false },
    showSendIcon: { type: [Boolean, String], default: true },
    showFiles: { type: [Boolean, String], default: true },
    showAudio: { type: [Boolean, String], default: true },
    audioBitRate: { type: Number, default: 128 },
    audioSampleRate: { type: Number, default: 44100 },
    showEmojis: { type: [Boolean, String], default: true },
    showReactionEmojis: { type: [Boolean, String], default: true },
    showNewMessagesDivider: { type: [Boolean, String], default: true },
    showFooter: { type: [Boolean, String], default: true },
    textFormatting: {
      type: [Object, String],
      default: () => ({
        disabled: false,
        italic: "_",
        bold: "*",
        strike: "~",
        underline: "°",
        multilineCode: "```",
        inlineCode: "`"
      })
    },
    linkOptions: {
      type: [Object, String],
      default: () => ({ disabled: false, target: "_blank", rel: null })
    },
    roomInfoEnabled: { type: [Boolean, String], default: false },
    textareaActionEnabled: { type: [Boolean, String], default: false },
    textareaAutoFocus: { type: [Boolean, String], default: true },
    userTagsEnabled: { type: [Boolean, String], default: true },
    emojisSuggestionEnabled: { type: [Boolean, String], default: true },
    roomMessage: { type: String, default: "" },
    scrollDistance: { type: Number, default: 60 },
    acceptedFiles: { type: String, default: "*" },
    captureFiles: { type: String },
    templatesText: { type: [Array, String], default: () => [] },
    mediaPreviewEnabled: { type: [Boolean, String], default: true },
    usernameOptions: {
      type: [Object, String],
      default: () => ({ minUsers: 1, currentUser: false })
    },
    emojiDataSource: { type: String, default: undefined }
    // room_id: { type: Number, default: null }
  },

  emits: [
    "toggle-rooms-list",
    "room-info",
    "fetch-messages",
    "send-message",
    "edit-message",
    "delete-message",
    "open-file",
    "open-user-tag",
    "open-failed-message",
    "menu-action-handler",
    "message-action-handler",
    "send-message-reaction",
    "typing-message",
    "show-typing",
    "textarea-action-handler",
    "fetch-more-rooms",
    "fetch-room-id",
    "add-room",
    "toggle-room-info",
    "search-room",
    "room-action-handler",
    "message-selection-action-handler"
  ],

  data() {
    return {
      slots: [],
      room: {},
      loadingMoreRooms: false,
      showRoomsList: true,
      showRoomInfo: true,
      isMobile: false,
      showMediaPreview: false,
      previewFile: {}
    };
  },

  computed: {
    t() {
      return {
        ...locales,
        ...this.textMessagesCasted
      };
    },
    cssVars() {
      const defaultStyles = defaultThemeStyles[this.theme];
      const customStyles = {};

      Object.keys(defaultStyles).map(key => {
        customStyles[key] = {
          ...defaultStyles[key],
          ...(this.stylesCasted[key] || {})
        };
      });

      return cssThemeVars(customStyles);
    },
    isShowRoomInfo() {
      return this.room.id && this.showRoomInfo;
    },
    orderedRooms() {
      return this.roomsCasted;
    },
    orderedPrimaryRooms() {
      return this.roomsCasted.filter(
        room => room.primary_user_id === this.currentUserId
      );
    },
    orderedNotPrimaryRooms() {
      return this.roomsCasted.filter(
        room => room.primary_user_id !== this.currentUserId
      );
    },
    singleRoomCasted() {
      return this.castBoolean(this.singleRoom);
    },
    roomsListOpenedCasted() {
      return this.castBoolean(this.roomsListOpened);
    },
    loadingRoomsCasted() {
      return this.castBoolean(this.loadingRooms);
    },
    roomsLoadedCasted() {
      return this.castBoolean(this.roomsLoaded);
    },
    loadFirstRoomCasted() {
      return this.castBoolean(this.loadFirstRoom);
    },
    messagesLoadedCasted() {
      return this.castBoolean(this.messagesLoaded);
    },
    showSearchCasted() {
      return this.castBoolean(this.showSearch);
    },
    showAddRoomCasted() {
      return this.castBoolean(this.showAddRoom);
    },
    showSendIconCasted() {
      return this.castBoolean(this.showSendIcon);
    },
    showFilesCasted() {
      return this.castBoolean(this.showFiles);
    },
    showAudioCasted() {
      return this.castBoolean(this.showAudio);
    },
    showEmojisCasted() {
      return this.castBoolean(this.showEmojis);
    },
    showReactionEmojisCasted() {
      return this.castBoolean(this.showReactionEmojis);
    },
    showNewMessagesDividerCasted() {
      return this.castBoolean(this.showNewMessagesDivider);
    },
    showFooterCasted() {
      return this.castBoolean(this.showFooter);
    },
    roomInfoEnabledCasted() {
      return this.castBoolean(this.roomInfoEnabled);
    },
    textareaActionEnabledCasted() {
      return this.castBoolean(this.textareaActionEnabled);
    },
    textareaAutoFocusCasted() {
      return this.castBoolean(this.textareaAutoFocus);
    },
    userTagsEnabledCasted() {
      return this.castBoolean(this.userTagsEnabled);
    },
    emojisSuggestionEnabledCasted() {
      return this.castBoolean(this.emojisSuggestionEnabled);
    },
    mediaPreviewEnabledCasted() {
      return this.castBoolean(this.mediaPreviewEnabled);
    },
    roomsCasted() {
      return this.castArray(this.rooms);
    },
    messagesCasted() {
      return this.castArray(this.messages);
    },
    roomSupervisedActionsCasted() {
      return this.castArray(this.roomSupervisedActions);
    },
    menuSupervisedActionsCasted() {
      return this.castArray(this.menuSupervisedActions);
    },
    roomActionsCasted() {
      return this.castArray(this.roomActions);
    },
    menuActionsCasted() {
      return this.castArray(this.menuActions);
    },
    messageActionsCasted() {
      return this.castArray(this.messageActions);
    },
    messageSelectionActionsCasted() {
      return this.castArray(this.messageSelectionActions);
    },
    templatesTextCasted() {
      return this.castArray(this.templatesText);
    },
    stylesCasted() {
      return this.castObject(this.styles);
    },
    textMessagesCasted() {
      return this.castObject(this.textMessages);
    },
    autoScrollCasted() {
      return this.castObject(this.autoScroll);
    },
    textFormattingCasted() {
      return this.castObject(this.textFormatting);
    },
    linkOptionsCasted() {
      return this.castObject(this.linkOptions);
    },
    usernameOptionsCasted() {
      return this.castObject(this.usernameOptions);
    }
  },

  watch: {
    roomsCasted: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.showRoomInfo = !(!newVal[0] && oldVal);
        if (!newVal[0] || !newVal.find(room => room.id === this.room.id)) {
          this.showRoomsList = true;
        }

        if (
          !this.loadingMoreRooms &&
          this.loadFirstRoomCasted &&
          newVal[0] &&
          (!oldVal || newVal.length !== oldVal.length)
        ) {
          if (this.id) {
            const room = newVal.find(r => r.id === this.id) || {};
            this.fetchRoom({ room });
          } else if (!this.isMobile || this.singleRoomCasted) {
            this.fetchRoom({ room: this.orderedRooms[0] });
          } else {
            this.showRoomsList = true;
          }
        }

        if (newVal.length === 1 && !this.id) {
          this.fetchRoom({ room: newVal[0] });
        }
      }
    },

    loadingRoomsCasted(val) {
      if (val) this.room = {};
    },

    roomId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && !this.loadingRoomsCasted && this.roomsCasted.length) {
          const room = this.roomsCasted.find(r => r.id === newVal);
          this.fetchRoom({ room });
        } else if (oldVal && !newVal) {
          this.room = {};
        }

        if (!newVal) {
          this.showRoomInfo = false;
        }
      }
    },

    room(val) {
      if (!val || Object.entries(val).length === 0) return;
      /* roomsValidation(val);
      val.users.forEach(user => {
        if (user?.id) partcipantsValidation(user);
      }); */
    },

    roomsListOpenedCasted: {
      immediate: true,
      handler(val) {
        this.showRoomsList = val;
      }
    }
  },

  created() {
    this.updateResponsive();
    window.addEventListener("resize", ev => {
      if (ev.isTrusted) this.updateResponsive();
    });
  },

  updated() {
    const slots = document.querySelectorAll("[slot]");
    if (this.slots.length !== slots.length) {
      this.slots = slots;
    }
  },

  methods: {
    castBoolean(val) {
      return val === "true" || val === true;
    },
    castArray(val) {
      return !val ? [] : Array.isArray(val) ? val : JSON.parse(val);
    },
    castObject(val) {
      return !val ? {} : typeof val === "object" ? val : JSON.parse(val);
    },
    updateResponsive() {
      this.isMobile = window.innerWidth < Number(this.responsiveBreakpoint);
    },
    toggleRoomsList() {
      this.showRoomsList = !this.showRoomsList;
      if (this.isMobile) this.room = {};
      this.$emit("toggle-rooms-list", { opened: this.showRoomsList });
    },
    fetchRoom({ room }) {
      this.room = room;
      this.fetchMessages({ reset: true });
      if (this.isMobile) this.showRoomsList = false;
    },
    fetchMoreRooms() {
      this.$emit("fetch-more-rooms");
    },
    fetchRoomId(val) {
      this.$emit("fetch-room-id", val);
    },
    roomInfo() {
      this.$emit("room-info", this.room);
    },
    removeRoomTag(tagId) {
      this.$emit("remove-room-tag", { roomId: this.room.id, tagId: tagId });
    },
    addRoom() {
      this.$emit("add-room");
    },
    toggleRoomInfo() {
      this.showRoomInfo = !this.showRoomInfo;
    },
    searchRoom(val) {
      this.$emit("search-room", { value: val, roomId: this.room.id });
    },
    fetchMessages(options) {
      this.$emit("fetch-messages", { room: this.room, options });
    },
    sendMessage(message) {
      this.$emit("send-message", { ...message, roomId: this.room.id });
    },
    editMessage(message) {
      this.$emit("edit-message", { ...message, roomId: this.room.id });
    },
    deleteMessage(message) {
      this.$emit("delete-message", { message, roomId: this.room.id });
    },
    openFile({ message, file }) {
      if (this.mediaPreviewEnabledCasted && file.action === "preview") {
        this.previewFile = file.file;
        this.showMediaPreview = true;
      } else {
        this.$emit("open-file", { message, file });
      }
    },
    openUserTag({ user }) {
      this.$emit("open-user-tag", { user });
    },
    openFailedMessage({ message }) {
      this.$emit("open-failed-message", {
        message,
        roomId: this.room.id
      });
    },
    menuActionHandler(ev) {
      this.$emit("menu-action-handler", {
        action: ev,
        roomId: this.room.id
      });
    },
    roomActionHandler({ action, roomId }) {
      this.$emit("room-action-handler", {
        action,
        roomId
      });
    },
    messageActionHandler(ev) {
      this.$emit("message-action-handler", {
        ...ev,
        roomId: this.room.id
      });
    },
    messageSelectionActionHandler(ev) {
      this.$emit("message-selection-action-handler", {
        ...ev,
        roomId: this.room.id
      });
    },
    sendMessageReaction(messageReaction) {
      this.$emit("send-message-reaction", {
        ...messageReaction,
        roomId: this.room.id
      });
    },
    typingMessage(message) {
      this.$emit("typing-message", {
        message,
        roomId: this.room.id
      });
    },
    showTyping(roomId) {
      this.$emit("show-typing", roomId);
    },
    textareaActionHandler(message) {
      this.$emit("textarea-action-handler", {
        message,
        roomId: this.room.id
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/animation.scss";
@import "@/styles/menu.scss";
@import "@/styles/helper.scss";

@import "@/lib/ChatWindow.scss";

@import "@/lib/MediaPreview/MediaPreview.scss";

@import "@/lib/Room/Room.scss";
@import "@/lib/Room/RoomHeader/RoomHeader.scss";

@import "@/lib/Room/RoomFooter/RoomFooter.scss";
@import "@/lib/Room/RoomFooter/RoomEmojis/RoomEmojis.scss";
@import "@/lib/Room/RoomFooter/RoomMessageReply/RoomMessageReply.scss";
@import "@/lib/Room/RoomFooter/RoomFiles/RoomFiles.scss";
@import "@/lib/Room/RoomFooter/RoomFiles/RoomFile/RoomFile.scss";
@import "@/lib/Room/RoomFooter/RoomUsersTag/RoomUsersTag.scss";
@import "@/lib/Room/RoomFooter/RoomTemplatesText/RoomTemplatesText.scss";

@import "@/lib/RoomsList/RoomsList.scss";
@import "@/lib/RoomsList/RoomContent/RoomContent.scss";
@import "@/lib/RoomsList/RoomsSearch/RoomsSearch.scss";

@import "@/lib/Room/RoomMessage/RoomMessage.scss";
@import "@/lib/Room/RoomMessage/AudioPlayer/AudioPlayer.scss";
@import "@/lib/Room/RoomMessage/AudioPlayer/AudioControl/AudioControl.scss";
@import "@/lib/Room/RoomMessage/MessageActions/MessageActions.scss";
@import "@/lib/Room/RoomMessage/MessageFiles/MessageFiles.scss";
@import "@/lib/Room/RoomMessage/MessageFiles/MessageFile/MessageFile.scss";
@import "@/lib/Room/RoomMessage/MessageReactions/MessageReactions.scss";
@import "@/lib/Room/RoomMessage/MessageReply/MessageReply.scss";

@import "@/lib/components/EmojiPickerContainer/EmojiPickerContainer.scss";
@import "@/lib/components/FormatMessage/FormatMessage.scss";
@import "@/lib/components/Loader/Loader.scss";
@import "@/lib/components/SvgIcon/SvgIcon.scss";
@import "@/lib/components/ProgressBar/ProgressBar.scss";
</style>
