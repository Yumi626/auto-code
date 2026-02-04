<template>
  <div class="detail-page">
    <!-- 左侧操作栏 -->
    <aside class="detail-left-sidebar">
      <div class="action-item" title="点赞">
        <el-icon :class="{ active: isLiked }" @click="toggleLike"><Star /></el-icon>
        <span>{{ likesCount }}</span>
      </div>
      <div class="action-item" title="评论">
        <el-icon><ChatDotRound /></el-icon>
        <span>{{ article.comments }}</span>
      </div>
      <div class="action-item" title="收藏" @click="toggleCollection">
        <el-icon :class="{ active: isCollected }"><Star /></el-icon>
        <span>{{ isCollected ? '已收藏' : '收藏' }}</span>
      </div>
      <div class="action-item" title="分享">
        <el-icon><Share /></el-icon>
      </div>
      <div class="action-item" title="举报">
        <el-icon><Warning /></el-icon>
      </div>
      <div class="action-item" title="更多">
        <el-icon><MoreFilled /></el-icon>
      </div>
    </aside>

    <!-- 中间主要内容 -->
    <main class="detail-main-content">
      <div class="article-container">
        <!-- 文章标题和作者信息 -->
        <div class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta-info">
            <div class="author-section">
              <el-avatar :src="article.author.avatar" :size="40"></el-avatar>
              <div class="author-details">
                <div class="author-name">{{ article.author.name }}</div>
                <div class="article-info-row">
                  <span>{{ formatDate(article.createTime) }}</span>
                  <span>·</span>
                  <span>阅读 {{ article.views }}</span>
                </div>
              </div>
            </div>
            <el-button type="primary">关注</el-button>
          </div>
        </div>

        <el-divider />

        <!-- 文章内容 -->
        <div class="article-body">
          <p>{{ article.content }}</p>
        </div>

        <el-divider />

        <!-- 标签 -->
        <div class="article-tags-section">
          <el-tag type="info">编程</el-tag>
          <el-tag type="info">JavaScript</el-tag>
          <el-tag type="info">前端</el-tag>
        </div>

        <el-divider />

        <!-- 底部操作 -->
        <div class="article-footer-actions">
          <el-button type="default">
            <el-icon><Star /></el-icon>
            点赞 ({{ likesCount }})
          </el-button>
          <el-button type="default">
            <el-icon><ChatDotRound /></el-icon>
            评论 ({{ article.comments }})
          </el-button>
          <el-button type="default">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h3>评论 ({{ article.comments }})</h3>
          <el-input
            v-model="commentForm.content"
            type="textarea"
            placeholder="发表评论..."
            :rows="3"
            style="margin-bottom: 12px"
          />
          <el-button type="primary" @click="submitComment">
            发表评论
          </el-button>

          <el-divider />

          <div class="comments-list">
            <div v-if="comments.length === 0" class="empty-comments">
              还没有评论，来抢沙发吧！
            </div>
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-header">
                <el-avatar :src="comment.author.avatar" :size="32"></el-avatar>
                <div class="comment-info">
                  <div class="comment-author">{{ comment.author.name }}</div>
                  <div class="comment-time">{{ formatDate(comment.createTime) }}</div>
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <span class="action-btn">赞</span>
                <span class="action-btn">回复</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 右侧信息栏 -->
    <aside class="detail-right-sidebar">
      <!-- 作者信息卡 -->
      <div class="author-card">
        <div class="card-title">作者</div>
        <div class="card-content">
          <div class="author-profile">
            <el-avatar :src="article.author.avatar" :size="60"></el-avatar>
            <div class="author-info">
              <div class="author-name">{{ article.author.name }}</div>
              <div class="author-desc">前端开发者</div>
            </div>
          </div>
          <div class="author-stats">
            <div class="stat-item">
              <div class="stat-value">137</div>
              <div class="stat-label">文章</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">40k</div>
              <div class="stat-label">阅读</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">26</div>
              <div class="stat-label">粉丝</div>
            </div>
          </div>
          <el-button type="primary" style="width: 100%">关注</el-button>
          <el-button type="default" style="width: 100%; margin-top: 8px">私信</el-button>
        </div>
      </div>

      <!-- 目录 -->
      <div class="toc-card">
        <div class="card-title">目录</div>
        <div class="card-content">
          <div class="toc-item">一、2026年初的碎碎念</div>
          <div class="toc-item">二、年初处标上海</div>
          <div class="toc-item">三、5月套套：坚定"入魂"至一路流...</div>
          <div class="toc-item">四、7月套套：去深圳</div>
          <div class="toc-item">五、8月生活：坚了7天、爬了山、找回...</div>
          <div class="toc-item">六、9-12月：金年台开花，我红绿线</div>
          <div class="toc-item">七、关于自媒体与职能的 Q&A</div>
          <div class="toc-item">八、最后</div>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="recommend-card">
        <div class="card-title">相关推荐</div>
        <div class="card-content">
          <div class="recommend-item">2025年终总结<br><span class="recommend-meta">30阅读 · 0点赞</span></div>
          <div class="recommend-item">AI编程日小结新增部分问题与当选在...<br><span class="recommend-meta">29阅读 · 1点赞</span></div>
          <div class="recommend-item">ComfyUI的读存梦想技让选<br><span class="recommend-meta">66阅读 · 0点赞</span></div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, ChatDotRound, Share, Warning, MoreFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

