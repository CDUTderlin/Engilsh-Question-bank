const REPORT_WIDTH = 720
const PAGE_PADDING = 28
const SECTION_GAP = 24
const CARD_PADDING = 24
const INNER_GAP = 16
const SUMMARY_GAP = 14
const SUMMARY_ITEM_HEIGHT = 102
const HEADER_HEIGHT = 164
const BORDER_RADIUS = 22
const DETAIL_CARD_GAP = 16
const DETAIL_WORD_FONT_SIZE = 42
const DETAIL_WORD_LINE_HEIGHT = 50
const DETAIL_MEANING_FONT_SIZE = 22
const DETAIL_MEANING_LINE_HEIGHT = 34
const DETAIL_CARD_SIDE_PADDING = 24
const DETAIL_CARD_TOP_PADDING = 24
const DETAIL_CARD_BOTTOM_PADDING = 24
const DETAIL_BADGE_WIDTH = 54
const DETAIL_BADGE_HEIGHT = 34
const DETAIL_BADGE_GAP = 16
const DETAIL_HEADER_GAP = 18
const DETAIL_MEANING_BOX_PADDING_X = 18
const DETAIL_MEANING_BOX_PADDING_TOP = 16
const DETAIL_MEANING_BOX_PADDING_BOTTOM = 18
const DETAIL_MEANING_LABEL_GAP = 14

function sanitizeText(value, fallback = '') {
  const text = String(value || '').trim()
  return text || fallback
}

function formatDate(value) {
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

function formatDuration(totalSeconds) {
  const safeSeconds = Number(totalSeconds || 0)
  const h = String(Math.floor(safeSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(safeSeconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function getCharWidth(char, fontSize) {
  if (!char) {
    return 0
  }

  if (/\s/.test(char)) {
    return fontSize * 0.35
  }

  if (/[\u4e00-\u9fff]/.test(char)) {
    return fontSize
  }

  if (/[A-Z0-9]/.test(char)) {
    return fontSize * 0.66
  }

  if (/[a-z]/.test(char)) {
    return fontSize * 0.58
  }

  return fontSize * 0.45
}

function wrapText(text, maxWidth, fontSize) {
  const content = sanitizeText(text)
  if (!content) {
    return ['']
  }

  const rawLines = content.split(/\n+/)
  const lines = []

  rawLines.forEach((rawLine) => {
    let current = ''
    let currentWidth = 0
    const safeLine = rawLine || ''

    for (const char of safeLine) {
      const charWidth = getCharWidth(char, fontSize)
      if (current && currentWidth + charWidth > maxWidth) {
        lines.push(current)
        current = char
        currentWidth = charWidth
      } else {
        current += char
        currentWidth += charWidth
      }
    }

    if (current) {
      lines.push(current)
    } else {
      lines.push('')
    }
  })

  return lines.length ? lines : ['']
}

function drawRoundRect(ctx, x, y, width, height, radius, fillColor, strokeColor) {
  const safeRadius = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + safeRadius, y)
  ctx.lineTo(x + width - safeRadius, y)
  ctx.arcTo(x + width, y, x + width, y + safeRadius, safeRadius)
  ctx.lineTo(x + width, y + height - safeRadius)
  ctx.arcTo(x + width, y + height, x + width - safeRadius, y + height, safeRadius)
  ctx.lineTo(x + safeRadius, y + height)
  ctx.arcTo(x, y + height, x, y + height - safeRadius, safeRadius)
  ctx.lineTo(x, y + safeRadius)
  ctx.arcTo(x, y, x + safeRadius, y, safeRadius)
  ctx.closePath()

  if (fillColor) {
    ctx.setFillStyle(fillColor)
    ctx.fill()
  }

  if (strokeColor) {
    ctx.setStrokeStyle(strokeColor)
    ctx.stroke()
  }
}

function drawTextLines(ctx, lines, options = {}) {
  const {
    x = 0,
    y = 0,
    fontSize = 24,
    lineHeight = fontSize * 1.5,
    color = '#243447'
  } = options

  ctx.setFillStyle(color)
  ctx.setFontSize(fontSize)

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight)
  })

  return y + lines.length * lineHeight
}

function extractMeaningFromExplanation(explanation) {
  const text = String(explanation || '')
  const fullMatch = text.match(/完整释义[:：]\s*([^\n]+)/)
  if (fullMatch && fullMatch[1]) {
    return fullMatch[1].trim()
  }

  const briefMatch = text.match(/中文意思是[:：]\s*([^\n]+)/)
  if (briefMatch && briefMatch[1]) {
    return briefMatch[1].trim()
  }

  const fallbackLine = text
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && /[:：]/.test(line))

  if (!fallbackLine) {
    return ''
  }

  return fallbackLine.split(/[:：]/).slice(1).join('：').trim()
}

