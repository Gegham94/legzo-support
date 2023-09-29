<script setup lang="ts">
import { useUserStoreHook } from "@/store/modules/user";
import { setManagerStatus } from "@/api/agents";

defineOptions({
  name: "Accept"
});

const setUserStatus = status => {
  setManagerStatus(status);
};

const usersStore = useUserStoreHook();
</script>

<template>
  <div>
    <div
      v-if="usersStore.getOnlineStatus === 1"
      class="flex gap-4 items-center no-accept-chat-content"
    >
      <span class="font-medium">You are currently not accepting chats</span>
      <el-button plain @click="setUserStatus(2)">
        Start accepting chats
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.no-accept-chat-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--chat-no-accept-bg-color);
  padding: 0 15px;
  height: 100%;
  width: 100%;

  @media screen and (max-width: 1200px) {
    .font-medium {
      font-size: 13px !important;
      line-height: 1rem;
    }

    .el-button {
      font-size: 12px;
    }
  }
  @media screen and (max-width: 990px) {
    .font-medium {
      font-size: 11px !important;
    }
  }

  .font-medium {
    color: var(--chat-no-accept-message-color);
    font-size: 15px;
    font-weight: 600;
    text-align: center;
  }

  .el-button {
    padding: 0 5px;
    font-weight: 600;
  }
}
</style>
