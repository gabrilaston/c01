<template>
  <div
    class="h-full w-full p-2 bg-white cu flex flex-col"
    :class="state.autoAble ? 'cursor-none' : ''"
    ref="el"
  >
    <div class="border-b border-black">
      {{ state.mouse }}
      <button
        class="my-2"
        @click="toggle"
      >
        Go Fullscreen
      </button>
    </div>

    <div class="border-b border-black flex py-3">
      <div class="w-60 h-40 bg-black text-white flex">
        <span id="typed"></span>
      </div>
      <button
        class="h-10 ml-60"
        @click="typeOrder()"
      >
        自动指令操作
      </button>
    </div>

    <div class="border-b border-black py-3 flex">
      <div class="h-full w-1/2">
        <div class="text-xl my-1">数量: {{ count }}</div>
        <button @click="type(0)">增加</button>
        <button @click="type(1)">减少</button>
        <span class="ml-2">/</span>
        <button
          :disabled="!canUndo"
          @click="type(2)"
        >
          回退
        </button>
        <button
          :disabled="!canRedo"
          @click="type(3)"
        >
          重做
        </button>
        <button @click="reset()">复原</button>
        <br />
        <br />
        <div>History (limited to 10 records for demo)</div>
        <div class="code-block mt-4">
          <div
            v-for="i in history"
            :key="i.timestamp"
          >
            <span class="opacity-50 mr-2 font-mono">{{
              format(i.timestamp)
            }}</span>
            <span class="font-mono">{ value: {{ i.snapshot }} }</span>
          </div>
        </div>
      </div>
      <div class="h-full w-1/2 flex flex-col">
        <div>
          <button @click="clearOrder()">清空操作记录</button>
          <button @click="clickOrder()">自动按钮操作</button>
        </div>

        自动执行顺序：
        <div v-for="item in click_list">
          {{ click_order[item] }}
        </div>
      </div>
    </div>

    <div class="border-b border-black flex py-3">
      <button @click="moveOrder()">自动界面操作</button>
    </div>
    <svg
      viewBox="11.8 9 16 22"
      v-show="state.autoAble"
      id="mouse1"
      class="mouse"
    >
      <path d="M20,21l4.5,8l-3.4,2l-4.6-8.1L12,29V9l16,12H20z"></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen, useMouse, useRefHistory } from "@vueuse/core";
import { useCounter } from "@vueuse/shared";
import { formatDate } from "@vueuse/core";
import { animate } from "popmotion";
import { Observable } from "rxjs";
// import Typed from "typed.js";

const observable = new Observable((subscriber: any) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});

function format(ts: number) {
  return formatDate(new Date(ts), "YYYY-MM-DD HH:mm:ss");
}

const { count, inc, dec } = useCounter();
const { history, undo, redo, canUndo, canRedo } = useRefHistory(count, {
  capacity: 8,
});
const el = ref();
const { toggle } = useFullscreen(el);
const click_list = ref([] as any);
const click_order = ["增加", "减少", "回退", "重做"];

const state = reactive({
  mouse: useMouse(),
  mos: null as any,
  autoAble: false,
});
function updateMouse(x, y) {
  state.mos.style.transform = `translate(${x}px, ${y}px)`;
}

const moveOrder = async () => {
  state.autoAble = !state.autoAble;
  const list = [
    { x: 0, y: 0 },
    { x: 279, y: 425 },
    { x: 633, y: 140 },
    { x: 460, y: 472 },
    { x: 260, y: 472 },
    { x: 479, y: 225 },
  ];
  const a = () => {
    animate({
      from: list[0],
      to: list[1],
      onUpdate: (latest) => updateMouse(latest.x, latest.y),
      duration: 2000,
      onComplete: () => {
        if (list.length > 1) {
          list.shift();
          a();
        } else {
          state.autoAble = !state.autoAble;
          alert("完成操作");
        }
      },
      // type: "spring",
    });
  };
  a();
};
const clearOrder = () => {
  click_list.value = [];
};

const clickOrder = () => {
  const list = [];
  click_list.value.forEach((x) => {
    list.push(x);
  });
  const timer = setInterval(() => {
    if (list.length > 0) {
      _order(list[0]);
      list.shift();
    } else {
      clearInterval(timer);
      alert("完成操作");
      return;
    }
  }, 1000);
};

const typeOrder = async () => {
  // 初始化 Typed.js
  var typed = new Typed("#typed", {
    strings: [
      "开启火电送风系统",
      "正在执行指令...",
      "开启给水泵系统",
      "正在执行指令...",
      "开启油系统",
      "正在执行指令...",
      "指令已完成",
    ],
    typeSpeed: 100,
    backSpeed: 60,
    loop: false,
  });
};

const _order = (val: any) => {
  switch (val) {
    case 0:
      inc();
      break;
    case 1:
      dec();
      break;
    case 2:
      undo();
      break;
    case 3:
      redo();
      break;
    default:
      break;
  }
};

const type = (val: any) => {
  _order(val);
  click_list.value.push(val);
  if (click_list.value.length > 8) {
    click_list.value.shift();
  }
};

const reset = () => {
  console.log(history.value);
  count.value = 0;
};

onMounted(() => {
  state.mos = document.getElementById("mouse1");
  nextTick(() => {});
});
onBeforeUnmount(() => {});
</script>

<style scoped lang="scss">
.container {
  width: 500px;
  height: 500px;
  outline: 2px solid #41b883;
}
.box {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #41b883;
  color: white;
}
svg {
  width: 20px;
  top: 0;
  left: 0;
  position: fixed;
}
button {
  border: none;
  outline: none;
  margin-right: 10px;
  background-color: #2ecc71;
  color: white;
  padding: 5px 10px;
}
</style>
