<template>
  <div class="overlay-main">
    <content-block caption="创建覆盖物"></content-block>
    <div class="overlay-block">
      <div class="drop-item">
        <span>种类</span>
        <div>
          <drop-down v-model="selectedType" :options="typeOptions" :disabled="false" />
        </div>
      </div>
      <div class="btn-item">
        <span>坐标拾取</span>
        <button @click.stop="pickup" @mouseup.stop>拾取</button>
      </div>
      <div class="input-item">
        <span>坐标</span>
        <div class="coordinate-items">
          <div class="coordinate-item">
            <span>X</span><input @keydown="onKeyDown($event)" v-model="corrdinateX" type="number" />
          </div>
          <div class="coordinate-item">
            <span>Y</span><input @keydown="onKeyDown($event)" v-model="corrdinateY" type="number" />
          </div>
          <div class="coordinate-item">
            <span>Z</span><input @keydown="onKeyDown($event)" v-model="corrdinateZ" type="number" />
          </div>
        </div>
      </div>
      <div class="input-item" v-if="selectedType.value === 'Marker'">
        <span>标题</span>
        <input @keydown="onKeyDown($event)" type="text" v-model="title" placeholder="请输入文字" />
      </div>
      <div class="input-item" :style="{height: (selectedType.value === 'poi' ? '24px' : '48px')}"
        v-if="selectedType.value !== 'emissiveOverlay'">
        <span>内容</span>
        <textarea cols="4" @keydown="onKeyDown($event)" v-model="content" placeholder="请输入文字"></textarea>
      </div>
      <div class="drop-item" style="margin-top: 12px;" v-if="selectedType.value === 'Marker'">
        <span>对齐方式</span>
        <div>
          <drop-down v-model="selectedAlign" :options="alignOptions" :disabled="false" />
        </div>
      </div>
      <div class="drop-item" style="margin-top: 12px;" v-if="selectedType.value === 'emissiveOverlay'">
        <span>类型</span>
        <div>
          <drop-down v-model="selectedEmissive" :options="emissiveOptions" :disabled="false" />
        </div>
      </div>
      <div class="drop-item" style="margin-top: 12px;" v-if="selectedType.value === 'poi'">
        <span>类型</span>
        <div>
          <drop-down v-model="selectedIconType" :options="iconTypeOptions" :disabled="false" />
        </div>
      </div>
      <div class="drop-item" style="margin-top: 12px;" v-if="selectedType.value === 'poi'">
        <span>图标</span>
        <div>
          <drop-down v-model="selectedIcon" :options="iconOptions" :disabled="false" />
        </div>
      </div>
      <div class="input-item">
        <span>颜色</span>
        <input v-model="color" type="color" />
      </div>
      <div class="input-item" v-if="selectedType.value === 'emissiveOverlay'">
        <span>旋转</span>
        <div class="coordinate-items">
          <div class="coordinate-item">
            <span>X</span><input @keydown="onKeyDown($event)" v-model="rotationX" type="number" />
          </div>
          <div class="coordinate-item">
            <span>Y</span><input @keydown="onKeyDown($event)" v-model="rotationY" type="number" />
          </div>
          <div class="coordinate-item">
            <span>Z</span><input @keydown="onKeyDown($event)" v-model="rotationZ" type="number" />
          </div>
        </div>
      </div>
      <div class="input-item">
        <span>缩放</span>
        <input-number :min="0" :max="100" v-model="scale"></input-number>
      </div>
      <div class="input-item" v-if="selectedType.value !== 'emissiveOverlay'">
        <span>不透明度</span>
        <input-number :min="0" :max="100" v-model="opacity"></input-number>
      </div>
      <div class="input-item" v-if="selectedType.value === 'Marker'">
        <span>边框大小</span>
        <input-number :min="0" :max="1" v-model="border"></input-number>
      </div>
      <div class="input-item" v-if="selectedType.value === 'Marker'">
        <span>边框颜色</span>
        <input v-model="borderColor" type="color" />
      </div>
      <div class="input-item" v-if="selectedType.value === 'emissiveOverlay'">
        <span>自发光强度</span>
        <input-number :min="0" v-model="emission"></input-number>
      </div>
      <div class="input-item" v-if="selectedType.value === 'emissiveOverlay'">
        <span>速度</span>
        <input-number :min="0" v-model="speed"></input-number>
      </div>
      <div class="btn-item">
        <span></span>
        <button @click="create()">创建</button>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <content-block caption="覆盖物列表"></content-block>

      <div class="scroll">
        <div v-for="overlay in overlays" :key="overlay.id" class="overlay-list" @click="selectOverlay(overlay)">
          <div class="overlay-item" :class="{'selected': selectedId === overlay.id}">
            <span>{{overlay.type === 'poi' ? overlay.content : overlay.type === 'Marker' ? overlay.title : overlay.icon}}</span>
            <div class="overlay-info">
              <span>{{overlay.type === 'poi' ? 'POI' : overlay.type === 'Marker' ? 'Marker' : 'Emissive'}}</span>
              <div class="overlay-delete" @click="del($event, overlay)">
                <img src="../assets/icon/overlay/delete.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import contentBlock from "@/components/content-block.vue";
  import dropDown from "@/components/dropdown.vue";
  import inputNumber from "@/components/input-number.vue";
  import { diva, data } from "@/global";
  import { LocalStorageService } from "@/services/localStorage.service";
  import {
    onMounted,
    reactive,
    Ref,
    ref
  } from "vue";
  import {
    DivaMouseEvent,
    Emissive,
    Marker,
    Model,
    POI,
    POIIcon
  } from "@sheencity/diva-sdk";
  import {
    Quaternion,
    Vector3,
    Euler, 
    deg2rad
  } from "@sheencity/diva-sdk-math";
  import {
    EmissionType,
    EmissiveOverlay,
    MarkerOverlay,
    OverlayType,
    POIIconType,
    POIOverlay,
  } from '@/models/overlay.model';
  import { DropdownData } from '@/models/dropdown-data.interface';

  export default {
    setup() {
      let store = new LocalStorageService();
      let typeOptions = [{
          value: OverlayType.POI,
          placeholder: 'POI'
        },
        {
          value: OverlayType.Marker,
          placeholder: 'Marker'
        },
        {
          value: OverlayType.Emissive,
          placeholder: 'Emissive'
        },
      ];
      let alignOptions = [{
          value: 'center',
          placeholder: '居中'
        },
        {
          value: 'left',
          placeholder: '左对齐'
        },
        {
          value: 'right',
          placeholder: '右对齐'
        },
      ];
      let iconOptions = [{
          value: POIIcon.Camera,
          placeholder: '摄像头'
        },
        {
          value: POIIcon.Location,
          placeholder: '定位'
        },
        {
          value: POIIcon.TrafficLight,
          placeholder: '红绿灯'
        },
        {
          value: POIIcon.TrashCan,
          placeholder: '垃圾桶'
        },
        {
          value: POIIcon.StreetLamp,
          placeholder: '路灯'
        },
        {
          value: POIIcon.BusStation,
          placeholder: '公交站'
        },
        {
          value: POIIcon.Exit,
          placeholder: '出口'
        },
        {
          value: POIIcon.Restaurant,
          placeholder: '餐饮'
        },
        {
          value: POIIcon.Parking,
          placeholder: '停车场'
        },
        {
          value: POIIcon.Dock,
          placeholder: '码头'
        },
        {
          value: POIIcon.Subway,
          placeholder: '地铁'
        },
        {
          value: POIIcon.Supermarket,
          placeholder: '超市'
        },
        {
          value: POIIcon.Mall,
          placeholder: '商场'
        },
        {
          value: POIIcon.Toilet,
          placeholder: '卫生间'
        },
      ];
      let iconTypeOptions = [{
          value: POIIconType.type1,
          placeholder: 'POI文字标签'
        },
        {
          value: POIIconType.type2,
          placeholder: 'POI圆形标签'
        },
        {
          value: POIIconType.type3,
          placeholder: 'POI水滴'
        },
      ];
      let emissiveOptions = [{
          value: EmissionType.type1,
          placeholder: '悬浮标记01'
        },
        {
          value: EmissionType.type2,
          placeholder: '圆形区域轮廓02'
        },
        {
          value: EmissionType.type3,
          placeholder: '雷达标记'
        },
        {
          value: EmissionType.type4,
          placeholder: '地面标记01'
        },
        {
          value: EmissionType.type5,
          placeholder: '圆形区域轮廓01'
        },
        {
          value: EmissionType.type6,
          placeholder: '事故标记'
        },
        {
          value: EmissionType.type7,
          placeholder: '悬浮标记02'
        },
        {
          value: EmissionType.type8,
          placeholder: '圆形区域轮廓03'
        },
      ];
      let overlays: (POIOverlay | MarkerOverlay | EmissiveOverlay)[] = reactive([]);
      let selectedType = ref({
        value: OverlayType.POI,
        placeholder: 'POI',
      });
      let selectedIcon: Ref<DropdownData> = ref({
        value: POIIcon.Camera,
        placeholder: '摄像头',
      });
      let selectedIconType: Ref<DropdownData> = ref({
        value: POIIconType.type1,
        placeholder: 'POI文字标签',
      });
      let selectedEmissive: Ref<DropdownData<EmissionType>> = ref({
        value: EmissionType.type1,
        placeholder: '悬浮标记01',
      });
      let selectedAlign = ref({
        value: 'center',
        placeholder: '居中',
      } as { value: 'left' | 'right' | 'center'; placeholder: string });

      let corrdinateX = ref(0.0);
      let corrdinateY = ref(0.0);
      let corrdinateZ = ref(0.0);
      let title = ref('');
      let content = ref('');
      let color = ref('#ff0000');
      let rotationX = ref(0);
      let rotationY = ref(0);
      let rotationZ = ref(0);
      let scale: Ref<number> = ref(1.0);
      let opacity: Ref<number> = ref(1.0);
      let border = ref(0.0);
      let borderColor = ref('#ffffff');
      let selectedId = ref(null);
      let emission = ref(1.0);
      let speed = ref(2.0);

      /**
       * 创建覆盖物
       */
      const create = async () => {
        if (selectedType.value.value === OverlayType.POI) {
          const overlay = new POIOverlay();
          overlay.icon = selectedIcon.value.value as POIIcon;
          overlay.coordinateX = corrdinateX.value;
          overlay.coordinateY = corrdinateY.value;
          overlay.coordinateZ = corrdinateZ.value;
          overlay.content = content.value;
          overlay.color = color.value;
          overlay.scale = scale.value;
          overlay.opacity = opacity.value;
          const poiOverlay = new POI({
            icon: overlay.icon,
            title: overlay.content,
            backgroundColor: overlay.color,
            opacity: overlay.opacity,
            scale: new Vector3(overlay.scale, overlay.scale, overlay.scale),
            coord: new Vector3(
              overlay.coordinateX,
              overlay.coordinateY,
              overlay.coordinateZ
            ),
            resource: {
              name: selectedIconType.value.value,
            },
            id: overlay.id,
            name: uniqueName('poi'),
            autoSize: false,
          });
          await poiOverlay.setClient(diva.client);
          poiOverlay.focus(1000, -Math.PI / 6);
          store.storeOverlay(overlay);
          data.changeCode(
            `const overlay = new POI(config_learnMoreInTutorial);`,
            `await overlay.setClient(diva.client);`
          );
        } else if (selectedType.value.value === OverlayType.Marker) {
          const overlay = new MarkerOverlay();
          overlay.coordinateX = corrdinateX.value;
          overlay.coordinateY = corrdinateY.value;
          overlay.coordinateZ = corrdinateZ.value;
          overlay.title = title.value;
          overlay.content = content.value;
          overlay.align = selectedAlign.value.value;
          overlay.color = color.value;
          overlay.scale = scale.value;
          overlay.opacity = opacity.value;
          overlay.borderWidth = border.value;
          overlay.borderColor = borderColor.value;
          const markerOverlay = new Marker({
            title: overlay.title,
            content: overlay.content,
            align: overlay.align,
            border: {
              color: overlay.borderColor,
              width: overlay.borderWidth,
            },
            backgroundColor: overlay.color,
            opacity: overlay.opacity,
            scale: new Vector3(overlay.scale, overlay.scale, overlay.scale),
            coord: new Vector3(
              overlay.coordinateX,
              overlay.coordinateY,
              overlay.coordinateZ
            ),
            resource: {
              name: '文字标签',
            },
            id: overlay.id,
            name: uniqueName('marker'),
            autoSize: false,
          });
          await markerOverlay.setClient(diva.client);
          markerOverlay.focus(1000, -Math.PI / 6);
          store.storeOverlay(overlay);
          data.changeCode(
            `const overlay = new Marker(config_learnMoreInTutorial);`,
            `await overlay.setClient(diva.client);`
          );
        } else if (selectedType.value.value === OverlayType.Emissive) {
          const overlay = new EmissiveOverlay();
          overlay.icon = selectedEmissive.value.value;
          overlay.coordinateX = corrdinateX.value;
          overlay.coordinateY = corrdinateY.value;
          overlay.coordinateZ = corrdinateZ.value;
          overlay.color = color.value;
          overlay.emission = emission.value;
          overlay.speed = speed.value;
          overlay.rotationX = rotationX.value;
          overlay.rotationY = rotationY.value;
          overlay.rotationZ = rotationZ.value;
          overlay.scale = scale.value;
          const emissiveOverlay = new Emissive({
            emissionColor: overlay.color,
            emissionStrength: overlay.emission,
            speed: overlay.speed,
            coord: new Vector3(
              overlay.coordinateX,
              overlay.coordinateY,
              overlay.coordinateZ
            ),
            rotation: Quaternion.FromEuler(
              new Euler(
                ...deg2rad([
                  overlay.rotationX,
                  overlay.rotationY,
                  overlay.rotationZ,
                ])
              )
            ),
            scale: new Vector3(overlay.scale, overlay.scale, overlay.scale),
            resource: {
              name: overlay.icon,
            },
            id: overlay.id,
            name: uniqueName('effect'),
          });
          await emissiveOverlay.setClient(diva.client);
          emissiveOverlay.focus(1000, -Math.PI / 6);
          store.storeOverlay(overlay);
          data.changeCode(
            `const overlay = new Emissive(config_learnMoreInTutorial);`,
            `await overlay.setClient(diva.client);`
          );
        }
        overlays.length = 0;
        store.getAllOverlays().forEach(e => {
          overlays.push(e);
        })
        reset();
      };

      const uniqueName = (prefix: string): string => {
        return '' + prefix + '_' + new Date().toISOString();
      }

      /**
       * 删除覆盖物
       */
      const del = async ($event: Event,overlay: POIOverlay | MarkerOverlay | EmissiveOverlay) => {
        $event.stopPropagation();
        store.deleteOverlay(overlay);
        const entity = await diva.client.getEntityById<Model>(overlay.id);
        await entity.setClient(null);
        data.changeCode(`entity.setClient(null)`);
        overlays.length = 0;
        store.getAllOverlays().forEach(e => {
          overlays.push(e);
        });
      }

      /**
       * 创建覆盖物之后重置所有配置
       */
      const reset = () => {
        selectedIcon.value.value = POIIcon.Camera,
        selectedIcon.value.placeholder = '摄像头',
        selectedIconType.value.value = POIIconType.type1,
        selectedIconType.value.placeholder = 'POI文字标签',
        selectedEmissive.value.value = EmissionType.type1,
        selectedEmissive.value.placeholder = '悬浮标记01',
        selectedAlign.value.value = 'center',
        selectedAlign.value.placeholder = '居中',

        corrdinateX.value = 0.0;
        corrdinateY.value = 0.0;
        corrdinateZ.value = 0.0;
        rotationX.value = 0;
        rotationY.value = 0;
        rotationZ.value = 0;
        title.value = '';
        content.value = '';
        color.value = '#ff0000';
        scale.value = 1.0;
        opacity.value = 1.0;
        border.value = 0.0;
        borderColor.value = '#ffffff';
        emission.value = 1.0;
        speed.value = 2.0;
      }
      /**
       * 聚焦覆盖物
       */
      const selectOverlay = async (overlay: POIOverlay | MarkerOverlay | EmissiveOverlay) => {
        selectedId = overlay.id;
        const entity = await diva.client.getEntityById<Model>(overlay.id);
        entity.focus(1000, - Math.PI / 6);
        data.changeCode(`model.focus(1000, - Math.PI / 6)`);
      }
      /**
       * 拾取世界坐标
       */
      const pickup = (e) => {
        const handler = (event: DivaMouseEvent) => {
          [corrdinateX.value, corrdinateY.value, corrdinateZ.value] = event.detail.position;
          document.body.style.cursor = 'default';
        };
        document.body.style.cursor = 'crosshair';
        diva.client.addEventListener('click', handler, {
          once: true
        });
      }

      /**
       * 阻止事件冒泡
       * @param $event
       */
      const onKeyDown = ($event) => {
        $event.stopPropagation();
      }

      onMounted(async () => {
        store.getAllOverlays().forEach(e => {
          overlays.push(e);
        })
        await diva.client?.applyScene('覆盖物');
        data.changeCode(`client.applyScene('覆盖物')`);
        overlays.map(async (overlay) => {
          const entity = await diva.client.getEntityById<Model>(overlay.id);
          entity.setVisibility(true);
        });
      });

      return {
        typeOptions,
        pickup,
        onKeyDown,
        corrdinateX,
        corrdinateY,
        corrdinateZ,
        title,
        content,
        alignOptions,
        emissiveOptions,
        iconOptions,
        iconTypeOptions,
        color,
        rotationX,
        rotationY,
        rotationZ,
        scale,
        opacity,
        border,
        borderColor,
        emission,
        speed,
        create,
        overlays,
        selectOverlay,
        del,
        selectedId,
        selectedIcon,
        selectedType,
        selectedAlign,
        selectedEmissive,
        selectedIconType,
      };
    },
    components: {
      contentBlock,
      dropDown,
      inputNumber
    },
  };
