import { store } from "@/store";
import { defineStore } from "pinia";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { GetGroup } from "@/api/groups/interfaces";

export const useGroupsStore = defineStore({
  id: "pure-groups",
  state: () => ({
    groupList: []
  }),
  getters: {
    getGroupsList() {
      return this.groupList;
    }
  },
  actions: {
    async fetchGroupsList(): Promise<void> {
      const { data } = await http.getList<void, RequestResult<GetGroup[]>>(
        "/managers/groups"
      );

      this.groupList = data;
    }
  }
});

export function useGroupsStoreHook() {
  return useGroupsStore(store);
}
