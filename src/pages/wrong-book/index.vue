<template>
  <view class="page">
    <view class="card">
      <view class="head">
        <text class="title2">错题本</text>
        <button class="ghost mini" :disabled="!wrongBook.length" @tap="clearWrongs">清空</button>
      </view>

      <view class="filters">
        <view class="filter-intro">
          <text class="filter-title">筛选错题</text>
          <text class="filter-hint">按文章或时间快速查看想复习的错题</text>
        </view>
        <view class="filter-bar">
          <view
            class="filter-trigger"
            :class="{ active: hasArticleFilter || activePanel === 'article' }"
            @tap.stop="openFilterPanel('article')"
            @click.stop="openFilterPanel('article')"
          >
            <text class="filter-trigger-text">文章筛选</text>
            <text class="filter-trigger-arrow" :class="{ open: activePanel === 'article' }">▼</text>
          </view>
          <view
            class="filter-trigger"
            :class="{ active: hasDateFilter || activePanel === 'date' }"
            @tap.stop="openFilterPanel('date')"
            @click.stop="openFilterPanel('date')"
          >
            <text class="filter-trigger-text">时间筛选</text>
            <text class="filter-trigger-arrow" :class="{ open: activePanel === 'date' }">▼</text>
          </view>
          <view
            class="filter-trigger"
            :class="{ active: hasCustomSort || activePanel === 'sort' }"
            @tap.stop="openFilterPanel('sort')"
            @click.stop="openFilterPanel('sort')"
          >
            <text class="filter-trigger-text">排序</text>
            <text class="filter-trigger-arrow" :class="{ open: activePanel === 'sort' }">▼</text>
          </view>
        </view>

        <view v-if="hasActiveFilters || hasCustomSort" class="filter-summary">
          <text v-if="hasArticleFilter" class="filter-chip">文章：{{ currentArticleSummary }}</text>
          <text v-if="hasDateFilter" class="filter-chip">时间：{{ currentDateSummary }}</text>
          <text v-if="hasCustomSort" class="filter-chip">排序：{{ currentSortSummary }}</text>
        </view>

        <view v-if="activePanel === 'article'" class="filter-dropdown" @tap.stop @click.stop>
          <scroll-view class="filter-options" scroll-y>
            <view
              v-for="item in articleFilterOptions"
              :key="item.value || 'all'"
              class="filter-option"
              :class="{ on: draftArticleId === item.value }"
              @tap.stop="chooseDraftArticle(item.value)"
              @click.stop="chooseDraftArticle(item.value)"
            >
              <text class="filter-option-text">{{ item.label }}</text>
              <text v-if="draftArticleId === item.value" class="filter-option-check">✓</text>
            </view>
          </scroll-view>
          <view class="filter-actions">
            <button class="ghost mini action-btn" @tap="resetArticleFilter">重置</button>
            <button class="primary mini action-btn" @tap="confirmArticleFilter">确定</button>
          </view>
        </view>

        <view v-if="activePanel === 'date'" class="filter-dropdown" @tap.stop @click.stop>
          <view class="date-row">
            <text class="date-label">开始日期</text>
            <picker mode="date" :value="draftStartDate" @change="setDraftStartDate">
              <view class="date-picker">{{ draftStartDate || '不限' }}</view>
            </picker>
          </view>
          <view class="date-row">
            <text class="date-label">结束日期</text>
            <picker mode="date" :value="draftEndDate" @change="setDraftEndDate">
              <view class="date-picker">{{ draftEndDate || '不限' }}</view>
            </picker>
          </view>
          <view class="filter-actions">
            <button class="ghost mini action-btn" @tap="resetDateFilter">重置</button>
            <button class="primary mini action-btn" @tap="confirmDateFilter">确定</button>
          </view>
        </view>

        <view v-if="activePanel === 'sort'" class="filter-dropdown" @tap.stop @click.stop>
          <view class="sort-block">
            <text class="sort-label">排序依据</text>
            <view class="sort-segment">
              <view
                class="sort-pill"
                :class="{ on: draftSortField === 'time' }"
                @tap.stop="chooseDraftSortField('time')"
                @click.stop="chooseDraftSortField('time')"
              >
                时间
              </view>
              <view
                class="sort-pill"
                :class="{ on: draftSortField === 'wrongCount' }"
                @tap.stop="chooseDraftSortField('wrongCount')"
                @click.stop="chooseDraftSortField('wrongCount')"
              >
                错误次数
              </view>
            </view>
          </view>
          <view class="sort-block">
            <text class="sort-label">排序方向</text>
            <view class="sort-segment">
              <view
                class="sort-pill"
                :class="{ on: draftSortDirection === 'desc' }"
                @tap.stop="chooseDraftSortDirection('desc')"
                @click.stop="chooseDraftSortDirection('desc')"
              >
                降序
              </view>
              <view
                class="sort-pill"
                :class="{ on: draftSortDirection === 'asc' }"
                @tap.stop="chooseDraftSortDirection('asc')"
                @click.stop="chooseDraftSortDirection('asc')"
              >
                升序
              </view>
            </view>
          </view>
          <view class="filter-actions">
            <button class="ghost mini action-btn" @tap="resetSort">重置</button>
            <button class="primary mini action-btn" @tap="confirmSort">确定</button>
          </view>
        </view>
      </view>

      <view v-if="filteredWrongBook.length">
        <view v-for="item in filteredWrongBook" :key="item.id" class="wrong">
          <text class="meta">{{ item.articleLabel || item.articleTitle || item.category }} · 单选题</text>
          <text class="meta">{{ item.category }}</text>
          <text class="word-stem">{{ item.stem || item.question }}</text>
          <text class="question">{{ item.question }}</text>
          <text v-for="option in item.options" :key="option.key" class="plain">{{ option.key }}. {{ option.text }}</text>
          <text class="plain">正确答案：{{ showAnswer(item, item.correctAnswer) }}</text>
          <text class="plain">最近一次答案：{{ showAnswer(item, item.userAnswer) || '未作答' }}</text>
          <text class="plain">解析：{{ item.explanation }}</text>
          <text class="meta">错误次数：{{ item.wrongCount }} · {{ formatDate(item.updatedAt) }}</text>
          <button class="ghost mini" @tap="removeWrong(item.id)">移除</button>
        </view>
      </view>

      <view v-else class="empty">{{ wrongBook.length ? '当前筛选条件下没有错题' : '错题会自动记录到这里' }}</view>
    </view>

    <view v-if="activePanel" class="overlay" @tap="closeFilterPanel" @click="closeFilterPanel"></view>
  </view>