</script>

<style lang="scss">
  .overlay-main {
    .content-block-main {
      width: 282px;
    }

    pointer-events: all;
    width: 282px;

    .overlay-block {
      width: 282px;
      padding: 12px 20px;
      margin-top: 8px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.1);
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

      .input-item {
        margin-top: 12px;
        height: 24px;
        display: flex;
        justify-content: space-between;

        span {
          line-height: 24px;
          font-weight: bold;
          color: #fff;
        }

        .coordinate-items {
          width: 174px;
          display: flex;
          justify-content: space-between;

          .coordinate-item {
            display: flex;
            justify-content: space-between;
            width: 55px;

            span {
              font-weight: normal;
              font-size: 12px;
              line-height: 24px;
            }

            input {
              width: 45px;
            }
          }
        }

        input {
          font-size: 12px;
          color: #fff;
          width: 57px;
          height: 100%;
          padding: 6px;
          box-sizing: border-box;
          border: none;
          border-radius: 2px;
          outline: none;
          background: rgba(0, 0, 0, 0.3);
        }

        input[type="number"] {
          text-align: right;

          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }
        }

        input[type="text"] {
          width: 194px;

          &::placeholder {
            color: #fff;
            font-size: 12px;
            font-weight: normal;
          }

          // text-align: right;
        }

        input[type="color"] {
          background-color: #fff;
          padding: 2px;

          &::-webkit-color-swatch {
            border: none;
          }
        }

        textarea {
          width: 194px;
          box-sizing: border-box;
          padding: 0 6px;
          padding-top: 4px;
          outline: none;
          border: none;
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.3);
          color: #fff;
          font-size: 12px;
          font-family: "微软雅黑";
          resize: none;

          &::placeholder {
            color: #fff;
            font-size: 12px;
            font-weight: normal;
          }
        }

        textarea::-webkit-scrollbar {
          width: 3px;
        }

        textarea::-webkit-scrollbar-thumb {
          width: 3px;
          border-radius: 2px;
          background-color: rgba(255, 255, 255, 0.3);
        }
      }

      .btn-item {
        width: 100%;
        height: 24px;
        display: flex;
        margin-top: 12px;
        justify-content: space-between;

        span {
          line-height: 24px;
          font-weight: bold;
          color: #fff;
        }

        button {
          cursor: pointer;
          width: 58px;
          background: rgba(255, 255, 255, 0.1);
          line-height: 22px;
          text-align: center;
          color: #fff;
          font-size: 12px;
          border: 1px solid #fff;
          outline: none;
          border-radius: 2px;
        }
      }
    }

    .overlay-list {
      width: 282px;
      padding: 20px;
      margin-top: 8px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      cursor: pointer;

      .overlay-item {
        width: 100%;
        height: 24px;
        display: flex;
        justify-content: space-between;
        color: #fff;

        span {
          line-height: 24px;
          font-weight: bold;
        }

        .overlay-info {
          display: flex;
          justify-content: space-between;

          .overlay-delete {
            cursor: pointer;
            margin-left: 12px;
            width: 24px;
            height: 24px;
          }
        }
      }

      .selected {
        color: #fff;
      }
    }

    .scroll {
      width: 300px;
      max-height: 400px;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    .scroll::-webkit-scrollbar {
      background-color: transparent;
      width: 14px;
    }

    .scroll::-webkit-scrollbar-button {
      display: none;
    }

    .scroll::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      background-clip: padding-box;
      border: 4px solid transparent;
      border-radius: 7px;
    }

  }
</style>