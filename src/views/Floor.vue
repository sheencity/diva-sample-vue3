<template>
  <div class="floor-main">
    <content-block caption="楼层展示"></content-block>
    <div class="switch-block">
      <div class="switch-item">
        <switcher :label="'炸开'" v-model="explode" @switch="explodef"></switcher>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <content-block caption="楼层展示"></content-block>
      <div class="switch-block">
        <div class="switch-item">
          <switcher v-model="gradation" :label="'分层聚焦'" @switch="gradationf"></switcher>
        </div>
      </div>
      <div class="drop-block" style="z-index: 100;">
        <div class="drop-item">
          <span>聚焦楼层</span>
          <div>
            <drop-down :options="options" :initvalue="inintval" @select="selectf" :disabled="!gradation"></drop-down>
            <span style="margin-left: 4px;">层</span>
          </div>
        </div>
      </div>
      <div class="switch-block">
        <div class="switch-item">
          <switcher v-model="pipe" :label="'显示管线'" @switch="pipef" :disabled="!gradation"></switcher>
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
    onMounted,
    onUnmounted,
    ref
  } from "vue";
  import {
    DropdownData
  } from "@/models/dropdown-data.interface";
  import {
    DataService
  } from "@/services/data.service";
  import {
    diva
  } from "@/global";
  import {
    Model,
    TypedGroup
  } from "@sheencity/diva-sdk";
  import {
    defer,
    from,
    Observable
  } from "rxjs";
  import {
    shareReplay
  } from "rxjs/operators";

  export default {
    setup() {
      const _diva = diva;
      let _data = new DataService();
      // 所有楼层模型
      let models: Model[] = [];
      // 所有管道模型
      let pipeModels: Model[] = [];
      // 层数
      let selectedFloor: DropdownData = {
        placeholder: "1",
        value: "一层-1_1",
      };
      // 显示管线
      let pipe = ref(false);
      let group$: Observable < TypedGroup < Model >> ;
      // 炸开
      let explode = ref(false);
      // 分层聚焦
      let gradation = ref(false);
      let options = ref([{
          placeholder: "1",
          value: "一层-1_1",
          pipeLineName: "一层管线"
        },
        {
          placeholder: "2",
          value: "二层(1)-1_1",
          pipeLineName: "二层管线"
        },
        {
          placeholder: "3",
          value: "三楼-1_5",
          pipeLineName: "三层管线"
        },
        {
          placeholder: "4",
          value: "标准层(1)-1_11",
          pipeLineName: "四层管线"
        },
        {
          placeholder: "5",
          value: "标准层(1)-1_12",
          pipeLineName: "五层管线"
        },
        {
          placeholder: "6",
          value: "标准层(1)-1_15",
          pipeLineName: "六层管线"
        },
        {
          placeholder: "7",
          value: "标准层(1)-1_16",
          pipeLineName: "七层管线"
        },
        {
          placeholder: "8",
          value: "标准层(1)-1_9",
          pipeLineName: "八层管线"
        },
        {
          placeholder: "9",
          value: "标准层(1)-1_10",
          pipeLineName: "九层管线"
        },
        {
          placeholder: "10",
          value: "标准层(1)-1_14",
          pipeLineName: "十层管线"
        },
        {
          placeholder: "11",
          value: "标准层(1)-1_17",
          pipeLineName: "十一层管线",
        },
        {
          placeholder: "12",
          value: "标准层(1)-1_13",
          pipeLineName: "十二层管线",
        },
        {
          placeholder: "13",
          value: "顶楼_12",
          pipeLineName: "顶层管线"
        },
      ]);

      let inintval = {
        placeholder: "1",
        value: "一层-1_1",
        pipeLineName: "一层管线",
      };

      
      const setexplode = (val: boolean) => {
        if (!group$) return;
        group$.subscribe((group) => {
          const options = {
            spacing: 300,
            eachHeight: 290,
            duration: 5
          };

          if (val) group.disassemble(options);
          else group.assemble();

          explode.value = val;
          _data.changeCode(
            `const group = client.getEntityGroupByGroupPath('场景模型/主楼拆分');`,
            val ?
            "client.disassemble(group, { spacing: 300, eachHeight: 290, duration: 5 })" :
            "client.assemble(group)"
          );
        });
      };
      
      const setgradation = (v: boolean) => {
        if (v) {
          // 聚焦到已选中的层数
          focusFloor(Number(selectedFloor.placeholder));
          setpipe(false);
        } else {
          setVisibility(models, true, true);
          setVisibility(pipeModels, false, true);
        }
        gradation.value = v;
      };

      const setselectedFloor = (v: DropdownData) => {
        if (!gradation.value) {
          return;
        }
        if (gradation.value) {
          // 聚焦到已选中的层数
          focusFloor(Number(v.placeholder));
        }
        // 此处设置层数
        selectedFloor = v;
      };
      
      const setpipe = (v: boolean) => {
        if (!gradation.value) {
          return;
        }
        // 此处设置显示管线
        pipe.value = v;
        const currentPipe = pipeModels.filter(
          (pipeModel) =>
          pipeModel.name ===
          options.value[Number(selectedFloor.placeholder) - 1].pipeLineName
        );
        if (gradation.value && v) {
          setVisibility(currentPipe, true);
        } else {
          setVisibility(currentPipe, false);
        }
      };
   
     

      /**
       * 聚焦层数
       * @param floor (number) 层数
       */
      const focusFloor = async (floor: number) => {
        // 显示当前层数模型
        const modelToFocus = models.filter(
          (model) => model.name === options.value[floor - 1].value
        );
        // 隐藏其他层数模型
        const modelToHide = models.filter(
          (model) => model.name !== options.value[floor - 1].value
        );
        // 显示当前层数管道
        const pipeToShow = pipeModels.filter(
          (pipeModel) => pipeModel.name === options.value[floor - 1].pipeLineName
        );
        // 隐藏其他层数的管道
        const pipeToHide = pipeModels.filter(
          (pipeModel) => pipeModel.name !== options.value[floor - 1].pipeLineName
        );

        // 聚焦当前楼层
        await focus(modelToFocus[0]);
        await setVisibility(modelToFocus, true);
        await setVisibility(modelToHide, false);
        await setVisibility(pipeToHide, false);
        await setVisibility(pipeToShow, pipe.value ? true : false);
        _data.changeCode(
          `client.setVisibility(${[
          ...modelToFocus.map((model) => `'${model.id}'`),
        ]}, true)`
        );
      };

      // 聚焦方法
      const focus = async (model: Model) => {
        await model.focus(5000, -Math.PI / 6);
        _data.changeCode(`model.focus(5000, -Math.PI / 6)`);
      };
      // 显示隐藏方法
      const setVisibility = (
        models: Model[],
        visible: boolean,
        leave = false
      ) => {
        models.map((model) => model.setVisibility(visible));
        if (!leave) {
          _data.changeCode(
            `client.setVisibility(${[
            ...models.map((model) => `'${model.id}'`),
          ]}, ${visible})`
          );
        }
      };
      // 获取模型方法
      const getModel = async (name: string) => {
        const [model] = await _diva.client.getEntitiesByName < Model > (name);
        return model;
      };
      // 设置路径显示隐藏
      const SetPathVisibility = (v: boolean) => {
        const pathIndexArray = [0, 1, 2, 3, 4];
        pathIndexArray.forEach((i) => {
          _diva.client.setPathVisibility(i, v);
        });
      };

      onMounted(async () => {
        await _diva.client ?.applyScene("楼层展示");
        _data.changeCode(`client.applyScene('楼层展示')`);
        options.value.forEach(async (option) => {
          const model = await getModel(option.value);
          const pipeModel = await getModel(option.pipeLineName);
          // 获取所有楼层模型以及管道模型
          models.push(model);
          pipeModels.push(pipeModel);
        });
        SetPathVisibility(false);
        const getGroup = () =>
          from(_diva.client.getModelGroupByGroupPath("场景模型/主楼拆分"));
        group$ = defer(getGroup).pipe(shareReplay(1));
      });

      onUnmounted(async () => {
        if (group$) {
          group$.subscribe((group) => group.assemble());
        }
        // 显示所有楼层，隐藏所有管道，并且不显示示例代码
        setVisibility(models, true, true);
        setVisibility(pipeModels, false, true);
        SetPathVisibility(true);
      });

      const explodef = (val) => {
        setexplode(val);
      };
      const gradationf = (val) => {
        setgradation(val);
      };
      const pipef = (val) => {
        setpipe(val);
      };

      const selectf = (val) => {
        setselectedFloor(val);
      };

      // watch(()=>explode.value,(oldexplode,newexplode)=>{
      //   setexplode(newexplode);
      // })
      return {
        explodef,
        gradationf,
        pipef,
        gradation,
        options,
        selectf,
        inintval,
      };
    },
    components: {
      contentBlock,
      switcher,
      dropDown,
    },
  };
</script>

<style lang="scss">
  .floor-main {
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

    .drop-block {
      width: 100%;
      padding: 18px 20px;
      margin-top: 8px;
      box-sizing: border-box;
      position: relative;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);

      .drop-item {
        height: 24px;
        display: flex;
        justify-content: space-between;

        span {
          line-height: 24px;
          font-weight: bold;
          color: #fff;
        }

        app-dropdown {
          width: 57px;
        }
      }
    }
  }
</style>