function getDetailMeaning(detail) {
  return sanitizeText(
    detail && (detail.meaningSummary || detail.meaning || extractMeaningFromExplanation(detail.explanation)),
    '暂无释义'
  )
}

function formatOrder(order, fallbackIndex) {
  const safeNumber = Number(order || fallbackIndex || 0)
  return safeNumber > 0 ? String(safeNumber).padStart(2, '0') : '--'
}

function buildSummaryItems(record) {
  return [
    { label: '完成时间', value: formatDate(record.finishedAt), color: '#243447' },
    { label: '练习模式', value: sanitizeText(record.modeLabel, '未记录'), color: '#243447' },
    { label: '文章范围', value: sanitizeText(record.articleLabel, '未记录'), color: '#243447' },
    { label: '练习时长', value: formatDuration(record.durationSeconds), color: '#243447' },
    {
      label: '总题数',
      value: String(record.totalQuestionCount || record.uniqueAnsweredCount || record.answeredCount || 0),
      color: '#243447'
    },
    { label: '正确率', value: `${record.accuracy || 0}%`, color: '#d96a1f' },
    { label: '答对题数', value: String(record.correctCount || 0), color: '#1d7a46' },
    { label: '错误题数', value: String(record.wrongCount || 0), color: '#d1495b' }
  ]
}

function buildDetailLayout(detail, index, contentWidth) {
  const word = sanitizeText(detail && detail.stem, '未知单词')
  const meaning = getDetailMeaning(detail)
  const badgeText = formatOrder(detail && detail.order, index + 1)
  const wordWidth = contentWidth - DETAIL_CARD_SIDE_PADDING * 2 - DETAIL_BADGE_WIDTH - DETAIL_BADGE_GAP
  const meaningBoxWidth = contentWidth - DETAIL_CARD_SIDE_PADDING * 2
  const meaningTextWidth = meaningBoxWidth - DETAIL_MEANING_BOX_PADDING_X * 2
  const wordLines = wrapText(word, wordWidth, DETAIL_WORD_FONT_SIZE)
  const meaningLines = wrapText(meaning, meaningTextWidth, DETAIL_MEANING_FONT_SIZE)
  const headerHeight = Math.max(wordLines.length * DETAIL_WORD_LINE_HEIGHT, DETAIL_BADGE_HEIGHT)
  const meaningBoxHeight =
    DETAIL_MEANING_BOX_PADDING_TOP +
    18 +
    DETAIL_MEANING_LABEL_GAP +
    meaningLines.length * DETAIL_MEANING_LINE_HEIGHT +
    DETAIL_MEANING_BOX_PADDING_BOTTOM
  const height = DETAIL_CARD_TOP_PADDING + headerHeight + DETAIL_HEADER_GAP + meaningBoxHeight + DETAIL_CARD_BOTTOM_PADDING

  return {
    badgeText,
    wordLines,
    meaningLines,
    headerHeight,
    meaningBoxHeight,
    height
  }
}

export function createPracticeRecordImageLayout(record) {
  const summaryItems = buildSummaryItems(record)
  const summaryInnerWidth = REPORT_WIDTH - PAGE_PADDING * 2 - CARD_PADDING * 2
  const summaryItemWidth = (summaryInnerWidth - SUMMARY_GAP) / 2
  const wrongDetails = Array.isArray(record.wrongDetails) ? record.wrongDetails : []
  const detailWidth = REPORT_WIDTH - PAGE_PADDING * 2 - CARD_PADDING * 2
  const detailLayouts = wrongDetails.map((detail, index) => buildDetailLayout(detail, index, detailWidth))

  let height = PAGE_PADDING
  height += HEADER_HEIGHT
  height += SECTION_GAP

  const summaryRows = Math.ceil(summaryItems.length / 2)
  const summaryHeight =
    CARD_PADDING * 2 + 48 + INNER_GAP + summaryRows * SUMMARY_ITEM_HEIGHT + Math.max(summaryRows - 1, 0) * SUMMARY_GAP
  height += summaryHeight
  height += SECTION_GAP

  let detailSectionHeight = CARD_PADDING * 2 + 48 + INNER_GAP
  if (detailLayouts.length) {
    detailSectionHeight += detailLayouts.reduce((sum, item) => sum + item.height, 0)
    detailSectionHeight += Math.max(detailLayouts.length - 1, 0) * DETAIL_CARD_GAP
  } else {
    detailSectionHeight += 120
  }
  height += detailSectionHeight
  height += SECTION_GAP
  height += 72

  return {
    width: REPORT_WIDTH,
    height,
    summaryItems,
    summaryHeight,
    summaryItemWidth,
    detailLayouts,
    detailSectionHeight,
    finishedAt: formatDate(record.finishedAt)
  }
}

