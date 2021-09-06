<template>
  <div class="win">
    <div ref="backendContainer" class="backend-container"></div>
    <main :class="{'includeCodeArea': exampleCode}">
      <header>
        <s-header @showCode="showCode"></s-header>
      </header>
      <article>
        <nav>
          <s-nav></s-nav>
        </nav>
        <div class="router">
          <div>
            <router-view v-if="isRouter"/>
          </div>
        </div>
         <div class="codeView" v-show="exampleCode">
          <codeView></codeView>
        </div>
      </article>
    </main>
  </div>
</template>
<script lang="ts">
  import sHeader from "@/components/header.vue";
  import sNav from "@/components/nav.vue";
  import codeView from "@/components/code-view.vue";
  import {
    provide,
    ref,
    onMounted,
    Ref
  } from "vue";
  import { diva } from "@/global";

  export default {
    setup() {
      const backendContainer: Ref = ref(null);
      const _divaSer = diva;
      const isRouter = ref(false);
      let exampleCode = ref(false);
      onMounted(async () => {
        if (backendContainer) {
          //初始话 webRtc 链接
          await _divaSer.init(backendContainer.value);
          isRouter.value = true;
        }
      });
      const showCode = (v)=>{
        exampleCode.value = v;
      }
      provide("_diva", _divaSer);
      return {
        backendContainer,
        isRouter,
        exampleCode,
        showCode
      };
    },
    components: {
      sHeader,
      sNav,
      codeView
    },
  };
</script>
<style lang="scss">
  .win {
    main {
      position: absolute;
      z-index: 2;
      width: 100%;
      min-height: 100%;
      pointer-events: none;

      background: linear-gradient(0deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.4) 100%) top/100% 170px no-repeat,
        linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%) left/300px 100% no-repeat,
        linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%) right/420px 100% no-repeat;

      header {
        width: 100%;
        padding-top: 4px;
      }

      article {
        margin-top: 22px;
        display: flex;
        justify-content: space-between;

        nav {
          margin-left: 60px;
        }

        .router {
          margin-right: 60px;
        }

        .codeView {
          position: absolute;
          left: 60px;
          top: 933px;
          width: 1087px;
          height: 92px;
          box-sizing: border-box;
          padding: 20px;
          padding-right: 0;
          background: rgba(126, 92, 92, 0.1);
          backdrop-filter: blur(8px);
        }
      }
    }
    main.includeCodeArea {
     min-height: 1025px;
    }
  }

  /* TODO: 设置分辨率时会产生白边  */
  .backend-container {
    position: fixed;
    top: -1px;
    left: -1px;
    bottom: -1px;
    right: -1px;
    z-index: 1;
  }
</style>