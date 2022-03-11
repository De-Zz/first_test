<template>
  <div class="home">
    <div class="home_button">
      <el-button type="info" @click="home_out">退出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {
    home_out() {
      // 清楚token
      window.sessionStorage.clear();
      // 跳转路由
      this.$router.push("/login");
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
