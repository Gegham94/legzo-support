<template>
  <div class="vac-room-header vac-app-border-b">
    <slot name="room-header">
      <div class="vac-room-wrapper">
        <transition name="vac-slide-up">
          <div v-if="messageSelectionEnabled" class="vac-room-selection">
            <div
              v-for="action in messageSelectionActions"
              :id="action.name"
              :key="action.name"
            >
              <div
                class="vac-selection-button"
                @click="messageSelectionActionHandler(action)"
              >
                {{ action.title }}
                <span class="vac-selection-button-count">
                  {{ selectedMessagesTotal }}
                </span>
              </div>
            </div>
            <div
              class="vac-selection-cancel vac-item-clickable"
              @click="$emit('cancel-message-selection')"
            >
              {{ textMessages.CANCEL_SELECT_MESSAGE }}
            </div>
          </div>
        </transition>
        <template
          v-if="!messageSelectionEnabled && messageSelectionAnimationEnded"
        >
          <div
            class="vac-info-wrapper"
            :class="{ 'vac-item-clickable': roomInfoEnabled }"
          >
            <slot name="room-header-avatar">
              <div
                v-if="room.avatar"
                class="vac-avatar"
                :style="{ 'background-image': `url('${room.avatar}')` }"
              />
            </slot>
            <slot name="room-header-info">
              <div class="vac-text-ellipsis">
                <div class="vac-room-name vac-text-ellipsis">
                  <span>{{ room.roomName }}</span>
                </div>
                <div v-if="typingUsers" class="vac-room-info vac-text-ellipsis">
                  {{ typingUsers }}
                </div>
                <div v-else class="vac-room-info vac-text-ellipsis">
                  {{ userStatus }}
                </div>
              </div>
            </slot>
          </div>
          <div
            v-if="room.tags?.length"
            class="vac-info-wrapper tags-container"
            :class="{ 'vac-item-clickable': roomInfoEnabled }"
          >
            <div v-for="(tag, key) in room.tags" :key="key">
              <el-tag
                v-if="key <= 5"
                :key="tag.id"
                class="mx-1"
                :closable="closableTag"
                :disable-transitions="false"
                :type="closableTag ? 'warning' : ''"
                @click="setClosableTag(true)"
                effect="light"
                @close="$emit('remove-room-tag', tag.id)"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <div class="vac-icon-textarea-left">
              <div
                v-if="closableTag"
                class="vac-svg-button vac-icon-audio-confirm"
                @click="setClosableTag(false)"
              >
                <slot name="audio-check-icon">
                  <svg-icon name="checkmark" />
                </slot>
              </div>
            </div>
          </div>
          <slot v-if="room.id" name="room-options">
            <div
              v-if="menuActions.length"
              class="vac-svg-button vac-room-options"
              @click="menuOpened = !menuOpened"
            >
              <slot name="menu-icon">
                <svg-icon name="menu" />
              </slot>
            </div>
            <div
              class="vac-svg-button vac-icon-info"
              @click="$emit('toggle-room-info')"
            >
              <slot name="menu-icon">
                <svg-icon name="info" />
              </slot>
            </div>
            <transition v-if="menuActions.length" name="vac-slide-left">
              <div
                v-if="menuOpened"
                v-click-outside="closeMenu"
                class="vac-menu-options"
              >
                <div class="vac-menu-list">
                  <div v-for="action in menuActions" :key="action.name">
                    <div
                      class="vac-menu-item"
                      @click="menuActionHandler(action)"
                    >
                      {{ action.title }}
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </slot>
        </template>
      </div>
    </slot>
  </div>
</template>

<script>
import SvgIcon from "../../components/SvgIcon/SvgIcon.vue";

import vClickOutside from "../../utils/on-click-outside";
import typingText from "../../utils/typing-text";

export default {
  name: "RoomHeader",
  components: {
    SvgIcon
  },

  directives: {
    clickOutside: vClickOutside
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    singleRoom: { type: Boolean, required: true },
    showRoomsList: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    roomInfoEnabled: { type: Boolean, required: true },
    menuActions: { type: Array, required: true },
    room: { type: Object, required: true },
    messageSelectionEnabled: { type: Boolean, required: true },
    messageSelectionActions: { type: Array, required: true },
    selectedMessagesTotal: { type: Number, required: true }
  },

  emits: [
    "toggle-rooms-list",
    "room-info",
    "remove-room-tag",
    "menu-action-handler",
    "cancel-message-selection",
    "message-selection-action-handler"
  ],

  data() {
    return {
      menuOpened: false,
      closableTag: false,
      messageSelectionAnimationEnded: true
    };
  },

  computed: {
    typingUsers() {
      return typingText(this.room, this.currentUserId, this.textMessages);
    },
    userStatus() {
      if (!this.room.users || this.room.users.length !== 2) return;

      const user = this.room.users?.find(u => u?._id !== this.currentUserId);

      if (!user?.status) return;

      let text = "";

      if (user.status.state === "online") {
        text = this.textMessages.IS_ONLINE;
      } else if (user.status.lastChanged) {
        text = this.textMessages.LAST_SEEN + user.status.lastChanged;
      }

      return text;
    }
  },

  watch: {
    messageSelectionEnabled(val) {
      if (val) {
        this.messageSelectionAnimationEnded = false;
      } else {
        setTimeout(() => {
          this.messageSelectionAnimationEnded = true;
        }, 300);
      }
    }
  },

  methods: {
    menuActionHandler(action) {
      this.closeMenu();
      this.$emit("menu-action-handler", action);
    },
    closeMenu() {
      this.menuOpened = false;
    },
    messageSelectionActionHandler(action) {
      this.$emit("message-selection-action-handler", action);
    },
    setClosableTag(status) {
      this.closableTag = status;
    }
  }
};
</script>
