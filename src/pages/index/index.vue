<template>
    <view class="page">
      <view class="hero card">
      <image class="hero-logo" src="/static/snowy-enligsh-logo.svg" mode="widthFix"></image>
      <text class="title">Snowy Enligsh</text>
      <text class="sub">Calm, focused English practice for vocabulary, grammar and reading.</text>
      <text class="hero-desc">Build steady progress with mistake review, instant word lookup, and study stats that make every session feel clear and manageable.</text>
    </view>

    <view class="tabs">
      <view v-for="item in tabs" :key="item" class="tab" :class="{ on: tab === item }" @tap="tab = item">{{ item }}</view>
    </view>

    <view v-if="tab === '刷题'" class="card">
      <!-- 三个筛选器分别控制分类、难度与题型 -->
      <view class="filters">
        <picker :range="categoryOptions" :value="findIndex(categoryOptions, selectedCategory)" @change="setFilter('selectedCategory', categoryOptions, $event)">
          <view class="picker">分类：{{ selectedCategory }}</view>
        </picker>
        <picker :range="difficultyOptions" :value="findIndex(difficultyOptions, selectedDifficulty)" @change="setFilter('selectedDifficulty', difficultyOptions, $event)">
          <view class="picker">难度：{{ selectedDifficulty }}</view>
        </picker>
        <picker :range="typeLabels" :value="findIndex(typeLabels, selectedTypeLabel)" @change="setTypeFilter">
          <view class="picker">题型：{{ selectedTypeLabel }}</view>
        </picker>
      </view>

      <view v-if="question">
        <text class="meta">{{ question.category }} · {{ question.difficulty }} · {{ typeLabel(question.type) }}</text>
        <text class="meta">第 {{ currentIndex + 1 }} / {{ filteredQuestions.length }} 题</text>
        <view class="bar"><view class="fill" :style="{ width: progress + '%' }"></view></view>

        <view v-if="question.passage" class="block">
          <text class="label">阅读材料</text>
          <view class="text-line">
            <text v-for="(seg, idx) in segments(question.passage)" :key="idx" :class="{ word: seg.word }" @longpress="openTranslation(seg)">{{ seg.text }}</text>
          </view>
        </view>

        <view class="block">
          <text class="label">题目</text>
          <view class="text-line">
            <text v-for="(seg, idx) in segments(question.stem || question.question)" :key="idx" :class="{ word: seg.word }" @longpress="openTranslation(seg)">{{ seg.text }}</text>
          </view>
          <text v-if="question.question && question.stem" class="question">{{ question.question }}</text>
        </view>

        <!-- 单选题与填空题 -->
        <view v-if="question.type === 'single'">
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
        <input v-else v-model="blankAnswer" class="input" :disabled="answered" placeholder="请输入答案" />

        <view class="actions">
          <button class="ghost" :disabled="currentIndex === 0" @tap="prev">上一题</button>
          <button class="primary" v-if="!answered" @tap="submit">提交</button>
          <button class="primary" v-else @tap="next">下一题</button>
        </view>

        <view v-if="answered" class="result" :class="{ ok: result.correct, bad: !result.correct }">
          <text>{{ result.correct ? '回答正确' : '回答错误，已加入错题本' }}</text>
          <text>正确答案：{{ showAnswer(question) }}</text>
          <text>你的答案：{{ result.userAnswer || '未作答' }}</text>
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
          <text class="meta">{{ item.category }} · {{ item.difficulty }} · {{ typeLabel(item.type) }}</text>
          <text v-if="item.passage" class="plain">{{ item.passage }}</text>
          <text class="plain">{{ item.stem || item.question }}</text>
          <text v-for="option in item.options" :key="option.key" class="plain">{{ option.key }}. {{ option.text }}</text>
          <text class="plain">正确答案：{{ item.correctAnswer }}</text>
          <text class="plain">你的答案：{{ item.userAnswer || '未作答' }}</text>
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

    <!-- 长按英文单词后展示翻译结果 -->
    <view v-if="popup.show" class="mask" @tap="popup.show = false">
      <view class="popup card" @tap.stop="">
        <text class="title2">{{ popup.word }}</text>
        <text class="plain">{{ popup.text }}</text>
        <button class="primary mini" @tap="popup.show = false">关闭</button>
      </view>
    </view>
  </view>
