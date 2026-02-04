# Vue3 掘金克隆项目 - 功能完整指南

## 📋 项目概览

完整的 Vue3 + TypeScript + ElementPlus 文章浏览应用，功能包含：
- 🔐 模态框登录系统（短信 + 第三方OAuth）
- 👍 文章点赞功能
- 💬 评论系统
- 💾 文章收藏功能
- 📱 完全响应式设计

---

## 🎯 核心功能

### 1. 认证系统

#### 全局登录对话框（App.vue）
```vue
<!-- 登录/注册统一由 App.vue 全局模态框管理 -->
<el-dialog 
  v-model="userStore.showLoginDialog"
  title="登录/注册"
>
  <!-- 短信验证码登录表单 -->
  <!-- 第三方登录按钮（微信/QQ/GitHub） -->
</el-dialog>
```

**登录方式**：
1. **短信验证码**：输入手机号 → 获取验证码 → 验证登录
2. **微信登录**：点击微信图标 → 扫码登录（模拟）
3. **QQ登录**：点击QQ图标 → 快速登录（模拟）
4. **GitHub登录**：点击GitHub图标 → 授权登录（模拟）

#### 使用状态店（Pinia）

```typescript
// stores/user.ts
interface UserStore {
  user: User | null              // 用户信息
  isLogin: boolean               // 登录状态
  showLoginDialog: boolean       // 对话框可见性
  
  setUser(user: User): void      // 设置用户
  logout(): void                 // 退出登录
  initUser(): void               // 初始化用户（从localStorage恢复）
}
```

---

### 2. 文章列表功能

#### 列表页（List.vue）

**布局**：三列网格
- 左侧：分类菜单（200px）
- 中间：文章列表（自适应）
- 右侧：推荐信息（300px）

**功能**：
```typescript
// 点赞功能 - 需要登录
toggleLike(articleId: string) {
  if (!userStore.isLogin) {
    userStore.showLoginDialog = true  // 显示登录框
    return
  }
  // 执行点赞操作
  userLikes.add(articleId)
  article.likes++
}
```

**用户交互**：
- ✓ 点击文章卡片进入详情页
- ✓ 点击点赞图标：需要登录，可切换点赞状态
- ✓ 搜索功能：按关键词筛选文章
- ✓ 分类筛选：按类别筛选文章
- ✓ 分页：切换不同页码查看文章

---

### 3. 文章详情功能

#### 详情页（Detail.vue）

**布局**：三列网格
- 左侧：操作栏（50px）
  - 👍 点赞
  - 💬 评论数
  - 💾 **收藏**（新功能）
  - 📤 分享
  - ⚠️ 举报
  - ⋯️ 更多

- 中间：文章内容（自适应）
  - 标题 + 作者信息
  - 文章正文
  - 标签
  - 操作按钮
  - 评论区

- 右侧：信息栏（280px）
  - 作者卡片
  - 文章目录
  - 相关推荐

**功能**：

1. **点赞** - 需要登录
```typescript
toggleLike() {
  if (!userStore.isLogin) {
    userStore.showLoginDialog = true
    return
  }
  isLiked.value = !isLiked.value
  likesCount.value += isLiked.value ? 1 : -1
}
```

2. **评论** - 需要登录
```typescript
submitComment() {
  if (!userStore.isLogin) {
    userStore.showLoginDialog = true
    return
  }
  // 创建新评论
  const newComment = {
    id: generateId(),
    content: commentForm.value.content,
    author: currentUser,
    createTime: new Date()
  }
  comments.value.push(newComment)
}
```

3. **收藏** - 需要登录（新增）
```typescript
toggleCollection() {
  if (!userStore.isLogin) {
    userStore.showLoginDialog = true
    return
  }
  isCollected.value = !isCollected.value
  ElMessage.success(isCollected.value ? '已收藏' : '已取消收藏')
}
```

---

### 4. Header 组件

#### 动态用户界面

**未登录状态**：
```vue
<div class="auth-buttons">
  <el-button text type="primary" @click="showLoginDialog = true">登录</el-button>
  <el-button type="primary" @click="showLoginDialog = true">创作中心</el-button>
</div>
```

**已登录状态**：
```vue
<el-dropdown @command="handleCommand">
  <div class="user-menu">
    <el-avatar :src="userStore.user?.avatar"></el-avatar>
    <span>{{ userStore.user?.username }}</span>
    <el-icon><ArrowDown /></el-icon>
  </div>
  <template #dropdown>
    <el-dropdown-menu>
      <el-dropdown-item command="profile">个人资料</el-dropdown-item>
      <el-dropdown-item command="settings">设置</el-dropdown-item>
      <el-dropdown-divider></el-dropdown-divider>
      <el-dropdown-item command="logout">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>
```

**功能**：
- 搜索功能：按回车搜索文章
- 用户菜单：个人资料、设置、退出登录
- Logo 点击返回首页

---

## 🔌 API 接口设计（待实现）

### 认证接口

```typescript
// 登录
POST /api/auth/login
{
  phone: string
  captcha: string
}
Response: { token, user }

// 第三方登录
POST /api/auth/oauth
{
  provider: 'weixin' | 'qq' | 'github'
  code: string
}
Response: { token, user }

// 获取验证码
POST /api/auth/captcha
{ phone: string }
Response: { success }

// 登出
POST /api/auth/logout
Response: { success }
```

### 文章接口

```typescript
// 获取文章列表
GET /api/articles?page=1&limit=10&keyword=&category=
Response: { articles, total }

// 获取文章详情
GET /api/articles/:id
Response: { article }

// 点赞文章
POST /api/articles/:id/like
Response: { likes }

// 取消点赞
DELETE /api/articles/:id/like
Response: { likes }

// 收藏文章
POST /api/articles/:id/collect
Response: { collected }

// 取消收藏
DELETE /api/articles/:id/collect
Response: { collected }
```

