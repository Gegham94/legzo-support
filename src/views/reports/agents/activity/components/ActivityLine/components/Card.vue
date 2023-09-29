<script setup lang="ts">
import { PropType } from "vue";
import { activityAgents } from "@/store/modules/types";
import AgentCard from "@/views/components/agent-card/index.vue";
import moment from "moment-timezone";

defineOptions({
  name: "ActivityLine"
});

defineProps({
  agent: {
    type: Object as PropType<activityAgents>
  }
});
</script>

<template>
  <el-row class="border-b-[1px] pb-3 pt-2 border-[#dcdfe6]">
    <el-col :span="6" class="items-center flex">
      <AgentCard :agent="agent" />
    </el-col>
    <el-col :span="18" class="flex items-center w-full">
      <div class="w-full css-1dmyoyw">
        <div class="css-opbmdv lc-activity-chart-container pl-8 pr-8">
          <div class="css-xxb03j">
            <div class="css-1h46rle">
              <div class="css-1ncrhew" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1ncrhew" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1ncrhew" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1ncrhew" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1ncrhew" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1ncrhew" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1fkkkgf" />
              <div class="css-1ncrhew" />
            </div>
            <div class="css-inslvv">
              <div class="css-1f0uoee">
                <el-tooltip
                  class="item"
                  :content="item.accepting_time"
                  placement="bottom"
                  popper-class="pure-tooltip"
                  v-for="item in agent.activity"
                  :key="item.left"
                >
                  <div
                    class="css-tfh4bz"
                    :style="{
                      left: `${item.left}%`,
                      width: `${item.width}%`,
                      backgroundColor: item.background
                    }"
                  />
                </el-tooltip>
              </div>
              <div class="css-tkf5a0">
                <div class="css-33psgk" />
                <div class="css-1nxxjvo" />
              </div>
            </div>
            <div class="css-4f8a5v">
              <span class="css-1kisfds"
                >Accepting chats:
                <strong>{{
                  moment
                    .utc(agent.total.accepting_chats * 1000)
                    .format("HH[h] mm[m] ss[s]")
                }}</strong></span
              >
              <span class="css-1kisfds css-15jpq2b">
                Not accepting chats:
                <strong>
                  {{
                    moment
                      .utc(agent.total.not_accepting_chats * 1000)
                      .format("HH[h] mm[m] ss[s]")
                  }}</strong
                >
              </span>
              <span class="css-1kisfds css-pm3msk"
                >Logged out:
                {{
                  moment
                    .utc(agent.total.logged_out * 1000)
                    .format("HH[h] mm[m] ss[s]")
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.css-xxb03j {
  position: relative;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  height: 70px;
  margin-left: auto;
  margin-right: auto;
}

.css-1ncrhew {
  width: 1px;
  height: 8px;
  margin-bottom: 7px;
  background-color: var(--border-default);
}

.css-1fkkkgf {
  width: 1px;
  height: 4px;
  margin-bottom: 7px;
  background-color: var(--border-default);
}

.css-1h46rle {
  position: relative;
  display: flex;
  align-items: flex-end;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-basis: 0px;
}

.css-tfh4bz {
  position: absolute;
  top: 0px;
  left: -1px;
  height: 6px;
  min-width: 1px;
}

.css-1f0uoee {
  position: relative;
  width: 100%;
  height: 6px;
  background-color: var(--surface-secondary-default);
}

.css-4f8a5v {
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-basis: 0px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  flex-wrap: wrap;
}

.css-1kisfds {
  color: var(--content-subtle);
  font-size: 12px;
  margin: 0px 8px;
  font-weight: 400;
  min-width: 140px;
  display: inline-block;
}

.css-1kisfds::before {
  content: "";
  background-color: var(--color-positive-default);
  height: 6px;
  width: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.css-15jpq2b::before {
  background-color: var(--color-negative-default);
  content: "";
  height: 6px;
  width: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.css-pm3msk::before {
  background-color: var(--surface-secondary-default);
  content: "";
  height: 6px;
  width: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}
</style>
