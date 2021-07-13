<template>
  <div class="monitor-main">
    <content-block caption="监控视频演示"></content-block>
    <div v-for="monitor in monitors" :key="monitor.title">
      <div class="drop-block">
        <div class="content-block" @click="selectMonitor(monitor.title)">
          <div class="content-item">
            <span>{{monitor.title}}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <content-block caption="设备弹窗演示"></content-block>
      <div v-for="monitorEqui in monitorEquis" :key="monitorEqui.title">
        <div class="refresh-block" @click="selectMonitor(monitorEqui.title)">
          <div class="refresh-item">
            <span>{{monitorEqui.title}}</span>
            <div class="refresh-icon" @click="refresh(monitorEqui)">
              <img src="../assets/icon/monitor/refresh.png" />
            </div>
          </div>
          <input @click="stopPropagation($event)" @keydown="stopPropagation($event)" v-model="monitorEqui.url" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import contentBlock from '@/components/content-block.vue'
  import dropDown from '@/components/dropdown.vue'
  import switcher from '@/components/switcher.vue'
  import {
    diva
  } from '@/global'
  import {
    DataService
  } from '@/services/data.service';
  import {
    onMounted,
    onUnmounted,
  } from 'vue'
  import {
    Model,
    RenderingStyleMode
  } from '@sheencity/diva-sdk';


  export default {

    setup() {
      const _diva = diva;
      let _data = new DataService;
      let monitors = [{
          title: '测试设备01',
          url: 'rtmp://xxxxxxxxxxxxxxxxxx',
        },
        {
          title: '测试设备02',
          url: 'rtmp://xxxxxxxxxxxxxxxxxx',
        },
        {
          title: '测试设备03',
          url: 'https://www.sheencity.com',
        },
        {
          title: '测试设备04',
          url: 'https://www.sheencity.com',
        }
      ];
      // 监控设备
      monitors = monitors.slice(0, 2);
      // 弹窗设备
      let monitorEquis = [{
          title: '测试设备03',
          url: 'https://www.sheencity.com',
        },
        {
          title: '测试设备04',
          url: 'https://www.sheencity.com',
        }
      ];
      // 存放各个设备对应的 model 对象
      let models: Map < string, Model > ;
      // 事件句柄列表
      let monitorHandlers: Array < () => any > ;

      const removeWidget = async (name: string) => {
        await (await getModelByName(name)).setWebWidget(null);
      }
      const setWidget = async (monitor: string | Model, url: string) => {
        if (typeof monitor === 'string') {
          monitor = await getModelByName(monitor);
        }
        if (!url) return;
        await monitor.setWebWidget(new URL(url), 500, 280);
        _data.changeCode(`model.setWebWidget(new URL('${url}'), 500, 280)`);
      }
      const refresh = async (monitorEqui: {
        title: string;url: string
      }) => {
        try {
          await removeWidget(monitorEqui.title);
        } catch (e) {
          console.log('当前模型无可清除的 web 组件');
        }
        await setWidget(monitorEqui.title, monitorEqui.url);
      }

      const selectMonitor = async (name: string) => {
        await (await getModelByName(name)).focus(1000, -Math.PI / 6);
        _data.changeCode(`model.focus(1000, -Math.PI / 6)`);
      }

      const getModelByName = async (name: string) => {
        let m = models.get(name);
        if (!m) {
          m = (await _diva.client.getEntitiesByName < Model > (name))[0];
          models.set(name, m);
        }
        return m;
      }

      const stopPropagation = ($event) => {
        $event.stopPropagation();
      }

      onMounted(async () => {
        _diva.client.applyScene('监控设备').then(() => {
          _data.changeCode(`client.applyScene('监控设备')`);
        });
        models = new Map();
        monitorHandlers = [];
        for (let i = 0; i < 4; i++) {
          const model = await getModelByName(monitors[i].title);
          const handle = function () {
            const url = monitors.find((m) => m.title === this.name).url;
            setWidget(this as Model, url);
          };
          model.setRenderingStyleMode(RenderingStyleMode.Default);
          model.addEventListener('click', handle);
          monitorHandlers.push(handle);
        }
      });

      onUnmounted(() => {
        monitors.forEach(async (m, i) => {
          const model = await getModelByName(m.title);
          model.removeEventListener('click', monitorHandlers[i]);
        });
      })

      return {
        monitors,
        monitorEquis,
        refresh,
        selectMonitor,
        stopPropagation,
      }
    },
    components: {
      contentBlock,
      dropDown,
      switcher
    }
  }
</script>

<style lang="scss">
  @import '../common/styles/styles.scss';

  .monitor-main {
    pointer-events: all;

    .content-block {
      width: 240px;
      padding: 20px;
      margin-top: 8px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      cursor: pointer;

      .content-item {
        width: 100%;

        span {
          color: #fff;
          font-weight: bold;
        }
      }
    }

    .refresh-block {
      width: 240px;
      padding: 20px;
      margin-top: 8px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      cursor: pointer;

      .refresh-item {
        width: 100%;
        display: flex;
        justify-content: space-between;

        span {
          color: #fff;
          font-weight: bold;
        }

        .refresh-icon {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }

      input {
        margin-top: 6px;
        width: 100%;
        height: 24px;
        padding: 3px 6px;
        box-sizing: border-box;
        font-size: 12px;
        line-height: 18px;
        border: none;
        border-radius: 2px;
        outline: none;
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>