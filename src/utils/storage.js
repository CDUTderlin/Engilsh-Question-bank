const WRONG_BOOK_KEY = 'english-practice-wrong-book'
const STATS_KEY = 'english-practice-stats'
const PRACTICE_RECORDS_KEY = 'english-practice-records'

const defaultStats = {
  answeredCount: 0,
  correctCount: 0,
  completedQuestionIds: [],
  totalStudySeconds: 0,
  lastPracticedAt: ''
}

export function getWrongBook() {
  return uni.getStorageSync(WRONG_BOOK_KEY) || []
}

export function saveWrongBook(list) {
  uni.setStorageSync(WRONG_BOOK_KEY, list)
}

export function addWrongQuestion(question, userAnswer) {
  const wrongBook = getWrongBook()
  const existingIndex = wrongBook.findIndex((item) => item.id === question.id)
  const nextEntry = {
    id: question.id,
    type: question.type,
    category: question.category,
    articleId: question.articleId || '',
    articleIndex: question.articleIndex || 0,
    articleTitle: question.articleTitle || '',
    articleLabel: question.articleLabel || '',
    difficulty: question.difficulty,
    stem: question.stem,
    passage: question.passage || '',
    question: question.question || '',
    options: question.options || [],
    correctAnswer: question.answer,
    userAnswer,
    explanation: question.explanation || '',
    wrongCount: 1,
    updatedAt: new Date().toISOString()
  }

  if (existingIndex >= 0) {
    const merged = {
      ...wrongBook[existingIndex],
      ...nextEntry,
      wrongCount: (wrongBook[existingIndex].wrongCount || 0) + 1
    }
    wrongBook.splice(existingIndex, 1, merged)
  } else {
    wrongBook.unshift(nextEntry)
  }

  saveWrongBook(wrongBook)
  return wrongBook
}

export function removeWrongQuestion(questionId) {
  const nextList = getWrongBook().filter((item) => item.id !== questionId)
  saveWrongBook(nextList)
  return nextList
}

export function clearWrongBook() {
  saveWrongBook([])
  return []
}

export function getStats() {
  return {
    ...defaultStats,
    ...(uni.getStorageSync(STATS_KEY) || {})
  }
}

export function saveStats(stats) {
  uni.setStorageSync(STATS_KEY, {
    ...defaultStats,
    ...stats
  })
}

export function addStudySeconds(seconds) {
  const safeSeconds = Math.max(0, Number(seconds || 0))
  const stats = getStats()
  const nextStats = {
    ...stats,
    totalStudySeconds: (stats.totalStudySeconds || 0) + safeSeconds
  }
  saveStats(nextStats)
  return nextStats
}

export function getPracticeRecords() {
  return uni.getStorageSync(PRACTICE_RECORDS_KEY) || []
}

export function savePracticeRecords(records) {
  uni.setStorageSync(PRACTICE_RECORDS_KEY, records)
}

export function addPracticeRecord(record) {
  const records = getPracticeRecords()
  const nextRecords = [record].concat(records).slice(0, 50)
  savePracticeRecords(nextRecords)
  return nextRecords
}
