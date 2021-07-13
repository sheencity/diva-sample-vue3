<template>
  <div class="date-main">
    <content-block caption="预设四季"></content-block>
    <div v-for="season in seasons" :key="season.name">
      <div class="content" @click="switchSeason(season)">
        <div class="title">{{ season.title }}</div>
        <div class="icon">
          <img :src="require(`../assets/icon/date/${season.name}.png`)" />
        </div>
      </div>
    </div>
    <div style="margin-top: 20px">
      <content-block caption="预设时间"></content-block>
      <div v-for="noon in noons" :key="noon.title">
        <div class="content" @click="switchNoon(noon)">
          <div class="title">{{ noon.title }}</div>
          <div class="icon">
            <img :src="require(`../assets/icon/date/${noon.name}.png`)" />
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px">
      <content-block caption="自定义"></content-block>
      <div class="date-block">
        <div class="date-select">
          <span class="date-title">日期</span>
          <input type="date" @change="onDateChange($event)" :value="date" />
        </div>
        <div class="date-select date-time">
          <span>时间</span>
          <input type="time" @change="onTimeChange($event)" :value="time" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import contentBlock from "@/components/content-block.vue";
  import {
    onMounted,
    onUnmounted,
    ref
  } from "vue";
  import {
    DataService
  } from "@/services/data.service";
  // import { useStore } from "vuex";
  import {
    diva
  } from "@/global";
  import {
    WeatherName
  } from "@sheencity/diva-sdk";

  export default {
    setup() {
      const _diva = diva;
      let _data = new DataService();
      // 自定义日期
      let date = ref();
      // 自定义时间
      let time = ref();
      
      onMounted(async () => {
        date.value = getDate("date");
        time.value = getDate("time");
        _diva.client.setDate(new Date());
        _diva.client.setTime(new Date());
        _diva.client ?.applyScene("日期时间").then(() => {
          _data.changeCode(`client.applyScene('日期时间')`);
        });
      });


      /**
       * 设置自定义日期
       * @param $event DateInputEvent
       */
      const onDateChange = ($event: any) => {
        const date = new Date($event.target.value);
        _diva.client.setDate(date);
        _data.changeCode(`client.setDate(new Date('${date}'))`);
      };

      /**
       * 设置自定义时间
       * @param $event DateInputEvent
       */
      const onTimeChange = ($event: any) => {
        const time = new Date();
        time.setHours(
          ...($event.target.value.split(":").map((val) => parseInt(val, 10)) as[
            hour: number,
            second: number
          ])
        );
        _diva.client.setTime(time);
        _data.changeCode(`client.setTime(new Date('${time}'))`);
      };

      const switchSeason = async (season: {
        title: string;
        value: string;
        name: string;
      }) => {
        await _diva.client.setDate(new Date(season.value));
        if (season.name === "winterSnow") {
          await _diva.client.setWeather(WeatherName.Snow);
        } else {
          await _diva.client.setWeather(WeatherName.Default);
        }
        if (season.name === "winterSnow") {
          _data.changeCode(
            `client.setDate(new Date('${season.value}'));`,
            `client.setWeather('snow')`
          );
        } else if (season.name === "autumn") {
          // 秋季需要设置 11-01， 代码显示 09-23
          _data.changeCode(`client.setDate(new Date('2021-09-23'))`);
        } else {
          _data.changeCode(`client.setDate(new Date('${season.value}'))`);
        }
      };

      /**
       * 切换午时
       * @param noon
       */
      const switchNoon = (noon: {
        title: string;
        value: number;
        name: string;
      }) => {
        _diva.client.setTime(getTime(noon.value, 0));
        _data.changeCode(
          "const now = new Date();",
          `const time = (now.setHours(${noon.value}), now);`,
          "client.setTime(time);"
        );
      };

      const getTime = (hour: number, min: number) => {
        const now = new Date();
        now.setHours(hour, min, 0, 0);
        return now;
      };

      /**
       * 获取当前日期或时间
       * @param type (string) 日期/时间
       * @returns (Date)
       */
      const getDate = (type: string) => {
        const date = new Date();
        if (type === "date") {
          return `${date.getFullYear()}-${_format(date.getMonth() + 1)}-${_format(
          date.getDate()
        )}`;
        } else if (type === "time") {
          return `${_format(date.getHours())}:${_format(date.getMinutes())}`;
        }
      };

      // 规整，方便对时间 input 绑定值
      const _format = (v: number) => {
        return v < 10 ? `0${v}` : `${v}`;
      };
      onUnmounted(() => {
        _diva.client.setWeather(WeatherName.Default);
      });
      return {
        //各种场景
        date,
        time,
        seasons: [{
            title: "春",
            value: "2021-03-21",
            name: "spring",
          },
          {
            title: "夏",
            value: "2021-06-22",
            name: "summer",
          },
          {
            title: "秋",
            value: "2021-11-01",
            name: "autumn",
          },
          {
            title: "冬",
            value: "2021-12-21",
            name: "winter",
          },
          {
            title: "冬 (雪)",
            value: "2021-12-21",
            name: "winterSnow",
          },
        ],
        noons: [{
            title: "早晨",
            value: 8,
            name: "morning",
          },
          {
            title: "中午",
            value: 12,
            name: "noon",
          },
          {
            title: "傍晚",
            value: 17,
            name: "afternoon",
          },
        ],
        onDateChange,
        onTimeChange,
        switchSeason,
        switchNoon,
      };
    },
    components: {
      contentBlock,
    },
  };
</script>

<style lang="scss">
  .date-main {
    pointer-events: all;

    .date-block {
      width: 240px;
      margin-top: 8px;
      padding: 12px 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);

      .date-select {
        display: flex;
        justify-content: space-between;

        span {
          font-weight: bold;
          line-height: 24px;
          color: #fff;
        }

        input {
          width: 108px;
          height: 24px;
          padding: 6px;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.3);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          border: none;
          border-radius: 2px;
          outline: none;
          user-select: none;
        }

        ::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }

        ::-webkit-calendar-picker-indicator {
          margin-left: 0;
        }
      }

      .date-time {
        margin-top: 8px;
      }
    }

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