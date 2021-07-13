<template>
  <input ref="inputDOM" type="number" v-model="input" @keydown="onKeyDown($event)" @input="inputHandle()" />
</template>

<script lang="ts">
  import {
    onMounted,
    ref
  } from "@vue/runtime-core";
  import {
    Ref,
    toRef
  } from "vue";

  export default {
    props: {
      max: Number,
      min: Number,
      modelValue: Number,
    },
    setup(props, context) {
      /** 隐藏 options */
      let input = ref(props.modelValue);
      let min = toRef(props, 'min');
      let max = toRef(props, 'max');
      let inputDOM: Ref = ref(null);
      onMounted(() => {

      });
      const inputHandle = () => {
        if (min.value !== null && input.value < min.value) {
          input.value = min.value;
        } else if (max.value !== null && input.value > max.value) {
          input.value = max.value;
        }
        context.emit('update:modelValue', Number(input.value))
      }
      const onKeyDown = ($event) => {
        $event.stopPropagation();
      }
      return {
        input,
        onKeyDown,
        inputDOM,
        inputHandle
      };
    }
  }
</script>


<style lang="scss">
  input {
    font-size: 12px;
    color: #fff;
    width: 57px;
    height: 100%;
    padding: 6px;
    box-sizing: border-box;
    border: none;
    border-radius: 2px;
    outline: none;
    background: rgba(0, 0, 0, 0.3);
  }

  input[type="number"] {
    text-align: right;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }
</style>