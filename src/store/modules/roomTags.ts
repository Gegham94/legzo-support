import { store } from "@/store";
import { defineStore } from "pinia";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { Tag, TagCreate } from "@/api/chats/interfaces";

export const useRoomTagsStore = defineStore({
  id: "pure-room-tags",
  state: () => ({
    tagsList: []
  }),
  getters: {
    getTags() {
      return this.tagsList;
    }
  },
  actions: {
    async addNewTag(name: string): Promise<number> {
      const {
        success,
        data: { id }
      } = await http.post<TagCreate, RequestResult<Tag>>(`/managers/tags`, {
        data: { name }
      });

      if (success) {
        return id;
      }
    },
    async fetchTags(): Promise<void> {
      const { data } = await http.getList<void, RequestResult<Tag[]>>(
        "/managers/tags"
      );

      this.tagsList = [];

      if (data?.length) {
        data.forEach(tag => {
          this.tagsList.push({
            value: tag.name,
            id: tag.id,
            active: tag.active
          });
        });
      }
    },
    async fetchEditTag(tag: Tag): Promise<boolean> {
      const { success } = await http.put<Tag, RequestResult<Tag>>(
        `/managers/tags/${tag.id}`,
        { data: { ...tag } }
      );

      return success;
    },
    async fetchDeleteTag(tagId: string): Promise<boolean> {
      const { success } = await http.delete<Tag, RequestResult<Tag>>(
        `/admin/tags/${tagId}`
      );

      return success;
    }
  }
});

export function useRoomTagsStoreHook() {
  return useRoomTagsStore(store);
}
