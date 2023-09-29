<script setup lang="ts">
import { useTags } from "@/views/settings/tags/hooks/useTags";
import { useNav } from "@/layout/hooks/useNav";

defineOptions({
  name: "Tags"
});

const {
  getTagsList,
  formTags,
  editTag,
  dialogTagVisible,
  addTag,
  changeEditTag,
  handleEdit,
  handleDelete,
  fetchTagsList
} = useTags();

const { device } = useNav();
</script>

<template>
  <div>
    <div
      class="window-container"
      :class="{ 'window-mobile': device.value === 'mobile' }"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="Add a tag">
          <el-autocomplete
            ref="InputRef"
            v-model="formTags"
            :fetch-suggestions="fetchTagsList"
            placeholder="Search"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addTag">Add</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <div class="w-full flex mb-4 pb-4">
        <el-table :data="getTagsList" style="width: 100%">
          <el-table-column label="ID" width="100">
            <template #default="scope">
              <div style="display: flex">
                <span>{{ scope.row.id }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Tag" width="280">
            <template #default="scope">
              <div style="display: flex">
                <el-tag>{{ scope.row.value }}</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Status" width="180">
            <template #default="scope">
              <div style="display: flex">
                <el-tag
                  class="ml-2"
                  :type="scope.row.active ? 'success' : 'error'"
                >
                  {{ scope.row.active ? "active" : "inactive" }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Operations">
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
                >Edit</el-button
              >
              <el-popconfirm
                width="250"
                title="Are you sure to delete this?"
                @confirm="handleDelete(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button size="small" type="danger">Delete</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="dialogTagVisible" width="35%">
      <el-form
        v-model="editTag"
        :inline="true"
        class="demo-form-inline"
        style="text-align: center"
      >
        <el-form-item label="Name">
          <el-input v-model="editTag.name" />
        </el-form-item>
        <el-form-item label="Active">
          <el-switch v-model="editTag.active" />
        </el-form-item>
        <el-form-item style="margin-left: 30px; margin-right: 0">
          <el-button type="primary" @click="changeEditTag">Save</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
