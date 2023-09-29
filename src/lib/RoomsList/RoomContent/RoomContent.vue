<template>
  <div class="vac-room-container">
    <slot :name="'room-list-item_' + room.id">
      <slot :name="'room-list-avatar_' + room.id">
        <div
          v-if="room.avatar"
          class="vac-avatar"
          :style="{ 'background-image': `url('${room.avatar}')` }"
        />
        <div v-else class="vac-avatar empty-avatar">
          <span v-if="room.roomName">{{ room.roomName[0] }}</span>
        </div>
      </slot>
      <div class="vac-name-container vac-text-ellipsis">
        <div class="vac-title-container">
          <div
            v-if="userStatus"
            class="vac-state-circle"
            :class="{ 'vac-state-online': userStatus === 'online' }"
          />
          <div class="vac-room-name vac-text-ellipsis">
            <div class="emoji-room-name">
              <span v-if="getEmoji" class="emoji-char" v-html="getEmoji" />
              <span>{{ room.roomName }}</span>
            </div>

            <span v-if="getAgent" class="agent-name"
              >Agent: {{ getAgent }}</span
            >
          </div>
          <div v-if="room.lastMessage" class="vac-text-date">
            <span>{{ formatterDate(room.lastMessage.updated_at) }}</span>
          </div>
          <div v-else class="vac-text-date">
            {{ formatterDate(room.updated_at) }}
          </div>
        </div>
        <div
          class="vac-text-last"
          :class="{
            'vac-message-new':
              room.lastMessage && room.lastMessage.new && !typingUsers
          }"
        >
          <span v-if="isMessageCheckmarkVisible">
            <slot :name="'checkmark-icon_' + room.id">
              <svg-icon
                :name="
                  room.lastMessage.distributed
                    ? 'double-checkmark'
                    : 'checkmark'
                "
                :param="room.lastMessage.seen ? 'seen' : ''"
                class="vac-icon-check"
              />
            </slot>
          </span>
          <span v-if="getMessageAuthor" class="get-message-author">{{
            getMessageAuthor
          }}</span>
          <div
            v-if="room.lastMessage && !room.lastMessage.deleted && isAudio"
            class="vac-text-ellipsis flex"
          >
            <slot :name="'microphone-icon_' + room.id">
              <svg-icon name="microphone" class="vac-icon-microphone" />
            </slot>
            {{ formattedDuration }}
          </div>
          <format-message
            v-else-if="room.lastMessage"
            :message-id="room.lastMessage.id"
            :room-id="room.id"
            :room-list="true"
            :content="getLastMessage"
            :deleted="!!room.lastMessage.deleted && !typingUsers"
            :users="room.users"
            :text-messages="textMessages"
            :linkify="false"
            :text-formatting="textFormatting"
            :link-options="linkOptions"
            :single-line="true"
          >
            <template v-for="(idx, name) in $slots" #[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </format-message>
          <div
            v-if="!room.lastMessage && typingUsers"
            class="vac-text-ellipsis"
          >
            {{ typingUsers }}
          </div>
          <div v-if="!room.lastMessage" class="vac-text-ellipsis">
            Room create
          </div>
          <div class="vac-room-options-container">
            <div
              v-if="room.unreadCount"
              class="vac-badge-counter vac-room-badge"
            >
              {{ room.unreadCount }}
            </div>
            <slot :name="'room-list-options_' + room.id">
              <div
                v-if="roomActions.length"
                class="vac-svg-button vac-list-room-options"
                @click="roomMenuOpened = room.id"
              >
                <slot :name="'room-list-options-icon_' + room.id">
                  <svg-icon name="dropdown" param="room" />
                </slot>
              </div>
              <transition v-if="roomActions.length" name="vac-slide-left">
                <div
                  v-if="roomMenuOpened === room.id"
                  v-click-outside="closeRoomMenu"
                  class="vac-menu-options"
                >
                  <div class="vac-menu-list">
                    <div v-for="action in roomActions" :key="action.name">
                      <div
                        class="vac-menu-item"
                        @click.stop="roomActionHandler(action)"
                      >
                        {{ action.title }}
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import SvgIcon from "../../components/SvgIcon/SvgIcon.vue";
import FormatMessage from "../../components/FormatMessage/FormatMessage.vue";

