<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" class="login-form" autocomplete="on" label-position="left" label-width="auto">

      <el-image class="full" :src="logo" />
      <h1 class="title">业务管理系统</h1>

      <el-form-item prop="username" label="用户名：">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password" label="密码：">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-form-item prop="password" label="验证码：" class="verify-code">
        <el-input
          ref="password"
          v-model="loginForm.verifyCode"
          placeholder="请输入验证码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <el-image
          src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"
          @click="handleSendVerifyCode"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码必须要大于等于6位'))
      } else {
        callback()
      }
    }
    return {
      logo: require('@/assets/images/logo.jpg'),
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      // loginRules: {
      //   username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      //   password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      // },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleSendVerifyCode() {
      console.log('获取验证码')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

.login-form {
  .verify-code {
    .el-form-item__content {
      display: flex;
      .el-image {
        height: 36px;
        width: 200px;
        margin-left: 20px;
      }
    }
  }
  .el-button {
    padding-left: 60px;
    padding-right: 60px;
  }
}
</style>

<style lang="scss" scoped>
.full {
  width: 100%;
  height: 100%;
}
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  text-align: center;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    .title {
      margin-bottom: 40px;
    }
  }

}
</style>
