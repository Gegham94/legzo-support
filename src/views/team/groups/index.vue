<script setup lang="ts">
import Card from "./components/Card.vue";
import DialogForm from "./components/DialogForm.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "@iconify-icons/ep/search";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { svg } from "@/constants/common";
import { useGroups } from "@/views/team/groups/hooks";
import Detail from "@/views/team/groups/components/Detail.vue";
import Header from "@/views/team/groups/components/Header.vue";
import Close from "@iconify-icons/ep/close";

defineOptions({
  name: "ListGroups"
});

const {
  formDialogVisible,
  handleSearch,
  search,
  dataLoading,
  groupList,
  totalCount,
  selectedGroup,
  setSelectedGroup,
  handleDeleteItem,
  handleManageGroup,
  pagination,
  onPageSizeChange,
  onCurrentChange,
  formData,
  agentList,
  getListGroups,
  handleSort
} = useGroups();
</script>

<template>
  <div class="main">
    <el-row>
      <el-col
        :span="selectedGroup ? 18 : 24"
        class="team_info"
        v-loading="dataLoading"
        :element-loading-svg="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
      >
        <div class="team_title">Team</div>
        <div class="w-full flex justify-between pb-4 team_search">
          <el-button
            :icon="useRenderIcon(AddFill)"
            @click="formDialogVisible = true"
          >
            Add Group
          </el-button>
          <el-input
            style="width: 300px"
            v-model="search"
            placeholder="Name"
            clearable
            @input="handleSearch"
          >
            <template #suffix>
              <el-icon class="el-input__icon">
                <IconifyIconOffline
                  v-show="search.length === 0"
                  :icon="Search"
                />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="pb-4 team_total">Total ({{ totalCount }})</div>
        <el-empty description="Not Data" v-show="groupList.length === 0" />
        <template v-if="totalCount > 0">
          <el-row :gutter="16">
            <el-col>
              <el-row :gutter="16">
                <el-col>
                  <Header :sort="pagination.sort" @handle-sort="handleSort" />
                </el-col>
                <el-col
                  v-for="(group, index) in groupList"
                  :key="index"
                  :span="24"
                >
                  <Card
                    :group="group"
                    :active="selectedGroup?.id === group?.id"
                    @delete-item="handleDeleteItem"
                    @manage-group="handleManageGroup"
                    @set-selected-group="setSelectedGroup(group)"
                  />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-pagination
            class="float-right pt-4"
            v-model:currentPage="pagination.page"
            :page-size="pagination.perPage"
            :total="totalCount"
            :page-sizes="[20, 40, 80]"
            :background="true"
            layout="sizes, prev, pager, next, jumper"
            @size-change="onPageSizeChange"
            @current-change="onCurrentChange"
          />
        </template>
      </el-col>
      <el-col v-if="selectedGroup" class="team_details" :span="6">
        <div class="team_details-title">
          <span>Details</span>
          <el-icon class="el-icon--right">
            <IconifyIconOffline
              class="close-sidebar"
              :icon="Close"
              width="15px"
              height="15px"
              @click="setSelectedGroup(null)"
            />
          </el-icon>
        </div>
        <Detail :group="selectedGroup" class="team_details-info" />
      </el-col>
    </el-row>

    <DialogForm
      v-model:visible="formDialogVisible"
      :data="formData"
      :customers="agentList"
      @update-list="getListGroups"
    />
  </div>
</template>
<style lang="scss" scoped>
.main.main-content {
  margin: 0;
  background: white;
}

.team {
  &_info {
    padding-bottom: 20px;
    overflow-x: hidden;
  }

  &_title {
    display: flex;
    width: 100%;
    height: 52px;
    position: relative;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid var(--border-basic-tertiary);
    background-color: var(--surface-primary-default);
    align-items: center;
    padding-left: 16px;
  }

  &_search {
    padding: 20px 16px;
    background-color: var(--surface-primary-default);
  }

  &_total {
    padding-top: 16px;
    padding-left: 16px;
    background: var(--surface-primary-default);
  }

  &_details {
    border-left: 1px solid var(--border-basic-tertiary);

    &-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 52px;
      box-sizing: border-box;
      border-bottom: 1px solid var(--border-basic-tertiary);
      background-color: var(--surface-primary-default);
      padding-left: 10px;
    }

    i {
      margin-right: 15px;
      cursor: pointer;
    }
  }
}
</style>
