<template>
  <div class="list-container">
    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索关键词..."
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-select
            v-model="filterForm.category"
            placeholder="选择分类"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="AI编程" value="ai-coding" />
            <el-option label="Web开发" value="web" />
            <el-option label="移动开发" value="mobile" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-button type="primary" @click="handleSearch" style="width: 100%">
            搜索
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 列表 -->
    <div class="articles-list">
      <el-empty
        v-if="articles.length === 0"
        description="暂无文章"
      />

      <div
        v-for="article in articles"
        :key="article.id"
        class="article-item"
        @click="goToDetail(article.id)"
      >
        <div class="article-header">
          <h3 class="article-title">{{ article.title }}</h3>
          <div class="article-meta">
            <el-tag type="info" size="small">{{ article.category }}</el-tag>
            <span class="article-date">{{ formatDate(article.createTime) }}</span>
          </div>
        </div>

        <div class="article-content">
          <p class="article-description">{{ article.description }}</p>
        </div>

        <div class="article-footer">
          <div class="article-stats">
            <span><el-icon><View /></el-icon> {{ article.views }}</span>
            <span><el-icon><ChatDotRound /></el-icon> {{ article.comments }}</span>
            <span 
              class="like-button"
              :class="{ liked: userLikes.has(article.id) }"
              @click.stop="toggleLike(article.id)"
            >
              <el-icon><Star /></el-icon> {{ article.likes }}
            </span>
          </div>
          <div class="article-author">
            <el-avatar :size="24" :src="article.author.avatar"></el-avatar>
            <span>{{ article.author.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <!-- 已移除分页控件，改为无限滚动 -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, ChatDotRound, Star } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

interface Article {
  id: string
  title: string
  description: string
  category: string
  content: string
  views: number
  comments: number
  likes: number
  createTime: string
  author: {
    name: string
    avatar: string
  }
}

const router = useRouter()
const userStore = useUserStore()
const userLikes = ref<Set<string>>(new Set())

const filterForm = reactive({
  keyword: '',
  category: ''
})

const articles = ref<Article[]>([])
const loadingMore = ref(false)
const hasMore = ref(true)
let loadedPage = 1
const PAGE_SIZE = 10

// 模拟数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: '前特斯拉 AI 总监：AI 编程最大的谎言，是"提效"',
    description: '前两天，前特斯拉 AI 总监 Andrej Karpathy 在 X 上发了一条长的关于 Claude 编码的感悟，内容是他最近几个月使用 Claude 编控的一些随机笔记。结果话题热子百遍了，阅读量超过 600 万。',
    category: 'AI编程',
    content: '这是一篇关于 AI 编程效率的深度思考...',
    views: 903,
    comments: 5,
    likes: 70,
    createTime: '2026-02-03',
    author: {
      name: '代码父亲',
      avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
    }
  },
  {
    id: '2',
    title: '2025年前端要学什么技术栈',
    description: '2025 年的开发者在学习什么，前端开发需要学什么。本篇将为前端开发者指点迷津，让新手们在 web 全栈学习路上少走弯路。',
    category: 'Web开发',
    content: '2025 年的前端技术发展趋势...',
    views: 1500,
    comments: 8,
    likes: 114,
    createTime: '2026-02-02',
    author: {
      name: 'EripanOmer',
      avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
    }
  },
  {
    id: '3',
    title: '断掉前端魂魄死了？',
    description: '这以上面了，到 Reddit 看前端的种种吐槽，就会发现许多人都在质疑前端是否真的死了。但是就像许多人说的，前端永不死。',
    category: 'Web开发',
    content: '前端发展的过去和现在...',
    views: 2000,
    comments: 10,
    likes: 101,
    createTime: '2026-02-01',
    author: {
      name: 'suke',
      avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
    }
  },
  {
    id: '4',
    title: '超越！优秀前端做的是什么分层架构！',
    description: '好的架构设计对一个项目的重要性，不言而喻。为什么要做分层，分层的意义。本文将带你了解前端分层架构的本质。',
    category: 'Web开发',
    content: '前端分层架构的设计思想...',
    views: 1300,
    comments: 6,
    likes: 67,
    createTime: '2026-01-31',
    author: {
      name: '晨曦</晨曦',
      avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
    }
  },
  {
    id: '5',
    title: '相信为什么叫越技术人员',
    description: '网友一：那位大佬，师傅学艺飞；OpenAI 创始成员之二；后来去特斯拉当了 AI 总监，负责自动驾驶的视觉系统。',
    category: 'AI编程',
    content: '技术人员的职业发展路径...',
    views: 800,
    comments: 4,
    likes: 50,
    createTime: '2026-01-30',
    author: {
      name: '代码父亲',
      avatar: 'https://cube.elemecdn.com/0/88/03b0f1b1f1a309a7fa23f36b27afbc94.jpg'
    }
  }
]

