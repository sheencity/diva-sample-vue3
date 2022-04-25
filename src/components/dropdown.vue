<template>
  <a class="select">
    <p :class="{'select-disabled':disable}" style="margin: 0;user-select: none;">
      <input type="text" class="placeholder" :disabled="disable" :value="placeholder" readonly @blur="onBlur($event)"
        @keydown='$event.preventDefault();' @click="onClick()">
      <img class="arrow-down" :class="{'activity':!hideOptions}" width="9" height="6"
        :src="disable? getAssetsFile('arrow-down-disabled.svg') : getAssetsFile('arrow-down.svg')" />
    </p>
    <ul class="option" :style="{height: (!hideOptions ? 'auto':'0px')}">
      <li v-for="item in items" :key="item.value" class="dropdown-item" :title="item.placeholder"
        @mousedown="menuClick(item)">{{item.placeholder}}</li>
    </ul>
  </a>

</template>

<script lang="ts">
  import {
    reactive,
    ref
  } from "@vue/runtime-core";
  import {
    DropdownData
  } from "@/models/dropdown-data.interface";
  import {
    toRef,
    toRefs
  } from "vue";
  import getAssetsFile from '@/util/public-use';

  export default {
    props: {
      options: Array,
      initvalue: Object,
      disabled: Boolean,
    },
    setup(props, context) {
      /** 隐藏 options */
      let hideOptions = ref(true);
      let disable = toRef(props, "disabled");
      let options = toRef(props, "options");
      /** 当前选中的项目 */
      let selectedItem: DropdownData = reactive({
        value: props.initvalue.value,
        placeholder: props.initvalue.placeholder,
      });

      const onClick = () => {
        if (disable.value) {
          return;
        }
        hideOptions.value = !hideOptions.value;
      };
      const menuClick = (item: DropdownData) => {
        selectedItem.placeholder = item.placeholder;
        selectedItem.value = item.value;
        hideOptions.value = true;
        context.emit("select", selectedItem);
      };
      const onBlur = (ev) => {
        ev.stopPropagation();
        if (!hideOptions.value) {
          setTimeout(() => {
            hideOptions.value = true;
          }, 200);
        }
      };
      return {
        hideOptions,
        disable,
        items: options,
        ...toRefs(selectedItem),
        getAssetsFile,
        // 事件
        onClick,
        menuClick,
        onBlur,
      };
    },
  };
</script>


<style lang="scss">
  :host.multi {
    a.select {
      width: 57px;

      p {
        width: 57px;

        input {
          width: 57px;
        }
      }
    }

    .option {
      left: 0;

      &::-webkit-scrollbar {
        background-color: #1d1d1d;
      }

      max-height: 120px;

      .dropdown-item {
        background: rgba(0, 0, 0, 0.3);

        &:hover {
          background-color: #fba113;
        }
      }
    }
  }

  .select {
    outline: none;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    font-size: 12px;
    box-sizing: border-box;
    width: 57px;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    position: relative;

    .p {
      margin: 0;
      padding: 0px 10px;
      text-align: left;
      background: #333;
      border-radius: 2px;
      cursor: pointer;
      color: #8c8c8c;
      transition: color 0.2s;
    }

    .select-disabled {
      opacity: 0.5;
    }

    input {
      line-height: 24px;
    }

    input.placeholder {
      cursor: pointer;
      caret-color: transparent;
      border: none;
      outline: none;
      background: none;
      width: 57px;
      height: 24px;
      color: #fff;
      padding-left: 6px;
      font-size: 12px;
      box-sizing: border-box;
    }

    .arrow-down {
      position: absolute;
      right: 6px;
      top: 9px;
      cursor: pointer;
      transition: all 0.4s;
      pointer-events: none;
    }

    .activity {
      transform: rotate(180deg);
    }
  }

  .option {
    /*display: none;*/
    width: 57px;
    max-height: 99px;
    overflow: auto;
    position: absolute;
    left: -1px;
    z-index: 999999;
    top: 15px;
    border-width: 0px 1px;
    right: -1px;
    padding: 0px;
    box-sizing: border-box;
    border-radius: 4px;
    height: auto;
    transition: 0s height;

    &::-webkit-scrollbar {
      background-color: #333 !important;
    }
  }

  .option::-webkit-scrollbar {
    width: 3px;
  }

  .option::-webkit-scrollbar-thumb {
    width: 3px;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .option {
    li {
      list-style: none;
      outline: none;
      /*background-color: white;*/
      font-size: 12px;
      text-align: left;
      height: 24px;
      color: #fff;
      box-sizing: border-box;
      line-height: 24px;
      cursor: pointer;
      padding: 0 8px;
      background: #333;
      overflow: hidden;
      white-space: nowrap;

      &:hover,
      &:focus {
        background: #666;
      }

      &:first-child {
        padding-top: 1px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      &:last-child {
        padding-bottom: 1px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }

    .triangle {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #fba113;
      box-sizing: border-box;
    }

    .to-top {
      border-top: 10px solid #fba113;
    }

    .to-bottom {
      border-bottom: 10px solid #fba113;
    }
  }
</style>