### 评论接口

```typescript
// 获取评论
GET /api/articles/:id/comments?page=1&limit=10
Response: { comments, total }

// 发布评论
POST /api/articles/:id/comments
{ content: string }
Response: { comment }

// 删除评论
DELETE /api/comments/:id
Response: { success }
```

---

## 📊 数据模型

```typescript
// 用户
interface User {
  id: string
  username: string
  email: string
  avatar?: string
  phone?: string
}

// 文章
interface Article {
  id: string
  title: string
  content: string
  description: string
  category: string
  views: number
  comments: number
  likes: number
  createTime: string
  author: {
    name: string
    avatar: string
  }
}

// 评论
interface Comment {
  id: string
  content: string
  createTime: string
  author: {
    name: string
    avatar: string
  }
}

// 登录表单
interface LoginForm {
  phone: string           // 手机号
  captcha: string        // 验证码
  username?: string      // 用户名（备用）
  password?: string      // 密码（备用）
}
```

---

## 🎨 样式指南

### 响应式断点

```css
/* 桌面版 */
@media (min-width: 1200px) {
  .list-container { max-width: 85%; }
  .detail-page { display: grid; grid-template-columns: 50px 1fr 280px; }
}

/* 平板版 */
@media (max-width: 1200px) {
  .list-container { max-width: 90%; }
  .detail-right-sidebar { display: none; }
}

/* 手机版 */
@media (max-width: 768px) {
  .header-menu { display: none; }
  .list-container { max-width: 100%; }
  .detail-left-sidebar { display: none; }
}

/* 超小屏幕 */
@media (max-width: 480px) {
  .header-content { padding: 0 10px; }
  .el-input { width: 80px !important; }
}
```

### 颜色主题

```css
/* 主色 */
--primary: #1e80ff      /* 按钮蓝色 */
--success: #52c41a      /* 成功绿色 */
--warning: #faad14      /* 警告黄色 */
--danger: #f5222d       /* 危险红色 */

/* 文字颜色 */
--text-primary: #333    /* 主文字 */
--text-secondary: #666  /* 副文字 */
--text-disabled: #999   /* 禁用文字 */

/* 背景 */
--bg-primary: #fff      /* 主背景 */
--bg-secondary: #f5f5f5 /* 次级背景 */
--border: #f0f0f0       /* 边框 */
```

---

## 🚀 快速开始

### 安装依赖
```bash
cd e:\Projects\东丽\Tpch\test-vue3
npm install
```

### 启动开发服务器
```bash
npm run dev
# 访问 http://localhost:5174
```

### 构建生产版本
```bash
npm run build
npm run preview
```

---

## 📝 文件结构

```
test-vue3/
├── public/                 # 静态资源
├── src/
│   ├── components/
│   │   └── Header.vue     # 头部导航
│   ├── views/
│   │   ├── Home.vue       # 首页
│   │   ├── List.vue       # 列表页（✅ 已完成）
│   │   ├── Detail.vue     # 详情页（✅ 已完成）
│   │   ├── About.vue      # 关于页
│   │   └── Login.vue      # 已废弃（✗ 已删除路由）
│   ├── stores/
│   │   └── user.ts        # 用户状态管理
│   ├── router/
│   │   └── index.ts       # 路由配置
│   ├── App.vue            # 根组件（✅ 全局登录对话框）
│   └── main.ts            # 入口文件
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
└── UPDATES.md             # 本文档
```

---

## ✅ 完成检查清单

### 认证系统
- ✅ 全局登录对话框
- ✅ 短信验证码登录
- ✅ 第三方登录（微信/QQ/GitHub）
- ✅ 用户状态管理（Pinia）
- ✅ localStorage 持久化

### 列表页
- ✅ 三列网格布局
- ✅ 文章卡片展示
- ✅ 点赞功能（带登录检查）
- ✅ 搜索功能
- ✅ 分类筛选
- ✅ 分页显示

### 详情页
- ✅ 三列网格布局
- ✅ 文章内容展示
- ✅ 点赞功能（带登录检查）
- ✅ 评论功能（带登录检查）
- ✅ **收藏功能（新增，带登录检查）**
- ✅ 作者信息卡
- ✅ 相关推荐

### Header 组件
- ✅ 动态登录/注册按钮
- ✅ 用户头像菜单
- ✅ 搜索功能
- ✅ 响应式菜单

### 响应式设计
- ✅ 桌面版（1200px+）
- ✅ 平板版（768px-1200px）
- ✅ 手机版（480px-768px）
- ✅ 超小屏幕（<480px）

---

## 🔒 安全建议

1. **密钥管理**：
   - 不在代码中存储 API 密钥
   - 使用环境变量 `.env`

2. **认证令牌**：
   - 使用 JWT 令牌
   - 存储在 httpOnly Cookie
   - 定期刷新令牌

3. **CSRF 防护**：
   - 使用 CSRF 令牌
   - 验证 Origin/Referer 头

4. **XSS 防护**：
   - 使用 Vue3 自动转义
   - 避免 v-html 使用

5. **SQL 注入防护**：
   - 使用参数化查询
   - 服务端验证所有输入

---

## 📧 联系方式

**项目位置**: `e:\Projects\东丽\Tpch\test-vue3`  
**开发服务器**: `http://localhost:5174`  
**启动命令**: `npm run dev`

---

*最后更新：2026年 | Vue 3 + TypeScript + ElementPlus*
