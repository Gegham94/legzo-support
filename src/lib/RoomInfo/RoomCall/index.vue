<script setup lang="ts">
import { useLive } from "./hooks/";
import ExitFullscreen from "@iconify-icons/ri/fullscreen-exit-fill";
import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import VideoPlay from "@iconify-icons/ri/play-mini-line";
import VideoPause from "@iconify-icons/ri/pause-mini-fill";
import Microphone from "@iconify-icons/ri/mic-line";
import Mute from "@iconify-icons/ri/mic-off-line";
import Setting from "@iconify-icons/ri/settings-3-line";

defineOptions({
  name: "LiveSwitchClient"
});

const {
  runLocalMedia,
  leaveLocalMedia,
  toggleMuteLocalAudio,
  toggleMuteLocalVideo,
  isMuteLocalAudio,
  isMuteLocalVideo,
  audioInputSelectList,
  audioOutputSelectList,
  videoInputSelectList,
  selectedAudioInput,
  selectedAudioOutput,
  selectedVideoInput,
  toggleFullScreen,
  isFullScreen,
  isStartStreaming,
  toggleSettingShow,
  isSettingShow
} = useLive();
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-row v-show="isStartStreaming">
        <div id="video" class="container-video flex justify-center">
          <el-button
            v-if="isFullScreen"
            class="fullscreen"
            @click="toggleFullScreen"
            type="primary"
            circle
          >
            <IconifyIconOffline :icon="ExitFullscreen" />
          </el-button>
        </div>
        <el-row v-if="isSettingShow" class="flex justify-center w-full">
          <div class="w-full p-4">
            <div class="mb-4 w-full">
              <p>Audio Device:</p>
              <el-select
                v-model="selectedAudioInput"
                default-first-option
                filterable
                class="mr-2 mt-2"
                placeholder="Audio Inputs"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, key) in audioInputSelectList"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="mb-4 w-full">
              <p>Audio Output Device:</p>
              <el-select
                v-model="selectedAudioOutput"
                default-first-option
                filterable
                class="mr-2 mt-2"
                placeholder="Audio Outputs"
                style="width: 100%"
              >
                <el-option
                  v-for="item in audioOutputSelectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="mb-4 w-full">
              <p>Video Device:</p>
              <el-select
                v-model="selectedVideoInput"
                default-first-option
                filterable
                class="mr-2 mt-2"
                placeholder="Video Inputs"
                style="width: 100%"
              >
                <el-option
                  v-for="item in videoInputSelectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </el-row>
      </el-row>
      <el-footer>
        <el-row v-if="isStartStreaming" class="flex justify-center mb-4">
          <el-button
            @click="toggleMuteLocalVideo"
            :type="!isMuteLocalVideo ? 'danger' : 'primary'"
            circle
          >
            <IconifyIconOffline
              :icon="!isMuteLocalVideo ? VideoPause : VideoPlay"
            />
          </el-button>
          <el-button
            @click="toggleMuteLocalAudio"
            :type="!isMuteLocalAudio ? 'danger' : 'primary'"
            circle
          >
            <IconifyIconOffline :icon="!isMuteLocalAudio ? Mute : Microphone" />
          </el-button>
          <el-button
            @click="toggleSettingShow"
            :type="!isSettingShow ? 'primary' : 'danger'"
            circle
          >
            <IconifyIconOffline :icon="Setting" />
          </el-button>
          <el-button @click="toggleFullScreen" type="primary" circle>
            <IconifyIconOffline :icon="Fullscreen" />
          </el-button>
        </el-row>
        <el-row class="flex justify-center mb-4 mt-4">
          <el-button
            v-if="!isStartStreaming"
            @click="runLocalMedia"
            type="success"
            plain
            >Start Streaming</el-button
          >
          <el-button v-else @click="leaveLocalMedia" type="danger" plain
            >Stop Streaming</el-button
          >
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.container-video {
  height: 300px;
  width: 100%;
  margin-bottom: 20px;

  .fullscreen {
    position: absolute;
    right: 30px;
    top: 15px;
    z-index: 1000;
  }
}
</style>