export function renderPracticeRecordImage(ctx, record, layout) {
  const pageWidth = layout.width
  const pageHeight = layout.height
  const sectionWidth = pageWidth - PAGE_PADDING * 2

  const pageBackground = ctx.createLinearGradient(0, 0, 0, pageHeight)
  pageBackground.addColorStop(0, '#fffaf3')
  pageBackground.addColorStop(1, '#eef4fb')
  ctx.setFillStyle(pageBackground)
  ctx.fillRect(0, 0, pageWidth, pageHeight)

  let currentY = PAGE_PADDING

  const headerGradient = ctx.createLinearGradient(PAGE_PADDING, currentY, pageWidth - PAGE_PADDING, currentY + HEADER_HEIGHT)
  headerGradient.addColorStop(0, '#fff1d9')
  headerGradient.addColorStop(0.58, '#fffaf2')
  headerGradient.addColorStop(1, '#f4f8ff')
  drawRoundRect(ctx, PAGE_PADDING, currentY, sectionWidth, HEADER_HEIGHT, BORDER_RADIUS, headerGradient, '#eedfca')

  drawRoundRect(ctx, pageWidth - PAGE_PADDING - 132, currentY + 22, 108, 34, 17, '#ffffff', '#ebdcc7')
  ctx.setFillStyle('#cb7a28')
  ctx.setFontSize(16)
  ctx.fillText('图片报告', pageWidth - PAGE_PADDING - 104, currentY + 44)

  ctx.setFillStyle('#243447')
  ctx.setFontSize(34)
  ctx.fillText('Snowy English 练习报告', PAGE_PADDING + 24, currentY + 42)

  ctx.setFillStyle('#6a7c92')
  ctx.setFontSize(18)
  ctx.fillText('保留练习概览与错词释义，适合直接保存回顾', PAGE_PADDING + 24, currentY + 80)

  ctx.setFillStyle('#8a6644')
  ctx.setFontSize(18)
  ctx.fillText(`完成时间：${layout.finishedAt}`, PAGE_PADDING + 24, currentY + 114)

  ctx.setFillStyle('#f1b880')
  ctx.fillRect(PAGE_PADDING + 24, currentY + 126, 96, 4)

  currentY += HEADER_HEIGHT + SECTION_GAP

  drawRoundRect(ctx, PAGE_PADDING, currentY, sectionWidth, layout.summaryHeight, BORDER_RADIUS, '#ffffff', '#e4eaf1')
  ctx.setFillStyle('#243447')
  ctx.setFontSize(28)
  ctx.fillText('练习概览', PAGE_PADDING + CARD_PADDING, currentY + CARD_PADDING + 4)

  ctx.setFillStyle('#8a98a8')
  ctx.setFontSize(16)
  ctx.fillText('核心信息集中展示，方便快速查看本次练习情况', PAGE_PADDING + CARD_PADDING, currentY + CARD_PADDING + 32)

  const summaryStartY = currentY + CARD_PADDING + 48 + INNER_GAP
  layout.summaryItems.forEach((item, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const boxX = PAGE_PADDING + CARD_PADDING + col * (layout.summaryItemWidth + SUMMARY_GAP)
    const boxY = summaryStartY + row * (SUMMARY_ITEM_HEIGHT + SUMMARY_GAP)

    drawRoundRect(ctx, boxX, boxY, layout.summaryItemWidth, SUMMARY_ITEM_HEIGHT, 18, '#f8fafc', '#e4eaf1')
    ctx.setFillStyle('#7a8a9c')
    ctx.setFontSize(16)
    ctx.fillText(item.label, boxX + 16, boxY + 24)

    const valueLines = wrapText(item.value, layout.summaryItemWidth - 32, 24)
    drawTextLines(ctx, valueLines, {
      x: boxX + 16,
      y: boxY + 58,
      fontSize: 24,
      lineHeight: 30,
      color: item.color
    })
  })

  currentY += layout.summaryHeight + SECTION_GAP

  drawRoundRect(ctx, PAGE_PADDING, currentY, sectionWidth, layout.detailSectionHeight, BORDER_RADIUS, '#ffffff', '#e4eaf1')
  ctx.setFillStyle('#243447')
  ctx.setFontSize(28)
  ctx.fillText('错误单词明细', PAGE_PADDING + CARD_PADDING, currentY + CARD_PADDING + 4)

  ctx.setFillStyle('#8a98a8')
  ctx.setFontSize(16)
  ctx.fillText('只保留错误单词与释义，复盘更聚焦，也更适合截图分享', PAGE_PADDING + CARD_PADDING, currentY + CARD_PADDING + 32)

  let detailY = currentY + CARD_PADDING + 48 + INNER_GAP

  if (layout.detailLayouts.length) {
    layout.detailLayouts.forEach((item) => {
      const cardX = PAGE_PADDING + CARD_PADDING
      const cardY = detailY
      const cardWidth = sectionWidth - CARD_PADDING * 2

      const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + item.height)
      cardGradient.addColorStop(0, '#fffaf6')
      cardGradient.addColorStop(1, '#ffffff')
      drawRoundRect(ctx, cardX, cardY, cardWidth, item.height, 20, cardGradient, '#f0ded0')

      drawRoundRect(ctx, cardX + 18, cardY + 18, 10, item.height - 36, 5, '#f1c28a', null)

      const badgeX = cardX + DETAIL_CARD_SIDE_PADDING
      const badgeY = cardY + DETAIL_CARD_TOP_PADDING
      const wordX = badgeX + DETAIL_BADGE_WIDTH + DETAIL_BADGE_GAP
      const wordY = badgeY + 30
      const meaningBoxX = cardX + DETAIL_CARD_SIDE_PADDING
      const meaningBoxY = cardY + DETAIL_CARD_TOP_PADDING + item.headerHeight + DETAIL_HEADER_GAP

      drawRoundRect(ctx, badgeX, badgeY, DETAIL_BADGE_WIDTH, DETAIL_BADGE_HEIGHT, 15, '#f7efe7', '#ecd9c5')
      ctx.setFillStyle('#b36f2f')
      ctx.setFontSize(16)
      ctx.fillText(item.badgeText, badgeX + 16, badgeY + 23)

      drawTextLines(ctx, item.wordLines, {
        x: wordX,
        y: wordY,
        fontSize: DETAIL_WORD_FONT_SIZE,
        lineHeight: DETAIL_WORD_LINE_HEIGHT,
        color: '#1d4d7a'
      })

      drawRoundRect(ctx, meaningBoxX, meaningBoxY, cardWidth - DETAIL_CARD_SIDE_PADDING * 2, item.meaningBoxHeight, 16, '#f4f7fb', '#dde7f0')

      ctx.setFillStyle('#6e7f94')
      ctx.setFontSize(16)
      ctx.fillText('释义', meaningBoxX + DETAIL_MEANING_BOX_PADDING_X, meaningBoxY + DETAIL_MEANING_BOX_PADDING_TOP + 14)

      drawTextLines(ctx, item.meaningLines, {
        x: meaningBoxX + DETAIL_MEANING_BOX_PADDING_X,
        y: meaningBoxY + DETAIL_MEANING_BOX_PADDING_TOP + 32 + DETAIL_MEANING_LABEL_GAP,
        fontSize: DETAIL_MEANING_FONT_SIZE,
        lineHeight: DETAIL_MEANING_LINE_HEIGHT,
        color: '#32475b'
      })

      detailY += item.height + DETAIL_CARD_GAP
    })
  } else {
    drawRoundRect(ctx, PAGE_PADDING + CARD_PADDING, detailY, sectionWidth - CARD_PADDING * 2, 120, 20, '#effaf3', '#cfe8d9')
    ctx.setFillStyle('#1d7a46')
    ctx.setFontSize(24)
    ctx.fillText('这次练习没有错题，继续保持。', PAGE_PADDING + CARD_PADDING + 22, detailY + 50)
    ctx.setFillStyle('#6f8c7a')
    ctx.setFontSize(18)
    ctx.fillText('下次生成报告时，这里会自动汇总需要回顾的单词。', PAGE_PADDING + CARD_PADDING + 22, detailY + 86)
  }

  ctx.setFillStyle('#8a98a8')
  ctx.setFontSize(18)
  ctx.fillText('生成完成后可在预览里长按保存到相册。', PAGE_PADDING, pageHeight - 40)
}