</template>

<script>
import { questionBank } from '../../data/question-bank'
import { addWrongQuestion, clearWrongBook, getStats, getWrongBook, removeWrongQuestion, saveStats } from '../../utils/storage'
import { translateWord } from '../../utils/translator'

const typeMap = { all: '全部', single: '单选题', blank: '填空题' }
const typeList = ['all', 'single', 'blank']
const emptyResult = () => ({ correct: false, userAnswer: '' })

export default {
  data() {
    return {
      questionBank,
      tabs: ['刷题', '错题本', '统计'],
      tab: '刷题',
      selectedCategory: '全部',
      selectedDifficulty: '全部',
      selectedType: 'all',
      currentIndex: 0,
      selectedOption: '',
      blankAnswer: '',
      answered: false,
      result: emptyResult(),
      wrongBook: [],
      stats: getStats(),
      liveSeconds: 0,
      startAt: 0,
      timer: null,
      popup: { show: false, word: '', text: '' }
    }
  },
  computed: {
    categoryOptions() { return ['全部'].concat([...new Set(this.questionBank.map((i) => i.category))]) },
    difficultyOptions() { return ['全部'].concat([...new Set(this.questionBank.map((i) => i.difficulty))]) },
    typeLabels() { return typeList.map((key) => typeMap[key]) },
    selectedTypeLabel() { return typeMap[this.selectedType] },
    filteredQuestions() {
      return this.questionBank.filter((i) => (this.selectedCategory === '全部' || i.category === this.selectedCategory) && (this.selectedDifficulty === '全部' || i.difficulty === this.selectedDifficulty) && (this.selectedType === 'all' || i.type === this.selectedType))
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
    selectedDifficulty() { this.resetPractice() },
    selectedType() { this.resetPractice() }
  },
  onLoad() { this.wrongBook = getWrongBook(); this.stats = getStats() },
  onShow() { this.startTimer() },
  onHide() { this.stopTimer() },
  onUnload() { this.stopTimer() },
  methods: {
    findIndex(list, value) { return Math.max(list.indexOf(value), 0) },
    typeLabel(type) { return typeMap[type] || type },
    setFilter(field, list, event) { this[field] = list[event.detail.value] },
    setTypeFilter(event) { this.selectedType = typeList[event.detail.value] },
    resetPractice() { this.currentIndex = 0; this.selectedOption = ''; this.blankAnswer = ''; this.answered = false; this.result = emptyResult() },
    choose(key) { if (!this.answered) this.selectedOption = key },
    prev() { if (this.currentIndex > 0) this.resetForMove(this.currentIndex - 1) },
    next() { if (this.filteredQuestions.length) this.resetForMove((this.currentIndex + 1) % this.filteredQuestions.length) },
    resetForMove(index) { this.currentIndex = index; this.selectedOption = ''; this.blankAnswer = ''; this.answered = false; this.result = emptyResult() },
    normalize(v) { return String(v || '').trim().toLowerCase() },
    submit() {
      if (!this.question) return
      let userAnswer = ''
      let correct = false
      if (this.question.type === 'single') {
        if (!this.selectedOption) return uni.showToast({ title: '请先选择答案', icon: 'none' })
        userAnswer = this.selectedOption
        correct = userAnswer === this.question.answer
      } else {
        if (!this.blankAnswer.trim()) return uni.showToast({ title: '请先填写答案', icon: 'none' })
        userAnswer = this.blankAnswer.trim()
        const answers = (this.question.acceptableAnswers || [this.question.answer]).map(this.normalize)
        correct = answers.includes(this.normalize(userAnswer))
      }
      this.answered = true
      this.result = { correct, userAnswer }
      const ids = new Set(this.stats.completedQuestionIds || [])
      ids.add(this.question.id)
      this.stats = { ...this.stats, answeredCount: (this.stats.answeredCount || 0) + 1, correctCount: (this.stats.correctCount || 0) + (correct ? 1 : 0), completedQuestionIds: [...ids], lastPracticedAt: new Date().toISOString() }
      saveStats(this.stats)
      if (!correct) this.wrongBook = addWrongQuestion(this.question, userAnswer)
    },
    optionState(key) {
      if (!this.answered) return { on: this.selectedOption === key }
      return { ok: key === this.question.answer, bad: this.selectedOption === key && key !== this.question.answer }
    },
    showAnswer(question) {
      if (question.type === 'blank') return question.answer
      const option = (question.options || []).find((i) => i.key === question.answer)
      return option ? `${option.key}. ${option.text}` : question.answer
    },
    clearWrongs() { this.wrongBook = clearWrongBook() },
    removeWrong(id) { this.wrongBook = removeWrongQuestion(id) },
    segments(text) {
      return String(text || '').split(/([A-Za-z'-]+|[^A-Za-z'-]+)/).filter(Boolean).map((t) => ({ text: t, word: /^[A-Za-z'-]+$/.test(t) }))
    },
    async openTranslation(seg) {
      if (!seg.word) return
      uni.showLoading({ title: '翻译中', mask: true })
      try {
        this.popup = { show: true, word: seg.text, text: await translateWord(seg.text) }
      } catch (e) {
        this.popup = { show: true, word: seg.text, text: e.message || '翻译失败' }
      } finally {
        uni.hideLoading()
      }
    },
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
.tabs,.filters,.actions,.head,.stats{display:flex;gap:12rpx;flex-wrap:wrap}.tab,.picker,.stat,.option,.result,.popup{border-radius:18rpx}
.tab{flex:1;text-align:center;padding:18rpx 0;background:#eef2f7;color:#51606f}.tab.on{background:#243447;color:#fff}
.picker{padding:16rpx 18rpx;background:#f7f9fc;color:#3f4d5c;font-size:25rpx}
.bar{height:14rpx;background:#edf2f7;border-radius:999rpx;overflow:hidden;margin:12rpx 0 18rpx}.bar.large{height:18rpx}.fill{height:100%;background:linear-gradient(90deg,#f59f42,#ea5f3d)}.fill.warm{background:linear-gradient(90deg,#f6b14a,#ff7b54)}
.block,.wrong,.stat{margin-top:18rpx}.label,.title2{display:block;font-size:30rpx;font-weight:700;color:#243447}.text-line,.plain,.question{font-size:28rpx;color:#334155}.word{color:#bc6b1c;font-weight:600}
.question{margin-top:10rpx}.option{display:flex;gap:16rpx;padding:18rpx;background:#f8fafc;margin-top:12rpx;border:2rpx solid transparent}.option.on{border-color:#f6b35e;background:#fff4e5}.option.ok{border-color:#39a56d;background:#eaf8f1}.option.bad{border-color:#e57373;background:#fff1f1}
.option-key{width:44rpx;height:44rpx;line-height:44rpx;text-align:center;border-radius:50%;background:#e8eef5}.option-text{flex:1;font-size:28rpx;color:#334155}
.input{height:84rpx;padding:0 20rpx;background:#f8fafc;border-radius:18rpx;border:2rpx solid #dde5ef;font-size:28rpx;margin-top:18rpx}
.primary,.ghost{flex:1;margin:0;border-radius:999rpx;font-size:28rpx}.primary{background:#e47d36;color:#fff}.ghost{background:#fff;color:#435163;border:2rpx solid #d8e0ea}.mini{flex:none;min-width:140rpx;font-size:24rpx}
.result{display:flex;flex-direction:column;gap:8rpx;padding:18rpx;margin-top:18rpx}.result.ok{background:#effaf3}.result.bad{background:#fff3ef}.empty{text-align:center;color:#64748b;padding:30rpx 0}
.stats .stat{width:calc(50% - 6rpx);padding:20rpx;background:#f8fafc}.v{display:block;font-size:34rpx;font-weight:700;color:#243447;margin-top:8rpx}
.mask{position:fixed;inset:0;background:rgba(15,23,42,.35);display:flex;align-items:center;justify-content:center;padding:24rpx}.popup{width:100%}
</style>
