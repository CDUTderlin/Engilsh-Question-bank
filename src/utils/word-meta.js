import questionRowsSource from '../data/question-bank/questions'
import wordFamilyOverrides from '../data/word-family-overrides'
import wordFamilyGenerated from '../data/word-family-generated'

const MIN_FAMILY_ROOT_LENGTH = 4
const MAX_RELATED_FORMS = 6
const POS_PRIORITY = ['n.', 'v.', 'adj.', 'adv.']
const POS_GROUP_LABELS = {
  'n.': '名词',
  'v.': '动词',
  'adj.': '形容词',
  'adv.': '副词',
  other: '其他'
}

function uniq(list) {
  return [...new Set(list.filter(Boolean))]
}

function isLikelyPlural(baseWord, candidate) {
  if (!baseWord || !candidate || baseWord === candidate) {
    return false
  }

  const directMatches = [
    `${baseWord}s`,
    `${baseWord}es`,
    `${baseWord}ies`
  ]

  if (directMatches.includes(candidate)) {
    return true
  }

  if (baseWord.endsWith('y') && candidate === `${baseWord.slice(0, -1)}ies`) {
    return true
  }

  return false
}

function isLikelyVerbInflection(baseWord, candidate) {
  if (!baseWord || !candidate || baseWord === candidate) {
    return false
  }

  const candidates = [
    `${baseWord}ed`,
    `${baseWord}ing`,
    `${baseWord}s`,
    `${baseWord}es`,
    `${baseWord}d`
  ]

  if (candidates.includes(candidate)) {
    return true
  }

  if (baseWord.endsWith('y')) {
    if (candidate === `${baseWord.slice(0, -1)}ied` || candidate === `${baseWord.slice(0, -1)}ies`) {
      return true
    }
  }

  if (baseWord.endsWith('e') && candidate === `${baseWord.slice(0, -1)}ing`) {
    return true
  }

  return false
}

function isBaseWordVariant(baseWord, candidate) {
  return baseWord === candidate
}

function normalizeSingleWord(stem) {
  const normalized = String(stem || '')
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*.*/g, ' ')
    .replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '')
    .replace(/^[-']+|[-']+$/g, '')

  if (!normalized || /\s/.test(normalized)) {
    return ''
  }

  return /^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/.test(normalized) ? normalized : ''
}

function sortPosTags(tags) {
  return uniq(tags).sort((left, right) => {
    const leftIndex = POS_PRIORITY.indexOf(left)
    const rightIndex = POS_PRIORITY.indexOf(right)
    const safeLeft = leftIndex === -1 ? POS_PRIORITY.length : leftIndex
    const safeRight = rightIndex === -1 ? POS_PRIORITY.length : rightIndex
    return safeLeft - safeRight
  })
}

function extractPosTagsFromMeaning(meaning) {
  const text = String(meaning || '')
  const tags = []

  if (/\badj\./i.test(text)) {
    tags.push('adj.')
  }
  if (/\badv\./i.test(text)) {
    tags.push('adv.')
  }
  if (/\bn\./i.test(text)) {
    tags.push('n.')
  }
  if (/\bv(?:t|i|[il])?\.?/i.test(text)) {
    tags.push('v.')
  }

  return sortPosTags(tags)
}

function inferPosTagsFromWord(word, relatedWords = []) {
  const tags = []
  const familyWords = relatedWords.map((item) => item.word)

  if (/ly$/.test(word)) {
    tags.push('adv.')
  }
  if (/(tion|sion|ment|ness|ity|age|ance|ence|ship|dom|hood|ism|ist)$/.test(word)) {
    tags.push('n.')
  }
  if (/(able|ible|al|ful|less|ous|ive|ic|ish|ary|ory)$/.test(word)) {
    tags.push('adj.')
  }
  if (/(ize|ise|ify|ate|en)$/.test(word)) {
    tags.push('v.')
  }
  if (/ed$/.test(word)) {
    tags.push('adj.')
    tags.push('v.')
  }
  if (/ing$/.test(word)) {
    tags.push('v.')
  }

  if (!tags.length && familyWords.some((item) => item.endsWith('ly'))) {
    tags.push('adj.')
  }
  if (!tags.length && familyWords.some((item) => /(ed|ing)$/.test(item))) {
    tags.push('v.')
  }
  if (!tags.length && familyWords.some((item) => /(tion|sion|ment|ness|ity)$/.test(item))) {
    tags.push('v.')
  }

  return sortPosTags(tags)
}

