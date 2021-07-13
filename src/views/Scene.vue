<template>
  <div class="scene-main">
    <content-block caption="场景切换"></content-block>
    <div v-for="scene in scenes" :key="scene.index">
      <div class="content" @click="switchScene(scene)">
        <div class="title">{{scene.title}}</div>
        <div class="icon">
          <img src="../assets/icon/scene/scene.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import contentBlock from "@/components/content-block.vue";
  import {
    onMounted
  } from "vue";
  import {
    DataService
  } from "@/services/data.service";
  // import { useStore } from "vuex";
  import {
    diva
  } from "@/global";

  export default {
    setup() {
      // const store = useStore()
      // const _diva: DivaService = store.state._diva;
      const _diva = diva;
      let _data = new DataService();
      onMounted(async () => {
        console.log(_diva.client);
        _diva.client ?.applyScene("半鸟瞰").then(() => {
          _data.changeCode(`client.applyScene('半鸟瞰')`);
        });
      });

      const switchScene = (scene: {
        title: string;index: number
      }) => {
        console.log(scene.index);
        console.log(_diva);
        _diva.client ?.applyScene(scene.index).then(() => {
          _data.changeCode(`client.applyScene('${scene.title}')`);
        });
      };

      return {
        //各种场景
        scenes: [{
            title: "测试场景01",
            index: 0,
          },
          {
            title: "测试场景02",
            index: 1,
          },
          {
            title: "测试场景03",
            index: 2,
          },
          {
            title: "测试场景04",
            index: 3,
          },
          {
            title: "测试场景05",
            index: 4,
          },
          {
            title: "测试场景06",
            index: 5,
          },
          {
            title: "测试场景07",
            index: 6,
          },
          {
            title: "测试场景08",
            index: 7,
          },
          {
            title: "测试场景09",
            index: 8,
          },
          {
            title: "测试场景10",
            index: 9,
          },
        ],
        switchScene,
      };
    },
    components: {
      contentBlock,
    },
  };
</script>

<style lang="scss">
  .scene-main {
    .content {
      width: 240px;
      height: 60px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      margin-top: 8px;
      cursor: pointer;
      pointer-events: all;

      .title {
        height: 20px;
        line-height: 20px;
        font-weight: bold;
        color: #fff;
      }

      .icon {
        width: 24px;
        height: 24px;
      }
    }

    .content:hover .title {
      color: #fff;
    }
  }
</style>