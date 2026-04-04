const articleCatalog = [
  { value: 'article-01', unitTitle: 'Friendship', articleTitle: 'Fall in Love with English', count: 43 },
  { value: 'article-02', unitTitle: 'English around the world', articleTitle: 'Different Kinds of English', count: 41 },
  { value: 'article-03', unitTitle: 'Travel journal', articleTitle: 'A Hard Trip', count: 42 },
  { value: 'article-04', unitTitle: 'Earthquakes', articleTitle: 'A Terrible Earthquake', count: 45 },
  { value: 'article-05', unitTitle: 'Nelson Mandela - a modern hero', articleTitle: 'A Great President', count: 43 },
  { value: 'article-06', unitTitle: 'Cultural relics', articleTitle: 'A Brave Maid', count: 41 },
  { value: 'article-07', unitTitle: 'The Olympic Games', articleTitle: 'Competitions Must Be Fair', count: 41 },
  { value: 'article-08', unitTitle: 'Computers', articleTitle: 'The Computer', count: 42 },
  { value: 'article-09', unitTitle: 'Wildlife protection', articleTitle: 'Protect Wildlife', count: 42 },
  { value: 'article-10', unitTitle: 'Music', articleTitle: 'My First Band', count: 40 },
  { value: 'article-11', unitTitle: 'Festivals around the world', articleTitle: 'An Interesting Festival', count: 42 },
  { value: 'article-12', unitTitle: 'Healthy eating', articleTitle: 'Balanced Diet', count: 40 },
  { value: 'article-13', unitTitle: 'The Million Pound Bank Note', articleTitle: 'Go Ahead', count: 40 },
  { value: 'article-14', unitTitle: 'Astronomy: the science of the stars', articleTitle: 'Explore UKII', count: 43 },
  { value: 'article-15', unitTitle: 'Canada "The True North"', articleTitle: 'A Journey across Canada', count: 42 },
  { value: 'article-16', unitTitle: 'Women of achievement', articleTitle: 'A Woman Doctor Li Na', count: 25 },
  { value: 'article-17', unitTitle: 'Working the land', articleTitle: "Tuan's New Farming Way", count: 25 },
  { value: 'article-18', unitTitle: 'A taste of English humour', articleTitle: 'A Great Master of Humour', count: 25 },
  { value: 'article-19', unitTitle: 'Body language', articleTitle: 'A Misunderstanding', count: 25 },
  { value: 'article-20', unitTitle: 'Theme parks', articleTitle: 'A Unique Theme Park', count: 25 },
  { value: 'article-21', unitTitle: 'Great scientists', articleTitle: 'A Strange Severe Disease', count: 25 },
  { value: 'article-22', unitTitle: 'The United Kingdom', articleTitle: 'Sightseeing in the United Kingdom', count: 25 },
  { value: 'article-23', unitTitle: 'Life in the future', articleTitle: 'An Air Crash', count: 25 },
  { value: 'article-24', unitTitle: 'Making the news', articleTitle: 'An Amateur Journalist', count: 25 },
  { value: 'article-25', unitTitle: 'First aid', articleTitle: 'First Aid', count: 25 }
]

const articleMetaMap = articleCatalog.reduce((map, item) => {
  map[item.value] = item
  return map
}, {})

const articleCache = {}
let mixedCachePromise = null

// #ifndef H5
const articleLoaders = {
  'article-01': () => import('./question-bank/article-01.js'),
  'article-02': () => import('./question-bank/article-02.js'),
  'article-03': () => import('./question-bank/article-03.js'),
  'article-04': () => import('./question-bank/article-04.js'),
  'article-05': () => import('./question-bank/article-05.js'),
  'article-06': () => import('./question-bank/article-06.js'),
  'article-07': () => import('./question-bank/article-07.js'),
  'article-08': () => import('./question-bank/article-08.js'),
  'article-09': () => import('./question-bank/article-09.js'),
  'article-10': () => import('./question-bank/article-10.js'),
  'article-11': () => import('./question-bank/article-11.js'),
  'article-12': () => import('./question-bank/article-12.js'),
  'article-13': () => import('./question-bank/article-13.js'),
  'article-14': () => import('./question-bank/article-14.js'),
  'article-15': () => import('./question-bank/article-15.js'),
  'article-16': () => import('./question-bank/article-16.js'),
  'article-17': () => import('./question-bank/article-17.js'),
  'article-18': () => import('./question-bank/article-18.js'),
  'article-19': () => import('./question-bank/article-19.js'),
  'article-20': () => import('./question-bank/article-20.js'),
  'article-21': () => import('./question-bank/article-21.js'),
  'article-22': () => import('./question-bank/article-22.js'),
  'article-23': () => import('./question-bank/article-23.js'),
  'article-24': () => import('./question-bank/article-24.js'),
  'article-25': () => import('./question-bank/article-25.js')
}
// #endif

function normalizeModule(mod) {
  return mod && mod.default ? mod.default : mod
}

function getArticleIndex(articleId) {
  const match = /article-(\d+)/.exec(articleId || '')
  return match ? Number(match[1]) : 0
}

function formatArticleLabel(articleId) {
  const meta = articleMetaMap[articleId]
  if (!meta) {
    return '未知文章'
  }

  return `第 ${getArticleIndex(articleId)} 篇 · ${meta.articleTitle}`
}

function normalizeQuestion(question) {
  const meta = articleMetaMap[question.articleId] || {}
  const correctOption = (question.options || []).find((item) => item.key === question.answer)
  const correctMeaning = correctOption ? correctOption.text : ''

  return {
    ...question,
    category: meta.unitTitle || question.category || '',
    articleIndex: getArticleIndex(question.articleId) || question.articleIndex || 0,
    articleTitle: meta.articleTitle || question.articleTitle || '',
    articleLabel: formatArticleLabel(question.articleId),
    question: '请选择最恰当的中文释义。',
    explanation: correctMeaning ? `${question.stem} 的中文意思是：${correctMeaning}` : question.explanation
  }
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

async function loadQuestionsByArticle(articleId) {
  if (!articleMetaMap[articleId]) {
    return []
  }

  if (!articleCache[articleId]) {
    // #ifdef H5
    articleCache[articleId] = requestJson(`${articleId}.json`).then((list) => list.map(normalizeQuestion))
    // #endif

    // #ifndef H5
    articleCache[articleId] = articleLoaders[articleId]().then(normalizeModule).then((list) => list.map(normalizeQuestion))
    // #endif
  }

  const questions = await articleCache[articleId]
  return questions.slice()
}

async function loadAllQuestions() {
  if (!mixedCachePromise) {
    // #ifdef H5
    mixedCachePromise = requestJson('all.json').then((list) => list.map(normalizeQuestion))
    // #endif

    // #ifndef H5
    mixedCachePromise = Promise.all(articleCatalog.map((item) => loadQuestionsByArticle(item.value))).then((groups) => groups.flat())
    // #endif
  }

  const questions = await mixedCachePromise
  return questions.slice()
}

export const articleOptions = articleCatalog.map((item) => ({
  value: item.value,
  label: formatArticleLabel(item.value),
  unitTitle: item.unitTitle,
  articleTitle: item.articleTitle,
  count: item.count
}))

export const totalQuestionCount = articleCatalog.reduce((sum, item) => sum + item.count, 0)

export async function loadArticleQuestions(articleId) {
  return loadQuestionsByArticle(articleId)
}

export async function loadMixedQuestions() {
  return loadAllQuestions()
}

export const questionBank = []
