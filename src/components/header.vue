<template>
  <div class="header">
    <div class="title">
      <div class="cn">光辉城市数据智能可视化分析接口演示</div>
      <div class="en">SHEENCITY DIVA (Data Intelligent Visual API) DEMO</div>
    </div>
    <div class="info">
      <div class="exampleCode">
        <switcher class="switcher" v-model="exampleCode" label="显示示例代码"></switcher>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import switcher from "@/components/switcher.vue";
  import { ref, watch } from '@vue/runtime-core';

  export default{
    setup(props, context){
      let exampleCode = ref(false);
      watch(exampleCode,(newValue,oldValue)=>{
        context.emit('showCode', newValue);
      })
      return {
        exampleCode
      };
    },
    components:{
      switcher
    }
  }
</script>


<style lang="scss">
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 94px;
    box-sizing: border-box;
    margin: 50px 60px 0;

    .title {
      position: relative;
      z-index: 99;

      div {
        width: 912px;
        color: #ffffff;
        font-weight: bold;
        writing-mode: horizontal-tb;
        letter-spacing: 0px;
        text-overflow: ellipsis;
        white-space: nowrap;
        opacity: 1;
      }

      .cn {
        font-size: 48px;
        line-height: 58px;
        text-align: justify;
        text-align-last: justify;
      }

      .en {
        font-family: "Roboto";
        font-size: 26px;
        line-height: 34px;
      }
    }

    .info {
      position: relative;
      z-index: 99;
      display: flex;

      .exampleCode {
        height: 43px;
        line-height: 43px;

        // margin-right: 24px;
        .switcher {
          width: 117px;
          pointer-events: all;
        }
      }
    }
  }
</style>