<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>用户登录</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-width="80px"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="14">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                clearable
              />
            </el-col>
            <el-col :span="10">
              <el-button
                type="primary"
                plain
                @click="generateCaptcha"
                style="width: 100%"
              >
                {{ captchaCode }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <span>还没有账号？<el-button text type="primary" @click="showRegisterDialog = true">注册</el-button></span>
        </div>
      </el-form>
    </el-card>

    <!-- 注册弹出框 -->
    <el-dialog v-model="showRegisterDialog" title="用户注册" width="90%" :max-width="400">
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="请确认密码"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showRegisterDialog = false">取消</el-button>
        <el-button type="primary" @click="handleRegister" :loading="registerLoading">
          注册
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const registerLoading = ref(false)
const captchaCode = ref('6574')
const showRegisterDialog = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
  rememberMe: false
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ]
}

const generateCaptcha = () => {
  captchaCode.value = Math.random().toString().slice(2, 6)
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      if (loginForm.captcha !== captchaCode.value) {
        ElMessage.error('验证码错误')
        return
      }

      loading.value = true
      setTimeout(() => {
        loading.value = false
        userStore.setUser({
          id: '1',
          username: loginForm.username,
          email: 'admin@example.com'
        })
        ElMessage.success('登录成功')
        router.push('/list')
      }, 1000)
    }
  })
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate((valid) => {
    if (valid) {
      if (registerForm.password !== registerForm.confirmPassword) {
        ElMessage.error('两次输入的密码不一致')
        return
      }

      registerLoading.value = true
      setTimeout(() => {
        registerLoading.value = false
        ElMessage.success('注册成功，请登录')
        showRegisterDialog.value = false
        registerFormRef.value?.resetFields()
      }, 1000)
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.login-footer {
  text-align: center;
  font-size: 12px;
  color: #666;
}

.login-footer a {
  color: #409eff;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

:deep(.el-button--text) {
  padding: 0 4px;
}
</style>
