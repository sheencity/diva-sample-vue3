<template>
  <div class="air-main">
    <content-block caption="空调控制"></content-block>
    <div v-for="(airDec,i) in airDecs" :key="airDec.title">
      <div class="switch-block" @click="onClick(i)">
        <div class="switch-item">
          <switcher v-model="airDec.state" :label="airDec.title" @switch="onSwitch($event, i)"></switcher>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import contentBlock from "@/components/content-block.vue";
  import switcher from "@/components/switcher.vue";
  import {
    diva,data
  } from "@/global";
  import {
    onMounted,
    onUnmounted,
    reactive
  } from "vue";
  import {
    Device,
    DeviceController
  } from "@sheencity/diva-sdk";

  export default {
    airDecs: [],
    setup() {

      // 自动的空调设备
      let airDecs: {
        title: string;state: boolean
      } [] = reactive([{
          title: '测试空调01',
          state: false,
        },
        {
          title: '测试空调02',
          state: false,
        },
        {
          title: '测试空调03',
          state: false,
        },
        {
          title: '测试空调04',
          state: false,
        },
      ]);
      // 空调设备
      let airs: Device[] = [];
      // 空调控制器
      let airControllers: DeviceController[] = [];



      onMounted(async () => {
        diva.client.applyScene('空调控制');
        // 初始化设备的初始状态
        airDecs.forEach((airDec) => (airDec.state = false));
        airDecs.forEach(async (airDec) => {
          const airController = new DeviceController();
          const [air] = await diva.client.getEntitiesByName < Device > (airDec.title);
          air.bind(airController.signal); // 绑定控制器
          airController.turnOff();
          airs.push(air);
          airControllers.push(airController);
        })
        setTimeout(() => {
          data.changeCode(`client.applyScene('空调控制')`)
        }, 0);
      });

      /**
       * 空调的开关
       * @param $event (boolean) switch 的值
       * @param index 控制空调的 index 值
       * @returns void
       */
      const onSwitch = ($event: boolean, index: number) => {
        if (airControllers.length === 0) return;
        $event ? airControllers[index].turnOn() : airControllers[index].turnOff();
        data.changeCode(`device.${$event ? 'turnOn()' : 'turnOff()'}`);
        console.log($event, index);
      }

      /**
       * 设备聚焦
       * @param index 选中设备的 index 值
       * @returns
       */
      const onClick = async (index: number) => {
        if (!airs[index]) return;
        await airs[index].focus(1000, -Math.PI / 6);
        data.changeCode(`device.focus(1000, -Math.PI / 6)`);
      }

      onUnmounted(() => {
        airControllers.forEach((airController) => airController.turnOff());
      })
      return {
        airDecs,
        onClick,
        onSwitch,
      };
    },
    components: {
      contentBlock,
      switcher,
    },
  };
</script>

<style lang="scss">
  .air-main {
    pointer-events: all;

    .switch-block {
      width: 240px;
      padding: 20px;
      margin-top: 8px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);

      .switch-item {
        width: 100%;

        app-switcher {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>