<template>
  <div class="cus-main">
    <content-block caption="数字孪生电梯演示"></content-block>
    <div
      class="drop-block"
      v-for="(lift,i) in lifts"
      :key="lift.title"
    >
      <div class="drop-item">
        <span>{{ lift.title }}</span>
        <div>
          <drop-down
              :options="options"
              :initvalue="initvalue"
              @select="selectLift($event,i)"
              :disabled="false"
            ></drop-down>
          <span style="margin-left: 4px">层</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import contentBlock from "@/components/content-block.vue";
import dropDown from "@/components/dropdown.vue";
import { diva } from "@/global";
import { DataService } from "@/services/data.service";
import { onMounted, reactive } from "vue";
import { Elevator, ElevatorController, Model, Vector3 } from "@sheencity/diva-sdk";
import { DropdownData } from "@/models/dropdown-data.interface";

export default {
  setup() {
    const _diva = diva;
    let _data = new DataService();
    let lifts = reactive([
      {
        title: '一号梯',
      },
      {
        title: '二号梯',
      },
      {
        title: '三号梯',
      },
      {
        title: '四号梯',
      },
    ]);

    // 电梯模型
    let liftModels: Elevator[] = [];
    // 电梯控制器
    let controllers: ElevatorController[] = [];
    // 初始层数
    let currentLift = [1, 1, 1, 1];
    // 每层高度，由最高高度减最低高度除楼层获得
    let step = 299.7;
    // 电梯下拉框配置
    let options = [
      { value: '1', placeholder: '1' },
      { value: '2', placeholder: '2' },
      { value: '3', placeholder: '3' },
      { value: '4', placeholder: '4' },
      { value: '5', placeholder: '5' },
      { value: '6', placeholder: '6' },
      { value: '7', placeholder: '7' },
      { value: '8', placeholder: '8' },
      { value: '9', placeholder: '9' },
      { value: '10', placeholder: '10' },
      { value: '11', placeholder: '11' },
      { value: '12', placeholder: '12' },
    ];

     /**
     * 给初始化的电梯添加 selected 属性，以便于在 dropdown 循环中绑定
     * @param lift 电梯
     * @param i index
     * @returns 添加 selected 的电梯数组
     */
    const addSelected = (lift: { title: string }, i: number)=>{
      let selected = {
        value: currentLift[i].toString(),
        placeholder: currentLift[i].toString(),
      } as DropdownData;
      return { ...lift, selected };
    }

    /**
     * 选择电梯层数
     * @param $event (dropdownData) 下拉框选中的值
     * @param i (number) 被触发电梯的 index 值
     */
    const selectLift = async ($event, i)=>{
      const value = Number($event.value);
      console.log('controllers', controllers);
      controllers[i].land(`f${value}`);
      _data.changeCode(`elevatorController.land('f${value}')`);
    }


  

    onMounted(async () => {
      _diva.client.applyScene('电梯演示');
      _data.changeCode(`client.applyScene('电梯演示')`);
      lifts = lifts.map((lift, index) => addSelected(lift, index));
      for (let i = 0; i < 4; i++) {
        const [model] = await _diva.client.getEntitiesByName<Model>(
          lifts[i].title
        );
        const coord = await model.getCoordinate();
        const controller = new ElevatorController({
          // 初始化电梯控制器
          landings: {
            f1: new Vector3(coord.x, coord.y, 987),
            f2: new Vector3(coord.x, coord.y, 987 + step),
            f3: new Vector3(coord.x, coord.y, 987 + step * 2),
            f4: new Vector3(coord.x, coord.y, 987 + step * 3),
            f5: new Vector3(coord.x, coord.y, 987 + step * 4),
            f6: new Vector3(coord.x, coord.y, 987 + step * 5),
            f7: new Vector3(coord.x, coord.y, 987 + step * 6),
            f8: new Vector3(coord.x, coord.y, 987 + step * 7),
            f9: new Vector3(coord.x, coord.y, 987 + step * 8),
            f10: new Vector3(coord.x, coord.y, 987 + step * 9),
            f11: new Vector3(coord.x, coord.y, 987 + step * 10),
            f12: new Vector3(coord.x, coord.y, 987 + step * 11),
            f13: new Vector3(coord.x, coord.y, 987 + step * 12),
          },
          speed: 500,
        });
        const lift = new Elevator({ model, signal: controller.signal }); // 初始化电梯
        liftModels.push(lift);
        controllers.push(controller);
      }
    });



    return {
      options,
      lifts,
      selectLift,
      initvalue: { value: '1', placeholder: '1' },
    };
  },
  components: {
    contentBlock,
    dropDown,
  },
};
</script>

<style lang="scss">
@import "../common/styles/styles.scss";
.cus-main {
  pointer-events: all;
  color: #fff;
  .drop-block {
    width: 100%;
    padding: 18px 20px;
    margin-top: 8px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    cursor: pointer;
    position: relative;
    @include reverseCascade(1, 4);
    .drop-item {
      height: 24px;
      display: flex;
      justify-content: space-between;
      color: #fff;
      span {
        line-height: 24px;
        font-weight: bold;
      }
      app-dropdown {
        width: 57px;
      }
    }
  }
}
</style>