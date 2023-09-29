<template>
  <el-dropdown
    v-if="!childListOpen"
    popper-class="dropdown-content-wrapper"
    trigger="click"
    placement="top"
    ref="hashtagDropdown"
    max-height="300"
    v-click-outside="clickOutsideHandler"
  >
    <div class="vac-icon-hashtag">
      <svg-icon name="hashtag" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in hashtagList"
          :key="item.id"
          @click="insertHashtagText(item)"
        >
          <div class="list-label">
            <span> {{ item.text }} </span>
            <span class="list-arrow" v-if="item.shortcuts.length">
              <svg-icon name="arrowRight" />
            </span>
          </div>
        </el-dropdown-item>
        <div class="vac-dropdown-actions" ref="dropdownActions">
          <div class="vac-icon-plus"><svg-icon name="plus" /> New</div>
          <div class="vac-icon-settings">
            <svg-icon name="settings" />
          </div>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <el-dropdown
    v-if="childListOpen"
    popper-class="dropdown-content-wrapper"
    trigger="click"
    placement="top"
    ref="hashtagChildDropdown"
    max-height="300"
    v-click-outside="clickOutsideHandler"
  >
    <div class="vac-icon-hashtag">
      <svg-icon name="hashtag" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="chiltdShortcut in childList"
          :key="chiltdShortcut"
          @click="insertHashtagChildText(chiltdShortcut)"
        >
          <div class="list-label">
            <span> {{ chiltdShortcut }} </span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import SvgIcon from "../SvgIcon/SvgIcon.vue";
import { http } from "@/utils/http";
import vClickOutside from "../../utils/on-click-outside";

export default {
  name: "HashtagPickerContainer",
  components: {
    SvgIcon
  },

  directives: {
    clickOutside: vClickOutside
  },

  props: {
    hashtagKeyPressed: { type: Boolean, default: false }
  },

  emits: ["insert-text"],

  watch: {
    hashtagKeyPressed(val) {
      if (val) {
        setTimeout(() => {
          this.$refs.hashtagDropdown.handleOpen();
        }, 200);
      }
    }
  },

  data() {
    return {
      hashtagList: [],
      childList: [],
      childListOpen: false
    };
  },

  mounted() {
    this.fetchHashtagData();
  },

  methods: {
    async fetchHashtagData() {
      const data = await this.getTemplates();
      data.sort((a, b) => {
        const aHasShortcuts = a.shortcuts && a.shortcuts.length > 0;
        const bHasShortcuts = b.shortcuts && b.shortcuts.length > 0;
        if (aHasShortcuts && !bHasShortcuts) {
          return -1;
        } else if (!aHasShortcuts && bHasShortcuts) {
          return 1;
        }
        return 0;
      });
      this.hashtagList = [...data];
    },

    clickOutsideHandler() {
      this.childListOpen = false;
      this.childList = [];
    },

    insertHashtagText(item) {
      if (item.shortcuts.length) {
        this.childList = item.shortcuts;
        this.childListOpen = true;
        this.$refs.hashtagDropdown.handleClose();
        setTimeout(() => {
          this.$refs.hashtagChildDropdown.handleOpen();
        }, 200);
      } else {
        this.$emit("insert-text", item.text);
      }
    },

    insertHashtagChildText(item) {
      this.$refs.hashtagChildDropdown.handleClose();
      this.$emit("insert-text", item);
      this.childListOpen = false;
    },

    async getTemplates() {
      const { data } = await http.get(`/admin/templates`);
      return data;
    }
  }
};
</script>
