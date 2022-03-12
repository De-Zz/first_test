<template>
  <div class="home">
    <el-container class="home_con">
      <el-header>
        <div class="home_flex">
          <img src="../assets/logo.png" alt="" />
          <span>电商后台管理系统</span>
        </div>

        <el-button type="info" @click="home_out">退出</el-button></el-header
      >
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isoppalse ? '64px':'200px'">
            <div class="taggerbutton" @click="tagg_click">|||</div>
          <el-menu
            background-color="#333741"
            text-color="#fff"
            active-text-color='rgb(68,155,245)'
            :unique-opened="true"
            :collapse="isoppalse"
            :collapse-transition="false"
            :router='true'
            :default-active='v'
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconmany[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+item1.path" v-for="item1 in item.children" :key="item1.id" @click="saveList('/'+item1.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{item1.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
            <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
    created () {
        this.getMeauList()
        this.v=window.sessionStorage.getItem('v')
    },
  props: {},
  data() {
    return {
        //左侧菜单数据
        menuList:[],
        iconmany:{
            101:'el-icon-info',
            102:'el-icon-remove',
            103:'el-icon-circle-plus',
            125:'el-icon-success',
            145:'el-icon-error'
        },
        isoppalse:false,
        v:''
    };
  },
  methods: {
    home_out() {
      // 清楚token
      window.sessionStorage.clear();
      // 跳转路由
      this.$router.push("/login");
    },
   async getMeauList(){
      const {data:res} = await this.$http.get('menus')
            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg)
            }    
            this.menuList = res.data
            console.log(this.menuList);
    },
    tagg_click(){
        this.isoppalse =!this.isoppalse
    },
    saveList(v){
        window.sessionStorage.setItem('v',v)
        this.v = v
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.home {
  height: 100%;
}

.home_con {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eee;
}
.home_flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    color: white;
    font-size: 20px;
  }
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
}
.el-menu{
    border: none;
}
.taggerbutton{
    text-align: center;
    color: white;
    background-color: #4a5064;
    line-height: 24px;
    letter-spacing: 0.1em;
    cursor: pointer;
}
</style>
