<template>
  <div
    v-show="(isMobile && !showRoomsList) || !isMobile || singleRoom"
    class="vac-col-messages"
    @drop.prevent="onDropFiles"
    @dragenter.prevent
    @dragover.prevent
    @dragleave.prevent
    @touchstart="touchStart"
  >
    <slot v-if="showNoRoom" name="no-room-selected">
      <div class="vac-container-center vac-room-empty">
        <div>{{ textMessages.ROOM_EMPTY }}</div>
      </div>
    </slot>

    <room-header
      v-else
      :current-user-id="currentUserId"
      :text-messages="textMessages"
      :single-room="singleRoom"
      :show-rooms-list="showRoomsList"
      :is-mobile="isMobile"
      :room-info-enabled="roomInfoEnabled"
      :menu-actions="
        roomsNotPrimary && roomsNotPrimary?.length > 0
          ? menuSupervisedActions
          : menuActions
      "
      :room="room"
      :message-selection-enabled="messageSelectionEnabled"
      :message-selection-actions="messageSelectionActions"
      :selected-messages-total="selectedMessages.length"
      @toggle-rooms-list="$emit('toggle-rooms-list')"
      @toggle-room-info="$emit('toggle-room-info')"
      @room-info="$emit('room-info')"
      @remove-room-tag="$emit('remove-room-tag', $event)"
      @menu-action-handler="$emit('menu-action-handler', $event)"
      @message-selection-action-handler="messageSelectionActionHandler"
      @cancel-message-selection="messageSelectionEnabled = false"
    >
      <template v-for="(i, name) in $slots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </room-header>

    <div
      id="messages-list"
      ref="scrollContainer"
      class="vac-container-scroll"
      @scroll="onContainerScroll"
    >
      <loader :show="loadingMessages" type="messages">
        <template v-for="(idx, name) in $slots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </loader>
      <div class="vac-messages-container">
        <div :class="{ 'vac-messages-hidden': loadingMessages }">
          <transition name="vac-fade-message">
            <div>
              <div v-if="showNoMessages" class="vac-text-started">
                <slot name="messages-empty">
                  {{ textMessages.MESSAGES_EMPTY }}
                </slot>
              </div>
              <div v-if="showMessagesStarted" class="vac-text-started">
                {{ textMessages.CONVERSATION_STARTED }}
                {{ formatterDate(messages[0].created_at) }}
                <div
                  class="vac-text-started-info"
                  v-if="getManager && getCustomer"
                >
                  <span class="manager-name">{{ getManager }}</span>
                  <span class="mid-word">and</span>
                  <span class="customer-name">{{ getCustomer }}</span>
                </div>
              </div>
            </div>
          </transition>
          <div
            v-if="messages.length && !messagesLoaded"
            id="infinite-loader-messages"
          >
            <loader :show="true" :infinite="true" type="infinite-messages">
              <template v-for="(idx, name) in $slots" #[name]="data">
                <slot :name="name" v-bind="data" />
              </template>
            </loader>
          </div>
          <transition-group :key="roomId" name="vac-fade-message" tag="span">
            <div class="relative pb-4">
              <el-button
                v-if="isArchive && room.next"
                class="more-message-button next-messages"
                @click="loadRoomId(room.next)"
              >
                <IconifyIconOffline :icon="ArrowUpLine()" />
                <span class="button-text">Next chat with this customer</span>
              </el-button>
              <div class="messages-list">
                <div v-for="(m, i) in messages" :key="m.id">
                  <room-message
                    :current-user-id="currentUserId"
                    :message="m"
                    :index="i"
                    :messages="messages"
                    :edited-message-id="editedMessageId"
                    :message-actions="messageActions"
                    :room-users="room.users"
                    :text-messages="textMessages"
                    :new-messages="newMessages"
                    :show-reaction-emojis="showReactionEmojis"
                    :show-new-messages-divider="showNewMessagesDivider"
                    :text-formatting="textFormatting"
                    :link-options="linkOptions"
                    :username-options="usernameOptions"
                    :message-selection-enabled="messageSelectionEnabled"
                    :selected-messages="selectedMessages"
                    :emoji-data-source="emojiDataSource"
                    @message-added="onMessageAdded"
                    @message-action-handler="messageActionHandler"
                    @open-file="openFile"
                    @open-user-tag="openUserTag"
                    @open-failed-message="$emit('open-failed-message', $event)"
                    @send-message-reaction="sendMessageReaction"
                    @select-message="selectMessage"
                    @unselect-message="unselectMessage"
                  >
                    <template v-for="(idx, name) in $slots" #[name]="data">
                      <slot :name="name" v-bind="data" />
                    </template>
                  </room-message>
                </div>
              </div>
              <el-button
                v-if="isArchive && room.prev"
                class="more-message-button prev-messages"
                @click="loadRoomId(room.prev)"
              >
                <IconifyIconOffline :icon="ArrowDownLine()" />
                <span class="button-text"
                  >Previous chat with this customer</span
                >
              </el-button>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div v-if="!loadingMessages">
      <transition name="vac-bounce">
        <div v-if="scrollIcon" class="vac-icon-scroll" @click="scrollToBottom">
          <transition name="vac-bounce">
            <div
              v-if="scrollMessagesCount"
              class="vac-badge-counter vac-messages-count"
            >
              {{ scrollMessagesCount }}
            </div>
          </transition>
          <slot name="scroll-icon">
            <svg-icon name="dropdown" param="scroll" />
          </slot>
        </div>
      </transition>
    </div>

    <room-footer
      v-if="!isArchive"
      :room="room"
      :room-id="roomId"
      :room-message="roomMessage"
      :text-messages="textMessages"
      :show-send-icon="showSendIcon"
      :show-files="showFiles"
      :show-audio="showAudio"
      :show-emojis="showEmojis"
      :show-footer="showFooter"
      :accepted-files="acceptedFiles"
      :capture-files="captureFiles"
      :textarea-action-enabled="textareaActionEnabled"
      :textarea-auto-focus="textareaAutoFocus"
      :user-tags-enabled="userTagsEnabled"
      :emojis-suggestion-enabled="emojisSuggestionEnabled"
      :templates-text="templatesText"
      :text-formatting="textFormatting"
      :link-options="linkOptions"
      :audio-bit-rate="audioBitRate"
      :audio-sample-rate="audioSampleRate"
      :init-reply-message="initReplyMessage"
      :init-edit-message="initEditMessage"
      :dropped-files="droppedFiles"
      :emoji-data-source="emojiDataSource"
      @update-edited-message-id="editedMessageId = $event"
      @edit-message="$emit('edit-message', $event)"
      @send-message="$emit('send-message', $event)"
      @typing-message="$emit('typing-message', $event)"
      @show-typing="$emit('show-typing', $event)"
      @textarea-action-handler="$emit('textarea-action-handler', $event)"
    >
      <template v-for="(idx, name) in $slots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </room-footer>
  </div>
