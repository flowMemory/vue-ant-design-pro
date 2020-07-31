import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import 'ant-design-vue/dist/antd.css';
import {
  Button,
  Layout,
  Icon,
  Drawer,
  Radio,
  Menu,
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  AutoComplete,
  Row,
  Col,
  Checkbox
} from "ant-design-vue";
import Authorized from "./components/Authorized.vue";
import Auth from "./directives/auth";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1394589_wfpbiqrtsa.js"
});
Vue.component("IconFont", IconFont);

Vue.config.productionTip = false;

// 全局注册组件 - 第三方
Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(Menu);
Vue.use(Form);
Vue.use(Input);
Vue.use(Tooltip);
Vue.use(Cascader);
Vue.use(Select);
Vue.use(AutoComplete);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);

// 全局注册组件 - 自己的实例
Vue.component("Authorized", Authorized);

// 全局注册指令
Vue.use(Auth);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
