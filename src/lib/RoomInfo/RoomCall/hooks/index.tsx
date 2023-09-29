import ls from "fm.liveswitch";
import { onMounted, onUnmounted, ref, watch } from "vue";
import {
  applicationId,
  sharedSecret,
  gatewayUrl
} from "../../../../../liveswitch_config.json";
import { message } from "@/utils/message";
import { useUserStore } from "@/store/modules/user";
import { storeToRefs } from "pinia";
import { useRoomsStore } from "@/store/modules/rooms";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { VideoCall } from "@/api/chats/interfaces";

export function useLive() {
  const client = ref(null);
  const channel = ref(null);
  const unregistering = ref(false);
  const reRegisterBackoff = ref(1000);
  const maxRegisterBackoff = ref(60000);
  const localMedia = ref(null);
  const upstreamConnection = ref(null);
  const downstreamConnections = ref({});
  const layoutManager = ref(null);
  const isMuteLocalAudio = ref(true);
  const isMuteLocalVideo = ref(true);
  const isFullScreen = ref(false);
  const isStartStreaming = ref(false);
  const isSettingShow = ref(false);

  const audioInputs = ref(null);
  const audioOutputs = ref(null);
  const videoInputs = ref(null);

  const audioInputSelectList = ref([]);
  const audioOutputSelectList = ref([]);
  const videoInputSelectList = ref([]);

  const selectedAudioInput = ref(0);
  const selectedAudioOutput = ref(0);
  const selectedVideoInput = ref(0);

  const usersStore = useUserStore();
  const { user } = storeToRefs(usersStore);
  const roomsStore = useRoomsStore();
  const { getCurrentRoom } = storeToRefs(roomsStore);
  const chanelId = `user.${user.value.id}`;

  const sendSystemMessage = async (msgCode: number) => {
    try {
      await http.post<VideoCall, RequestResult<void>>(
        `/managers/room/${getCurrentRoom.value.id}/video_call`,
        {
          data: {
            msgCode: msgCode,
            userId: user.value.id,
            roomId: getCurrentRoom.value.id,
            chanelId: chanelId
          }
        }
      );
    } catch (error) {
      console.log("error", error);
      message(error, { type: "error" });
    }
  };
  const joinAsync = (): ls.Future<Object> => {
    const promise = new ls.Promise<Object>();

    // Create a client.
    client.value = new ls.Client(gatewayUrl, applicationId);

    const token: string = ls.Token.generateClientRegisterToken(
      applicationId,
      client.value.getUserId(),
      client.value.getDeviceId(),
      client.value.getId(),
      null,
      [new ls.ChannelClaim(chanelId)],
      sharedSecret
    );
    unregistering.value = false;

    client.value.addOnStateChange(() => {
      ls.Log.debug(
        `Client is ${new ls.ClientStateWrapper(client.value.getState())}.`
      );

      if (
        client.value.getState() === ls.ClientState.Unregistered &&
        !unregistering.value
      ) {
        ls.Log.debug(`Registering with backoff = ${reRegisterBackoff.value}.`);
        sendSystemMessage(12).catch();

        setTimeout(() => {
          if (reRegisterBackoff.value <= maxRegisterBackoff.value) {
            reRegisterBackoff.value += reRegisterBackoff.value;
          }

          client.value
            .register(token)
            .then(channels => {
              reRegisterBackoff.value = 200;
              onClientRegistered(channels);
              promise.resolve(null);
            })
            .fail(ex => {
              ls.Log.error("Failed to register with Gateway.");
              promise.reject(ex);
            });
        }, reRegisterBackoff.value);
      }
    });

    // Register client with token.
    client.value
      .register(token)
      .then(channels => {
        onClientRegistered(channels);
        promise.resolve(null);
      })
      .fail(ex => {
        ls.Log.error("Failed to register with Gateway.");
        promise.reject(ex);
      });

    return promise;
  };
  const leaveAsync = (): ls.Future<Object> => {
    unregistering.value = true;
    return client.value
      .unregister()
      .then(() => sendSystemMessage(13))
      .fail(() => ls.Log.error("Unregistration failed."));
  };
  const runLocalMedia = () => {
    startLocalMedia().then(() => {
      isStartStreaming.value = true;
      joinAsync().then(() => {
        loadInputs();
      });
    });
  };
  const getAudioInputs = (): ls.Future<ls.SourceInput[]> => {
    return localMedia.value?.getAudioInputs();
  };
  const getVideoInputs = (): ls.Future<ls.SourceInput[]> => {
    return localMedia.value?.getVideoInputs();
  };
  const getAudioOutputs = (): ls.Future<ls.SinkOutput[]> => {
    const remoteMedia = new ls.RemoteMedia(true, true);
    return remoteMedia.getAudioSinkOutputs();
  };
  const setAudioInput = (input: ls.SourceInput): void => {
    localMedia.value?.changeAudioSourceInput(input);
  };
  const setVideoInput = (input: ls.SourceInput): void => {
    localMedia.value?.changeVideoSourceInput(input);
  };
  const setAudioOutput = (output: ls.SinkOutput): void => {
    for (const connectionID in downstreamConnections.value) {
      const connection = downstreamConnections.value[connectionID];
      const remoteMedia = connection.getAudioStream().getRemoteMedia();
      remoteMedia.changeAudioSinkOutput(output);
    }
  };

  const loadInputs = () => {
    getAudioInputs().then(data => {
      audioInputs.value = data;
      for (const [key, input] of data.entries()) {
        audioInputSelectList.value.push({ label: input.getName(), value: key });
      }
    });
    getAudioOutputs().then(data => {
      audioOutputs.value = data;
      for (const [key, input] of data.entries()) {
        audioOutputSelectList.value.push({
          label: input.getName(),
          value: key
        });
      }
    });
    getVideoInputs().then(data => {
      videoInputs.value = data;
      for (const [key, input] of data.entries()) {
        videoInputSelectList.value.push({ label: input.getName(), value: key });
      }
    });
  };
  const leaveLocalMedia = () => {
    stopLocalMedia().then(() => {
      leaveAsync().then(() => {
        isStartStreaming.value = false;
        clearData();
      });
    });
  };
  const startLocalMedia = (): ls.Future<Object> => {
    const promise = new ls.Promise<Object>();

    if (localMedia.value === null) {
      // Create local media with audio and video enabled.
      const audioEnabled = true;
      const videoEnabled = true;
      localMedia.value = new ls.LocalMedia(audioEnabled, videoEnabled);

      // Set local media in the layout.
      layoutManager.value.setLocalMedia(localMedia.value);
    }

    // Start capturing local media.
    localMedia.value
      .start()
      .then(() => {
        ls.Log.debug("Media capture started.");
        promise.resolve(null);
      })
      .fail(ex => {
        ls.Log.error(ex.message);
        promise.reject(ex);
      });

    return promise;
  };
  const stopLocalMedia = (): ls.Future<Object> => {
    const promise = new ls.Promise<Object>();

    // Stop capturing local media.
    localMedia.value
      ?.stop()
      .then(() => {
        ls.Log.debug("Media capture stopped.");
        promise.resolve(null);
      })
      .fail(ex => {
        ls.Log.error(ex.message);
        promise.reject(ex);
      });

    return promise;
  };
  const openSfuUpstreamConnection = (
    localMedia: ls.LocalMedia
  ): ls.SfuUpstreamConnection => {
    const audioStream = new ls.AudioStream(localMedia);
    const videoStream = new ls.VideoStream(localMedia);

    const connection: ls.SfuUpstreamConnection =
      channel.value.createSfuUpstreamConnection(audioStream, videoStream);

    connection.addOnStateChange(conn => {
      ls.Log.debug(
        `Upstream connection is ${new ls.ConnectionStateWrapper(
          conn.getState()
        ).toString()}.`
      );

      if (
        conn.getState() === ls.ConnectionState.Closing ||
        conn.getState() === ls.ConnectionState.Failing
      ) {
        if (conn.getRemoteClosed()) {
          ls.Log.info(`Upstream connection ${conn.getId()} was closed`);
        }
      } else if (conn.getState() === ls.ConnectionState.Failed) {
        openSfuUpstreamConnection(localMedia);
      }
    });

    connection.open();
    return connection;
  };
  const openSfuDownstreamConnection = (
    remoteConnectionInfo: ls.ConnectionInfo
  ): ls.SfuDownstreamConnection => {
    // Create remote media.
    const remoteMedia = new ls.RemoteMedia();
    const audioStream = new ls.AudioStream(remoteMedia);
    const videoStream = new ls.VideoStream(remoteMedia);

    // Add remote media to the layout.
    layoutManager.value.addRemoteMedia(remoteMedia);

    // Create a SFU downstream connection with remote audio and video.
    const connection: ls.SfuDownstreamConnection =
      channel.value.createSfuDownstreamConnection(
        remoteConnectionInfo,
        audioStream,
        videoStream
      );

    // Store the downstream connection.
    downstreamConnections.value[connection.getId()] = connection;

    connection.addOnStateChange(conn => {
      ls.Log.debug(
        `Downstream connection is ${new ls.ConnectionStateWrapper(
          conn.getState()
        ).toString()}.`
      );

      // Remove the remote media from the layout and destroy it if the remote is closed.
      if (conn.getRemoteClosed()) {
        delete downstreamConnections.value[connection.getId()];
        layoutManager.value.removeRemoteMedia(remoteMedia);
        remoteMedia.destroy();
      }
    });

    connection.open();
    return connection;
  };
  const onClientRegistered = (channels: ls.Channel[]): void => {
    channel.value = channels[0];
    sendSystemMessage(11).catch();

    channel.value.addOnRemoteUpstreamConnectionOpen(remoteConnectionInfo => {
      ls.Log.info("An upstream connection opened.");
      openSfuDownstreamConnection(remoteConnectionInfo);
    });

    upstreamConnection.value = openSfuUpstreamConnection(localMedia.value);

    for (const remoteConnectionInfo of channel.value.getRemoteUpstreamConnectionInfos()) {
      openSfuDownstreamConnection(remoteConnectionInfo);
    }
  };
  const toggleMuteLocalAudio = (): ls.Future<object> => {
    const config: ls.ConnectionConfig = upstreamConnection.value.getConfig();
    config.setLocalAudioMuted(!config.getLocalAudioMuted());
    isMuteLocalAudio.value = !config.getLocalAudioMuted();

    return upstreamConnection.value.update(config);
  };
  const toggleMuteLocalVideo = (): ls.Future<object> => {
    const config: ls.ConnectionConfig = upstreamConnection.value.getConfig();
    config.setLocalVideoMuted(!config.getLocalVideoMuted());
    isMuteLocalVideo.value = !config.getLocalVideoMuted();

    return upstreamConnection.value.update(config);
  };

  const toggleFullScreen = () => {
    const fullscreenElement = document.fullscreenElement;

    if (fullscreenElement) {
      exitFullscreen();
      isFullScreen.value = false;
    } else {
      launchIntoFullscreen(document.getElementById("video"));
      isFullScreen.value = true;
    }
  };

  const launchIntoFullscreen = element => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else {
      element.classList.toggle("fullscreen");
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const toggleSettingShow = () => {
    isSettingShow.value = !isSettingShow.value;
  };

  const clearData = () => {
    audioInputs.value = null;
    audioOutputs.value = null;
    videoInputs.value = null;

    audioInputSelectList.value = [];
    audioOutputSelectList.value = [];
    videoInputSelectList.value = [];

    selectedAudioInput.value = 0;
    selectedAudioOutput.value = 0;
    selectedVideoInput.value = 0;
  };

  watch(selectedAudioInput, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      setAudioInput(audioInputs.value[selectedAudioInput.value]);
    }
  });

  watch(selectedAudioOutput, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      setAudioOutput(audioOutputs.value[selectedAudioOutput.value]);
    }
  });

  watch(selectedVideoInput, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      setVideoInput(videoInputs.value[selectedVideoInput.value]);
    }
  });

  onMounted(() => {
    layoutManager.value = new ls.DomLayoutManager(
      document.getElementById("video")
    );
  });

  onUnmounted(() => {
    leaveLocalMedia();
  });

  return {
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
    isSettingShow,
    toggleSettingShow
  };
}
