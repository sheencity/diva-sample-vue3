<template>
  <p class="code">{{code}}</p>
</template>

<script lang="ts">
  import {
    data
  } from "@/global";
import { onMounted, ref } from 'vue';
  export default {

    setup(){
      let code = ref('');

      onMounted(()=>{
        data.code.subscribe((res)=>{
          code.value = res;
        });
      });
      return {
        code
      }
    }

  }
</script>

<style lang="scss" scoped>
 .code {
    height: 100%;
    margin: 0;
    margin-right: 6px;
    padding: 0;
    word-wrap: break-word;
    font-family: Roboto;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    color: #fff;
    overflow: auto;
    text-align: justify;
    white-space: pre-wrap;
    pointer-events: all;
}
::-webkit-scrollbar {
    background-color: transparent;
    width: 14px;
}
::-webkit-scrollbar-button {
    display: none;
}
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, .3);
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 7px;
}
 
</style>