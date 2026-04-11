<template>
  <view class="page" :class="{ 'with-bottom-tabs': !isPracticing }">
    <view v-if="tab === '刷题'" class="card">
      <view v-if="!isPracticing" class="hero hero-inline">
        <view class="hero-body">
          <image class="hero-logo" :src="heroLogo" mode="aspectFit" />
          <view class="hero-copy">
            <text class="title">Snowy English</text>
            <text class="sub">本题库由唐雪雪老师精心挑选，包含了25篇精选教材文章的词汇题。</text>
          </view>
        </view>
      </view>
      <view v-else class="hero hero-inline practice-hero">
        <view class="practice-topbar">
          <view class="practice-back-btn" @tap="exitPractice">
            <view class="practice-back-icon"></view>
          </view>
          <text v-if="practiceMode === 'article'" class="practice-topbar-title">{{ selectedArticleLabel }}</text>
        </view>
      </view>

      <view v-if="!isPracticing" class="setup">
        <text class="title2">开始新的练习</text>
        <text class="meta">先选择刷题模式，再开始答题。</text>
        <view class="filters">
          <view class="setup-row" :class="{ open: activeDropdown === 'mode' }">
            <text class="setup-label">模式：</text>
            <view class="picker-trigger">
              <view class="picker-button" @tap.stop="toggleDropdown('mode')">
                <text class="picker-value">{{ selectedModeLabel }}</text>
                <text class="picker-arrow" :class="{ open: activeDropdown === 'mode' }">▼</text>
              </view>
              <view v-if="activeDropdown === 'mode'" class="dropdown-menu" @tap.stop>
                <view
                  v-for="item in modeOptions"
                  :key="item.value"
                  class="dropdown-item"
                  :class="{ on: practiceMode === item.value }"
                  @tap.stop="selectMode(item.value)"
                >
                  <text class="dropdown-text">{{ item.label }}</text>
                  <text v-if="practiceMode === item.value" class="dropdown-check">✓</text>
                </view>
              </view>
            </view>
          </view>
          <view v-if="practiceMode === 'article'" class="setup-row" :class="{ open: activeDropdown === 'article' }">
            <text class="setup-label">文章：</text>
            <view class="picker-trigger">
              <view class="picker-button" @tap.stop="toggleDropdown('article')">
                <text class="picker-value">{{ selectedArticleLabel }}</text>
                <text class="picker-arrow" :class="{ open: activeDropdown === 'article' }">▼</text>
              </view>
              <scroll-view v-if="activeDropdown === 'article'" class="dropdown-menu article-menu" scroll-y @tap.stop>
                <view
                  v-for="(label, index) in articleLabels"
                  :key="label"
                  class="dropdown-item"
                  :class="{ on: selectedArticleIndex === index }"
                  @tap.stop="selectArticle(index)"
                >
                  <text class="dropdown-text">{{ label }}</text>
                  <text v-if="selectedArticleIndex === index" class="dropdown-check">✓</text>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
        <button class="primary start-btn" :disabled="isLoading" @tap="startPractice">
          {{ isLoading ? '题库加载中...' : '开始答题' }}
        </button>
      </view>
      <view v-else-if="isLoading" class="empty">题库加载中...</view>
      <view v-else-if="question">
        <view class="block">
          <view class="word-head focus" :class="{ phrase: !currentWordMeta.isSingleWord }">
            <view class="word-canvas-shell">
              <canvas
                type="2d"
                canvas-id="practiceStemCanvas"
                id="practiceStemCanvas"
                class="word-stem-canvas"
                :style="stemCanvasStyle"
              ></canvas>
            </view>
            <view class="speaker-btn speaker-btn-corner" :class="{ disabled: currentAudioLoading || !currentAudioAvailable, playing: isPlayingPronunciation }" @tap="playCurrentPronunciation">
              <text class="speaker-icon">🔊</text>
            </view>
          </view>
        </view>

        <view>
          <view
            v-for="option in question.options"
            :key="option.key"
            class="option"
            :class="answered ? (option.key === question.answer ? 'ok' : (selectedOption === option.key ? 'bad' : '')) : (selectedOption === option.key ? 'on' : '')"
            @tap="choose(option.key)"
          >
            <text class="option-text">{{ option.text }}</text>
          </view>
        </view>

        <view class="question-status">
          <text class="meta">练习时间：{{ practiceStudyText }}</text>
          <text class="meta question-order">
            第 <text class="question-order-current">{{ currentIndex + 1 }}</text> / {{ sessionQuestions.length }} 题
          </text>
        </view>
        <view class="actions">
          <button class="ghost" :disabled="currentIndex === 0" @tap="prev">上一题</button>
          <button class="primary" v-if="!answered" @tap="submit">提交</button>
          <button class="primary" v-else-if="currentIndex < sessionQuestions.length - 1" @tap="next">下一题</button>
          <button class="primary" v-else @tap="finishPractice">完成答题</button>
        </view>

        <view v-if="answered" class="result" :class="{ ok: result.correct, bad: !result.correct }">
          <text>{{ result.correct ? '回答正确' : '回答错误，已加入错题本' }}</text>
          <text>正确答案：{{ showAnswer(question, question.answer) }}</text>
          <text>你的答案：{{ showAnswer(question, result.userAnswer) || '未作答' }}</text>

          <view v-if="currentWordMeta.isSingleWord" class="word-meta-card">
            <text class="word-meta-title">单词拓展</text>
            <view class="word-meta-section">
              <text class="word-meta-label">近义词</text>
              <text class="word-meta-inline">{{ currentSynonymText }}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty">当前模式下暂无题目</view>
    </view>

    <view v-if="tab === '我的'" class="card">
      <view class="my-entry-list">
        <view class="my-entry" @tap="openMyPage('/pages/wrong-book/index')">
          <view class="my-entry-copy">
            <text class="my-entry-title">错题本</text>
            <text class="my-entry-desc">查看做错的题目并继续复习</text>
          </view>
          <text class="my-entry-arrow">›</text>
        </view>
        <view class="my-entry" @tap="openMyPage('/pages/stats/index')">
          <view class="my-entry-copy">
            <text class="my-entry-title">统计</text>
            <text class="my-entry-desc">查看学习时长、完成量和正确率</text>
          </view>
          <text class="my-entry-arrow">›</text>
        </view>
      </view>
    </view>

    <view v-if="!isPracticing" class="tabs bottom-tabs">
      <view v-for="item in bottomTabs" :key="item.key" class="tab bottom-tab" :class="{ on: tab === item.key }" @tap="tab = item.key">
        <image class="tab-icon" :src="tab === item.key ? item.activeIcon : item.icon" mode="aspectFit" />
        <text class="tab-label">{{ item.label }}</text>
      </view>
    </view>

    <view v-if="activeDropdown" class="select-overlay" @tap="closeDropdown"></view>
  </view>
