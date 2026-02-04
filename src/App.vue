<template>
  <div id="app">
    <Header v-if="showHeader" />
    <div class="main-content" :class="{ 'with-header': showHeader }">
      <router-view />
    </div>

    <!-- 登录注册弹窗 -->
    <el-dialog v-model="userStore.showLoginDialog" :title="loginTab === 'login' ? '用户登录' : '用户注册'" width="90%" :max-width="400">
      <!-- 标签 -->
      <div style="display: flex; gap: 20px; margin-bottom: 20px; border-bottom: 1px solid #ebeef5; padding-bottom: 12px;">
        <div
          :class="{ active: loginTab === 'login' }"
          style="cursor: pointer; padding-bottom: 8px; border-bottom: 2px solid transparent; transition: all 0.3s;"
          @click="loginTab = 'login'"
        >
          验证码登录 / 注册
        </div>
      </div>

      <!-- 登录表单 -->
      <el-form v-if="loginTab === 'login'" ref="formRef" :model="loginForm" :rules="rules" label-width="0">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>

        <el-form-item prop="captcha">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="14">
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码" clearable />
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
          <el-button type="primary" style="width: 100%" @click="handleLogin" :loading="loading">
            登录 / 注册
          </el-button>
        </el-form-item>

        <el-divider>或使用以下方式登录</el-divider>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <el-button type="default" circle @click="handleThirdPartyLogin('wechat')">
            <el-icon><CirclePlus /></el-icon>
          </el-button>
          <el-button type="default" circle @click="handleThirdPartyLogin('qq')">
            <el-icon><CirclePlus /></el-icon>
          </el-button>
          <el-button type="default" circle @click="handleThirdPartyLogin('github')">
            <el-icon><CirclePlus /></el-icon>
          </el-button>
        </div>

        <div style="text-align: center; font-size: 12px; color: #999; margin-top: 12px;">
          <span>微信</span>
          <span style="margin: 0 8px;">·</span>
          <span>QQ</span>
          <span style="margin: 0 8px;">·</span>
          <span>GitHub</span>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const captchaCode = ref('6574')
const loginTab = ref('login')

// 登录页面不显示头部
const showHeader = computed(() => {
  return route.path !== '/login'
})

const loginForm = reactive({
  phone: '13800138000',
  captcha: '',
  username: 'admin',
  password: '123456'
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
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
          username: loginForm.phone,
          email: 'user@example.com'
        })
        userStore.showLoginDialog = false
        ElMessage.success('登录成功')
      }, 1000)
    }
  })
}

const handleThirdPartyLogin = (platform: string) => {
  ElMessage.info(`使用 ${platform} 登录`)
  // 模拟第三方登录
  setTimeout(() => {
    userStore.setUser({
      id: '1',
      username: `${platform}_user`,
      email: 'user@example.com'
    })
    userStore.showLoginDialog = false
    ElMessage.success(`${platform} 登录成功`)
  }, 1000)
}

onMounted(() => {
  userStore.initUser()
})
</script>

<style scoped>
#app {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  min-height: calc(100vh - 60px);
}

.main-content.with-header {
  padding-top: 60px;
}
</style>
