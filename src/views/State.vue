<template>
  <div class="state-main">
    <content-block caption="设备状态"></content-block>
    <div class="drop-block" v-for="(equipment,i) in equipments" :key="equipment.title">
      <div class="drop-item" :class="{'selected':selected === i}">
        <span>{{equipment.title}}</span>
        <div class="drop-down">
          <drop-down :options="options" :initvalue="inintval" @select="onChange(equipment, $event)" :disabled="false">
          </drop-down>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import contentBlock from "@/components/content-block.vue";
  import dropDown from "@/components/dropdown.vue";
  import {
    diva,data
  } from "@/global";

  import {
    onMounted,
    onUnmounted,
    ref
  } from "vue";
  import {
    Model,
    RenderingStyleMode
  } from "@sheencity/diva-sdk";
  import {
    DropdownData
  } from "@/models/dropdown-data.interface";

  export default {
    setup() {
      let equipments = [{
          title: "空调",
          state: RenderingStyleMode.Default,
        },
        {
          title: "电视机",
          state: RenderingStyleMode.Default,
        },
        {
          title: "路由器",
          state: RenderingStyleMode.Default,
        },
        {
          title: "冰箱",
          state: RenderingStyleMode.Default,
        },
      ];

      let selected = ref(Number);
      const addSelected = (equipment: {
        title: string;
        state: RenderingStyleMode;
      }) => {
        let selected: DropdownData < RenderingStyleMode > ;
        switch (equipment.state) {
          case RenderingStyleMode.Default:
            selected = {
              value: RenderingStyleMode.Default,
              placeholder: "默认"
            };
            break;
          case RenderingStyleMode.Alarm:
            selected = {
              value: RenderingStyleMode.Alarm,
              placeholder: "报警"
            };
            break;
          case RenderingStyleMode.Translucence:
            selected = {
              value: RenderingStyleMode.Translucence,
              placeholder: "半透",
            };
            break;
          case RenderingStyleMode.Hidden:
            selected = {
              value: RenderingStyleMode.Hidden,
              placeholder: "隐藏"
            };
            break;
          default:
            selected = {
              value: RenderingStyleMode.Default,
              placeholder: "默认"
            };
            break;
        }
        return {
          ...equipment,
          selected
        };
      };
      equipments = equipments.map((equipment) => addSelected(equipment));
      let options = [{
          value: RenderingStyleMode.Default,
          placeholder: "默认"
        },
        {
          value: RenderingStyleMode.Alarm,
          placeholder: "报警"
        },
        {
          value: RenderingStyleMode.Translucence,
          placeholder: "半透"
        },
        {
          value: RenderingStyleMode.Hidden,
          placeholder: "隐藏"
        },
      ] as DropdownData < RenderingStyleMode > [];

      const onChange = async (
        equi: {
          title: string;state: RenderingStyleMode
        },
        $event: DropdownData
      ) => {
        const [model] = await diva.client.getEntitiesByName < Model > (equi.title);
        if (!model) return;
        const type = $event.value as RenderingStyleMode;
        model.setRenderingStyleMode(type);

        data.changeCode(
          `model.setRenderingStyleMode(RenderingStyleMode.${
          type.slice(0, 1).toUpperCase() + type.slice(1)
        })`
        );
      };

      onMounted(async () => {
        diva.client ?.applyScene("状态演示").then(() => {
          data.changeCode(`client.applyScene('状态演示')`);
        });
      });

      onUnmounted(() => {
        equipments.forEach(async (equi) => {
          const [model] = await diva.client.getEntitiesByName < Model > (equi.title);
          model.setRenderingStyleMode(RenderingStyleMode.Default);
        });
      });

      return {
        equipments,
        options,
        selected,
        onChange,
        inintval: {
          value: RenderingStyleMode.Default,
          placeholder: "默认"
        },
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

  .state-main {
    pointer-events: all;

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

        .drop-down {
          width: 57px;
        }
      }

      .selected {
        color: #fff;
      }
    }
  }
</style>