<template>
  <div class="win">
    <div ref="backendContainer" class="backend-container"></div>
    <main>
      <header>
        <s-header></s-header>
      </header>
      <article>
        <nav>
          <s-nav></s-nav>
        </nav>
        <div class="content">
          <div>
            <router-view />
          </div>
        </div>
        <!-- <div class="codeView"></div> -->
      </article>
    </main>
  </div>
</template>
<script lang="ts">
  import sHeader from "@/components/header.vue";
  import sNav from "@/components/nav.vue";
  import {
    provide,
    ref,
    onMounted,
    Ref,
    onUnmounted
  } from "vue";
  import {
    Subject,
    Subscription
  } from "rxjs";
  import {
    debounceTime
  } from "rxjs/operators";
  import {
    diva
  } from "@/global";
  export default {
    setup() {
      const backendContainer: Ref = ref(null);
      //创建divaservice实例
      // const _divaSer = reactive(new DivaService);
      // const store = useStore()
      // const _divaSer = store.state._diva;
      const _divaSer = diva;
      console.log(_divaSer);
      const _changeResolution$ = new Subject < boolean > ();
      let _subs: Subscription;
      onMounted(async () => {
        if (backendContainer) {
          //初始话 webRtc 链接
          await _divaSer.init(backendContainer.value);
          //  设置服务后端分辨率
          _updateResolution();
          // 监听显示区域的改变
          const resizeObserver = new(window as any).ResizeObserver(() => {
            _changeResolution$.next(true);
          });
          resizeObserver.observe(backendContainer.value);
        }
        _subs = _changeResolution$
          .pipe(debounceTime(200))
          .subscribe(_updateResolution);
      });

      const _updateResolution = () => {
        const width = backendContainer.value.clientWidth;
        const height = backendContainer.value.clientHeight;
        _divaSer.client ?.setResolution({
          width,
          height,
        });
      };
      //组件销毁
      onUnmounted(() => {
        _subs.unsubscribe();
      });
      provide("_diva", _divaSer);
      return {
        backendContainer,
      };
    },
    components: {
      sHeader,
      sNav,
    },
  };
</script>
<style lang="scss" scoped>
  .win {
    width: 100%;
    height: 100%;
    main {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      /* background: url('../assets/bg.png') no-repeat;
     background-size: 100% 100%; */
      background: linear-gradient(0deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.4) 100%) top/auto 170px no-repeat,
        linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%) left/300px 100% no-repeat,
        linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%) right/420px 100% no-repeat;

      header {
        width: 100%;
      }

      article {
        position: absolute;
        top: 170px;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-between;

        nav {
          margin-left: 60px;
        }

        .content {
          margin-right: 60px;
        }

        .codeView {
          position: absolute;
          left: 60px;
          top: 763px;
          width: 1087px;
          height: 92px;
          box-sizing: border-box;
          padding: 20px;
          padding-right: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
        }
      }
    }
  }

  /* TODO: 设置分辨率时会产生白边  */
  .backend-container {
    position: fixed;
    top: -1px;
    left: -1px;
    bottom: -1px;
    right: -1px;
  }
</style>