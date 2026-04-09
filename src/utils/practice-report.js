import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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

function buildQuestionSection(detail) {
  const options = (detail.options || [])
    .map((option) => `<div class="option">${escapeHtml(option.text)}</div>`)
    .join('')

  return `
    <section class="question-card ${detail.isCorrect ? 'ok' : 'bad'}">
      <div class="question-head">
        <span class="question-order">第 ${detail.order} 题</span>
        <span class="question-state">${detail.isCorrect ? '回答正确' : '回答错误'}</span>
      </div>
      <div class="question-stem">${escapeHtml(detail.stem)}</div>
      <div class="question-text">${escapeHtml(detail.question)}</div>
      <div class="option-list">${options}</div>
      <div class="question-meta">你的答案：${escapeHtml(detail.userAnswerText || '未作答')}</div>
      <div class="question-meta">正确答案：${escapeHtml(detail.correctAnswerText || '')}</div>
      <div class="question-meta">解析：${escapeHtml(detail.explanation || '')}</div>
    </section>
  `
}

function buildReportHtml(record) {
  const wrongDetails = record.wrongDetails || []

  return `
    <div class="report">
      <div class="report-header">
        <h1>Snowy English 练习报告</h1>
        <div class="report-subtitle">本次练习概览与错题明细</div>
      </div>

      <section class="summary-card">
        <h2>练习概览</h2>
        <div class="summary-grid">
          <div class="summary-item"><span>完成时间</span><strong>${escapeHtml(formatDate(record.finishedAt))}</strong></div>
          <div class="summary-item"><span>练习模式</span><strong>${escapeHtml(record.modeLabel)}</strong></div>
          <div class="summary-item"><span>文章范围</span><strong>${escapeHtml(record.articleLabel)}</strong></div>
          <div class="summary-item"><span>练习时长</span><strong>${escapeHtml(formatDuration(record.durationSeconds))}</strong></div>
          <div class="summary-item"><span>总题数</span><strong>${escapeHtml(record.totalQuestionCount || details.length || 0)}</strong></div>
          <div class="summary-item"><span>正确率</span><strong>${escapeHtml(record.accuracy)}%</strong></div>
          <div class="summary-item"><span>正确题数</span><strong>${escapeHtml(record.correctCount || 0)}</strong></div>
          <div class="summary-item"><span>错题数量</span><strong>${escapeHtml(record.wrongCount || 0)}</strong></div>
        </div>
      </section>

      <section class="section-block">
        <h2>错题明细</h2>
        ${
          wrongDetails.length
            ? wrongDetails.map((detail) => buildQuestionSection(detail)).join('')
            : '<div class="empty-block">本次练习没有错题，继续保持。</div>'
        }
      </section>
    </div>
  `
}

function buildReportStyles() {
  return `
    .report {
      width: 960px;
      padding: 36px;
      box-sizing: border-box;
      background: #ffffff;
      color: #243447;
      font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    }
    .report-header {
      padding: 24px 28px;
      border-radius: 20px;
      background: linear-gradient(135deg, #fff4df, #ffffff);
      border: 1px solid #f0e1c7;
    }
    .report-header h1 {
      margin: 0;
      font-size: 32px;
    }
    .report-subtitle {
      margin-top: 8px;
      color: #6b7b8c;
      font-size: 16px;
    }
    .summary-card,
    .section-block {
      margin-top: 24px;
      padding: 24px;
      border-radius: 20px;
      background: #f8fafc;
      border: 1px solid #e4eaf1;
    }
    h2 {
      margin: 0 0 18px;
      font-size: 22px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .summary-item {
      padding: 16px 18px;
      border-radius: 16px;
      background: #ffffff;
      border: 1px solid #e4eaf1;
    }
    .summary-item span {
      display: block;
      color: #708092;
      font-size: 14px;
    }
    .summary-item strong {
      display: block;
      margin-top: 8px;
      font-size: 18px;
    }
    .question-card {
      margin-top: 14px;
      padding: 18px 20px;
      border-radius: 18px;
      background: #ffffff;
      border: 1px solid #e4eaf1;
    }
    .question-card.ok {
      background: #effaf3;
      border-color: #cfe8d9;
    }
    .question-card.bad {
      background: #fff3ef;
      border-color: #f0d4ca;
    }
    .question-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      font-size: 14px;
      color: #708092;
    }
    .question-order {
      font-weight: 700;
      color: #243447;
    }
    .question-state {
      font-weight: 700;
    }
    .question-stem {
      margin-top: 12px;
      font-size: 28px;
      font-weight: 700;
      color: #1d4d7a;
    }
    .question-text,
    .question-meta,
    .option {
      margin-top: 8px;
      font-size: 15px;
      line-height: 1.7;
      color: #334155;
    }
    .option-list {
      margin-top: 10px;
      padding-left: 6px;
    }
    .empty-block {
      padding: 18px 0;
      color: #708092;
      font-size: 15px;
    }
  `
}

function canvasSliceToPdf(canvas, fileName) {
  const pdf = new jsPDF('p', 'pt', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 24
  const contentWidth = pageWidth - margin * 2
  const pageContentHeight = pageHeight - margin * 2
  const sliceHeight = Math.floor((pageContentHeight / contentWidth) * canvas.width)

  let renderedHeight = 0
  let pageIndex = 0

  while (renderedHeight < canvas.height) {
    const currentSliceHeight = Math.min(sliceHeight, canvas.height - renderedHeight)
    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = currentSliceHeight
    const context = pageCanvas.getContext('2d')
    context.drawImage(canvas, 0, renderedHeight, canvas.width, currentSliceHeight, 0, 0, canvas.width, currentSliceHeight)

    const imageData = pageCanvas.toDataURL('image/png')
    const imageHeight = (currentSliceHeight / canvas.width) * contentWidth

    if (pageIndex > 0) {
      pdf.addPage()
    }
    pdf.addImage(imageData, 'PNG', margin, margin, contentWidth, imageHeight)

    renderedHeight += currentSliceHeight
    pageIndex += 1
  }

  pdf.save(fileName)
}

export async function downloadPracticeRecordPdf(record) {
  const reportRoot = document.createElement('div')
  reportRoot.style.position = 'fixed'
  reportRoot.style.left = '-100000px'
  reportRoot.style.top = '0'
  reportRoot.style.zIndex = '-1'
  reportRoot.innerHTML = `<style>${buildReportStyles()}</style>${buildReportHtml(record)}`
  document.body.appendChild(reportRoot)

  try {
    const canvas = await html2canvas(reportRoot, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    })
    const fileName = `Snowy-English-${formatDate(record.finishedAt).replace(/[: ]/g, '-')}.pdf`
    canvasSliceToPdf(canvas, fileName)
  } finally {
    document.body.removeChild(reportRoot)
  }
}
