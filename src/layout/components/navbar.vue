<script setup lang="ts">
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import { useNav } from "@/layout/hooks/useNav";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import Accept from "./accept/index.vue";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import ToggleLine from "@iconify-icons/ri/toggle-line";
import ToggleFill from "@iconify-icons/ri/toggle-fill";
import Setting from "@iconify-icons/ri/settings-3-line";

const {
  layout,
  device,
  logout,
  onPanel,
  user,
  userOnlineStatus,
  setUserStatus,
  goToProfileSetting
} = useNav();
</script>

<template>
  <div
    class="navbar bg-[#fff] shadow-sm shadow-[rgba(0, 21, 41, 0.08)] dark:shadow-[#0d0d0d]"
  >
    <Breadcrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />
    <Accept class="no-accept-chat" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <Search />
      <Notice id="header-notice" />
      <el-dropdown trigger="click" class="profile-data">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="user.avatar_link" style="margin-right: 10px" />
          <div class="user-name">
            <p v-if="user.name" class="dark:text-white">{{ user.name }}</p>
            <span v-if="user.email" class="dark:text-white email">{{
              user.email
            }}</span>
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item
              v-if="userOnlineStatus === 2"
              @click="setUserStatus(1)"
            >
              <span>Don't accept chats</span>
              <div>
                <IconifyIconOffline
                  :icon="ToggleFill"
                  class="profile-icon green"
                />
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-else @click="setUserStatus(2)">
              <span>Accept chats</span>
              <div>
                <IconifyIconOffline :icon="ToggleLine" class="profile-icon" />
              </div>
            </el-dropdown-item>

            <el-dropdown-item>
              <span
                >Chat limit:
                <strong>{{ user.params.maxActiveTickets }}</strong></span
              >
            </el-dropdown-item>
            <el-dropdown-item @click="goToProfileSetting">
              <span>Profile settings</span>
              <div>
                <IconifyIconOffline :icon="Setting" style="margin: 5px 0" />
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              Log out
              <div>
                <IconifyIconOffline
                  :icon="LogoutCircleRLine"
                  style="margin: 5px 0"
                />
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span
        class="set-icon navbar-bg-hover"
        title="Open project configuration"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 50px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .no-accept-chat {
    padding-left: 10px;
    flex: 1;
    height: 100%;
  }

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    min-width: 280px;
    height: 48px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;

    .el-dropdown-link {
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;
      color: #000000d9;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .user-name {
        display: flex;
        flex-direction: column;

        p {
          font-size: 14px;
          line-height: 1.2;
          font-weight: 500;
        }

        span {
          font-size: 11px;
        }
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
}

.profile-data {
  padding: 0 20px;
}

.profile-icon {
  font-size: 24px;

  &.green {
    color: green;
  }
}

.logout {
  width: 220px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
