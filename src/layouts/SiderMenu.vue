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
  整体的实现思路：
    1. 为每个菜单绑定对应的路由，当发生点击行为时，触发菜单路由
    2. watch 路由改动，然后更新selectedKeys，openKeys。同步选中的菜单和打开的菜单

*/

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
    // 存储所有的path key集合的对象
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
    /*  
      遍历要求：
        1. 把所有没有hideInMenu，hideChildrenInMenu，并且拥有name字段的路由收集起来
        2. 针对 "/" 重定向的路由，把Childen路由再次递归判断
    */

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
            // console.log(item)

            // 子路由再次抛出执行递归
            newItem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ]);
          } else {
            // 有子路由信息 并且 隐藏了 子路由的子路由
            // 这里为了把选择不同子路，但是open结果一致，都是父路由
            // selectedKey 的初值为path ：/form/step-form

            this.getMenuData(
              item.children,
              selectedKey ? parentKeys : [...parentKeys, item.path],
              selectedKey || item.path
            );
          }

          // 处理完毕，推入menuData
          menuData.push(newItem);
        } else if (
          !item.hideInMenu &&
          !item.hideChildrenInMenu &&
          item.children
        ) {
          // 针对重定向的路由，如果没有name,但是子级路由需要展示，再次抛出递归
          menuData.push(
            ...this.getMenuData(item.children, [...parentKeys, item.path])
          );
        }
      }
      // console.log(menuData)
      // console.log(this.openKeysMap)
      // console.log(this.selectedKeysMap)
      return menuData;
    }
  }
};
</script>
