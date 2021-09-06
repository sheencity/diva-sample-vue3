import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './style.scss';
import "@taufik-nurrohman/color-picker/index.css";

createApp(App).use(router).mount("#app");
