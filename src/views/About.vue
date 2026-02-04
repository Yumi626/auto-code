<template>
  <div class="about">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>关于本项目</span>
        </div>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="项目名称">Vue3 + TypeScript + ElementPlus</el-descriptions-item>
        <el-descriptions-item label="Vue 版本">3.4.0+</el-descriptions-item>
        <el-descriptions-item label="TypeScript 版本">5.3.0+</el-descriptions-item>
        <el-descriptions-item label="构建工具">Vite 5.0+</el-descriptions-item>
        <el-descriptions-item label="UI 框架">ElementPlus 2.5.0+</el-descriptions-item>
        <el-descriptions-item label="状态管理">Pinia 2.1.6+</el-descriptions-item>
        <el-descriptions-item label="路由">Vue Router 4.2.5+</el-descriptions-item>
        <el-descriptions-item label="描述">
          这是一个基于 Vue3 + TypeScript + ElementPlus 的现代化前端项目模板，包含完整的项目结构和开发工具配置。
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
