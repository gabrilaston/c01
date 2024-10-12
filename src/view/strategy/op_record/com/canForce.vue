<template>
  <div class="h-full w-full flex flex-col">
    <!-- 文件选择 -->
    <div class="h-50 w-full">
      <div class="h-40 w-full flex-shrink-0 border relative">
        <div
          class="h-full w-full z-20 absolute"
          v-if="state.isLoading"
        ></div>
        <component
          :is="UpArea"
          @file_upload="fileLoad"
        />
      </div>
      <div class="w-full h-10 p-1">
        <component :is="LibButton" />
      </div>
    </div>

    <div class="h-10 flex items-center px-2">
      <div class="h-10 text-md font-medium min-w-min m-auto flex items-center">
        模型：
      </div>
      <div class="w-28 flex-1">
        <el-select
          v-model="state.algo"
          placeholder="Select"
          :fit-input-width="true"
        >
          <el-option
            v-for="item in algo_doc"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div class="flex justify-between w-full h-10 p-2">
      <button
        @click="download"
        :disabled="state.downable"
        class="menuButton shadow-md bg-gray-200 cursor-pointer disabled:opacity-20"
      >
        下载
      </button>
      <button
        @click="submit"
        :disabled="state.downable"
        class="menuButton shadow-md bg-gray-200 cursor-pointer disabled:opacity-20"
      >
        识别
      </button>
    </div>

    <div class="border rounded-md h-20 mt-2">
      {{ state.result }}
    </div>
  </div>
</template>

<script setup lang="ts">
// import fs from "file-saver";
import { UpArea, LibButton } from "@/component";
import { algo_doc, fileFormat } from "../interface";

const instance = getCurrentInstance();
const state = reactive({
  downable: true,
  isLoading: false,
  algo: "demo",
  result: "",

  img: {} as any,
});

// 识别
async function submit() {
  // const para = "{ 'CF': '" + state.algo + "' }";
  // state.canvas.toBlob(
  //   (blob: any) => {
  //     let files = new window.File([blob], "dsfasf", { type: "asdfsf" });
  //     if (files !== null) {
  //       let _formData = new FormData();
  //       _formData.append("name", files.name);
  //       _formData.append("para", para);
  //       _formData.append("file", files);
  //       img_class(_formData).then((res: any) => {
  //         state.result = res.result;
  //       });
  //     }
  //   },
  //   "image/jpeg",
  //   0.95
  // );
}

// input选择文件
const fileLoad = (files) => {
  fileChange(files[0]);
};
const fileChange = (file: any) => {
  state.isLoading = true;
  if (!file) {
    state.isLoading = false;
    return;
  }
  const res = fileCheck(file, fileFormat);
  if (res[0]) {
    state.isLoading = false;
    return;
  }
  instance?.proxy?.$Bus.emit("file-load", file);
  state.isLoading = false;
};
const fileCheck = (file: any, accept_format: any) => {
  let res = [true, ""];
  // res[0] 是否符合 失败为true， res[1] 文件类型
  if (file.size > 100 * 1024 * 1024) {
    alert(file.size + "文件不能大于100M");
    return res;
  }
  const type = file.type !== "" ? file.type : file.name.split(".")[1];
  Object.keys(accept_format).forEach((key) => {
    if (accept_format[key].includes(type)) {
      res[0] = false;
      res[1] = key;
    }
  });
  if (res[0]) {
    alert("要求标准文档格式");
  }
  return res;
};

const hasLoaded = () => {
  state.isLoading = false;
};

defineExpose({ hasLoaded });
const download = () => {};

const fileCall = (data: any) => {
  fileChange(data.file);
};
onMounted(() => {
  document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };
  getCurrentInstance()?.proxy?.$Bus.on("call-on", fileCall);
  nextTick(() => {});
});
onBeforeUnmount(() => {
  getCurrentInstance()?.proxy?.$Bus.off("call-on");
});
</script>

<style scoped lang="scss"></style>
