<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Edit from "@iconify-icons/ep/edit";
import CopyDocument from "@iconify-icons/ep/copy-document";
import User from "@iconify-icons/ep/user";
import Delete from "@iconify-icons/ep/delete";
import moment from "moment-timezone";

const emit = defineEmits(["template-delete", "template-edit", "template-copy"]);

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const template = ref(props.data);

const templateEdit = template => {
  emit("template-edit", template);
};

const templateCopy = template => {
  emit("template-copy", template);
};

const templateDelete = id => {
  emit("template-delete", id);
};

watch(
  () => props.data,
  val => {
    template.value = val;
  }
);

const formatterDate = computed(() => {
  return moment.unix(template.value.updated_at).format("DD MMMM YYYY");
});
</script>

<template>
  <div class="card">
    <div>
      <ul class="card_hashtag">
        <li
          v-for="(shortcut, key) in template.shortcuts"
          :key="key"
          class="card_hashtag--item"
        >
          {{ shortcut.substring(1) }}
        </li>
      </ul>
      <p class="card_text">
        {{ template.text }}
      </p>
      <span class="card_date">
        <span class="card_date--icon">
          <IconifyIconOffline :icon="User" />
        </span>
        Added by LiveChat, {{ formatterDate }}
      </span>
    </div>
    <div class="card_icon">
      <div @click="templateEdit(template)">
        <IconifyIconOffline :icon="Edit" />
      </div>
      <div @click="templateCopy(template)">
        <IconifyIconOffline :icon="CopyDocument" />
      </div>
      <div @click="templateDelete(template.id)">
        <IconifyIconOffline :icon="Delete" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.card {
  transition: 0.3s;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  &_text {
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: var(--content-default);
    margin: 11px 0 10px;
    white-space: pre-line;
    overflow-wrap: break-word;
  }

  &_date {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--content-default);
    padding-bottom: 19px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
    min-height: 24px;

    &--icon {
      width: 20px;
      height: 20px;
      background: var(--surface-secondary-default);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      min-width: 20px;
      margin-right: 8px;
    }
  }

  &_icon {
    display: none;
    cursor: pointer;

    > div {
      width: 32px;
      height: 32px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;

      &:hover {
        background-color: var(--surface-basic-hover);
      }
    }
  }

  &_hashtag--item {
    position: relative;
    display: inline-block;
    width: auto;
    max-width: 100%;
    overflow-wrap: break-word;
    padding: 5px 8px;
    margin: 0 8px 8px 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--content-default);
    line-height: 22px;
    border: 1px solid var(--border-subtle);
    border-radius: 4px;
    text-shadow: none;

    &::before {
      content: "#";
      font-size: 15px;
      line-height: 22px;
      font-weight: 600;
      color: var(--color-action-default);
    }
  }

  &:hover {
    background-color: var(--surface-basic-subtle);

    .card_icon {
      display: flex;
    }
  }
}
</style>