function getFamilyRoots(word) {
  const roots = [word]

  if (word.endsWith('ly')) {
    roots.push(word.slice(0, -2))
    if (word.endsWith('ily')) {
      roots.push(`${word.slice(0, -3)}y`)
    }
  }

  if (word.endsWith('ed')) {
    roots.push(word.slice(0, -2))
    roots.push(`${word.slice(0, -2)}e`)
    if (/(.)\1ed$/.test(word)) {
      roots.push(word.slice(0, -3))
    }
  }

  if (word.endsWith('ing')) {
    roots.push(word.slice(0, -3))
    roots.push(`${word.slice(0, -3)}e`)
    if (/(.)\1ing$/.test(word)) {
      roots.push(word.slice(0, -4))
    }
  }

  if (word.endsWith('ation')) {
    roots.push(word.slice(0, -5))
    roots.push(`${word.slice(0, -5)}ate`)
  }
  if (word.endsWith('tion')) {
    roots.push(word.slice(0, -4))
    roots.push(`${word.slice(0, -4)}t`)
    roots.push(`${word.slice(0, -4)}e`)
  }
  if (word.endsWith('sion')) {
    roots.push(word.slice(0, -4))
    roots.push(`${word.slice(0, -4)}d`)
    roots.push(`${word.slice(0, -4)}de`)
  }
  if (word.endsWith('ment') || word.endsWith('ness')) {
    roots.push(word.slice(0, -4))
  }
  if (word.endsWith('ity')) {
    roots.push(word.slice(0, -3))
    roots.push(`${word.slice(0, -3)}e`)
    if (word.endsWith('ility')) {
      roots.push(`${word.slice(0, -5)}le`)
    }
    if (word.endsWith('ality')) {
      roots.push(`${word.slice(0, -5)}al`)
    }
  }
  if (word.endsWith('ive')) {
    roots.push(word.slice(0, -3))
    roots.push(`${word.slice(0, -3)}e`)
  }
  if (word.endsWith('able') || word.endsWith('ible')) {
    roots.push(word.slice(0, -4))
    roots.push(`${word.slice(0, -4)}e`)
  }
  if (word.endsWith('al')) {
    roots.push(word.slice(0, -2))
  }

  return uniq(roots.filter((item) => item && item.length >= MIN_FAMILY_ROOT_LENGTH))
}

const wordEntryMap = questionRowsSource.reduce((map, row) => {
  const word = normalizeSingleWord(row.stem)
  if (!word) {
    return map
  }

  if (!map[word]) {
    map[word] = {
      word,
      displayWord: String(row.stem || '').trim(),
      meanings: []
    }
  }

  if (row.meaning) {
    map[word].meanings.push(String(row.meaning))
  }

  return map
}, {})

const familyRootMap = {}
Object.keys(wordEntryMap).forEach((word) => {
  getFamilyRoots(word).forEach((root) => {
    if (!familyRootMap[root]) {
      familyRootMap[root] = new Set()
    }
    familyRootMap[root].add(word)
  })
})

function getRelatedWords(word) {
  const roots = getFamilyRoots(word)
  const scoreMap = {}

  roots.forEach((root) => {
    const candidates = familyRootMap[root]
    if (!candidates) {
      return
    }

    candidates.forEach((candidate) => {
      if (candidate === word) {
        return
      }
      scoreMap[candidate] = Math.max(scoreMap[candidate] || 0, root.length)
    })
  })

  return Object.keys(scoreMap)
    .sort((left, right) => {
      if (scoreMap[right] !== scoreMap[left]) {
        return scoreMap[right] - scoreMap[left]
      }
      return left.localeCompare(right)
    })
    .slice(0, MAX_RELATED_FORMS)
}

function buildPosTags(word, entry, relatedWords) {
  const meaningTags = uniq(
    (entry && entry.meanings ? entry.meanings : []).reduce((result, meaning) => result.concat(extractPosTagsFromMeaning(meaning)), [])
  )
  if (meaningTags.length) {
    return sortPosTags(meaningTags)
  }

  return inferPosTagsFromWord(word, relatedWords)
}

function getPrimaryPosTag(posTags = []) {
  return posTags && posTags.length ? posTags[0] : 'other'
}