import vClickOutside from "../../utils/on-click-outside";
import typingText from "../../utils/typing-text";
import { isAudioFile } from "../../utils/media-file";
import { formatTimestamp } from "@/utils/room";

export default {
  name: "RoomsContent",
  components: {
    SvgIcon,
    FormatMessage
  },

  directives: {
    clickOutside: vClickOutside
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    room: { type: Object, required: true },
    isArchived: { type: Boolean },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    textMessages: { type: Object, required: true },
    roomActions: { type: Array, required: true }
  },

  emits: ["room-action-handler"],

  data() {
    return {
      roomMenuOpened: null
    };
  },

  computed: {
    getLastMessage() {
      const isTyping = this.typingUsers;
      if (isTyping) return isTyping;

      const content = "";

      if (this.room?.lastMessage?.msg) {
        return this.room?.lastMessage?.msg;
      } else if (this.room?.lastMessage?.files.length) {
        return this.room?.lastMessage?.files[0]?.name;
      }

      if (this.room.users.length <= 2) {
        return content;
      }

      const user = this.room?.users?.find(
        user => user.id === this.room.lastMessage?.from_user_id
      );

      if (this.room.lastMessage.username) {
        return `${this.room.lastMessage.username} - ${content}`;
      } else if (!user || user.id === this.currentUserId) {
        return content;
      }

      return `${user.username} - ${content}`;
    },
    getAgent() {
      const agent = this.room.users.find(
        user => user.id === this.room.primary_user_id
      );
      return agent ? agent.name : null;
    },
    getMessageAuthor() {
      const msgAuthor = this.room.users.find(
        user => user.id === this.room.lastMessage.from_user_id
      );
      return msgAuthor ? `${msgAuthor.name.slice(0, 2)}:` : null;
    },
    getEmoji() {
      const emojiCodes = ["&#128078", "&#128077"];
      for (const emoji of emojiCodes) {
        if (this.room.lastMessage.msg.includes(emoji)) {
          return emoji;
        }
      }
      return null;
    },
    userStatus() {
      if (!this.room.users || this.room.users.length !== 2) return;
      const user = this.room.users?.find(u => u?.id !== this.currentUserId);
      if (user && user.status) return user.status.state;
      return null;
    },
    typingUsers() {
      return typingText(this.room, this.currentUserId, this.textMessages);
    },
    isMessageCheckmarkVisible() {
      return (
        !this.typingUsers &&
        this.room.lastMessage &&
        !this.room.lastMessage.deleted &&
        this.room.lastMessage.from_user_id === this.currentUserId &&
        (this.room.lastMessage.saved ||
          this.room.lastMessage.distributed ||
          this.room.lastMessage.seen)
      );
    },
    formattedDuration() {
      const file = this.room.lastMessage?.files?.[0];
      if (file) {
        if (!file.duration) {
          return `${file.name}.${file.extension}`;
        }
        let s = Math.floor(file.duration);
        return (s - (s %= 60)) / 60 + (s > 9 ? ":" : ":0") + s;
      }
      return "";
    },
    isAudio() {
      return this.room.lastMessage.files
        ? isAudioFile(this.room.lastMessage.files[0])
        : false;
    }
  },

  methods: {
    roomActionHandler(action) {
      this.closeRoomMenu();
      this.$emit("room-action-handler", { action, roomId: this.room.id });
    },
    closeRoomMenu() {
      this.roomMenuOpened = null;
    },
    formatterDate(value) {
      return formatTimestamp(value);
    }
  }
};
</script>
