import articleCatalog from './question-bank/articles'

// #ifndef H5
import questionRowsSource from './question-bank/questions'
// #endif

const optionKeys = ['A', 'B', 'C', 'D']
const singleWordPattern = /^[A-Za-z]+(?:[-'][A-Za-z]+)*$/
const articleMetaMap = articleCatalog.reduce((map, item) => {
  map[item.articleId] = item
  return map
}, {})

const articleCache = {}
let mixedCachePromise = null
let questionRowsPromise = null

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

function getDisplayMeaning(row) {
  return row.meaningSummary || row.meaning
}

function isSingleWordStem(stem) {
  return singleWordPattern.test((stem || '').trim())
}

function getStemType(row) {
  return isSingleWordStem(row.stem) ? 'word' : 'phrase'
}

function getMeaningPosTags(row) {
  if (Array.isArray(row.meanings) && row.meanings.length) {
    return row.meanings
      .map((item) => item && item.pos)
      .filter(Boolean)
  }

  const displayMeaning = getDisplayMeaning(row)
  const match = /^(n|v|vt|vi|adj|adv|prep|pron|conj|int|num|aux|abbr|art|det)\./.exec(displayMeaning || '')
  return match ? [`${match[1]}.`] : []
}

function countMeaningClauses(text) {
  return String(text || '')
    .split('；')
    .map((item) => item.trim())
    .filter(Boolean).length
}

function scoreCandidate(currentRow, candidateRow) {
  const currentType = getStemType(currentRow)
  const candidateType = getStemType(candidateRow)
  const currentMeaning = getDisplayMeaning(currentRow)
  const candidateMeaning = getDisplayMeaning(candidateRow)
  const currentPosTags = getMeaningPosTags(currentRow)
  const candidatePosTags = getMeaningPosTags(candidateRow)
  const candidatePosSet = new Set(candidatePosTags)
  const sharedPosCount = currentPosTags.filter((tag) => candidatePosSet.has(tag)).length

  let score = 0

  if (currentType === candidateType) {
    score += 120
  } else {
    score -= 60
  }

  if (currentType === 'word') {
    if (currentPosTags.length && candidatePosTags.length) {
      score += sharedPosCount * 70
      if (currentPosTags[0] === candidatePosTags[0]) {
        score += 50
      }
      if (sharedPosCount === 0) {
        score -= 70
      }
      if (currentPosTags.length > 1 && candidatePosTags.length > 1) {
        score += 16
      }
      score -= Math.abs(currentPosTags.length - candidatePosTags.length) * 8
    }
  } else {
    const currentTokenCount = currentRow.stem.trim().split(/\s+/).length
    const candidateTokenCount = candidateRow.stem.trim().split(/\s+/).length
    score -= Math.abs(currentTokenCount - candidateTokenCount) * 12
  }

  score -= Math.abs(currentMeaning.length - candidateMeaning.length) * 1.5
  score -= Math.abs(countMeaningClauses(currentMeaning) - countMeaningClauses(candidateMeaning)) * 10
  score -= Math.abs(currentRow.stem.length - candidateRow.stem.length) * 0.8

  return score
}

function buildArticleRowMap(rows) {
  return rows.reduce((map, row) => {
    if (!map[row.articleId]) {
      map[row.articleId] = []
    }

    map[row.articleId].push(row)
    return map
  }, {})
}

function getDistractors(articleRows, currentRow, correctMeaning, seed) {
  const randomizedCandidates = shuffleBySeed(
    articleRows.filter((row) => row.stem !== currentRow.stem || row.meaning !== currentRow.meaning),
    seed
  )

  const rankedCandidates = randomizedCandidates
    .map((row, index) => ({
      row,
      score: scoreCandidate(currentRow, row),
      index
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.index - right.index
    })

  const distractors = []
  const seen = new Set()

  rankedCandidates.forEach(({ row }) => {
    const candidate = getDisplayMeaning(row)
    if (candidate && candidate !== correctMeaning && !seen.has(candidate) && distractors.length < 3) {
      seen.add(candidate)
      distractors.push(candidate)
    }
  })

  return distractors
}

function buildQuestionList(rows, allRows = rows) {
  const perArticleCount = {}
  const articleRowMap = buildArticleRowMap(allRows)

  return rows.map((row, globalIndex) => {
    const meta = articleMetaMap[row.articleId] || {}
    const questionIndex = (perArticleCount[row.articleId] || 0) + 1
    perArticleCount[row.articleId] = questionIndex
    const displayMeaning = getDisplayMeaning(row)
    const articleRows = articleRowMap[row.articleId] || []

    const optionTexts = shuffleBySeed(
      [displayMeaning].concat(getDistractors(articleRows, row, displayMeaning, globalIndex + questionIndex)),
      globalIndex + 1
    )
    const options = optionTexts.map((text, index) => ({
      key: optionKeys[index],
      text
    }))
    const correctOption = options.find((item) => item.text === displayMeaning)
    const explanationLines = [`${row.stem} 的中文意思是：${displayMeaning}`]
    if (row.meaningSummary && row.meaning && row.meaning !== row.meaningSummary) {
      explanationLines.push(`完整释义：${row.meaning}`)
    }

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
      meaning: row.meaning,
      meaningSummary: displayMeaning,
      meanings: row.meanings || [],
      explanation: explanationLines.join('\n')
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
    articleCache[articleId] = loadQuestionRows().then((rows) =>
      buildQuestionList(rows.filter((item) => item.articleId === articleId))
    )
  }

  const questions = await articleCache[articleId]
  return questions.slice()
}

export async function loadMixedQuestions() {
  if (!mixedCachePromise) {
    mixedCachePromise = loadQuestionRows().then((rows) => buildQuestionList(rows, rows))
  }

  const questions = await mixedCachePromise
  return questions.slice()
}

export const questionBank = []