</template>

<script>
import { articleOptions, loadArticleQuestions, loadMixedQuestions, totalQuestionCount } from '../../data/question-bank'
import { addPracticeRecord, addStudySeconds, addWrongQuestion, clearWrongBook, getStats, getWrongBook, removeWrongQuestion, saveStats, saveWrongBook } from '../../utils/storage'
import { getLookupKey, getWordAudioUrls, getWordSynonyms, resolvePlayableAudioUrl } from '../../utils/word-network'
import { getWordMeta } from '../../utils/word-meta'

const modeValues = ['article', 'mixed']
const modeMap = {
  article: '按文章出题',
  mixed: '混合出题'
}
const MIXED_QUESTION_COUNT = 25
const emptyResult = () => ({ correct: false, userAnswer: '' })
const practiceIcon = require('../../static/tab-practice.svg')
const practiceActiveIcon = require('../../static/tab-practice-active.svg')
const profileIcon = require('../../static/tab-profile.svg')
const profileActiveIcon = require('../../static/tab-profile-active.svg')
const STEM_CANVAS_ID = 'practiceStemCanvas'
const STEM_CANVAS_HEIGHT_RPX = 136
const STEM_CANVAS_FALLBACK_WIDTH_RPX = 520

function shuffleList(list) {
  const result = list.slice()
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

const heroLogo = require('../../static/snowy-english-logo.png')
export default {
  data() {
    return {
      questionBank: [],
      articleOptions,
      modeOptions: modeValues.map((value) => ({ value, label: modeMap[value] })),
      totalQuestionCount,
      tabs: ['刷题', '我的'],
      bottomTabs: [
        { key: '刷题', label: '刷题', icon: practiceIcon, activeIcon: practiceActiveIcon },
        { key: '我的', label: '我的', icon: profileIcon, activeIcon: profileActiveIcon }
      ],
      heroLogo,
      tab: '刷题',
      practiceMode: 'article',
      currentArticleId: articleOptions[0] ? articleOptions[0].value : '',
      sessionQuestions: [],
      currentIndex: 0,
      selectedOption: '',
      answered: false,
      result: emptyResult(),
      wrongBook: [],
      stats: getStats(),
      loadedQuestionMap: {},
      isLoading: false,
      loadVersion: 0,
      liveSeconds: 0,
      startAt: 0,
      timer: null,
      isPracticing: false,
      activeDropdown: '',
      practiceStartedAt: 0,
      practiceElapsedSeconds: 0,
      sessionAnsweredCount: 0,
      sessionCorrectCount: 0,
      sessionCompletedIds: [],
      sessionAnswerMap: {},
      wordNetworkMap: {},
      audioContext: null,
      audioQueue: [],
      isPlayingPronunciation: false,
      isPreparingPronunciation: false,
      audioPlaybackToken: 0,
      stemCanvasWidth: 0,
      stemCanvasHeight: 0,
      stemCanvasTimer: null,
      stemCanvasRenderVersion: 0
    }
  },
  computed: {
    modeLabels() {
      return modeValues.map((value) => modeMap[value])
    },
    selectedModeLabel() {
      return modeMap[this.practiceMode]
    },
    articleLabels() {
      return this.articleOptions.map((item) => item.label)
    },
    selectedArticleIndex() {
      const index = this.articleOptions.findIndex((item) => item.value === this.currentArticleId)
      return index >= 0 ? index : 0
    },
    selectedArticleLabel() {
      const current = this.articleOptions[this.selectedArticleIndex]
      return current ? current.label : '暂无文章'
    },
    question() {
      return this.sessionQuestions[this.currentIndex] || null
    },
    completedCount() {
      return (this.stats.completedQuestionIds || []).length
    },
    accuracy() {
      return this.stats.answeredCount ? Math.round((this.stats.correctCount / this.stats.answeredCount) * 100) : 0
    },
    progress() {
      return this.sessionQuestions.length ? Math.round(((this.currentIndex + 1) / this.sessionQuestions.length) * 100) : 0
    },
    overallProgress() {
      return this.totalQuestionCount ? Math.round((this.completedCount / this.totalQuestionCount) * 100) : 0
    },
    studyText() {
      const total = (this.stats.totalStudySeconds || 0) + this.liveSeconds
      const h = String(Math.floor(total / 3600)).padStart(2, '0')
      const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
      const s = String(total % 60).padStart(2, '0')
      return `${h}:${m}:${s}`
    },
    practiceStudyText() {
      const total = this.practiceElapsedSeconds
      const h = String(Math.floor(total / 3600)).padStart(2, '0')
      const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
      const s = String(total % 60).padStart(2, '0')
      return `${h}:${m}:${s}`
    },
    currentWordNetwork() {
      const key = this.question ? getLookupKey(this.question.stem) : ''
      return key ? this.wordNetworkMap[key] || {} : {}
    },
    currentAudioAvailable() {
      return Array.isArray(this.currentWordNetwork.audioUrls) && this.currentWordNetwork.audioUrls.length > 0
    },
    currentAudioLoading() {
      return Boolean(this.currentWordNetwork.audioLoading || this.isPreparingPronunciation)
    },
    currentSynonymText() {
      if (this.currentWordNetwork.synonymsLoading) {
        return '获取中...'
      }

      if (Array.isArray(this.currentWordNetwork.synonyms) && this.currentWordNetwork.synonyms.length) {
        return this.currentWordNetwork.synonyms.join(' / ')
      }

      return this.currentWordNetwork.synonymsFetched ? '暂未获取到' : '获取中...'
    },
    currentWordMeta() {
      return this.question ? getWordMeta(this.question.stem) : { isSingleWord: false, posTags: [], relatedForms: [], groupedRelatedForms: [] }
    },
    stemCanvasStyle() {
      const width = Math.max(this.stemCanvasWidth || this.getDefaultStemCanvasWidth(), 1)
      const height = Math.max(this.stemCanvasHeight || this.getDefaultStemCanvasHeight(), 1)
      return `width:${width}px;height:${height}px;`
    },
    currentStemClasses() {
      if (!this.question) {
        return {}
      }

      if (!this.currentWordMeta.isSingleWord) {
        return {
          phrase: true
        }
      }

      const stemLength = String(this.question.stem || '').replace(/[^a-zA-Z]/g, '').length
      return {
        compact: stemLength >= 10,
        tight: stemLength >= 14
      }
    },
    lastPractice() {
      return this.stats.lastPracticedAt ? this.formatDate(this.stats.lastPracticedAt) : '暂无记录'
    }
  },
  watch: {
    question() {
      this.queueStemCanvasRender()
    },
    isPracticing(value) {
      if (value) {
        this.queueStemCanvasRender()
        return
      }

      this.clearStemCanvasTimer()
    }
  },
  onLoad() {
    this.loadLocalState()
  },
  onShow() {
    this.loadLocalState()
    this.startTimer()
    if (this.isPracticing && this.question) {
      this.queueStemCanvasRender()
    }
  },
  onHide() {
    this.stopTimer()
    this.stopPronunciationPlayback()
    this.clearStemCanvasTimer()
  },
  onUnload() {
    this.stopTimer()
    this.stopPronunciationPlayback(true)
    this.clearStemCanvasTimer()
  },
  methods: {
    getRpxUnit() {
      const systemInfo = uni.getSystemInfoSync()
      return systemInfo.windowWidth / 750
    },
    getDefaultStemCanvasWidth() {
      return Math.round(STEM_CANVAS_FALLBACK_WIDTH_RPX * this.getRpxUnit())
    },
    getDefaultStemCanvasHeight() {
      return Math.round(STEM_CANVAS_HEIGHT_RPX * this.getRpxUnit())
    },
    clearStemCanvasTimer() {
      if (!this.stemCanvasTimer) {
        return
      }

      clearTimeout(this.stemCanvasTimer)
      this.stemCanvasTimer = null
    },
    queueStemCanvasRender() {
      if (!this.isPracticing || !this.question) {
        return
      }

      this.clearStemCanvasTimer()
      const renderVersion = this.stemCanvasRenderVersion + 1
      this.stemCanvasRenderVersion = renderVersion

      this.$nextTick(() => {
        this.stemCanvasTimer = setTimeout(() => {
          this.renderStemCanvas(renderVersion)
        }, 16)
      })
    },
    resolveStemCanvas2d() {
      return new Promise((resolve) => {
        const defaultWidth = this.getDefaultStemCanvasWidth()
        const defaultHeight = this.getDefaultStemCanvasHeight()
        const query = uni.createSelectorQuery().in(this)

        query.select('.word-canvas-shell').boundingClientRect()
        query.select('#practiceStemCanvas').fields({ node: true, size: true })
        query.exec((results) => {
          const shellRect = results && results[0] ? results[0] : null
          const canvasResult = results && results[1] ? results[1] : null
          const width = shellRect && shellRect.width ? Math.round(shellRect.width) : defaultWidth
          const height = shellRect && shellRect.height ? Math.round(shellRect.height) : defaultHeight

          this.stemCanvasWidth = width
          this.stemCanvasHeight = height

          if (!canvasResult || !canvasResult.node) {
            resolve(null)
            return
          }

          const dpr = Math.max(uni.getSystemInfoSync().pixelRatio || 1, 1)
          const canvas = canvasResult.node
          const context = canvas.getContext('2d')

          canvas.width = Math.max(Math.round(width * dpr), 1)
          canvas.height = Math.max(Math.round(height * dpr), 1)

          if (typeof context.setTransform === 'function') {
            context.setTransform(1, 0, 0, 1, 0, 0)
          }
          context.clearRect(0, 0, canvas.width, canvas.height)
          if (typeof context.setTransform === 'function') {
            context.setTransform(dpr, 0, 0, dpr, 0, 0)
          } else if (typeof context.scale === 'function') {
            context.scale(dpr, dpr)
          }

          resolve({ canvas, context, width, height })
        })
      })
    },
    setStemCanvasFont(context, fontSize) {
      context.font = `600 ${fontSize}px sans-serif`
    },
    async renderStemCanvas(renderVersion = this.stemCanvasRenderVersion) {
      if (!this.question || renderVersion !== this.stemCanvasRenderVersion) {
        return
      }

      const canvasState = await this.resolveStemCanvas2d()
      if (!canvasState || renderVersion !== this.stemCanvasRenderVersion) {
        return
      }

      const { context, width, height } = canvasState
      const stem = String(this.question.stem || '').trim()
      const layout = this.currentWordMeta.isSingleWord
        ? this.getSingleWordCanvasLayout(context, stem, width)
        : this.getPhraseCanvasLayout(context, stem, width)

      context.fillStyle = '#173f69'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      this.setStemCanvasFont(context, layout.fontSize)

      if (layout.lines.length === 1) {
        context.fillText(layout.lines[0], width / 2, height / 2)
        return
      }

      const totalHeight = (layout.lines.length - 1) * layout.lineHeight
      const startY = (height / 2) - (totalHeight / 2)
      layout.lines.forEach((line, index) => {
        context.fillText(line, width / 2, startY + index * layout.lineHeight)
      })
    },
    getSingleWordCanvasLayout(context, text, maxWidth) {
      const cleanedLength = String(text || '').replace(/[^a-zA-Z]/g, '').length
      let fontSize = 31

      if (cleanedLength >= 14) {
        fontSize = 24
      } else if (cleanedLength >= 10) {
        fontSize = 27
      }

      const minFontSize = 20
      const targetWidth = Math.max(maxWidth - 6, 1)

      while (fontSize > minFontSize) {
        this.setStemCanvasFont(context, fontSize)
        if (context.measureText(text).width <= targetWidth) {
          break
        }
        fontSize -= 1
      }

      return {
        fontSize,
        lineHeight: Math.round(fontSize * 1.25),
        lines: [text]
      }
    },
    getPhraseCanvasLayout(context, text, maxWidth) {
      const targetWidth = Math.max(maxWidth - 8, 1)
      let fontSize = 24
      const minFontSize = 18
      let lines = [text]

      while (fontSize >= minFontSize) {
        this.setStemCanvasFont(context, fontSize)
        lines = this.wrapStemText(context, text, targetWidth)
        if (lines.length <= 2) {
          break
        }
        fontSize -= 1
      }

      if (lines.length > 2) {
        this.setStemCanvasFont(context, fontSize)
        lines = this.wrapStemText(context, text, targetWidth, 3)
      }

      return {
        fontSize,
        lineHeight: Math.round(fontSize * 1.35),
        lines
      }
    },
    wrapStemText(context, text, maxWidth, maxLines = 2) {
      const tokens = String(text || '').split(/\s+/).filter(Boolean)
      if (!tokens.length) {
        return ['']
      }

      const lines = []
      let currentLine = ''

      tokens.forEach((token) => {
        const candidate = currentLine ? `${currentLine} ${token}` : token
        if (context.measureText(candidate).width <= maxWidth) {
          currentLine = candidate
          return
        }

        if (currentLine) {
          lines.push(currentLine)
        }

        if (context.measureText(token).width <= maxWidth) {
          currentLine = token
          return
        }

        const broken = this.breakLongToken(context, token, maxWidth)
        currentLine = ''
        broken.forEach((segment) => {
          if (segment && lines.length < maxLines - 1) {
            lines.push(segment)
          } else if (segment) {
            currentLine = currentLine ? `${currentLine}${segment}` : segment
          }
        })
      })

      if (currentLine) {
        lines.push(currentLine)
      }

      return lines.filter(Boolean).slice(0, maxLines)
    },
    breakLongToken(context, token, maxWidth) {
      const segments = []
      let current = ''

      Array.from(token).forEach((char) => {
        const candidate = `${current}${char}`
        if (!current || context.measureText(candidate).width <= maxWidth) {
          current = candidate
          return
        }

        segments.push(current)
        current = char
      })

      if (current) {
        segments.push(current)
      }

      return segments
    },
    loadLocalState() {
      const rawStats = getStats()
      this.stats = {
        ...rawStats,
        completedQuestionIds: rawStats.completedQuestionIds || []
      }
      saveStats(this.stats)
      this.wrongBook = getWrongBook()
    },
    findIndex(list, value) {
      return Math.max(list.indexOf(value), 0)
    },
    toggleDropdown(name) {
      this.activeDropdown = this.activeDropdown === name ? '' : name
    },
    closeDropdown() {
      this.activeDropdown = ''
    },
    selectMode(value) {
      this.practiceMode = value
      this.closeDropdown()
    },
    selectArticle(index) {
      const selected = this.articleOptions[index]
      this.currentArticleId = selected ? selected.value : this.currentArticleId
      this.closeDropdown()
    },
    openMyPage(url) {
      uni.navigateTo({ url })
    },
    getWordNetworkEntry(stem) {
      const key = getLookupKey(stem)
      return key ? this.wordNetworkMap[key] || null : null
    },
    updateWordNetwork(stem, patch) {
      const key = getLookupKey(stem)
      if (!key) {
        return null
      }

      const nextEntry = {
        ...(this.wordNetworkMap[key] || {}),
        ...patch
      }

      this.wordNetworkMap = {
        ...this.wordNetworkMap,
        [key]: nextEntry
      }

      return nextEntry
    },
    ensureAudioContext() {
      if (this.audioContext) {
        return this.audioContext
      }

      if (typeof uni.setInnerAudioOption === 'function') {
        uni.setInnerAudioOption({
          obeyMuteSwitch: false,
          mixWithOther: true
        })
      }

      const audioContext = uni.createInnerAudioContext()
      audioContext.autoplay = false
      audioContext.obeyMuteSwitch = false
      audioContext.onEnded(() => {
        this.playNextAudioInQueue()
      })
      audioContext.onStop(() => {
        if (!this.audioQueue.length) {
          this.isPlayingPronunciation = false
        }
      })
      audioContext.onError((error) => {
        this.handlePronunciationError(error)
        this.playNextAudioInQueue()
      })
      this.audioContext = audioContext
      return audioContext
    },
    waitForAudioCanplay(audioContext, playbackToken) {
      return new Promise((resolve) => {
        let settled = false
        let timer = null

        const cleanup = () => {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }

          if (typeof audioContext.offCanplay === 'function') {
            audioContext.offCanplay(handleCanplay)
          }
        }

        const finish = (callback) => {
          if (settled || playbackToken !== this.audioPlaybackToken) {
            return
          }

          settled = true
          cleanup()
          callback()
        }

        const handleCanplay = () => {
          finish(() => resolve())
        }

        if (typeof audioContext.onCanplay === 'function') {
          audioContext.onCanplay(handleCanplay)
        }

        timer = setTimeout(() => {
          finish(() => resolve())
        }, 1200)
      })
    },
    async playNextAudioInQueue() {
      const nextUrl = this.audioQueue.shift()
      if (!nextUrl) {
        this.isPreparingPronunciation = false
        this.isPlayingPronunciation = false
        return
      }

      const playbackToken = this.audioPlaybackToken
      this.isPreparingPronunciation = true

      try {
        const playableUrl = await resolvePlayableAudioUrl(nextUrl)
        if (!playableUrl || playbackToken !== this.audioPlaybackToken) {
          return
        }

        const audioContext = this.ensureAudioContext()
        audioContext.src = playableUrl
        await this.waitForAudioCanplay(audioContext, playbackToken)
        if (playbackToken !== this.audioPlaybackToken) {
          return
        }

        audioContext.play()
        this.isPlayingPronunciation = true
      } catch (error) {
        if (playbackToken !== this.audioPlaybackToken) {
          return
        }

        this.handlePronunciationError(error)
        this.playNextAudioInQueue()
      } finally {
        if (playbackToken === this.audioPlaybackToken) {
          this.isPreparingPronunciation = false
        }
      }
    },
    stopPronunciationPlayback(destroy = false) {
      this.audioPlaybackToken += 1
      this.audioQueue = []
      this.isPreparingPronunciation = false
      this.isPlayingPronunciation = false

      if (!this.audioContext) {
        return
      }

      this.audioContext.stop()
      if (destroy) {
        this.audioContext.destroy()
        this.audioContext = null
      }
    },
    handlePronunciationError(error) {
      const detail =
        (error && (error.errMsg || error.errCode || error.message)) ||
        'unknown'

      console.error('[pronunciation] playback failed:', detail, error)
      uni.showToast({ title: '发音加载失败', icon: 'none' })
    },
    async playCurrentPronunciation() {
      if (this.currentAudioLoading) {
        uni.showToast({ title: '读音获取中', icon: 'none' })
        return
      }

      const audioUrls = Array.isArray(this.currentWordNetwork.audioUrls) ? this.currentWordNetwork.audioUrls.filter(Boolean) : []
      if (!audioUrls.length) {
        uni.showToast({ title: '暂未获取到音频', icon: 'none' })
        return
      }

      this.stopPronunciationPlayback()
      this.audioPlaybackToken += 1
      this.audioQueue = audioUrls.slice()
      await this.playNextAudioInQueue()
    },
    async ensureAudio(question) {
      if (!question || !question.stem) {
        return
      }

      const current = this.getWordNetworkEntry(question.stem)
      if (current && (current.audioLoading || Array.isArray(current.audioUrls))) {
        return
      }

      this.updateWordNetwork(question.stem, { audioLoading: true })

      try {
        const audioUrls = await getWordAudioUrls(question.stem)
        this.updateWordNetwork(question.stem, {
          audioUrls: Array.isArray(audioUrls) ? audioUrls : [],
          audioLoading: false
        })
      } catch (error) {
        this.updateWordNetwork(question.stem, {
          audioUrls: [],
          audioLoading: false
        })
      }
    },
    async ensureSynonyms(question) {
      if (!question || !question.stem) {
        return
      }

      const current = this.getWordNetworkEntry(question.stem)
      if (current && (current.synonymsLoading || current.synonymsFetched)) {
        return
      }

      this.updateWordNetwork(question.stem, { synonymsLoading: true })

      try {
        const synonyms = await getWordSynonyms(question.stem)
        this.updateWordNetwork(question.stem, {
          synonyms: Array.isArray(synonyms) ? synonyms : [],
          synonymsFetched: true,
          synonymsLoading: false
        })
      } catch (error) {
        this.updateWordNetwork(question.stem, {
          synonyms: [],
          synonymsFetched: true,
          synonymsLoading: false
        })
      }
    },
    prepareQuestionNetwork(question, options = {}) {
      if (!question) {
        return
      }

      this.ensureAudio(question)

      if (options.withSynonyms) {
        this.ensureSynonyms(question)
      }
    },
    buildPracticeRecord() {
      if (!this.sessionAnsweredCount) {
        return null
      }

      const durationSeconds = this.getCurrentPracticeDuration()
      const details = this.sessionQuestions.map((question, index) => {
        const cached = this.sessionAnswerMap[question.id] || {}
        const userAnswer = cached.result ? cached.result.userAnswer : ''
        const isCorrect = cached.result ? cached.result.correct : false

        return {
          id: question.id,
          order: index + 1,
          articleLabel: question.articleLabel,
          category: question.category,
          stem: question.stem,
          question: question.question,
          options: question.options || [],
          meaning: question.meaning || '',
          meaningSummary: question.meaningSummary || question.meaning || '',
          meanings: question.meanings || [],
          userAnswer,
          userAnswerText: userAnswer ? this.showAnswer(question, userAnswer) : '未作答',
          correctAnswer: question.answer,
          correctAnswerText: this.showAnswer(question, question.answer),
          isCorrect,
          explanation: question.explanation
        }
      })
      const uniqueAnsweredCount = this.sessionCompletedIds.length
      const wrongCount = this.sessionAnsweredCount - this.sessionCorrectCount
      const accuracy = this.sessionAnsweredCount ? Math.round((this.sessionCorrectCount / this.sessionAnsweredCount) * 100) : 0
      const finishedAt = new Date().toISOString()

      return {
        id: `practice-${Date.now()}`,
        finishedAt,
        durationSeconds,
        totalQuestionCount: this.sessionQuestions.length,
        mode: this.practiceMode,
        modeLabel: this.selectedModeLabel,
        articleId: this.practiceMode === 'article' ? this.currentArticleId : '',
        articleLabel: this.practiceMode === 'article' ? this.selectedArticleLabel : '混合出题',
        answeredCount: this.sessionAnsweredCount,
        uniqueAnsweredCount,
        correctCount: this.sessionCorrectCount,
        wrongCount,
        accuracy,
        details,
        wrongDetails: details.filter((item) => !item.isCorrect)
      }
    },
    getCurrentPracticeDuration() {
      if (!this.practiceStartedAt) {
        return this.practiceElapsedSeconds
      }

      const liveDuration = Math.floor((Date.now() - this.practiceStartedAt) / 1000)
      const safeDuration = Math.max(this.practiceElapsedSeconds, liveDuration)
      return this.sessionAnsweredCount ? Math.max(1, safeDuration) : safeDuration
    },
    clearPracticeView() {
      this.closeDropdown()
      this.stopPronunciationPlayback()
      this.clearStemCanvasTimer()
      this.stemCanvasRenderVersion += 1
      this.isPracticing = false
      this.questionBank = []
      this.sessionQuestions = []
      this.currentIndex = 0
      this.selectedOption = ''
      this.answered = false
      this.result = emptyResult()
      this.resetPracticeSessionState()
    },
    resetPracticeSessionState() {
      this.practiceStartedAt = 0
      this.practiceElapsedSeconds = 0
      this.sessionAnsweredCount = 0
      this.sessionCorrectCount = 0
      this.sessionCompletedIds = []
      this.sessionAnswerMap = {}
    },
    async startPractice() {
      this.closeDropdown()
      this.practiceStartedAt = Date.now()
      this.practiceElapsedSeconds = 0
      this.sessionAnsweredCount = 0
      this.sessionCorrectCount = 0
      this.sessionCompletedIds = []
      this.isPracticing = true
      await this.refreshQuestionSet()

      if (!this.sessionQuestions.length) {
        this.resetPracticeSessionState()
        this.isPracticing = false
      }
    },
    finishPractice() {
      const record = this.buildPracticeRecord()
      if (record) {
        addPracticeRecord(record)
      }
      const durationSeconds = this.getCurrentPracticeDuration()
      if (durationSeconds > 0) {
        this.stats = addStudySeconds(durationSeconds)
      }

      this.promptPracticeCompleteRedirect()
    },
    promptPracticeCompleteRedirect() {
      const itemList = ['查看统计', '查看错题本', '返回主页']

      uni.showActionSheet({
        itemList,
        success: ({ tapIndex }) => {
          if (tapIndex === 0) {
            this.clearPracticeView()
            uni.navigateTo({ url: '/pages/stats/index' })
            return
          }

          if (tapIndex === 1) {
            this.clearPracticeView()
            uni.navigateTo({ url: '/pages/wrong-book/index' })
            return
          }

          this.clearPracticeView()
          this.tab = '刷题'
        },
        fail: (error) => {
          if (error && /cancel/i.test(String(error.errMsg || ''))) {
            return
          }

          uni.showToast({ title: '已完成答题', icon: 'success' })
        }
      })
    },
    exitPractice() {
      uni.showModal({
        title: '确认退出',
        content: '退出后，本次答题进度将会消失，是否继续退出？',
        confirmText: '退出',
        cancelText: '继续答题',
        success: ({ confirm }) => {
          if (!confirm) {
            return
          }

          const durationSeconds = this.getCurrentPracticeDuration()
          if (durationSeconds > 0) {
            this.stats = addStudySeconds(durationSeconds)
          }
          this.clearPracticeView()
        }
      })
    },
    syncWrongBookWithLatest() {
      let changed = false
      const nextWrongBook = this.wrongBook.map((item) => {
        const latest = this.loadedQuestionMap[item.id]
        if (!latest) {
          return item
        }

        changed = true
        return {
          ...item,
          category: latest.category,
          articleId: latest.articleId,
          articleIndex: latest.articleIndex,
          articleTitle: latest.articleTitle,
          articleLabel: latest.articleLabel,
          stem: latest.stem,
          question: latest.question,
          options: latest.options,
          correctAnswer: latest.answer,
          explanation: latest.explanation
        }
      })

      if (changed) {
        this.wrongBook = nextWrongBook
        saveWrongBook(nextWrongBook)
      }
    },
    cacheQuestions(list) {
      const nextMap = { ...this.loadedQuestionMap }
      list.forEach((item) => {
        nextMap[item.id] = item
      })
      this.loadedQuestionMap = nextMap
      this.syncWrongBookWithLatest()
    },
    async refreshQuestionSet() {
      const currentLoadVersion = this.loadVersion + 1
      this.loadVersion = currentLoadVersion
      this.isLoading = true

      try {
        const base =
          this.practiceMode === 'mixed'
            ? await loadMixedQuestions()
            : await loadArticleQuestions(this.currentArticleId)

        if (currentLoadVersion !== this.loadVersion) {
          return
        }

        const currentSet =
          this.practiceMode === 'mixed'
            ? shuffleList(base).slice(0, MIXED_QUESTION_COUNT)
            : shuffleList(base)

        this.questionBank = currentSet
        this.cacheQuestions(currentSet)
        this.sessionQuestions = currentSet
        this.sessionAnswerMap = {}
        this.currentIndex = 0
        this.selectedOption = ''
        this.answered = false
        this.result = emptyResult()
        this.prepareQuestionNetwork(this.sessionQuestions[0])
      } catch (error) {
        if (currentLoadVersion !== this.loadVersion) {
          return
        }

        this.questionBank = []
        this.sessionQuestions = []
        this.currentIndex = 0
        this.selectedOption = ''
        this.answered = false
        this.result = emptyResult()
        uni.showToast({ title: '题库加载失败', icon: 'none' })
      } finally {
        if (currentLoadVersion === this.loadVersion) {
          this.isLoading = false
        }
      }
    },
    choose(key) {
      if (!this.answered) {
        this.selectedOption = key
      }
    },
    prev() {
      if (this.currentIndex > 0) {
        this.resetForMove(this.currentIndex - 1)
      }
    },
    next() {
      if (this.currentIndex < this.sessionQuestions.length - 1) {
        this.resetForMove(this.currentIndex + 1)
      }
    },
    resetForMove(index) {
      this.currentIndex = index
      const currentQuestion = this.sessionQuestions[index]
      const cached = currentQuestion ? this.sessionAnswerMap[currentQuestion.id] : null
      this.selectedOption = cached ? cached.selectedOption : ''
      this.answered = cached ? cached.answered : false
      this.result = cached ? { ...cached.result } : emptyResult()
      this.prepareQuestionNetwork(currentQuestion, { withSynonyms: Boolean(cached && cached.answered) })
    },
    submit() {
      if (!this.question) {
        return
      }
      if (!this.selectedOption) {
        uni.showToast({ title: '请先选择答案', icon: 'none' })
        return
      }

      const userAnswer = this.selectedOption
      const correct = userAnswer === this.question.answer
      this.answered = true
      this.result = { correct, userAnswer }
      this.sessionAnswerMap = {
        ...this.sessionAnswerMap,
        [this.question.id]: {
          selectedOption: userAnswer,
          answered: true,
          result: { correct, userAnswer }
        }
      }
      const nextCompletedIds = new Set(this.sessionCompletedIds)
      nextCompletedIds.add(this.question.id)
      this.sessionCompletedIds = [...nextCompletedIds]
      this.sessionAnsweredCount += 1
      if (correct) {
        this.sessionCorrectCount += 1
      }

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

      if (!correct) {
        this.wrongBook = addWrongQuestion(this.question, userAnswer)
      }

      this.prepareQuestionNetwork(this.question, { withSynonyms: true })
    },
    showAnswer(item, answerKey) {
      const option = (item.options || []).find((entry) => entry.key === answerKey)
      return option ? option.text : answerKey
    },
    clearWrongs() {
      this.wrongBook = clearWrongBook()
    },
    removeWrong(id) {
      this.wrongBook = removeWrongQuestion(id)
    },
    startTimer() {
      if (this.timer) {
        return
      }
      this.startAt = Date.now()
      this.liveSeconds = 0
      this.timer = setInterval(() => {
        this.liveSeconds = Math.floor((Date.now() - this.startAt) / 1000)
        if (this.isPracticing && this.practiceStartedAt) {
          this.practiceElapsedSeconds = Math.floor((Date.now() - this.practiceStartedAt) / 1000)
        }
      }, 1000)
    },
    stopTimer() {
      if (!this.startAt) {
        return
      }
      clearInterval(this.timer)
      this.timer = null
      this.startAt = 0
      this.liveSeconds = 0
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
.page.with-bottom-tabs{padding-bottom:152rpx}
.card{background:#fff;border-radius:24rpx;padding:24rpx;margin-bottom:20rpx;box-shadow:0 12rpx 32rpx rgba(0,0,0,.06)}
.hero{background:radial-gradient(circle at top left,rgba(255,227,182,.65),transparent 36%),linear-gradient(135deg,#fff4df,#ffffff);padding:28rpx 30rpx}
.hero-inline{margin-bottom:20rpx}
.hero-body{display:flex;align-items:center;gap:22rpx}
.hero-logo{width:192rpx;height:192rpx;flex:none}
.practice-hero{display:flex;flex-direction:column;align-items:flex-start;padding:0 12rpx 4rpx;background:transparent}
.practice-topbar{position:relative;display:flex;align-items:center;justify-content:center;width:100%;min-height:72rpx;padding:4rpx 0 10rpx;box-sizing:border-box;margin-bottom:18rpx}
.practice-back-btn{position:absolute;left:4rpx;top:50%;display:flex;align-items:center;justify-content:center;width:64rpx;min-width:64rpx;height:64rpx;transform:translateY(-50%)}
.practice-back-icon{width:18rpx;height:18rpx;border-left:4rpx solid #324558;border-bottom:4rpx solid #324558;transform:rotate(45deg);box-sizing:border-box}
.practice-topbar-title{max-width:72%;padding:0 36rpx;font-size:24rpx;font-weight:600;line-height:1.5;color:#435163;text-align:center;pointer-events:none}
.practice-hero-logo{width:180rpx;height:180rpx}
.hero-copy{flex:1;min-width:0}
.title{display:block;font-size:42rpx;font-weight:700;color:#233447}
.sub,.meta,.k,.hero-desc{display:block;color:#64748b}
.sub,.plain,.meta,.question,.result text,.hero-desc{line-height:1.7}
.sub{margin-top:8rpx}
.hero-desc{font-size:25rpx;margin-top:10rpx;color:#52708b}
.tabs,.actions,.head,.stats{display:flex;gap:12rpx;flex-wrap:wrap}
.filters{display:flex;flex-direction:column;gap:16rpx}
.tab,.picker,.stat,.option,.result,.picker-button{border-radius:18rpx}
.tab{flex:1;text-align:center;padding:18rpx 0;background:#eef2f7;color:#51606f}
.tab.on{background:#243447;color:#fff}
.bottom-tabs{position:fixed;left:24rpx;right:24rpx;bottom:24rpx;z-index:20;align-items:center;padding:14rpx 18rpx;background:rgba(255,255,255,.96);border-radius:28rpx;box-shadow:0 14rpx 36rpx rgba(24,39,75,.12);backdrop-filter:blur(12px)}
.bottom-tab{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8rpx;min-height:104rpx;padding:12rpx 0;background:transparent;color:#7b8794;transition:all .2s ease}
.bottom-tab.on{background:linear-gradient(180deg,#f3f8ff,#eef7f4);color:#1f7a59;box-shadow:inset 0 0 0 2rpx rgba(62,157,115,.08)}
.tab-icon{width:40rpx;height:40rpx}
.tab-label{font-size:24rpx;font-weight:600;line-height:1.2}
.my-entry-list{display:flex;flex-direction:column;gap:14rpx}
.my-entry{display:flex;align-items:center;justify-content:space-between;gap:18rpx;padding:24rpx 22rpx;background:#f7f9fc;border:2rpx solid #e1e7ef;border-radius:20rpx;box-shadow:0 8rpx 22rpx rgba(53,74,98,.05)}
.my-entry-copy{display:flex;flex-direction:column;gap:6rpx;min-width:0}
.my-entry-title{font-size:30rpx;font-weight:700;color:#243447}
.my-entry-desc{font-size:24rpx;line-height:1.6;color:#64748b}
.my-entry-arrow{font-size:42rpx;line-height:1;color:#90a0b2}
.setup{display:flex;flex-direction:column;gap:14rpx}
.setup-row{position:relative;display:flex;align-items:center;justify-content:space-between;gap:20rpx;padding:10rpx 2rpx}
.setup-row.open{z-index:70}
.setup-label{flex:none;font-size:28rpx;font-weight:600;color:#334155}
.picker-trigger{position:relative;flex:1;min-width:0}
.picker-button{display:flex;align-items:center;justify-content:space-between;padding:18rpx 22rpx;background:linear-gradient(180deg,#f8fbff,#f2f7fc);border:2rpx solid #dde6f0;box-shadow:0 10rpx 24rpx rgba(86,107,137,.08)}
.picker-value{flex:1;min-width:0;font-size:26rpx;color:#314254}
.picker-arrow{margin-left:20rpx;font-size:20rpx;color:#7a8a9a;transition:transform .2s ease}
.picker-arrow.open{transform:rotate(180deg)}
.dropdown-menu{position:absolute;top:calc(100% + 12rpx);left:0;right:0;width:100%;max-height:360rpx;padding:10rpx;box-sizing:border-box;background:#fff;border:2rpx solid #dde6f0;border-radius:22rpx;box-shadow:0 18rpx 36rpx rgba(26,44,72,.16);overflow:hidden;overflow-x:hidden;z-index:71}
.article-menu{height:360rpx;width:100%}
.dropdown-item{display:flex;align-items:center;justify-content:space-between;gap:16rpx;padding:18rpx 20rpx;border-radius:16rpx}
.dropdown-item + .dropdown-item{margin-top:6rpx}
.dropdown-item.on{background:#eef7f4}
.dropdown-text{flex:1;font-size:26rpx;color:#334155;line-height:1.5}
.dropdown-check{font-size:24rpx;font-weight:700;color:#1f7a59}
.select-overlay{position:fixed;inset:0;background:rgba(15,23,42,.18);z-index:60}
.bar{height:14rpx;background:#edf2f7;border-radius:999rpx;overflow:hidden;margin:12rpx 0 18rpx}
.bar.large{height:18rpx}
.fill{height:100%;background:linear-gradient(90deg,#f59f42,#ea5f3d)}
.fill.warm{background:linear-gradient(90deg,#f6b14a,#ff7b54)}
.block,.wrong,.stat{margin-top:18rpx}
.label,.title2{display:block;font-size:30rpx;font-weight:700;color:#243447}
.plain,.question{font-size:28rpx;color:#334155}
.block{display:flex;align-items:center;justify-content:center;min-height:228rpx;margin-top:12rpx;padding:28rpx;background:linear-gradient(180deg,#fff7eb,#ffffff);border:2rpx solid #f1dfc8;border-radius:26rpx;box-shadow:0 14rpx 32rpx rgba(228,125,54,.09)}
.word-head{display:flex;align-items:center;gap:14rpx;margin-top:14rpx}
.word-head.focus{position:relative;justify-content:center;align-items:center;gap:16rpx;width:100%;min-height:160rpx;margin-top:0}
.word-head.focus.phrase{align-items:center}
.word-canvas-shell{position:relative;z-index:1;flex:1;min-width:0;display:flex;align-items:center;justify-content:center;min-height:136rpx}
.word-stem-canvas{display:block;width:100%;height:100%}
.word-stem{display:block;flex:1;min-width:0;font-size:44rpx;font-weight:700;color:#1d4d7a;letter-spacing:1rpx}
.word-stem.centered{flex:0 1 auto;max-width:calc(100% - 78rpx);font-size:62rpx;line-height:1.2;text-align:center;letter-spacing:2rpx;color:#173f69;white-space:nowrap}
.word-stem.centered.compact{font-size:54rpx}
.word-stem.centered.tight{font-size:48rpx}
.word-stem.centered.phrase{max-width:calc(100% - 78rpx);font-size:48rpx;line-height:1.35;white-space:normal;word-break:break-word;overflow-wrap:anywhere}
.word-stem.small{font-size:34rpx}
.speaker-btn{flex:none;display:flex;align-items:center;justify-content:center;width:56rpx;height:56rpx;border-radius:50%;background:#eef6ff;border:2rpx solid #d4e4f8}
.speaker-btn-corner{position:relative;z-index:3;width:58rpx;height:58rpx;background:rgba(242,248,255,.92);border-color:#d5e3f2;box-shadow:0 6rpx 16rpx rgba(59,92,138,.08)}
.speaker-btn.disabled{opacity:.45}
.speaker-btn.playing{background:#e6fff1;border-color:#9bd4b2}
.speaker-icon{font-size:26rpx;line-height:1}
.question-status{display:flex;align-items:center;justify-content:space-between;gap:16rpx;margin:24rpx 0 14rpx}
.question-order-current{font-size:36rpx;font-weight:700;color:#243447}
.option{display:flex;padding:22rpx 24rpx;background:#f8fafc;margin-top:16rpx;border:2rpx solid transparent;border-radius:18rpx}
.option.on{border-color:#f6b35e;background:#fff4e5}
.option.ok{border-color:#39a56d;background:#eaf8f1}
.option.bad{border-color:#e57373;background:#fff1f1}
.option-text{flex:1;font-size:29rpx;line-height:1.65;color:#334155}
.primary,.ghost{flex:1;margin:0;border-radius:999rpx;font-size:28rpx}
.primary{background:#e47d36;color:#fff}
.start-btn{margin-top:8rpx}
.ghost{background:#fff;color:#435163;border:2rpx solid #d8e0ea}
.mini{flex:none;min-width:140rpx;font-size:24rpx}
.result{display:flex;flex-direction:column;gap:8rpx;padding:18rpx;margin-top:18rpx}
.result.ok{background:#effaf3}
.result.bad{background:#fff3ef}
.word-meta-card{margin-top:12rpx;padding:18rpx;background:rgba(255,255,255,.72);border:2rpx solid rgba(216,224,234,.88);border-radius:18rpx}
.word-meta-title{display:block;font-size:27rpx;font-weight:700;color:#243447}
.word-meta-section + .word-meta-section{margin-top:12rpx}
.word-meta-label{display:block;font-size:24rpx;font-weight:600;color:#526171}
.word-meta-inline{display:block;margin-top:10rpx;font-size:23rpx;line-height:1.7;color:#334155}
.word-meta-groups{display:flex;flex-direction:column;gap:12rpx;margin-top:10rpx}
.word-meta-groups.compact{gap:10rpx}
.word-meta-group{padding:14rpx 16rpx;background:#f8fafc;border-radius:16rpx}
.word-meta-group-title{display:block;font-size:23rpx;font-weight:700;color:#445566}
.word-meta-group-title.compact{font-size:22rpx;line-height:1.2}
.word-meta-tags,.word-meta-list{display:flex;flex-wrap:wrap;gap:10rpx;margin-top:10rpx}
.word-meta-list.compact{gap:8rpx;margin-top:8rpx}
.word-meta-tag{padding:8rpx 16rpx;background:#f4f7fb;border-radius:999rpx;font-size:22rpx;color:#324558}
.word-meta-item{padding:10rpx 16rpx;background:#ffffff;border-radius:999rpx;font-size:23rpx;line-height:1.5;color:#334155}
.word-meta-item.compact{padding:8rpx 14rpx;font-size:22rpx;line-height:1.25}
.word-meta-empty{display:block;margin-top:10rpx;font-size:23rpx;color:#7a8a9a}
.empty{text-align:center;color:#64748b;padding:30rpx 0}
.stats .stat{width:calc(50% - 6rpx);padding:20rpx;background:#f8fafc}
.v{display:block;font-size:34rpx;font-weight:700;color:#243447;margin-top:8rpx}
@media (max-width: 640px){
  .hero-body{align-items:center}
  .hero-logo{width:162rpx;height:162rpx}
  .practice-hero-logo{width:156rpx;height:156rpx}
  .title{font-size:38rpx}
}
</style>

<style>
.uni-picker-container .uni-picker-item,
.uni-selector-select .uni-picker-item {
  text-align: left !important;
  padding-left: 18px !important;
}
</style>
