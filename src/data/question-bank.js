// 内置示例题库，后续可以替换为服务端下发的数据。
export const questionBank = [
  {
    id: 'vocab-1',
    type: 'single',
    category: '词汇',
    difficulty: '初级',
    stem: 'The new library provides a quiet environment for students to study after school.',
    question: 'What is the closest meaning of "environment" in the sentence?',
    options: [
      { key: 'A', text: 'weather' },
      { key: 'B', text: 'surroundings' },
      { key: 'C', text: 'competition' },
      { key: 'D', text: 'schedule' }
    ],
    answer: 'B',
    explanation: 'environment 在这里表示“环境、周围条件”，与 surroundings 最接近。'
  },
  {
    id: 'grammar-1',
    type: 'blank',
    category: '语法',
    difficulty: '初级',
    stem: 'She has lived in Shanghai ___ 2019.',
    answer: 'since',
    acceptableAnswers: ['since'],
    explanation: '现在完成时搭配具体起点时间时，通常使用 since。'
  },
  {
    id: 'reading-1',
    type: 'single',
    category: '阅读理解',
    difficulty: '初级',
    passage:
      'Linda joins the school English club every Tuesday. She practices speaking with her classmates and watches short videos about daily conversations. After three months, she feels more confident when answering questions in class.',
    question: 'Why does Linda feel more confident now?',
    options: [
      { key: 'A', text: 'She has practiced speaking regularly.' },
      { key: 'B', text: 'She changed to a new school.' },
      { key: 'C', text: 'She stopped watching videos.' },
      { key: 'D', text: 'She only studies grammar rules.' }
    ],
    answer: 'A',
    explanation: '文章提到她持续参加英语社团并练习口语，因此更自信。'
  },
  {
    id: 'vocab-2',
    type: 'blank',
    category: '词汇',
    difficulty: '中级',
    stem: 'To improve your pronunciation, you should listen carefully and ___ the speaker.',
    answer: 'imitate',
    acceptableAnswers: ['imitate'],
    explanation: 'imitate 表示“模仿”，符合句意。'
  },
  {
    id: 'grammar-2',
    type: 'single',
    category: '语法',
    difficulty: '中级',
    stem: 'If he ____ harder last term, he would have passed the exam.',
    question: 'Choose the correct verb form.',
    options: [
      { key: 'A', text: 'studies' },
      { key: 'B', text: 'studied' },
      { key: 'C', text: 'had studied' },
      { key: 'D', text: 'has studied' }
    ],
    answer: 'C',
    explanation: '这是与过去事实相反的虚拟语气，从句应用 had + 过去分词。'
  },
  {
    id: 'reading-2',
    type: 'single',
    category: '阅读理解',
    difficulty: '中级',
    passage:
      'A group of students built a small greenhouse on campus. They recorded the temperature every day and compared the growth of tomatoes and beans. Their science teacher said the project helped them learn by doing.',
    question: 'What did the project help the students do?',
    options: [
      { key: 'A', text: 'Avoid science class' },
      { key: 'B', text: 'Learn through practical work' },
      { key: 'C', text: 'Travel around the city' },
      { key: 'D', text: 'Sell vegetables online' }
    ],
    answer: 'B',
    explanation: '文中明确说项目帮助他们“learn by doing”。'
  },
  {
    id: 'vocab-3',
    type: 'single',
    category: '词汇',
    difficulty: '高级',
    stem: 'The scientist gave a brief summary before presenting the detailed data.',
    question: 'What does "brief" most likely mean here?',
    options: [
      { key: 'A', text: 'short' },
      { key: 'B', text: 'unclear' },
      { key: 'C', text: 'humorous' },
      { key: 'D', text: 'unexpected' }
    ],
    answer: 'A',
    explanation: 'brief 表示“简短的”，与 short 含义最接近。'
  },
  {
    id: 'grammar-3',
    type: 'blank',
    category: '语法',
    difficulty: '高级',
    stem: 'No sooner had the bell rung than the students ___ into the classroom.',
    answer: 'rushed',
    acceptableAnswers: ['rushed'],
    explanation: 'no sooner...than... 结构中，后半句通常用一般过去时。'
  },
  {
    id: 'reading-3',
    type: 'single',
    category: '阅读理解',
    difficulty: '高级',
    passage:
      'More schools are introducing AI tools to support language learning. Teachers say these tools can provide instant feedback, but they also remind students to think independently and check whether the suggestions really fit the context.',
    question: 'What is the main idea of the passage?',
    options: [
      { key: 'A', text: 'AI tools should replace teachers completely.' },
      { key: 'B', text: 'Students should refuse all digital tools.' },
      { key: 'C', text: 'AI tools are useful, but students still need critical thinking.' },
      { key: 'D', text: 'Language learning only depends on instant feedback.' }
    ],
    answer: 'C',
    explanation: '文章强调 AI 工具的帮助作用，同时也强调独立思考的重要性。'
  }
]
