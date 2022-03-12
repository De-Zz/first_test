<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row class="users_row" :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="usersList.query"
            clearable
            @clear="getuserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col>
          <el-button type="primary" @click="addUsers">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" stripe border class="users_table">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="user_change(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="addusers(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delete_form(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersList.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="usersList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="close_form"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormref"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="enter_users">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editdialogVisible"
      width="50%"
        @close="reset_users"
    >
      <el-form :model="editform" :rules="editrules" ref="editFormref" label-width="100px">
  <el-form-item label="用户名称" >
    <el-input v-model="editform.username" disabled></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="editform.email" ></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="editform.mobile" ></el-input>
  </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit_enter"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    //获取用户列表数据
    this.getuserList();
  },
  props: {},
  data() {
    //验证邮箱规则
    var checkemail = (rule, value, callback) => {
      const emailtest = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (emailtest.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    //验证手机号码
    var checkmobile = (rule, value, callback) => {
      const mobiletest =
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (mobiletest.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      usersList: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      editdialogVisible:false,
      editform:{
          username:'',
          email:'',
          mobile:''
      },
      editrules:{
               email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      }
    };
  },
  methods: {
    async getuserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.usersList,
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.userList = res.data.users;
      console.log(this.userList);
      this.total = res.data.total;
    },
    //监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.usersList.pagesize = newSize;
      this.getuserList();
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.usersList.pagenum = newPage;
      this.getuserList();
    },
    //监听switch开关事件
    async user_change(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        //因为失败了所以要让开关回到原来的样子所以取反
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功!");
    },
    addUsers() {
      this.dialogVisible = true;
    },
    //重置表单
    close_form() {
      this.$refs.ruleFormref.resetFields();
    },
    //预验证
    enter_users() {
      this.$refs.ruleFormref.validate(async (valid) => {
        //如果预校验通过了 return 出去
        if (!valid) {
          return;
        }
        //发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.ruleForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.dialogVisible = false;
        this.getuserList();
      });
    },
    //编辑用户对话框
   async addusers(id) {
       console.log(id);
      const {data:res} = await this.$http.get('users/'+id)
      if(res.meta.status !== 200){
          return this.$message.error('获取用户信息失败')
      }
      this.editform = res.data
      console.log(this.editform);
        this.editdialogVisible = true
    },
    //重置操作
    reset_users(){
        this.$refs.editFormref.resetFields()
    },
    edit_enter(){
        this.$refs.editFormref.validate(async valid =>{
            console.log(valid);
            if(!valid) return
          const {data:res} = await this.$http.put('users/'+this.editform.id,{
              email:this.editform.email,
              mobile:this.editform.mobile
          })
          if(res.meta.status !== 200){
              return this.$message.error('添加用户失败!')
          }
          this.$message.success('添加用户成功')
          this.editdialogVisible = false
          this.getuserList()
        })
    },
   delete_form(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios.delete('users/'+id).then(res=>{
            if(res.data.meta.status !== 200){
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getuserList()
            })
       
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-card {
  margin-top: 20px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);
}
.users_row {
  display: flex;
}
.users_table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
