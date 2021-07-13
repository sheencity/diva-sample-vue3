<template>
  <div class="lamp-main">
    <content-block caption="灯光控制"></content-block>
    <div v-for="(lightDec,i) in lightDecs" :key="lightDec.title" @click="onClick(i)">
      <div class="switch-block">
        <div class="switch-item">
          <switcher v-model="lightDec.state" :label="lightDec.title"
            @switch="onSwitch($event, i)"></switcher>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import contentBlock from "@/components/content-block.vue";
  import dropDown from "@/components/dropdown.vue";
  import switcher from "@/components/switcher.vue";
  import {
    diva
  } from "@/global";
  import {
    DataService
  } from "@/services/data.service";
  import {
    onMounted
  } from "vue";
  import {
    Device,
    DeviceController
  } from "@sheencity/diva-sdk";

  export default {
    setup() {
      const _diva = diva;
      let _data = new DataService();

      let lightDecs = [{
          title: "测试灯光01",
          state: true,
        },
        {
          title: "测试灯光02",
          state: true,
        },
        {
          title: "测试灯光03",
          state: true,
        },
        {
          title: "测试灯光04",
          state: true,
        },
      ];
      // 灯光设备
      let lights: Device[] = [];
      // 灯光控制器
      let lightControllers: DeviceController[] = [];

      /**
       * 灯光的开关
       * @param $event (boolean) switch 的值
       * @param index 控制灯光的 index 值
       * @returns void
       */

      const onSwitch = ($event: boolean, index: number) => {
        if (lightControllers.length === 0) return;
        $event
          ?
          lightControllers[index].turnOn() :
          lightControllers[index].turnOff();
        _data.changeCode(`device.${$event ? "turnOn()" : "turnOff()"}`);
        console.log($event, index);
      };

      /**
       * 设备聚焦
       * @param index 选中设备的 index 值
       * @returns
       */
      const onClick = async (index: number) => {
        console.log(index)
        if (!lights[index]) return;
        await lights[index].focus(1000, -Math.PI / 6);
        _data.changeCode(`device.focus(1000, -Math.PI / 6)`);
      };

      onMounted(async () => {
        _diva.client.applyScene("灯光控制");
        // 初始化设备的初始状态
        lightDecs.forEach((lightDec) => (lightDec.state = true));
        lightDecs.forEach(async (lightDec) => {
          const lightController = new DeviceController();
          const [light] = await _diva.client.getEntitiesByName < Device > (
            lightDec.title
          );
          light.bind(lightController.signal); // 绑定控制器
          lightController.turnOff();
          lights.push(light);
          lightControllers.push(lightController);
        });
        setTimeout(() => {
          _data.changeCode(`client.applyScene('灯光控制')`);
        }, 0);
      });

      return {
        lightDecs,
        onClick,
        onSwitch,
      };
    },
    components: {
      contentBlock,
      dropDown,
      switcher,
    },
  };
</script>

<style lang="scss">
  .lamp-main {
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