interface Article {
  id: string
  title: string
  content: string
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

interface Comment {
  id: string
  content: string
  createTime: string
  author: {
    name: string
    avatar: string
  }
}

const route = useRoute()
const userStore = useUserStore()
const isLiked = ref(false)
const isCollected = ref(false)
const likesCount = ref(70)
const commentForm = ref({ content: '' })
const comments = ref<Comment[]>([
  {
    id: '1',
    content: '这篇文章写得不错，学到了很多！',
    createTime: '2026-02-03',
    author: {
      name: '用户A',
      avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
    }
  },
  {
    id: '2',
    content: '同意楼主的观点，AI 编程确实改变了开发方式。',
    createTime: '2026-02-02',
    author: {
      name: '用户B',
      avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
    }
  }
])

const article = ref<Article>({
  id: '',
  title: '2025总结：从应届生到全网20W粉，"稳定发疯"的一年',
  content: `这是一篇关于2025年的总结文章。

2026年初的碎碎念

哈嗯，各位观众老爷们不来好，我是追。现在是2026年1月，深圳这边已经开始工作了，是我的9认没有万万，谢谢文章对我和录数的2025。

作为一个25岁的应届生，回首21年一开做了工，这20W粉，是我意识到全网买了20W粉丝。但是粉都知道，我从21年大一开始做了，这20W粉，是意识到了全网买了一个个20W粉丝。

相关内容，确实工作以后，工作以后，工作以后会讲到的。今年的内容很多让人印象深刻，今年的内容会有一些工作分享与拆解分享。

我想和大家分享一些有意思的内容，感谢关注和支持。`,
  category: 'AI编程',
  views: 95,
  comments: 2,
  likes: 70,
  createTime: '2026-01-22',
  author: {
    name: '程序猿语言',
    avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
  }
})

const toggleLike = () => {
  if (!userStore.isLogin) {
    userStore.showLoginDialog = true
    return
  }
  isLiked.value = !isLiked.value
  likesCount.value = isLiked.value ? likesCount.value + 1 : likesCount.value - 1
  ElMessage.success(isLiked.value ? '已点赞' : '已取消点赞')
}

const submitComment = () => {
  if (!userStore.isLogin) {
    userStore.showLoginDialog = true
    return
  }
  if (!commentForm.value.content.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }

  const newComment: Comment = {
    id: String(comments.value.length + 1),
    content: commentForm.value.content,
    createTime: new Date().toISOString().split('T')[0],
    author: {
      name: '当前用户',
      avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
    }
  }

  comments.value.unshift(newComment)
  commentForm.value.content = ''
  ElMessage.success('评论发表成功')
}

const toggleCollection = () => {
  if (!userStore.isLogin) {
    userStore.showLoginDialog = true
    return
  }
  isCollected.value = !isCollected.value
  ElMessage.success(isCollected.value ? '已收藏' : '已取消收藏')
}

const formatDate = (date: string) => {
  return date
}

onMounted(() => {
  const id = route.params.id as string
  article.value.id = id
})
</script>

<style scoped>
.detail-page {
  display: grid;
  grid-template-columns: 56px 1fr 320px;
  gap: 0;
  background: #f4f5f7;
  min-height: 100vh;
}
.detail-left-sidebar {
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  gap: 32px;
}
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}
.action-item .el-icon {
  font-size: 22px;
  margin-bottom: 2px;
}
.action-item .active {
  color: #1e80ff;
}
.action-item:hover {
  color: #1e80ff;
}
.detail-main-content {
  padding: 0 0 0 0;
  margin: 0 auto;
  max-width: 800px;
}
.article-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 40px 48px 32px 48px;
  margin-top: 32px;
}
.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 8px;
}
.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #222;
  margin: 0 0 12px 0;
  line-height: 1.3;
}
.article-meta-info {
  display: flex;
  align-items: center;
  gap: 18px;
}
.author-section {
  display: flex;
  align-items: center;
  gap: 12px;
}
.author-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #222;
}
.article-info-row {
  font-size: 13px;
  color: #999;
  display: flex;
  gap: 8px;
}
.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin: 24px 0 16px 0;
}
.article-tags-section {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.article-footer-actions {
  display: flex;
  gap: 16px;
  margin: 24px 0 0 0;
}
.article-footer-actions .el-button {
  border-radius: 20px;
  font-size: 14px;
  padding: 0 18px;
  background: #f7f8fa;
  color: #666;
  border: none;
}
.article-footer-actions .el-button:hover {
  background: #eaf2ff;
  color: #1e80ff;
}
.comments-section {
  margin-top: 32px;
}
.comments-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 18px;
}
.comment-item {
  background: #f7f8fa;
  border-radius: 6px;
  padding: 16px 18px;
}
.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.comment-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.comment-time {
  font-size: 12px;
  color: #999;
}
.comment-content {
  font-size: 14px;
  color: #444;
  line-height: 1.7;
  margin-bottom: 6px;
}
.comment-actions {
  display: flex;
  gap: 16px;
  font-size: 13px;
}
.action-btn {
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}
.action-btn:hover {
  color: #1e80ff;
}
.detail-right-sidebar {
  background: none;
  padding-top: 32px;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.author-card, .toc-card, .recommend-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 24px 20px;
}
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
}
.author-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.author-desc {
  font-size: 13px;
  color: #999;
}
.author-stats {
  display: flex;
  gap: 18px;
  margin: 12px 0;
}
.stat-item {
  text-align: center;
}
.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}
.stat-label {
  font-size: 12px;
  color: #999;
}
.toc-card .card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.toc-item {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  padding: 2px 0;
}
.recommend-card .card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.recommend-item {
  font-size: 13px;
  color: #444;
}
.recommend-meta {
  font-size: 12px;
  color: #999;
}
</style>
