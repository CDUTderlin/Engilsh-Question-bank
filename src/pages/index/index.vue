<template>
  <view class="page">
    <view class="hero card">
      <image class="hero-logo" src="/static/snowy-enligsh-logo.svg" mode="widthFix"></image>
      <text class="title">Snowy Enligsh</text>
      <text class="sub">Article vocabulary practice in multiple-choice format.</text>
      <text class="hero-desc">本次题库来自文章《Fall in Love with English》，题干为英文词汇或短语，四个选项为中文释义。</text>
    </view>

    <view class="tabs">
      <view v-for="item in tabs" :key="item" class="tab" :class="{ on: tab === item }" @tap="tab = item">{{ item }}</view>
    </view>

    <view v-if="tab === '刷题'" class="card">
      <view class="filters">
        <picker :range="categoryOptions" :value="findIndex(categoryOptions, selectedCategory)" @change="setFilter('selectedCategory', categoryOptions, $event)">
          <view class="picker">分类：{{ selectedCategory }}</view>
        </picker>
        <picker :range="difficultyOptions" :value="findIndex(difficultyOptions, selectedDifficulty)" @change="setFilter('selectedDifficulty', difficultyOptions, $event)">
          <view class="picker">难度：{{ selectedDifficulty }}</view>
        </picker>
      </view>

      <view v-if="question">
        <text class="meta">{{ question.category }} · {{ question.difficulty }} · 单选题</text>
        <text class="meta">第 {{ currentIndex + 1 }} / {{ filteredQuestions.length }} 题</text>
        <view class="bar"><view class="fill" :style="{ width: progress + '%' }"></view></view>

        <view class="block">
          <text class="label">题干</text>
          <text class="word-stem">{{ question.stem }}</text>
          <text class="question">{{ question.question }}</text>
        </view>

        <view>
          <view
            v-for="option in question.options"
            :key="option.key"
            class="option"
            :class="answered ? (option.key === question.answer ? 'ok' : (selectedOption === option.key ? 'bad' : '')) : (selectedOption === option.key ? 'on' : '')"
            @tap="choose(option.key)"
          >
            <text class="option-key">{{ option.key }}</text>
            <text class="option-text">{{ option.text }}</text>
          </view>
        </view>

        <view class="actions">
          <button class="ghost" :disabled="currentIndex === 0" @tap="prev">上一题</button>
          <button class="primary" v-if="!answered" @tap="submit">提交</button>
          <button class="primary" v-else @tap="next">下一题</button>
        </view>

        <view v-if="answered" class="result" :class="{ ok: result.correct, bad: !result.correct }">
          <text>{{ result.correct ? '回答正确' : '回答错误，已加入错题本' }}</text>
          <text>正确答案：{{ showAnswer(question) }}</text>
          <text>你的答案：{{ showWrongBookAnswer(question, result.userAnswer) || '未作答' }}</text>
          <text>解析：{{ question.explanation }}</text>
        </view>
      </view>
      <view v-else class="empty">当前筛选下暂无题目</view>
    </view>

    <view v-if="tab === '错题本'" class="card">
      <view class="head">
        <text class="title2">错题本</text>
        <button class="ghost mini" :disabled="!wrongBook.length" @tap="clearWrongs">清空</button>
      </view>
      <view v-if="wrongBook.length">
        <view v-for="item in wrongBook" :key="item.id" class="wrong">
          <text class="meta">{{ item.category }} · {{ item.difficulty }} · 单选题</text>
          <text class="word-stem small">{{ item.stem || item.question }}</text>
          <text class="question">{{ item.question }}</text>
          <text v-for="option in item.options" :key="option.key" class="plain">{{ option.key }}. {{ option.text }}</text>
          <text class="plain">正确答案：{{ showWrongBookAnswer(item, item.correctAnswer) }}</text>
          <text class="plain">你的答案：{{ showWrongBookAnswer(item, item.userAnswer) || '未作答' }}</text>
          <text class="plain">解析：{{ item.explanation }}</text>
          <text class="meta">错误次数：{{ item.wrongCount }} · {{ formatDate(item.updatedAt) }}</text>
          <button class="ghost mini" @tap="removeWrong(item.id)">移除</button>
        </view>
      </view>
      <view v-else class="empty">错题会自动记录到这里</view>
    </view>

    <view v-if="tab === '统计'" class="card">
      <text class="title2">学习统计</text>
      <view class="stats">
        <view class="stat"><text class="k">学习时长</text><text class="v">{{ studyText }}</text></view>
        <view class="stat"><text class="k">完成题目</text><text class="v">{{ completedCount }}</text></view>
        <view class="stat"><text class="k">作答次数</text><text class="v">{{ stats.answeredCount }}</text></view>
        <view class="stat"><text class="k">正确率</text><text class="v">{{ accuracy }}%</text></view>
      </view>
      <text class="meta">最近练习：{{ lastPractice }}</text>
      <view class="bar large"><view class="fill warm" :style="{ width: overallProgress + '%' }"></view></view>
      <text class="meta">总进度：{{ completedCount }} / {{ questionBank.length }}</text>
    </view>
  </view>
