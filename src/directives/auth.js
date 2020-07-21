import { checkAuthority } from "../Authority/Authority";

// 该指令的作用就是对传入的权限对象检测，如果不通过则移除绑定的dom节点
function install(Vue, options = {}) {
  Vue.directive(options.name || "auth", {
    inserted(el, binding) {
      // console.log(el)       绑定的dom元素
      // console.log(binding)  指令上线文，包括指令传入对象
      if (!checkAuthority(binding.value)) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  });
}

export default { install };
