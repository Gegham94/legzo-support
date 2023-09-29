import { store } from "@/store";
import { defineStore } from "pinia";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { GetAgent } from "@/api/agents/interfaces";

export const useAgentsStore = defineStore({
  id: "pure-agents",
  state: () => ({
    agentList: []
  }),
  getters: {
    getAgentsList() {
      return this.agentList;
    }
  },
  actions: {
    async fetchAgentsList(): Promise<void> {
      const { data } = await http.getList<void, RequestResult<GetAgent[]>>(
        "/admin/users"
      );

      this.agentList = data;
    }
  }
});

export function useAgentsStoreHook() {
  return useAgentsStore(store);
}
