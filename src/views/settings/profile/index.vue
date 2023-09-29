<script setup lang="ts">
import { svg } from "@/constants/common";
import { usePresenter } from "./hooks";

const { form, onSubmit } = usePresenter();
defineOptions({
  name: "Profile"
});
</script>

<template>
  <div class="inactivity" :element-loading-svg="svg">
    <div class="inactivity_title">
      <h2>Profile</h2>
    </div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h4>Agent status after logging in</h4>
        </div>
      </template>
      <div class="text item">
        <el-form :model="form">
          <el-form-item>
            <el-radio-group
              v-model="form.readyAfterLogin"
              class="flex flex-col items-start"
              style="align-items: flex-start"
            >
              <el-radio size="large" :label="true">
                <span>Accept chats</span>
              </el-radio>
              <el-radio size="large" :label="false">
                <span>Don't accept chats</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Save</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: calc(100% - 60px);
  margin: 30px;
}

.inactivity.main-content {
  margin: 0;
}

.inactivity {
  &_title {
    width: 100%;
    height: 52px;
    position: relative;
    text-align: center;
    box-sizing: border-box;
    background-color: var(--surface-primary-default);
    border-bottom: 1px solid var(--border-subtle);
    display: flex;

    h2 {
      width: auto;
      color: var(--content-default);
      font-weight: 600;
      font-size: 20px;
      border-bottom: none;
      margin: 0 20px;
      display: flex;
      align-items: center;
    }
  }

  &_form {
    padding: 32px 20px 120px;
    box-sizing: border-box;
    max-width: 960px;
  }
}
</style>
