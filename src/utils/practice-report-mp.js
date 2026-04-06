const REPORT_WIDTH = 720
const PAGE_PADDING = 28
const SECTION_GAP = 24
const CARD_PADDING = 24
const INNER_GAP = 16
const SUMMARY_GAP = 14
const SUMMARY_ITEM_HEIGHT = 94
const HEADER_HEIGHT = 136
const BORDER_RADIUS = 20

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

function buildSummaryItems(record) {
  return [
    { label: '完成时间', value: formatDate(record.finishedAt) },
    { label: '练习模式', value: sanitizeText(record.modeLabel, '未记录') },
    { label: '文章范围', value: sanitizeText(record.articleLabel, '未记录') },
    { label: '练习时长', value: formatDuration(record.durationSeconds) },
    { label: '总题数', value: String(record.totalQuestionCount || record.uniqueAnsweredCount || record.answeredCount || 0) },
    { label: '正确率', value: `${record.accuracy || 0}%` },
    { label: '正确题数', value: String(record.correctCount || 0) },
    { label: '错误题数', value: String(record.wrongCount || 0) }
  ]
}

function buildDetailLayout(detail, contentWidth) {
  const optionWidth = contentWidth - 24
  const stemLines = wrapText(detail.stem, contentWidth, 30)
  const questionLines = wrapText(detail.question, contentWidth, 22)
  const optionLines = (detail.options || []).map((option) => wrapText(`${option.key}. ${option.text}`, optionWidth, 20))
  const userAnswerLines = wrapText(`你的答案：${sanitizeText(detail.userAnswerText, '未作答')}`, contentWidth, 20)
  const correctAnswerLines = wrapText(`正确答案：${sanitizeText(detail.correctAnswerText)}`, contentWidth, 20)
  const explanationLines = wrapText(`解析：${sanitizeText(detail.explanation, '暂无解析')}`, contentWidth, 20)

  let height = 20
  height += 24
  height += 12
  height += stemLines.length * 40
  height += 8
  height += questionLines.length * 32
  height += 10

  optionLines.forEach((lines, index) => {
    height += lines.length * 28
    if (index < optionLines.length - 1) {
      height += 6
    }
  })

  height += 12
  height += userAnswerLines.length * 28
  height += 8
  height += correctAnswerLines.length * 28
  height += 8
  height += explanationLines.length * 28
  height += 20

  return {
    detail,
    stemLines,
    questionLines,
    optionLines,
    userAnswerLines,
    correctAnswerLines,
    explanationLines,
    height
  }
}

