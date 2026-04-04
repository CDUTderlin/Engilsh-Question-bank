// 小程序前端不应该直接暴露腾讯云 SecretId / SecretKey。
// 推荐做法：把腾讯云翻译能力放到云函数或自建后端，再由这里发起请求。
const TRANSLATION_CONFIG = {
  proxyUrl: '',
  timeout: 4000
}

// 本地兜底词库，方便项目在未接线上接口时也能演示长按翻译能力。
const LOCAL_DICTIONARY = {
  adapt: '适应；改编',
  environment: '环境',
  confidence: '自信',
  practice: '练习',
  imitate: '模仿',
  pronunciation: '发音',
  summary: '总结；摘要',
  brief: '简短的',
  greenhouse: '温室',
  instant: '即时的',
  feedback: '反馈',
  independent: '独立的',
  context: '语境'
}

function cleanWord(word) {
  return String(word || '')
    .replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '')
    .toLowerCase()
}

export function translateWord(word) {
  const cleanedWord = cleanWord(word)

  if (!cleanedWord) {
    return Promise.resolve('请选择英文单词后再翻译。')
  }

  if (LOCAL_DICTIONARY[cleanedWord]) {
    return Promise.resolve(LOCAL_DICTIONARY[cleanedWord])
  }

  if (!TRANSLATION_CONFIG.proxyUrl) {
    return Promise.resolve('暂未配置在线翻译接口，请在 src/utils/translator.js 中补充代理地址。')
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: TRANSLATION_CONFIG.proxyUrl,
      method: 'POST',
      timeout: TRANSLATION_CONFIG.timeout,
      data: {
        word: cleanedWord,
        source: 'en',
        target: 'zh'
      },
      success: (response) => {
        const data = response.data || {}
        const translation =
          data.translation ||
          (data.data && data.data.translation) ||
          data.result

        if (translation) {
          resolve(translation)
          return
        }

        reject(new Error('翻译接口未返回可用结果。'))
      },
      fail: reject
    })
  })
}
