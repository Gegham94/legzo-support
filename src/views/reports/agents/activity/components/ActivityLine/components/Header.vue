<script setup lang="ts">
defineOptions({
  name: "ActivityHeader"
});
</script>

<template>
  <el-row class="border-b-[1px] pb-3 pt-2 border-[#dcdfe6]">
    <el-col :span="6" />
    <el-col :span="18" class="flex items-center w-full">
      <div class="css-zk7wnk w-full">
        <div class="css-1f75w2h">
          <div class="css-1hnxhlu">12 AM</div>
          <div class="css-1hnxhlu">4 AM</div>
          <div class="css-1hnxhlu">8 AM</div>
          <div class="css-1hnxhlu">12 PM</div>
          <div class="css-1hnxhlu">4 PM</div>
          <div class="css-1hnxhlu">8 PM</div>
          <div class="css-1hnxhlu">12 AM</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.css-zk7wnk {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 35px;
  padding: 0px 8px;
}

.css-1f75w2h {
  position: relative;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  flex: 1 0 auto;
  margin: 0px 8px;
  font-weight: 600;
}

.css-1hnxhlu {
  -webkit-box-flex: 0;
  flex-grow: 0;
  color: var(--content-default);
  font-weight: 600;
  font-size: 12px;
}

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