export function createPracticeRecordImageLayout(record) {
  const summaryItems = buildSummaryItems(record)
  const summaryInnerWidth = REPORT_WIDTH - PAGE_PADDING * 2 - CARD_PADDING * 2
  const summaryItemWidth = (summaryInnerWidth - SUMMARY_GAP) / 2
  const wrongDetails = Array.isArray(record.wrongDetails) ? record.wrongDetails : []
  const detailWidth = REPORT_WIDTH - PAGE_PADDING * 2 - CARD_PADDING * 2
  const detailLayouts = wrongDetails.map((detail) => buildDetailLayout(detail, detailWidth))

  let height = PAGE_PADDING
  height += HEADER_HEIGHT
  height += SECTION_GAP

  const summaryRows = Math.ceil(summaryItems.length / 2)
  const summaryHeight = CARD_PADDING * 2 + 40 + INNER_GAP + summaryRows * SUMMARY_ITEM_HEIGHT + (summaryRows - 1) * SUMMARY_GAP
  height += summaryHeight
  height += SECTION_GAP

  let detailSectionHeight = CARD_PADDING * 2 + 40 + INNER_GAP
  if (detailLayouts.length) {
    detailSectionHeight += detailLayouts.reduce((sum, item) => sum + item.height, 0)
    detailSectionHeight += (detailLayouts.length - 1) * 14
  } else {
    detailSectionHeight += 88
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

  ctx.setFillStyle('#f5f7fb')
  ctx.fillRect(0, 0, pageWidth, pageHeight)

  let currentY = PAGE_PADDING

  const headerGradient = ctx.createLinearGradient(PAGE_PADDING, currentY, pageWidth - PAGE_PADDING, currentY + HEADER_HEIGHT)
  headerGradient.addColorStop(0, '#fff4df')
  headerGradient.addColorStop(1, '#ffffff')
  drawRoundRect(ctx, PAGE_PADDING, currentY, sectionWidth, HEADER_HEIGHT, BORDER_RADIUS, headerGradient, '#f0e1c7')

  ctx.setFillStyle('#243447')
  ctx.setFontSize(32)
  ctx.fillText('Snowy English 练习报告', PAGE_PADDING + 24, currentY + 28)
  ctx.setFillStyle('#6b7b8c')
  ctx.setFontSize(18)
  ctx.fillText('本次练习概览、错题明细与复盘提示', PAGE_PADDING + 24, currentY + 74)
  ctx.fillText(`完成时间：${layout.finishedAt}`, PAGE_PADDING + 24, currentY + 100)

  currentY += HEADER_HEIGHT + SECTION_GAP

  drawRoundRect(ctx, PAGE_PADDING, currentY, sectionWidth, layout.summaryHeight, BORDER_RADIUS, '#ffffff', '#e4eaf1')
  ctx.setFillStyle('#243447')
  ctx.setFontSize(26)
  ctx.fillText('练习概览', PAGE_PADDING + CARD_PADDING, currentY + CARD_PADDING)

  const summaryStartY = currentY + CARD_PADDING + 40 + INNER_GAP
  layout.summaryItems.forEach((item, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const boxX = PAGE_PADDING + CARD_PADDING + col * (layout.summaryItemWidth + SUMMARY_GAP)
    const boxY = summaryStartY + row * (SUMMARY_ITEM_HEIGHT + SUMMARY_GAP)

    drawRoundRect(ctx, boxX, boxY, layout.summaryItemWidth, SUMMARY_ITEM_HEIGHT, 16, '#f8fafc', '#e4eaf1')
    ctx.setFillStyle('#708092')
    ctx.setFontSize(16)
    ctx.fillText(item.label, boxX + 16, boxY + 18)

    const valueLines = wrapText(item.value, layout.summaryItemWidth - 32, 18)
    drawTextLines(ctx, valueLines, {
      x: boxX + 16,
      y: boxY + 42,
      fontSize: 18,
      lineHeight: 24,
      color: '#243447'
    })
  })

  currentY += layout.summaryHeight + SECTION_GAP

  drawRoundRect(ctx, PAGE_PADDING, currentY, sectionWidth, layout.detailSectionHeight, BORDER_RADIUS, '#ffffff', '#e4eaf1')
  ctx.setFillStyle('#243447')
  ctx.setFontSize(26)
  ctx.fillText('错题明细', PAGE_PADDING + CARD_PADDING, currentY + CARD_PADDING)

  let detailY = currentY + CARD_PADDING + 40 + INNER_GAP

  if (layout.detailLayouts.length) {
    layout.detailLayouts.forEach((item) => {
      const cardX = PAGE_PADDING + CARD_PADDING
      const cardY = detailY
      const cardWidth = sectionWidth - CARD_PADDING * 2
      drawRoundRect(ctx, cardX, cardY, cardWidth, item.height, 18, '#fff3ef', '#f0d4ca')

      let textY = cardY + 20
      ctx.setFillStyle('#708092')
      ctx.setFontSize(18)
      ctx.fillText(`第 ${item.detail.order} 题`, cardX + 18, textY)
      ctx.fillText('回答错误', cardX + cardWidth - 96, textY)

      textY += 36
      textY = drawTextLines(ctx, item.stemLines, {
        x: cardX + 18,
        y: textY,
        fontSize: 30,
        lineHeight: 40,
        color: '#1d4d7a'
      })

      textY += 8
      textY = drawTextLines(ctx, item.questionLines, {
        x: cardX + 18,
        y: textY,
        fontSize: 22,
        lineHeight: 32,
        color: '#334155'
      })

      textY += 10
      item.optionLines.forEach((lines) => {
        textY = drawTextLines(ctx, lines, {
          x: cardX + 30,
          y: textY,
          fontSize: 20,
          lineHeight: 28,
          color: '#334155'
        })
        textY += 6
      })

      textY += 6
      textY = drawTextLines(ctx, item.userAnswerLines, {
        x: cardX + 18,
        y: textY,
        fontSize: 20,
        lineHeight: 28,
        color: '#334155'
      })

      textY += 8
      textY = drawTextLines(ctx, item.correctAnswerLines, {
        x: cardX + 18,
        y: textY,
        fontSize: 20,
        lineHeight: 28,
        color: '#334155'
      })

      textY += 8
      drawTextLines(ctx, item.explanationLines, {
        x: cardX + 18,
        y: textY,
        fontSize: 20,
        lineHeight: 28,
        color: '#334155'
      })

      detailY += item.height + 14
    })
  } else {
    drawRoundRect(ctx, PAGE_PADDING + CARD_PADDING, detailY, sectionWidth - CARD_PADDING * 2, 88, 18, '#effaf3', '#cfe8d9')
    ctx.setFillStyle('#52708b')
    ctx.setFontSize(20)
    ctx.fillText('本次练习没有错题，继续保持。', PAGE_PADDING + CARD_PADDING + 18, detailY + 32)
  }

  ctx.setFillStyle('#8a98a8')
  ctx.setFontSize(18)
  ctx.fillText('图片生成完成后，请在预览中长按保存到相册。', PAGE_PADDING, pageHeight - 40)
}

