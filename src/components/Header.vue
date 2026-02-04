<template>
  <header class="juejin-header">
    <div class="header-inner">
      <!-- 左侧 logo + 导航 -->
      <div class="header-left">
        <img src="https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/logo.a7995ad.svg" class="logo-img" alt="掘金Logo" />
        <nav class="nav-menu">
          <a href="#" class="nav-item active">首页</a>
          <a href="#" class="nav-item">AI Coding</a>
          <a href="#" class="nav-item">数据标主</a>
          <a href="#" class="nav-item">沸点</a>
          <a href="#" class="nav-item">课程</a>
          <a href="#" class="nav-item">直播</a>
          <a href="#" class="nav-item">活动</a>
          <a href="#" class="nav-item">APP</a>
          <a href="#" class="nav-item">插件</a>
        </nav>
      </div>
      <!-- 中间搜索框 -->
      <div class="header-center">
        <el-input
          v-model="searchText"
          placeholder="探索稀土掘金"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #suffix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <!-- 右侧按钮区 -->
      <div class="header-right">
        <el-button type="primary" class="creator-btn">创作者中心</el-button>
        <el-icon class="bell-icon"><Bell /></el-icon>
        <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Bell } from '@element-plus/icons-vue'

const router = useRouter()
const searchText = ref('')

const handleSearch = () => {
  if (searchText.value.trim()) {
    router.push({ path: '/list', query: { search: searchText.value } })
  }
}
</script>

<style scoped>
.juejin-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e4e6eb;
  z-index: 999;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}
.logo-img {
  height: 28px;
  margin-right: 16px;
}
.nav-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-item {
  font-size: 15px;
  color: #222;
  padding: 0 8px;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}
.nav-item.active {
  color: #1e80ff;
  font-weight: 600;
  background: #eaf2ff;
}
.nav-item:hover {
  background: #f4f5f7;
  color: #1e80ff;
}
.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.search-input {
  width: 320px;
  border-radius: 20px;
  background: #f7f8fa;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.creator-btn {
  border-radius: 20px;
  font-size: 14px;
  padding: 0 18px;
  background: #1e80ff;
  color: #fff;
  border: none;
}
.creator-btn:hover {
  background: #1765c7;
}
.bell-icon {
  font-size: 22px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;
}
.bell-icon:hover {
  color: #1e80ff;
}
</style>