function buildGroupedRelatedForms(relatedForms) {
  const groupMap = {}

  relatedForms.forEach((item) => {
    const groupKey = getPrimaryPosTag(item.posTags)
    if (!groupMap[groupKey]) {
      groupMap[groupKey] = {
        key: groupKey,
        label: POS_GROUP_LABELS[groupKey] || POS_GROUP_LABELS.other,
        items: []
      }
    }
    groupMap[groupKey].items.push(item)
  })

  return Object.values(groupMap).sort((left, right) => {
    const leftIndex = POS_PRIORITY.indexOf(left.key)
    const rightIndex = POS_PRIORITY.indexOf(right.key)
    const safeLeft = leftIndex === -1 ? POS_PRIORITY.length : leftIndex
    const safeRight = rightIndex === -1 ? POS_PRIORITY.length : rightIndex
    return safeLeft - safeRight
  })
}

function filterBasicForms(baseWord, groupKey, items = []) {
  const normalizedBase = normalizeSingleWord(baseWord)
  const uniqueItems = uniq(items.map((item) => item && item.word).filter(Boolean))

  let filteredWords = uniqueItems.filter((word) => {
    if (!normalizedBase) {
      return true
    }

    if (groupKey === 'n.') {
      return !isLikelyPlural(normalizedBase, word)
    }

    if (groupKey === 'v.') {
      return !isLikelyVerbInflection(normalizedBase, word)
    }

    return !isBaseWordVariant(normalizedBase, word)
  })

  if (!filteredWords.length && uniqueItems.length) {
    filteredWords = [uniqueItems[0]]
  }

  return filteredWords.slice(0, 3).map((word) => ({
    word,
    posTags: groupKey === 'other' ? [] : [groupKey],
    posText: POS_GROUP_LABELS[groupKey] || POS_GROUP_LABELS.other
  }))
}

function normalizeOverrideGroups(groups = []) {
  return groups
    .map((group) => {
      const key = group && group.key ? group.key : 'other'
      const items = uniq((group && group.items ? group.items : []).map((item) => String(item || '').trim()))
        .filter(Boolean)
        .map((word) => ({
          word,
          posTags: key === 'other' ? [] : [key],
          posText: POS_GROUP_LABELS[key] || POS_GROUP_LABELS.other
        }))

      if (!items.length) {
        return null
      }

      return {
        key,
        label: POS_GROUP_LABELS[key] || POS_GROUP_LABELS.other,
        items
      }
    })
    .filter(Boolean)
}

function pruneGroupedRelatedForms(baseWord, groups = []) {
  return groups
    .map((group) => {
      const items = filterBasicForms(baseWord, group.key, group.items || [])
      if (!items.length) {
        return null
      }

      return {
        key: group.key,
        label: group.label,
        items
      }
    })
    .filter(Boolean)
}

function flattenGroups(groups = []) {
  return groups.reduce((result, group) => result.concat(group.items || []), [])
}

export function getWordMeta(stem) {
  const word = normalizeSingleWord(stem)
  if (!word) {
    return {
      isSingleWord: false,
      word: '',
      displayWord: '',
      posTags: [],
      relatedForms: [],
      groupedRelatedForms: []
    }
  }

  const override = wordFamilyOverrides[word] || wordFamilyGenerated[word]
  if (override) {
    const posTags = sortPosTags(override.posTags || [])
    const groupedRelatedForms = pruneGroupedRelatedForms(word, normalizeOverrideGroups(override.groupedRelatedForms))
    return {
      isSingleWord: true,
      word,
      displayWord: word,
      posTags,
      posText: posTags.length ? posTags.join(' / ') : '待补充',
      relatedForms: flattenGroups(groupedRelatedForms),
      groupedRelatedForms
    }
  }

  const entry = wordEntryMap[word] || {
    word,
    displayWord: word,
    meanings: []
  }
  const relatedWords = getRelatedWords(word)
  const relatedForms = relatedWords.map((relatedWord) => {
    const relatedEntry = wordEntryMap[relatedWord]
    const posTags = buildPosTags(relatedWord, relatedEntry, [])
    return {
      word: relatedEntry ? relatedEntry.displayWord : relatedWord,
      posTags,
      posText: posTags.length ? posTags.join(' / ') : '待补充'
    }
  })

  const posTags = buildPosTags(word, entry, relatedForms)
  const groupedRelatedForms = pruneGroupedRelatedForms(word, buildGroupedRelatedForms(relatedForms))

  return {
    isSingleWord: true,
    word,
    displayWord: entry.displayWord,
    posTags,
    posText: posTags.length ? posTags.join(' / ') : '待补充',
    relatedForms,
    groupedRelatedForms
  }
}
