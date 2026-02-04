<template>
  <div class="home">
    <el-row :gutter="20" style="padding: 40px">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新文章</span>
            </div>
          </template>
          <el-statistic title="总数" :value="12" />
          <el-button type="primary" style="width: 100%; margin-top: 20px" @click="goToList">
            查看文章
          </el-button>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户数据</span>
            </div>
          </template>
          <el-statistic title="活跃用户" :value="856" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总浏览量</span>
            </div>
          </template>
          <el-statistic title="浏览次数" :value="12345" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>评论数</span>
            </div>
          </template>
          <el-statistic title="总评论" :value="543" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="padding: 40px; padding-top: 0">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>欢迎使用本系统</span>
            </div>
          </template>
          <el-alert
            title="功能介绍"
            type="success"
            description="这是一个基于 Vue3 + TypeScript + ElementPlus 的文章管理系统。包括用户登录、文章列表、文章详情等功能。"
            show-icon
            closable
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToList = () => {
  router.push('/list')
}
</script>

<style scoped>
.home {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
