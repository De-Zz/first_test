<template>
  <div class="login_main">
    <div class="login_box">
      <div class="login_img">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="form_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            prefix-icon="el-icon-user-solid"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="form_button">
          <el-button type="primary" @click="login_login">登录</el-button>
          <el-button type="info" @click="login_res">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //重置表单
    login_res() {
      // console.log(this);
      this.$refs.ruleForm.resetFields();
    },
    //表单预验证
    login_login() {
      this.$refs.ruleForm.validate(async (valid) => {
        // console.log(valid);valid是一个布尔值
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("login", this.ruleForm);
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('登陆失败')
        } else {
            this.$message.success('登陆成功')
            window.sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
        }
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.login_main {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_img {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.form_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.form_button {
  display: flex;
  justify-content: flex-end;
}
</style>
