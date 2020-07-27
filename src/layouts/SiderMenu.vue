<template>
  <div style="width: 200px">
    <a-menu
      :selectedKeys="selectedKeys"
      :openKeys.sync="openKeys"
      mode="inline"
      :theme="theme"
    >
      <template v-for="item in menuData">
        <a-menu-item
          v-if="!item.children"
          :key="item.path"
          @click="() => $router.push({ path: item.path, query: $route.query })"
        >
          <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.path" />
      </template>
    </a-menu>
  </div>
</template>

<script>
/*
 * recommend SubMenu.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu.vue
 * SubMenu1.vue https://github.com/vueComponent/ant-design-vue/blob/master/components/menu/demo/SubMenu1.vue
 * */
import { checkAuthority } from "../Authority/Authority";
import SubMenu from "./SubMenu";
export default {
  props: {
    theme: {
      type: String,
      default: "dark"
    }
  },
  components: {
    "sub-menu": SubMenu
  },
  watch: {
    // 当路由跳转的时候，根据路由path更新菜单选中的状态
    "$route.path": function(val) {
      this.selectedKeys = this.selectedKeysMap[val];
      this.openKeys = this.collapsed ? [] : this.openKeysMap[val];
    }
  },
  data() {
    // 存储所有的path key 值
    this.selectedKeysMap = {};
    this.openKeysMap = {};
    const menuData = this.getMenuData(this.$router.options.routes);
    return {
      // inline 时菜单是否收起状态
      collapsed: false,

      // 初始化菜单数据和状态
      menuData,
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.collapsed ? [] : this.openKeysMap[this.$route.path]
    };
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },

    // 遍历router树结构，创建菜单数据结构
    getMenuData(routes = [], parentKeys = [], selectedKey) {
      const menuData = [];
      for (let item of routes) {
        // 用户权限过滤
        if (
          item.meta &&
          item.meta.authority &&
          !checkAuthority(item.meta.authority)
        ) {
          continue;
        }

        // 有name字段 且 路由没被隐藏
        if (item.name && !item.hideInMenu) {
          // 收集所有的path
          this.openKeysMap[item.path] = parentKeys;
          this.selectedKeysMap[item.path] = [selectedKey || item.path];

          // 创建菜单路由对象
          const newItem = { ...item };
          delete newItem.children;

          // 有子路由信息 并且 没有隐藏子路由
          if (item.children && !item.hideChildrenInMenu) {
            newItem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ]);
          } else {
            // 有子路由信息 并且 隐藏子路由
            this.getMenuData(
              item.children,
              selectedKey ? parentKeys : [...parentKeys, item.path],
              selectedKey || item.path
            );
          }
          menuData.push(newItem);
        } else if (
          !item.hideInMenu &&
          !item.hideChildrenInMenu &&
          item.children
        ) {
          // 如果没有name,但是子级路由需要展示
          menuData.push(
            ...this.getMenuData(item.children, [...parentKeys, item.path])
          );
        }
      }
      //console.log(menuData)
      return menuData;
    }
  }
};
</script>