</template>

<script>
import { questionBank } from '../../data/question-bank'
import { addWrongQuestion, clearWrongBook, getStats, getWrongBook, removeWrongQuestion, saveStats } from '../../utils/storage'

const emptyResult = () => ({ correct: false, userAnswer: '' })

export default {
  data() {
    return {
      questionBank,
      tabs: ['刷题', '错题本', '统计'],
      tab: '刷题',
      selectedCategory: '全部',
      selectedDifficulty: '全部',
      currentIndex: 0,
      selectedOption: '',
      answered: false,
      result: emptyResult(),
      wrongBook: [],
      stats: getStats(),
      liveSeconds: 0,
      startAt: 0,
      timer: null
    }
  },
  computed: {
    categoryOptions() { return ['全部'].concat([...new Set(this.questionBank.map((i) => i.category))]) },
    difficultyOptions() { return ['全部'].concat([...new Set(this.questionBank.map((i) => i.difficulty))]) },
    filteredQuestions() {
      return this.questionBank.filter((i) => (this.selectedCategory === '全部' || i.category === this.selectedCategory) && (this.selectedDifficulty === '全部' || i.difficulty === this.selectedDifficulty))
    },
    question() { return this.filteredQuestions[this.currentIndex] || null },
    completedCount() { return (this.stats.completedQuestionIds || []).length },
    accuracy() { return this.stats.answeredCount ? Math.round(this.stats.correctCount / this.stats.answeredCount * 100) : 0 },
    progress() { return this.filteredQuestions.length ? Math.round((this.currentIndex + 1) / this.filteredQuestions.length * 100) : 0 },
    overallProgress() { return this.questionBank.length ? Math.round(this.completedCount / this.questionBank.length * 100) : 0 },
    studyText() {
      const total = (this.stats.totalStudySeconds || 0) + this.liveSeconds
      const h = String(Math.floor(total / 3600)).padStart(2, '0')
      const m = String(Math.floor(total % 3600 / 60)).padStart(2, '0')
      const s = String(total % 60).padStart(2, '0')
      return `${h}:${m}:${s}`
    },
    lastPractice() { return this.stats.lastPracticedAt ? this.formatDate(this.stats.lastPracticedAt) : '暂无记录' }
  },
  watch: {
    selectedCategory() { this.resetPractice() },
    selectedDifficulty() { this.resetPractice() }
  },
  onLoad() { this.wrongBook = getWrongBook(); this.stats = getStats() },
  onShow() { this.startTimer() },
  onHide() { this.stopTimer() },
  onUnload() { this.stopTimer() },
  methods: {
    findIndex(list, value) { return Math.max(list.indexOf(value), 0) },
    setFilter(field, list, event) { this[field] = list[event.detail.value] },
    resetPractice() { this.currentIndex = 0; this.selectedOption = ''; this.answered = false; this.result = emptyResult() },
    choose(key) { if (!this.answered) this.selectedOption = key },
    prev() { if (this.currentIndex > 0) this.resetForMove(this.currentIndex - 1) },
    next() { if (this.filteredQuestions.length) this.resetForMove((this.currentIndex + 1) % this.filteredQuestions.length) },
    resetForMove(index) { this.currentIndex = index; this.selectedOption = ''; this.answered = false; this.result = emptyResult() },
    submit() {
      if (!this.question) return
      if (!this.selectedOption) return uni.showToast({ title: '请先选择答案', icon: 'none' })

      const userAnswer = this.selectedOption
      const correct = userAnswer === this.question.answer
      this.answered = true
      this.result = { correct, userAnswer }

      const ids = new Set(this.stats.completedQuestionIds || [])
      ids.add(this.question.id)
      this.stats = {
        ...this.stats,
        answeredCount: (this.stats.answeredCount || 0) + 1,
        correctCount: (this.stats.correctCount || 0) + (correct ? 1 : 0),
        completedQuestionIds: [...ids],
        lastPracticedAt: new Date().toISOString()
      }
      saveStats(this.stats)

      if (!correct) this.wrongBook = addWrongQuestion(this.question, userAnswer)
    },
    showAnswer(question) {
      const option = (question.options || []).find((i) => i.key === question.answer)
      return option ? `${option.key}. ${option.text}` : question.answer
    },
    showWrongBookAnswer(item, answerKey) {
      const option = (item.options || []).find((i) => i.key === answerKey)
      return option ? `${option.key}. ${option.text}` : answerKey
    },
    clearWrongs() { this.wrongBook = clearWrongBook() },
    removeWrong(id) { this.wrongBook = removeWrongQuestion(id) },
    startTimer() {
      if (this.timer) return
      this.startAt = Date.now()
      this.liveSeconds = 0
      this.timer = setInterval(() => { this.liveSeconds = Math.floor((Date.now() - this.startAt) / 1000) }, 1000)
    },
    stopTimer() {
      if (!this.startAt) return
      const extra = Math.floor((Date.now() - this.startAt) / 1000)
      clearInterval(this.timer)
      this.timer = null
      this.startAt = 0
      this.liveSeconds = 0
      this.stats = { ...this.stats, totalStudySeconds: (this.stats.totalStudySeconds || 0) + extra }
      saveStats(this.stats)
    },
    formatDate(v) {
      const d = new Date(v)
      if (Number.isNaN(d.getTime())) return '未知时间'
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const h = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${day} ${h}:${mm}`
    }
  }
}
</script>

<style>
.page{min-height:100vh;padding:24rpx;background:linear-gradient(180deg,#fff8ef,#f1f5fb)}
.card{background:#fff;border-radius:24rpx;padding:24rpx;margin-bottom:20rpx;box-shadow:0 12rpx 32rpx rgba(0,0,0,.06)}
.hero{background:linear-gradient(135deg,#fff4df,#ffffff)}
.hero-logo{width:100%;max-width:560rpx;margin:0 auto 18rpx;display:block}
.title{display:block;font-size:42rpx;font-weight:700;color:#233447}.sub,.meta,.k,.hero-desc{display:block;color:#64748b}.sub,.plain,.meta,.question,.result text,.hero-desc{line-height:1.7}
.hero-desc{font-size:25rpx;margin-top:10rpx;color:#52708b}
.tabs,.filters,.actions,.head,.stats{display:flex;gap:12rpx;flex-wrap:wrap}.tab,.picker,.stat,.option,.result{border-radius:18rpx}
.tab{flex:1;text-align:center;padding:18rpx 0;background:#eef2f7;color:#51606f}.tab.on{background:#243447;color:#fff}
.picker{padding:16rpx 18rpx;background:#f7f9fc;color:#3f4d5c;font-size:25rpx}
.bar{height:14rpx;background:#edf2f7;border-radius:999rpx;overflow:hidden;margin:12rpx 0 18rpx}.bar.large{height:18rpx}.fill{height:100%;background:linear-gradient(90deg,#f59f42,#ea5f3d)}.fill.warm{background:linear-gradient(90deg,#f6b14a,#ff7b54)}
.block,.wrong,.stat{margin-top:18rpx}.label,.title2{display:block;font-size:30rpx;font-weight:700;color:#243447}.plain,.question{font-size:28rpx;color:#334155}
.word-stem{display:block;margin-top:14rpx;font-size:44rpx;font-weight:700;color:#1d4d7a;letter-spacing:1rpx}.word-stem.small{font-size:34rpx}
.question{margin-top:10rpx}
.option{display:flex;gap:16rpx;padding:18rpx;background:#f8fafc;margin-top:12rpx;border:2rpx solid transparent}.option.on{border-color:#f6b35e;background:#fff4e5}.option.ok{border-color:#39a56d;background:#eaf8f1}.option.bad{border-color:#e57373;background:#fff1f1}
.option-key{width:44rpx;height:44rpx;line-height:44rpx;text-align:center;border-radius:50%;background:#e8eef5}.option-text{flex:1;font-size:28rpx;color:#334155}
.primary,.ghost{flex:1;margin:0;border-radius:999rpx;font-size:28rpx}.primary{background:#e47d36;color:#fff}.ghost{background:#fff;color:#435163;border:2rpx solid #d8e0ea}.mini{flex:none;min-width:140rpx;font-size:24rpx}
.result{display:flex;flex-direction:column;gap:8rpx;padding:18rpx;margin-top:18rpx}.result.ok{background:#effaf3}.result.bad{background:#fff3ef}.empty{text-align:center;color:#64748b;padding:30rpx 0}
.stats .stat{width:calc(50% - 6rpx);padding:20rpx;background:#f8fafc}.v{display:block;font-size:34rpx;font-weight:700;color:#243447;margin-top:8rpx}
</style>
