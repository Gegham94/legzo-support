<script setup lang="ts">
import { ref, watch } from "vue";
import { BaseAgent } from "@/api/agents/interfaces";
import { INITIAL_DATA } from "@/api/agents/constants";
import Delete from "@iconify-icons/ep/delete";
import Plus from "@iconify-icons/ep/plus";
const emit = defineEmits(["upload-image"]);
const props = defineProps({
  isReset: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object as PropType<BaseAgent>,
    default: () => {
      return { ...INITIAL_DATA };
    }
  }
});

const fileList = ref([]);
const uploadFile = ref();
const formData = ref(props.data);

watch(
  () => props.isReset,
  val => {
    if (val) {
      handleRemove();
    }
  }
);

watch(
  () => props.data,
  val => {
    formData.value = val;

    if (formData.value.avatar_link) {
      fileList.value[0] = {
        name: formData.value.email,
        url: formData.value.avatar_link
      };
    } else {
      fileList.value = [];
    }
  }
);

const handleRemove = () => {
  uploadFile.value.clearFiles();
  emit("upload-image", null);
  formData.value.avatar = null;
};

const getFileMsg = content => {
  getBase64(content.raw).then(res => {
    emit("upload-image", res);
    formData.value.avatar = res;
  });
};

const getBase64 = file => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    let imgResult: string | ArrayBuffer = "";

    reader.readAsDataURL(file);
    reader.onload = () => {
      imgResult = reader.result;
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.onloadend = () => {
      resolve(imgResult);
    };
  });
};
</script>

<template>
  <div class="flex justify-center items-center pb-1">
    <el-upload
      v-model:file-list="fileList"
      action="#"
      ref="uploadFile"
      list-type="picture-card"
      :auto-upload="false"
      :limit="1"
      :on-change="getFileMsg"
      class="upload-avatar"
      :class="{ hideAddCard: fileList[0]?.url }"
    >
      <IconifyIconOffline
        class="dark:text-white"
        width="20px"
        height="20px"
        :icon="Plus"
      />
      <template #file="{ file }">
        <div>
          <img
            v-if="fileList[0]?.url"
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-delete" @click="handleRemove()">
              <IconifyIconOffline
                class="dark:text-white"
                width="20px"
                height="20px"
                :icon="Delete"
              />
            </span>
          </span>
        </div>
      </template>
    </el-upload>
  </div>
</template>
