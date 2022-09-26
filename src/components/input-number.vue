<template>
  <input ref="inputDOM" type="number" v-model="inputValue" @keydown="onKeyDown($event)" />
</template>

<script lang="ts">
import {
  onMounted,
  ref
} from "@vue/runtime-core";
import {
  Ref,
  toRef,
  computed,
} from "vue";

export default {
  props: {
    max: Number,
    min: Number,
    modelValue: Number,
  },
  setup(props, context) {
    let inputDOM: Ref = ref(null);

    const inputValue = computed({
      get: function () {
        if (props.min !== null && props.modelValue < props.min) {
          return props.min;
        } else if (props.max !== null && props.modelValue > props.max) {
          return props.max;
        }
        return props.modelValue;
      },
      set: function (val) {
        context.emit('update:modelValue', Number(val))
      }
    })
    const onKeyDown = ($event) => {
      $event.stopPropagation();
    }
    return {
      inputValue,
      onKeyDown,
      inputDOM,
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