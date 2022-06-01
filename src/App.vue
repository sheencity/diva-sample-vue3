<template>
  <div class="win">
    <div ref="backendContainer" class="backend-container"></div>
    <main :class="{ includeCodeArea: exampleCode }">
      <header>
        <s-header @showCode="showCode"></s-header>
      </header>
      <article>
        <nav>
          <s-nav></s-nav>
        </nav>
        <div class="router">
          <div>
            <router-view></router-view>
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
import codeView from "@/components/code-view.vue";
import sHeader from "@/components/header.vue";
import sNav from "@/components/nav.vue";
import { diva } from "@/global";
import { Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { onMounted, onUnmounted, ref, Ref } from "vue";

export default {
  setup() {
    const backendContainer: Ref = ref(null);
    const changeResolution$ = new Subject<boolean>();
    let subscription: Subscription;
    let exampleCode = ref(false);
    onMounted(async () => {
      if (backendContainer) {
        //初始话 webRtc 链接
        await diva.init(backendContainer.value);
        //  设置服务后端分辨率
        _updateResolution();
        // 监听显示区域的改变
        const resizeObserver = new ResizeObserver(() => {
          changeResolution$.next(true);
        });
        resizeObserver.observe(backendContainer.value);
      }
      subscription = changeResolution$.pipe(debounceTime(200)).subscribe(_updateResolution);
    });

    const _updateResolution = () => {
      if (!diva.isEmbeddedMode()) {
        const width = backendContainer.value.clientWidth;
        const height = backendContainer.value.clientHeight;
        diva.client?.setResolution({ width, height });
      }
    };
    const showCode = (v) => {
      exampleCode.value = v;
    };
    //组件销毁
    onUnmounted(() => {
      subscription.unsubscribe();
    });
    return {
      backendContainer,
      exampleCode,
      showCode,
    };
  },
  components: {
    sHeader,
    sNav,
    codeView,
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

    background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%) top/100% 170px no-repeat, linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%) left/300px 100% no-repeat, linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%) right/420px 100% no-repeat;

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
