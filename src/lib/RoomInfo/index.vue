<template>
  <div
    v-if="showRoomInfo"
    class="vac-rooms-container"
    :class="{
      'vac-rooms-container-full': isMobile,
      'vac-app-border-l': !isMobile
    }"
  >
    <slot name="rooms-header">
      <div class="flex sidebar-panel">
        <div class="flex panel-elements">
          <div
            class="vac-svg-button vac-info-icon"
            :class="{
              'active-tab': activeTab === 0
            }"
            @click="setActiveTab(0)"
          >
            <slot name="user">
              <svg-icon name="user" class="panel-icon" />
            </slot>
          </div>
          <div
            v-if="!isArchive"
            class="vac-svg-button vac-info-icon"
            :class="{
              'active-tab': activeTab === 1
            }"
            @click="setActiveTab(1)"
          >
            <slot name="phone">
              <svg-icon name="phone" class="panel-icon" />
            </slot>
          </div>
        </div>
        <div class="flex">
          <div
            class="vac-svg-button vac-info-icon"
            @click="$emit('toggle-room-info')"
          >
            <slot name="exit">
              <svg-icon name="exit" class="panel-icon" />
            </slot>
          </div>
        </div>
      </div>
    </slot>
    <div
      v-if="!loadingRooms"
      id="info-list"
      class="vac-room-list vac-info-list"
    >
      <room-info-content
        v-if="activeTab === 0"
        :current-user="currentUser"
        :room="room"
        :textMessages="textMessages"
      >
        <template v-for="(idx, name) in $slots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </room-info-content>
      <room-call
        v-if="activeTab === 1 && !isArchive"
        :current-user="currentUser"
        :room="room"
      >
        <template v-for="(idx, name) in $slots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </room-call>
    </div>
  </div>
</template>

<script>
import RoomInfoContent from "./RoomInfoContent/index.vue";
import RoomCall from "./RoomCall/index.vue";
import SvgIcon from "../components/SvgIcon/SvgIcon.vue";

export default {
  name: "RoomInfo",
  components: {
    RoomInfoContent,
    RoomCall,
    SvgIcon
  },

  props: {
    showRoomInfo: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true },
    room: { type: Object, required: true },
    loadingRooms: { type: Boolean, required: true },
    currentUser: { type: Object, required: true },
    textMessages: { type: Object, required: true },
    isArchive: { type: Boolean, default: false }
  },

  emits: ["toggle-room-info"],
  data() {
    return {
      activeTab: 0
    };
  },
  methods: {
    setActiveTab(val) {
      this.activeTab = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar-panel {
  justify-content: space-between;
  padding: 19px 15px 20px 5px;
  border-bottom: var(--chat-border-style);
}

.panel-elements {
  .vac-info-icon {
    padding: 0 8px;
  }

  .active-tab {
    cursor: default;
  }

  .active-tab::before {
    content: "";
    position: absolute;
    height: 5px;
    background: #4284f5;
    width: 24px;
    margin-top: 26px;
  }
}

.panel-icon {
  fill: #3b4a54;
}

.vac-rooms-container {
  .vac-info-list {
    padding: 10px 15px;
  }
}
</style>
