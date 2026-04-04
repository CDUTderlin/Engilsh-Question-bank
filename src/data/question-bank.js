import articleCatalog from './question-bank/articles'

// #ifndef H5
import questionRowsSource from './question-bank/questions'
import meaningPoolSource from './question-bank/meaning-pool'
// #endif

const optionKeys = ['A', 'B', 'C', 'D']
const articleMetaMap = articleCatalog.reduce((map, item) => {
  map[item.articleId] = item
  return map
}, {})

const articleCache = {}
let mixedCachePromise = null
let questionRowsPromise = null
let meaningPoolPromise = null

function getArticleIndex(articleId) {
  const match = /article-(\d+)/.exec(articleId || '')
  return match ? Number(match[1]) : 0
}

function formatArticleLabel(articleId) {
  const meta = articleMetaMap[articleId]
  if (!meta) {
    return '未知文章'
  }

  return `第 ${meta.articleIndex || getArticleIndex(articleId)} 篇 · ${meta.articleTitle}`
}

function shuffleBySeed(list, seed) {
  const result = list.slice()
  let currentSeed = seed || 1

  for (let i = result.length - 1; i > 0; i -= 1) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    const j = currentSeed % (i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }

  return result
}

function getDistractors(pool, correctMeaning, seed) {
  const distractors = []
  let step = 1

  while (distractors.length < 3 && step < pool.length + 8) {
    const candidate = pool[(seed + step * 7) % pool.length]
    if (candidate !== correctMeaning && !distractors.includes(candidate)) {
      distractors.push(candidate)
    }
    step += 1
  }

  return distractors
}

function buildQuestionList(rows, meaningPool) {
  const perArticleCount = {}

  return rows.map((row, globalIndex) => {
    const meta = articleMetaMap[row.articleId] || {}
    const questionIndex = (perArticleCount[row.articleId] || 0) + 1
    perArticleCount[row.articleId] = questionIndex

    const optionTexts = shuffleBySeed(
      [row.meaning].concat(getDistractors(meaningPool, row.meaning, globalIndex + questionIndex)),
      globalIndex + 1
    )
    const options = optionTexts.map((text, index) => ({
      key: optionKeys[index],
      text
    }))
    const correctOption = options.find((item) => item.text === row.meaning)

    return {
      id: `${row.articleId}-q${questionIndex}`,
      type: 'single',
      category: meta.unitTitle || '',
      articleId: row.articleId,
      articleIndex: meta.articleIndex || getArticleIndex(row.articleId),
      articleTitle: meta.articleTitle || '',
      articleLabel: formatArticleLabel(row.articleId),
      sourcePdfPage: meta.sourcePdfPage || 0,
      stem: row.stem,
      question: '请选择最恰当的中文释义。',
      options,
      answer: correctOption ? correctOption.key : 'A',
      explanation: `${row.stem} 的中文意思是：${row.meaning}`
    }
  })
}

function requestJson(filename) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${process.env.BASE_URL || '/'}static/question-bank/${filename}`,
      success: (response) => {
        const statusCode = Number(response.statusCode || 200)
        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`Failed to load ${filename}: ${statusCode}`))
          return
        }

        const payload = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
        resolve(payload)
      },
      fail: reject
    })
  })
}

async function loadQuestionRows() {
  if (!questionRowsPromise) {
    // #ifdef H5
    questionRowsPromise = requestJson('questions.json')
    // #endif

    // #ifndef H5
    questionRowsPromise = Promise.resolve(questionRowsSource)
    // #endif
  }

  const rows = await questionRowsPromise
  return rows.slice()
}

async function loadMeaningPool() {
  if (!meaningPoolPromise) {
    // #ifdef H5
    meaningPoolPromise = requestJson('meaning-pool.json')
    // #endif

    // #ifndef H5
    meaningPoolPromise = Promise.resolve(meaningPoolSource)
    // #endif
  }

  const meanings = await meaningPoolPromise
  return meanings.slice()
}

export const articleOptions = articleCatalog.map((item) => ({
  value: item.articleId,
  label: formatArticleLabel(item.articleId),
  unitTitle: item.unitTitle,
  articleTitle: item.articleTitle,
  count: item.count
}))

export const totalQuestionCount = articleCatalog.reduce((sum, item) => sum + item.count, 0)

export async function loadArticleQuestions(articleId) {
  if (!articleMetaMap[articleId]) {
    return []
  }

  if (!articleCache[articleId]) {
    articleCache[articleId] = Promise.all([loadQuestionRows(), loadMeaningPool()]).then(([rows, meaningPool]) =>
      buildQuestionList(
        rows.filter((item) => item.articleId === articleId),
        meaningPool
      )
    )
  }

  const questions = await articleCache[articleId]
  return questions.slice()
}

export async function loadMixedQuestions() {
  if (!mixedCachePromise) {
    mixedCachePromise = Promise.all([loadQuestionRows(), loadMeaningPool()]).then(([rows, meaningPool]) =>
      buildQuestionList(rows, meaningPool)
    )
  }

  const questions = await mixedCachePromise
  return questions.slice()
}

export const questionBank = []