const loadArticles = (append = false) => {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  setTimeout(() => {
    const start = (loadedPage - 1) * PAGE_SIZE
    const newArticles = mockArticles.slice(start, start + PAGE_SIZE)
    if (append) {
      articles.value = articles.value.concat(newArticles)
    } else {
      articles.value = newArticles
    }
    loadedPage++
    if (start + PAGE_SIZE >= mockArticles.length) {
      hasMore.value = false
    }
    loadingMore.value = false
  }, 600)
}

const handleSearch = () => {
  loadArticles()
}

const toggleLike = (articleId: string) => {
  if (!userStore.isLogin) {
    userStore.showLoginDialog = true
    return
  }

  if (userLikes.value.has(articleId)) {
    userLikes.value.delete(articleId)
    const article = articles.value.find(a => a.id === articleId)
    if (article) article.likes--
    ElMessage.success('已取消点赞')
  } else {
    userLikes.value.add(articleId)
    const article = articles.value.find(a => a.id === articleId)
    if (article) article.likes++
    ElMessage.success('点赞成功')
  }
}

const goToDetail = (id: string) => {
  router.push({ name: 'Detail', params: { id } })
}

const formatDate = (date: string) => {
  return date
}

const handleScroll = () => {
  const scrollContainer = document.querySelector('.list-container')
  if (!scrollContainer) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    loadArticles(true)
  }
}

onMounted(() => {
  loadArticles()
  const scrollContainer = document.querySelector('.list-container')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.list-container {
  width: 100%;
  max-width: 85%;
  margin: 0 auto;
  padding: 30px 0;
}

.search-card {
  margin-bottom: 20px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item {
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
}

.article-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.article-header {
  margin-bottom: 12px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.article-date {
  font-size: 12px;
  color: #999;
}

.article-content {
  margin-bottom: 12px;
}

.article-description {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
  flex-wrap: wrap;
  gap: 20px;
}

.article-stats {
  display: flex;
  gap: 20px;
}

.article-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-stats .like-button {
  cursor: pointer;
  color: #999;
  transition: all 0.3s;
}

.article-stats .like-button:hover {
  color: #f5222d;
}

.article-stats .like-button.liked {
  color: #f5222d;
}

.article-stats .like-button.liked :deep(.el-icon) {
  fill: #f5222d;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .list-container {
    max-width: 90%;
    padding: 20px 0;
  }
}

@media (max-width: 768px) {
  .list-container {
    max-width: 95%;
    padding: 15px 10px;
  }

  .article-item {
    padding: 15px;
  }

  .article-title {
    font-size: 14px;
  }

  .article-description {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }

  .article-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .article-stats {
    gap: 15px;
    font-size: 11px;
  }

  .article-author {
    gap: 6px;
  }

  :deep(.el-col) {
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .list-container {
    padding: 10px 8px;
  }

  .article-item {
    padding: 12px;
  }

  .article-title {
    font-size: 13px;
  }

  .article-description {
    font-size: 12px;
  }

  .article-stats {
    flex-wrap: wrap;
    gap: 10px;
    font-size: 10px;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  :deep(.el-button) {
    font-size: 12px;
    padding: 4px 8px;
  }

  :deep(.el-pagination) {
    margin-top: 15px;
  }
}
</style>