</template>

<script>
import Loader from "../components/Loader/Loader.vue";
import SvgIcon from "../components/SvgIcon/SvgIcon.vue";

import RoomHeader from "./RoomHeader/RoomHeader.vue";
import RoomFooter from "./RoomFooter/RoomFooter.vue";
import RoomMessage from "./RoomMessage/RoomMessage.vue";
import moment from "moment-timezone";

import ArrowUpLine from "@iconify-icons/ri/arrow-up-line";
import ArrowDownLine from "@iconify-icons/ri/arrow-down-line";

export default {
  name: "ChatRoom",
  components: {
    Loader,
    SvgIcon,
    RoomHeader,
    RoomFooter,
    RoomMessage
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    singleRoom: { type: Boolean, required: true },
    showRoomsList: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    isArchive: { type: Boolean, default: false },
    rooms: { type: Array, required: true },
    roomId: { type: [String, Number], required: true },
    roomsNotPrimary: { type: Array, required: true },
    currentUser: { type: Array, required: true },
    loadFirstRoom: { type: Boolean, required: true },
    messages: { type: Array, required: true },
    roomMessage: { type: String, default: null },
    messagesLoaded: { type: Boolean, required: true },
    menuActions: { type: Array, required: true },
    menuSupervisedActions: { type: Array, required: true },
    messageActions: { type: Array, required: true },
    messageSelectionActions: { type: Array, required: true },
    autoScroll: { type: Object, required: true },
    showSendIcon: { type: Boolean, required: true },
    showFiles: { type: Boolean, required: true },
    showAudio: { type: Boolean, required: true },
    audioBitRate: { type: Number, required: true },
    audioSampleRate: { type: Number, required: true },
    showEmojis: { type: Boolean, required: true },
    showReactionEmojis: { type: Boolean, required: true },
    showNewMessagesDivider: { type: Boolean, required: true },
    showFooter: { type: Boolean, required: true },
    acceptedFiles: { type: String, required: true },
    captureFiles: { type: String, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    loadingRooms: { type: Boolean, required: true },
    roomInfoEnabled: { type: Boolean, required: true },
    textareaActionEnabled: { type: Boolean, required: true },
    textareaAutoFocus: { type: Boolean, required: true },
    userTagsEnabled: { type: Boolean, required: true },
    emojisSuggestionEnabled: { type: Boolean, required: true },
    scrollDistance: { type: Number, required: true },
    templatesText: { type: Array, default: null },
    usernameOptions: { type: Object, required: true },
    emojiDataSource: { type: String, default: undefined }
  },

  emits: [
    "toggle-rooms-list",
    "toggle-room-info",
    "room-info",
    "remove-room-tag",
    "menu-action-handler",
    "message-selection-action-handler",
    "edit-message",
    "send-message",
    "delete-message",
    "message-action-handler",
    "fetch-messages",
    "fetch-room-id",
    "send-message-reaction",
    "typing-message",
    "open-file",
    "open-user-tag",
    "open-failed-message",
    "textarea-action-handler"
  ],

  data() {
    return {
      editedMessageId: null,
      initReplyMessage: null,
      initEditMessage: null,
      loadingMessages: false,
      observer: null,
      showLoader: true,
      loadingMoreMessages: false,
      scrollIcon: false,
      scrollMessagesCount: 0,
      newMessages: [],
      messageSelectionEnabled: false,
      selectedMessages: [],
      droppedFiles: []
    };
  },

  computed: {
    room() {
      return this.rooms.find(room => room.id === this.roomId) || {};
    },
    showNoMessages() {
      return (
        this.roomId &&
        !this.messages.length &&
        !this.loadingMessages &&
        !this.loadingRooms
      );
    },
    showNoRoom() {
      const noRoomSelected =
        (!this.rooms.length && !this.loadingRooms) ||
        (!this.roomId && !this.loadFirstRoom);

      if (noRoomSelected) {
        this.updateLoadingMessages(false);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.scrollIcon = false;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.scrollMessagesCount = 0;
      }

      return noRoomSelected;
    },
    showMessagesStarted() {
      return this.messages.length && this.messagesLoaded;
    },
    getManager() {
      const room = this.room;
      const manager = room.users.find(user => user.id === room.primary_user_id);
      if (!manager) return null;
      return manager.name;
    },
    getCustomer() {
      const customer = this.currentUser;
      if (customer?.name) {
        return customer.name;
      } else if (customer?.email) {
        const emailParts = customer.email.split("@");
        return emailParts[0];
      }
      return null;
    }
  },

  watch: {
    roomId: {
      immediate: true,
      handler() {
        if (!this.isArchive) {
          this.onRoomChanged();
        }
      }
    },
    messages: {
      deep: true,
      handler(newVal, oldVal) {
        newVal.forEach((message, i) => {
          if (
            this.showNewMessagesDivider &&
            !message.seen &&
            message.from_user_id !== this.currentUserId
          ) {
            this.newMessages.push({
              _id: message._id,
              index: i
            });
          }
        });
        if (oldVal?.length === newVal?.length - 1) {
          this.newMessages = [];
        }
        setTimeout(() => (this.loadingMoreMessages = false));
      }
    },
    messagesLoaded(val) {
      if (val) this.updateLoadingMessages(false);
    }
  },

  mounted() {
    this.newMessages = [];
  },

  methods: {
    ArrowUpLine() {
      return ArrowUpLine;
    },
    ArrowDownLine() {
      return ArrowDownLine;
    },
    updateLoadingMessages(val) {
      this.loadingMessages = val;

      if (!val) {
        setTimeout(() => this.initIntersectionObserver());
      }
    },
    initIntersectionObserver() {
      if (this.observer) {
        this.showLoader = true;
        this.observer.disconnect();
      }

      const loader = this.$el.querySelector("#infinite-loader-messages");

      if (loader) {
        const options = {
          root: this.$el.querySelector("#messages-list"),
          rootMargin: `${this.scrollDistance}px`,
          threshold: 0
        };

        this.observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            this.loadMoreMessages();
          }
        }, options);

        this.observer.observe(loader);
      }
    },
    preventTopScroll() {
      const container = this.$refs.scrollContainer;
      const prevScrollHeight = container.scrollHeight;

      const observer = new ResizeObserver(_ => {
        if (container.scrollHeight !== prevScrollHeight) {
          if (this.$refs.scrollContainer) {
            this.$refs.scrollContainer.scrollTo({
              top: container.scrollHeight - prevScrollHeight
            });
            observer.disconnect();
          }
        }
      });

      for (let i = 0; i < container.children.length; i++) {
        observer.observe(container.children[i]);
      }
    },
    touchStart(touchEvent) {
      if (this.singleRoom) return;

      if (touchEvent.changedTouches.length === 1) {
        const posXStart = touchEvent.changedTouches[0].clientX;
        const posYStart = touchEvent.changedTouches[0].clientY;

        addEventListener(
          "touchend",
          touchEvent => this.touchEnd(touchEvent, posXStart, posYStart),
          { once: true }
        );
      }
    },
    touchEnd(touchEvent, posXStart, posYStart) {
      if (touchEvent.changedTouches.length === 1) {
        const posXEnd = touchEvent.changedTouches[0].clientX;
        const posYEnd = touchEvent.changedTouches[0].clientY;

        const swippedRight = posXEnd - posXStart > 100;
        const swippedVertically = Math.abs(posYEnd - posYStart) > 50;

        if (swippedRight && !swippedVertically) {
          this.$emit("toggle-rooms-list");
        }
      }
    },
    onRoomChanged() {
      this.updateLoadingMessages(true);
      this.scrollIcon = false;
      this.scrollMessagesCount = 0;
      this.resetMessageSelection();

      const unwatch = this.$watch(
        () => this.messages,
        val => {
          if (!val || !val.length) return;

          const element = this.$refs.scrollContainer;
          if (!element) return;

          unwatch();

          setTimeout(() => {
            element.scrollTo({ top: element.scrollHeight });
            this.updateLoadingMessages(false);
          });
        }
      );
    },
    resetMessageSelection() {
      this.messageSelectionEnabled = false;
      this.selectedMessages = [];
    },
    selectMessage(message) {
      this.selectedMessages.push(message);
    },
    unselectMessage(messageId) {
      this.selectedMessages = this.selectedMessages.filter(
        message => message._id !== messageId
      );
    },
    onMessageAdded({ message, index, ref }) {
      if (index !== this.messages.length - 1) return;

      const autoScrollOffset = ref.offsetHeight + 60;

      setTimeout(() => {
        const scrolledUp =
          this.getBottomScroll(this.$refs.scrollContainer) > autoScrollOffset;

        if (message.from_user_id === this.currentUserId) {
          if (scrolledUp) {
            if (this.autoScroll.send.newAfterScrollUp) {
              this.scrollToBottom();
            }
          } else {
            if (this.autoScroll.send.new) {
              this.scrollToBottom();
            }
          }
        } else {
          if (scrolledUp) {
            if (this.autoScroll.receive.newAfterScrollUp) {
              this.scrollToBottom();
            } else {
              this.scrollIcon = true;
              this.scrollMessagesCount++;
            }
          } else {
            if (this.autoScroll.receive.new) {
              this.scrollToBottom();
            } else {
              this.scrollIcon = true;
              this.scrollMessagesCount++;
            }
          }
        }
      });
    },
    onContainerScroll(e) {
      if (!e.target) return;

      const bottomScroll = this.getBottomScroll(e.target);
      if (bottomScroll < 60) this.scrollMessagesCount = 0;
      this.scrollIcon = bottomScroll > 500 || this.scrollMessagesCount;
    },
    loadRoomId(id) {
      this.$emit("fetch-room-id", id);
    },
    loadMoreMessages() {
      if (this.loadingMessages || !this.room.prev) return;

      setTimeout(
        () => {
          if (this.loadingMoreMessages) return;

          if (this.messagesLoaded || !this.roomId) {
            this.loadingMoreMessages = false;
            this.showLoader = false;
            return;
          }

          this.preventTopScroll();
          this.loadRoomId();
          // this.$emit("fetch-messages");
          // this.loadingMoreMessages = true;
        },
        // prevent scroll bouncing speed
        500
      );
    },
    messageActionHandler({ action, message }) {
      switch (action.name) {
        case "replyMessage":
          this.initReplyMessage = message;
          setTimeout(() => {
            this.initReplyMessage = null;
          });
          return;
        case "editMessage":
          this.initEditMessage = message;
          setTimeout(() => {
            this.initEditMessage = null;
          });
          return;
        case "deleteMessage":
          return this.$emit("delete-message", message);
        case "selectMessages":
          this.selectedMessages = [message];
          this.messageSelectionEnabled = true;
          return;
        default:
          return this.$emit("message-action-handler", { action, message });
      }
    },
    messageSelectionActionHandler(action) {
      this.$emit("message-selection-action-handler", {
        action,
        messages: this.selectedMessages
      });
      this.resetMessageSelection();
    },
    sendMessageReaction(messageReaction) {
      this.$emit("send-message-reaction", messageReaction);
    },
    getBottomScroll(element) {
      const { scrollHeight, clientHeight, scrollTop } = element;
      return scrollHeight - clientHeight - scrollTop;
    },
    scrollToBottom() {
      setTimeout(() => {
        const element = this.$refs.scrollContainer;
        element.classList.add("vac-scroll-smooth");
        element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
        setTimeout(() => element.classList.remove("vac-scroll-smooth"));
      }, 50);
    },
    openFile({ message, file }) {
      this.$emit("open-file", { message, file });
    },
    openUserTag(user) {
      this.$emit("open-user-tag", user);
    },
    onDropFiles(event) {
      if (this.showFiles) {
        this.droppedFiles = event.dataTransfer.files;
      }
    },
    formatterDate(value) {
      return moment.unix(value).format("DD MMMM YYYY");
    }
  }
};
</script>
<style lang="scss" scoped>
.messages-list {
  min-height: 65vh;
}

.more-message-button {
  position: sticky;
  left: calc(50% - 150px);
  z-index: 11;
  width: 300px;

  &.next-messages {
    top: 10px;
  }

  &.prev-messages {
    bottom: 10px;
  }

  .button-text {
    padding-left: 10px;
  }
}
</style>
