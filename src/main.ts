import App from "./App.vue";
import router from "./router";
import { setupStore } from "@/store";
import ElementPlus from "element-plus";
import { getServerConfig } from "./config";
import { createApp, Directive } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import { injectResponsiveStorage } from "@/utils/responsive";
import Pusher from "pusher-js";
import Table from "@pureadmin/table";
import PureDescriptions from "@pureadmin/descriptions";
import { useEcharts } from "@/plugins/echarts";

import "./style/reset.scss";
import "./style/index.scss";
import "./style/tailwind.css";
import "element-plus/dist/index.css";
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";

const app = createApp(App);

import * as directives from "@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);

import { Auth } from "@/components/ReAuth";
app.component("Auth", Auth);

declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

window.Pusher = Pusher;
window.Pusher.logToConsole = 1;

getServerConfig(app).then(async config => {
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  setupStore(app);
  app
    .use(MotionPlugin)
    .use(ElementPlus)
    .use(useEcharts)
    .use(Table)
    .use(PureDescriptions);
  app.mount("#app");
});