</template>

<script>
import { articleOptions } from '../../data/question-bank'
import { addStudySeconds, clearWrongBook, getWrongBook, removeWrongQuestion } from '../../utils/storage'

export default {
  data() {
    return {
      wrongBook: [],
      articleFilterOptions: [{ value: '', label: '全部文章' }].concat(
        articleOptions.map((item) => ({ value: item.value, label: item.label }))
      ),
      selectedArticleId: '',
      startDate: '',
      endDate: '',
      activePanel: '',
      draftArticleId: '',
      draftStartDate: '',
      draftEndDate: '',
      sortField: 'time',
      sortDirection: 'desc',
      draftSortField: 'time',
      draftSortDirection: 'desc',
      pageStartedAt: 0
    }
  },
  computed: {
    hasArticleFilter() {
      return Boolean(this.selectedArticleId)
    },
    hasDateFilter() {
      return Boolean(this.startDate || this.endDate)
    },
    currentArticleSummary() {
      const current = this.articleFilterOptions.find((item) => item.value === this.selectedArticleId)
      return current ? current.label : '全部文章'
    },
    currentDateSummary() {
      const start = this.startDate || '不限'
      const end = this.endDate || '不限'
      return `${start} 至 ${end}`
    },
    hasCustomSort() {
      return this.sortField !== 'time' || this.sortDirection !== 'desc'
    },
    currentSortSummary() {
      const fieldLabel = this.sortField === 'wrongCount' ? '错误次数' : '时间'
      const directionLabel = this.sortDirection === 'asc' ? '升序' : '降序'
      return `${fieldLabel}${directionLabel}`
    },
    hasActiveFilters() {
      return Boolean(this.startDate || this.endDate || this.selectedArticleId)
    },
    filteredWrongBook() {
      const filtered = this.wrongBook.filter((item) => {
        if (this.selectedArticleId && item.articleId !== this.selectedArticleId) {
          return false
        }

        const updatedAt = new Date(item.updatedAt || '')
        const updatedTime = updatedAt.getTime()
        if (Number.isNaN(updatedTime)) {
          return !this.startDate && !this.endDate
        }

        if (this.startDate) {
          const startTime = new Date(`${this.startDate}T00:00:00`).getTime()
          if (updatedTime < startTime) {
            return false
          }
        }

        if (this.endDate) {
          const endTime = new Date(`${this.endDate}T23:59:59`).getTime()
          if (updatedTime > endTime) {
            return false
          }
        }

        return true
      })

      return filtered.slice().sort((left, right) => {
        let compareValue = 0

        if (this.sortField === 'wrongCount') {
          compareValue = (left.wrongCount || 0) - (right.wrongCount || 0)
        } else {
          const leftTime = new Date(left.updatedAt || '').getTime()
          const rightTime = new Date(right.updatedAt || '').getTime()
          compareValue = (Number.isNaN(leftTime) ? 0 : leftTime) - (Number.isNaN(rightTime) ? 0 : rightTime)
        }

        return this.sortDirection === 'asc' ? compareValue : -compareValue
      })
    }
  },
  onShow() {
    this.wrongBook = getWrongBook()
    this.activePanel = ''
    this.pageStartedAt = Date.now()
  },
  onHide() {
    this.flushStudyTime()
  },
  onUnload() {
    this.flushStudyTime()
  },
  methods: {
    flushStudyTime() {
      if (!this.pageStartedAt) {
        return
      }
      addStudySeconds(Math.floor((Date.now() - this.pageStartedAt) / 1000))
      this.pageStartedAt = 0
    },
    showAnswer(item, answerKey) {
      const option = (item.options || []).find((entry) => entry.key === answerKey)
      return option ? `${option.key}. ${option.text}` : answerKey
    },
    clearWrongs() {
      uni.showModal({
        title: '确认清空',
        content: '清空后，所有错题将不可见，是否继续清空？',
        confirmText: '清空',
        cancelText: '取消',
        success: ({ confirm }) => {
          if (confirm) {
            this.wrongBook = clearWrongBook()
          }
        }
      })
    },
    openFilterPanel(panel) {
      if (this.activePanel === panel) {
        this.closeFilterPanel()
        return
      }

      this.activePanel = panel
      this.draftArticleId = this.selectedArticleId
      this.draftStartDate = this.startDate
      this.draftEndDate = this.endDate
      this.draftSortField = this.sortField
      this.draftSortDirection = this.sortDirection
    },
    closeFilterPanel() {
      this.activePanel = ''
    },
    chooseDraftArticle(articleId) {
      this.draftArticleId = articleId
    },
    confirmArticleFilter() {
      this.selectedArticleId = this.draftArticleId
      this.closeFilterPanel()
    },
    resetArticleFilter() {
      this.draftArticleId = ''
      this.selectedArticleId = ''
      this.closeFilterPanel()
    },
    setDraftStartDate(event) {
      this.draftStartDate = event.detail.value
    },
    setDraftEndDate(event) {
      this.draftEndDate = event.detail.value
    },
    confirmDateFilter() {
      this.startDate = this.draftStartDate
      this.endDate = this.draftEndDate
      this.closeFilterPanel()
    },
    resetDateFilter() {
      this.draftStartDate = ''
      this.draftEndDate = ''
      this.startDate = ''
      this.endDate = ''
      this.closeFilterPanel()
    },
    chooseDraftSortField(field) {
      this.draftSortField = field
    },
    chooseDraftSortDirection(direction) {
      this.draftSortDirection = direction
    },
    confirmSort() {
      this.sortField = this.draftSortField
      this.sortDirection = this.draftSortDirection
      this.closeFilterPanel()
    },
    resetSort() {
      this.draftSortField = 'time'
      this.draftSortDirection = 'desc'
      this.sortField = 'time'
      this.sortDirection = 'desc'
      this.closeFilterPanel()
    },
    removeWrong(id) {
      uni.showModal({
        title: '确认移除',
        content: '移除后，这道错题将不可见，是否继续移除？',
        confirmText: '移除',
        cancelText: '取消',
        success: ({ confirm }) => {
          if (confirm) {
            this.wrongBook = removeWrongQuestion(id)
          }
        }
      })
    },
    formatDate(value) {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        return '未知时间'
      }
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const mm = String(date.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${d} ${h}:${mm}`
    }
  }
}
</script>

<style>
.page{min-height:100vh;padding:24rpx;box-sizing:border-box;background:linear-gradient(180deg,#fff8ef,#f1f5fb)}
.card{background:#fff;border-radius:24rpx;padding:24rpx;box-shadow:0 12rpx 32rpx rgba(0,0,0,.06)}
.head{display:flex;align-items:center;justify-content:space-between;gap:12rpx;flex-wrap:wrap}
.title2{display:block;font-size:30rpx;font-weight:700;color:#243447}
.filters{position:relative;margin-top:18rpx;padding:20rpx 22rpx;background:linear-gradient(180deg,#fbfcfe,#f7fafd);border:2rpx solid #e7edf3;border-radius:22rpx;overflow:visible;z-index:30}
.filter-intro{display:flex;flex-direction:column;gap:6rpx;align-items:center;text-align:center}
.filter-title{font-size:28rpx;font-weight:700;color:#243447}
.filter-hint{font-size:23rpx;line-height:1.6;color:#708092}
.filter-bar{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:20rpx;margin-top:18rpx}
.filter-trigger{display:flex;align-items:center;justify-content:center;gap:10rpx;flex:1 1 180rpx;max-width:240rpx;min-width:0;padding:16rpx 24rpx;box-sizing:border-box;background:#fff;border:2rpx solid #dde6ef;border-radius:999rpx;font-size:27rpx;font-weight:600;color:#51606f;box-shadow:0 8rpx 20rpx rgba(61,84,111,.06)}
.filter-trigger.active{color:#e47d36;border-color:rgba(228,125,54,.32);background:#fff7f0;box-shadow:0 10rpx 22rpx rgba(228,125,54,.10)}
.filter-trigger-text{line-height:1.3;min-width:0}
.filter-trigger-arrow{font-size:18rpx;color:inherit;transition:transform .2s ease}
.filter-trigger-arrow.open{transform:rotate(180deg)}
.filter-summary{display:flex;justify-content:center;flex-wrap:wrap;gap:12rpx;margin-top:16rpx}
.filter-chip{padding:10rpx 18rpx;background:#fff7f0;border:2rpx solid rgba(228,125,54,.18);border-radius:999rpx;font-size:22rpx;line-height:1.4;color:#b86423}
.filter-dropdown{position:absolute;top:calc(100% + 16rpx);left:0;right:0;margin-top:0;padding:18rpx;background:#fff;border:2rpx solid #d8e0ea;border-radius:20rpx;box-shadow:0 18rpx 36rpx rgba(26,44,72,.14);z-index:40}
.filter-options{max-height:360rpx}
.filter-option{display:flex;align-items:center;justify-content:space-between;gap:14rpx;padding:16rpx 18rpx;border-radius:16rpx}
.filter-option + .filter-option{margin-top:6rpx}
.filter-option.on{background:#fdf1e4}
.filter-option-text{flex:1;font-size:25rpx;line-height:1.6;color:#334155}
.filter-option-check{font-size:22rpx;font-weight:700;color:#e47d36}
.sort-block + .sort-block{margin-top:18rpx}
.sort-label{display:block;font-size:25rpx;font-weight:600;color:#334155;margin-bottom:12rpx}
.sort-segment{display:flex;gap:14rpx;flex-wrap:wrap}
.sort-pill{padding:14rpx 28rpx;background:#f8fafc;border:2rpx solid #dde6ef;border-radius:999rpx;font-size:24rpx;color:#526171}
.sort-pill.on{background:#fff7f0;border-color:rgba(228,125,54,.32);color:#d46f26;box-shadow:0 8rpx 18rpx rgba(228,125,54,.10)}
.date-row{display:flex;align-items:center;justify-content:space-between;gap:16rpx}
.date-row + .date-row{margin-top:14rpx}
.date-label{font-size:26rpx;font-weight:600;color:#334155}
.date-picker{min-width:300rpx;padding:14rpx 18rpx;background:#f8fafc;border:2rpx solid #d8e0ea;border-radius:16rpx;font-size:25rpx;color:#435163;text-align:right}
.filter-actions{display:flex;justify-content:flex-end;gap:14rpx;margin-top:18rpx}
.meta,.plain,.question{display:block;font-size:28rpx;line-height:1.7;color:#334155}
.meta{font-size:24rpx;color:#64748b}
.wrong{margin-top:18rpx;padding:22rpx;background:#f8fafc;border-radius:20rpx}
.word-stem{display:block;margin-top:14rpx;font-size:34rpx;font-weight:700;color:#1d4d7a}
.question{margin-top:10rpx}
.ghost{margin:0;border-radius:999rpx;font-size:28rpx;background:#fff;color:#435163;border:2rpx solid #d8e0ea}
.primary{margin:0;border-radius:999rpx;font-size:28rpx;background:#e47d36;color:#fff}
.mini{flex:none;min-width:140rpx;font-size:24rpx}
.action-btn{min-width:156rpx}
.empty{text-align:center;color:#64748b;padding:40rpx 0}
.overlay{position:fixed;inset:0;background:rgba(15,23,42,.14);z-index:20}
@media (max-width: 560px){
  .filters{padding:18rpx}
  .filter-bar{gap:16rpx}
  .filter-trigger{flex-basis:100%;max-width:none;font-size:26rpx}
}
</style>
