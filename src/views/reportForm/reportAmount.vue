<template>
  <div class="report-amount-container">
    <Amount @change="getChangeValue" :baseAmount="baseAmount" />
  </div>
</template>

<script>
import Amount from "@components/report/amount";
export default {
  data() {
    return {
      baseAmount: 10000
    };
  },

  watch: {},

  created() {},

  methods: {
    getChangeValue(val) {
      console.log(val);
    }
  },

  components: {
    Amount
  }
};
</script>

<style lang="less" scoped>
.report-amount-container {
  width: 100%;
  color: @color;
  background-color: @background-color;
  font-size: @font-size;
}</style
>>
