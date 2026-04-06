<template>
  <view class="page">
    <view class="card overview-card">
      <text class="title2">统计概览</text>
      <view class="stats">
        <view class="stat"><text class="k">学习时长</text><text class="v">{{ studyText }}</text></view>
        <view class="stat"><text class="k">正确率</text><text class="v">{{ accuracy }}%</text></view>
      </view>
      <view class="progress-panel">
        <view class="progress-head">
          <text class="k">总进度</text>
          <text class="meta">{{ completedCount }} / {{ totalQuestionCount }}</text>
        </view>
        <view class="bar large"><view class="fill warm" :style="{ width: overallProgress + '%' }"></view></view>
      </view>
    </view>

    <view class="card">
      <view class="records">
        <text class="title2">练习记录</text>
        <view v-if="practiceRecords.length">
          <view v-for="record in practiceRecords" :key="record.id" class="record-card">
            <view class="record-head">
              <text class="record-title">{{ record.modeLabel }}</text>
              <text class="record-time">{{ formatDate(record.finishedAt) }}</text>
            </view>
            <text class="record-line">文章：{{ record.articleLabel }}</text>
            <text class="record-line">练习时长：{{ formatDuration(record.durationSeconds) }}</text>
            <text class="record-line">总题数：{{ record.totalQuestionCount || record.uniqueAnsweredCount || record.answeredCount || 0 }}</text>
            <text class="record-line">正确 {{ record.correctCount }} · 错误 {{ record.wrongCount }} · 正确率：{{ record.accuracy }}%</text>
            <view class="record-actions">
              <button
                v-if="isH5"
                class="primary mini report-btn"
                :disabled="generatingRecordId === record.id"
                @tap="downloadReport(record)"
              >
                {{ generatingRecordId === record.id ? '生成中...' : '生成 PDF 报告' }}
              </button>
              <text v-else class="report-note">PDF 报告仅支持 H5 网页端导出</text>
            </view>
          </view>
        </view>
        <view v-else class="empty">完成一次答题后，这里会自动生成练习记录</view>
      </view>
    </view>
  </view>
</template>

<script>
import { articleOptions, totalQuestionCount } from '../../data/question-bank'
import { getPracticeRecords, getStats } from '../../utils/storage'

const IS_H5 = process.env.UNI_PLATFORM === 'h5'

export default {
  data() {
    return {
      articleOptions,
      totalQuestionCount,
      stats: getStats(),
      practiceRecords: getPracticeRecords(),
      generatingRecordId: '',
      isH5: IS_H5
    }
  },
  computed: {
    completedCount() {
      return (this.stats.completedQuestionIds || []).length
    },
    accuracy() {
      return this.stats.answeredCount ? Math.round((this.stats.correctCount / this.stats.answeredCount) * 100) : 0
    },
    overallProgress() {
      return this.totalQuestionCount ? Math.round((this.completedCount / this.totalQuestionCount) * 100) : 0
    },
    studyText() {
      const total = this.stats.totalStudySeconds || 0
      const h = String(Math.floor(total / 3600)).padStart(2, '0')
      const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
      const s = String(total % 60).padStart(2, '0')
      return `${h}:${m}:${s}`
    }
  },
  onShow() {
    this.stats = getStats()
    this.practiceRecords = getPracticeRecords()
  },
  methods: {
    async downloadReport(record) {
      if (!record) {
        return
      }

      if (!record.details || !record.details.length) {
        uni.showToast({ title: '这条旧记录缺少明细，无法生成完整报告', icon: 'none' })
        return
      }

      this.generatingRecordId = record.id

      // #ifdef H5
      try {
        const { downloadPracticeRecordPdf } = await import('../../utils/practice-report')
        await downloadPracticeRecordPdf(record)
      } catch (error) {
        uni.showToast({ title: '报告生成失败，请稍后重试', icon: 'none' })
      } finally {
        this.generatingRecordId = ''
      }
      // #endif

      // #ifndef H5
      this.generatingRecordId = ''
      uni.showToast({ title: '当前仅支持网页端下载 PDF 报告', icon: 'none' })
      // #endif
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
    },
    formatDuration(totalSeconds) {
      const safeSeconds = Number(totalSeconds || 0)
      const h = String(Math.floor(safeSeconds / 3600)).padStart(2, '0')
      const m = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0')
      const s = String(safeSeconds % 60).padStart(2, '0')
      return `${h}:${m}:${s}`
    }
  }
}
</script>

<style>
.page{min-height:100vh;padding:24rpx;box-sizing:border-box;background:linear-gradient(180deg,#fff8ef,#f1f5fb)}
.card{background:#fff;border-radius:24rpx;padding:24rpx;box-shadow:0 12rpx 32rpx rgba(0,0,0,.06)}
.overview-card{margin-bottom:24rpx}
.title2{display:block;font-size:30rpx;font-weight:700;color:#243447}
.meta,.k{display:block;color:#64748b}
.stats{display:flex;gap:12rpx;flex-wrap:nowrap;margin-top:18rpx}
.stat{width:calc(50% - 6rpx);padding:20rpx;background:#f8fafc;border-radius:18rpx}
.v{display:block;font-size:34rpx;font-weight:700;color:#243447;margin-top:8rpx}
.progress-panel{margin-top:18rpx}
.progress-head{display:flex;align-items:center;justify-content:space-between;gap:12rpx;flex-wrap:wrap}
.bar{height:14rpx;background:#edf2f7;border-radius:999rpx;overflow:hidden;margin:12rpx 0 18rpx}
.bar.large{height:18rpx}
.fill{height:100%;background:linear-gradient(90deg,#f59f42,#ea5f3d)}
.fill.warm{background:linear-gradient(90deg,#f6b14a,#ff7b54)}
.records{min-width:0}
.record-card{padding:22rpx;background:#f8fafc;border-radius:20rpx}
.record-card + .record-card{margin-top:14rpx}
.records .title2{margin-bottom:20rpx}
.record-head{display:flex;align-items:center;justify-content:space-between;gap:12rpx;flex-wrap:wrap}
.record-title{font-size:28rpx;font-weight:700;color:#243447}
.record-time,.record-line{display:block;font-size:24rpx;line-height:1.7;color:#64748b}
.record-line{margin-top:4rpx}
.record-actions{display:flex;justify-content:flex-end;margin-top:16rpx}
.report-note{display:block;font-size:24rpx;line-height:1.6;color:#94a3b8}
.primary{margin:0;border-radius:999rpx;font-size:28rpx;background:#e47d36;color:#fff}
.mini{flex:none;min-width:180rpx;font-size:24rpx}
.report-btn[disabled]{opacity:.65}
.empty{text-align:center;color:#64748b;padding:30rpx 0}
@media (max-width: 560px){
  .stats{gap:10rpx}
  .stat{width:calc(50% - 5rpx);padding:18rpx}
  .v{font-size:30rpx}
}
</style>
