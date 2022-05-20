<template>
  <div class="switcher">
    <span class="switcher-lable-title" v-if="lab">{{lab}}</span>
    <label class="switch" :class="{'switch-disabled':disab}" @click="$event.stopPropagation()">
      <input type="checkbox" v-model="isOn" :disabled="disab" />
      <div class="slider round" :class="{'ball-color':!!ballColor}" @click="onClick($event)"
        :style="{background: background}"></div>
    </label>
  </div>
</template>

<script lang="ts">
  import {
    onMounted,
    ref
  } from "@vue/runtime-core";
  import {
    toRef
  } from "vue";

  export default {
    props: {
      label: String,
      ballColor: String,
      disabled: Boolean,
      modelValue: Boolean,
    },
    setup(props, context) {
      let isOn = ref(props.modelValue);
      let background = "rgba(255, 255, 255, 0.1)";
      let disable = toRef(props, "disabled");
      // let ballColor = toRef(props,'disabled');
      let label = toRef(props, "label");
      onMounted(async () => {});
      const onClick = (e) => {
        e.stopPropagation();
        context.emit("switch", !isOn.value);
        context.emit("update:modelValue", !isOn.value);
      };
      return {
        lab: label,
        background,
        disab: disable,
        isOn,
        onClick,
      };
    },
  };
</script>


<style lang="scss">
  .switcher {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;

    .switcher-lable-title {
      display: inline-block;
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
      color: #fff;
      margin-right: 8px;
    }

    .switch {
      width: 24px;
      height: 14px;
      position: relative;
      display: inline-block;
    }

    .switch-disabled {
      opacity: 0.5;
    }

    input {
      display: none;
    }

    .round {
      border-radius: 10px;
    }

    .slider {
      background: rgba(255, 255, 255, 0.1);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 24px;
      transition: all 0.2s;
      cursor: pointer;
      // adding inset bottom box-shadow
      // box-shadow: inset 0 -1px 0 0 rgba(0,0,0,0.5);
    }

    //小圆点
    .slider:after {
      content: "";
      width: 10px;
      height: 10px;
      display: block;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      position: absolute;
      top: 2px;
      left: 2px;
      transition: all 0.2s;
    }

    .ball-color:after {
      background: #444;
    }

    //单选框选中后改变的样式
    input:checked+.slider:after {
      transform: translateX(10px);
      background: #fff;
    }
  }
</style>