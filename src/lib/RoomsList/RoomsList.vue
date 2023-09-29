<template>
  <div
    v-show="showRoomsList"
    class="vac-rooms-container"
    :class="{
      'vac-rooms-container-full': isMobile,
      'vac-app-border-r': !isMobile
    }"
  >
    <slot name="rooms-header" />

    <slot name="rooms-list-search">
      <rooms-search
        :rooms="rooms"
        :loading-rooms="loadingRooms"
        :text-messages="textMessages"
        :show-search="showSearch"
        :show-add-room="showAddRoom"
        @search-room="searchRoom"
        @add-room="$emit('add-room')"
      >
        <template v-for="(idx, name) in $slots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </rooms-search>
    </slot>

    <loader :show="loadingRooms" type="rooms">
      <template v-for="(idx, name) in $slots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </loader>

    <div v-if="!loadingRooms && !rooms.length" class="vac-rooms-empty">
      <slot name="rooms-empty">
        {{ textMessages.ROOMS_EMPTY }}
      </slot>
    </div>

    <div v-if="!loadingRooms" id="rooms-list" class="vac-room-list">
      <div v-if="!isArchive">
        <div v-if="roomsPrimary?.length > 0">
          <h4>My chats ({{ roomsPrimary.length }})</h4>
          <div
            v-for="fRoom in roomsPrimary"
            :id="fRoom.id"
            :key="fRoom.id"
            class="vac-room-item"
            :class="{ 'vac-room-selected': selectedRoomId === fRoom.id }"
            @click="openRoom(fRoom)"
          >
            <room-content
              :current-user-id="currentUserId"
              :room="fRoom"
              :text-formatting="textFormatting"
              :link-options="linkOptions"
              :text-messages="textMessages"
              :room-actions="roomActions"
              @room-action-handler="$emit('room-action-handler', $event)"
            >
              <template v-for="(idx, name) in $slots" #[name]="data">
                <slot :name="name" v-bind="data" />
              </template>
            </room-content>
          </div>
        </div>
        <div v-if="roomsNotPrimary?.length > 0">
          <h4>Supervised ({{ roomsNotPrimary.length }})</h4>
          <div
            v-for="fRoom in roomsNotPrimary"
            :id="fRoom.id"
            :key="fRoom.id"
            class="vac-room-item"
            :class="{ 'vac-room-selected': selectedRoomId === fRoom.id }"
            @click="openRoom(fRoom)"
          >
            <room-content
              :current-user-id="currentUserId"
              :room="fRoom"
              :text-formatting="textFormatting"
              :link-options="linkOptions"
              :text-messages="textMessages"
              :room-actions="roomSupervisedActions"
              @room-action-handler="$emit('room-action-handler', $event)"
            >
              <template v-for="(idx, name) in $slots" #[name]="data">
                <slot :name="name" v-bind="data" />
              </template>
            </room-content>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          v-for="fRoom in rooms"
          :id="fRoom.id"
          :key="fRoom.id"
          class="vac-room-item"
          :class="{ 'vac-room-selected': selectedRoomId === fRoom.id }"
          @click="openRoom(fRoom)"
        >
          <room-content
            :current-user-id="currentUserId"
            :room="fRoom"
            :text-formatting="textFormatting"
            :link-options="linkOptions"
            :text-messages="textMessages"
            :room-actions="roomActions"
            @room-action-handler="$emit('room-action-handler', $event)"
          >
            <template v-for="(idx, name) in $slots" #[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </room-content>
        </div>
      </div>
      <transition name="vac-fade-message">
        <div v-if="rooms.length && !loadingRooms" id="infinite-loader-rooms">
          <loader :show="showLoader" :infinite="true" type="infinite-rooms">
            <template v-for="(idx, name) in $slots" #[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </loader>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Loader from "../components/Loader/Loader.vue";
import RoomsSearch from "./RoomsSearch/RoomsSearch.vue";
import RoomContent from "./RoomContent/RoomContent.vue";

export default {
  name: "RoomsList",
  components: {
    Loader,
    RoomsSearch,
    RoomContent
  },

  props: {
    currentUserId: { type: [String, Number], required: true },
    textMessages: { type: Object, required: true },
    showRoomsList: { type: Boolean, required: true },
    showSearch: { type: Boolean, required: true },
    showAddRoom: { type: Boolean, required: true },
    textFormatting: { type: Object, required: true },
    linkOptions: { type: Object, required: true },
    isMobile: { type: Boolean, required: true },
    rooms: { type: Array, required: true },
    roomsPrimary: { type: Array, required: true },
    roomsNotPrimary: { type: Array, required: true },
    loadingRooms: { type: Boolean, required: true },
    roomsLoaded: { type: Boolean, required: true },
    isArchive: { type: Boolean, required: false },
    room: { type: Object, required: true },
    customSearchRoomEnabled: { type: [Boolean, String], default: false },
    roomActions: { type: Array, required: true },
    roomSupervisedActions: { type: Array, required: true },
    scrollDistance: { type: Number, required: true }
  },

  emits: [
    "add-room",
    "search-room",
    "room-action-handler",
    "loading-more-rooms",
    "fetch-room",
    "fetch-more-rooms"
  ],

  data() {
    return {
      observer: null,
      showLoader: true,
      selectedRoomId: ""
    };
  },

  watch: {
    loadingRooms(val) {
      if (!val) {
        setTimeout(() => this.initIntersectionObserver());
      }
    },
    loadingMoreRooms(val) {
      this.$emit("loading-more-rooms", val);
    },
    roomsLoaded: {
      immediate: true,
      handler(val) {
        if (val) {
          if (!this.loadingRooms) {
            this.showLoader = false;
          }
        }
      }
    },
    room: {
      immediate: true,
      handler(val) {
        if (val && !this.isMobile) this.selectedRoomId = val.id;
      }
    }
  },

  methods: {
    initIntersectionObserver() {
      if (this.observer) {
        this.showLoader = true;
        this.observer.disconnect();
      }

      const loader = this.$el.querySelector("#infinite-loader-rooms");

      if (loader) {
        const options = {
          root: this.$el.querySelector("#rooms-list"),
          rootMargin: `${this.scrollDistance}px`,
          threshold: 0
        };

        this.observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            this.loadMoreRooms();
          }
        }, options);

        this.observer.observe(loader);
      }
    },
    searchRoom(ev) {
      this.$emit("search-room", ev.target.value);
    },
    openRoom(room) {
      if (room.id === this.room.id && !this.isMobile) return;
      if (!this.isMobile) this.selectedRoomId = room.id;
      this.$emit("fetch-room", { room });
    },
    loadMoreRooms() {
      if (this.roomsLoaded) {
        this.showLoader = false;
        return;
      }

      this.$emit("fetch-more-rooms");
    }
  }
};
</script>
