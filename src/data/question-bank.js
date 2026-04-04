const optionKeys = ['A', 'B', 'C', 'D']
const articleBanks = [
  {
    "articleId": "article-01",
    "articleIndex": 1,
    "unitTitle": "Friendship",
    "articleTitle": "Fall in Love with English",
    "sourcePdfPage": 3,
    "entries": [
      {
        "term": "curtain",
        "meaning": "窗帘；门帘；幕布"
      },
      {
        "term": "pack up",
        "meaning": "将（东西）装箱打包"
      },
      {
        "term": "nagging",
        "meaning": "唠叨；催促"
      },
      {
        "term": "get along with",
        "meaning": "与……相处；进展"
      },
      {
        "term": "recover from",
        "meaning": "从……中恢复；痊愈"
      },
      {
        "term": "loose",
        "meaning": "松散的；宽松的"
      },
      {
        "term": "dusty",
        "meaning": "积满灰尘的"
      },
      {
        "term": "teenager",
        "meaning": "十几岁的青少年"
      },
      {
        "term": "pack",
        "meaning": "捆扎；包装；收拾（行李）小包；包裹"
      },
      {
        "term": "overcoat",
        "meaning": "大衣；外套"
      },
      {
        "term": "suitcase",
        "meaning": "手提箱；衣箱"
      },
      {
        "term": "dusk",
        "meaning": "黄昏；傍晚"
      },
      {
        "term": "at dusk",
        "meaning": "在黄昏时刻"
      },
      {
        "term": "thunder",
        "meaning": "雷声v打雷"
      },
      {
        "term": "lightning",
        "meaning": "闪电"
      },
      {
        "term": "outdoors",
        "meaning": "在户外；在野外"
      },
      {
        "term": "have got to",
        "meaning": "不得不"
      },
      {
        "term": "be tired of",
        "meaning": "对厌烦"
      },
      {
        "term": "no longer/not ... any longer",
        "meaning": "不再"
      },
      {
        "term": "go through",
        "meaning": "忍受；经历；经受"
      },
      {
        "term": "dislike",
        "meaning": "不喜欢；厌恶"
      },
      {
        "term": "join in",
        "meaning": "参加；加入"
      },
      {
        "term": "ignore",
        "meaning": "不理踩；忽视"
      },
      {
        "term": "onpurpose",
        "meaning": "故意"
      },
      {
        "term": "add up",
        "meaning": "合计"
      },
      {
        "term": "partner",
        "meaning": "伙伴；合作者；合伙人"
      },
      {
        "term": "concern",
        "meaning": "涉及；关系到n.关心；关注；（利害）关系"
      },
      {
        "term": "be concerned about",
        "meaning": "关心"
      },
      {
        "term": "exactly",
        "meaning": "确实如此；正是；确切地"
      },
      {
        "term": "suffer",
        "meaning": "遭受；忍受"
      },
      {
        "term": "suffer from",
        "meaning": "遭受；患病"
      },
      {
        "term": "entire",
        "meaning": "整个的；全部的"
      },
      {
        "term": "entirely",
        "meaning": "整个地；全部地"
      },
      {
        "term": "disagree",
        "meaning": "不同意"
      },
      {
        "term": "in order to",
        "meaning": "为了."
      },
      {
        "term": "calm",
        "meaning": "镇静；沉着adj.镇静的；沉着的"
      },
      {
        "term": "calm down",
        "meaning": "平静下来"
      },
      {
        "term": "settle",
        "meaning": "安家；安居；使定居；解决"
      },
      {
        "term": "face to face",
        "meaning": "面对面地"
      },
      {
        "term": "swap",
        "meaning": "交换"
      },
      {
        "term": "series",
        "meaning": "连续；系列"
      },
      {
        "term": "a series of",
        "meaning": "一系列的；一连串的"
      },
      {
        "term": "tip",
        "meaning": "提示；技巧；尖；小费vl.倾斜；翻倒"
      }
    ]
  },
  {
    "articleId": "article-02",
    "articleIndex": 2,
    "unitTitle": "English around the world",
    "articleTitle": "Different Kinds of English",
    "sourcePdfPage": 7,
    "entries": [
      {
        "term": "at present",
        "meaning": "现在；目前"
      },
      {
        "term": "make use of",
        "meaning": "利用；使用"
      },
      {
        "term": "identity",
        "meaning": "身份；本体；一致"
      },
      {
        "term": "voyage",
        "meaning": "航行；航海"
      },
      {
        "term": "play a part in",
        "meaning": "扮演一个角色；参与"
      },
      {
        "term": "frequent",
        "meaning": "频繁的；常见的"
      },
      {
        "term": "frequently",
        "meaning": "常常；频繁地"
      },
      {
        "term": "official",
        "meaning": "官方；正式的；公务的"
      },
      {
        "term": "such as",
        "meaning": "例如"
      },
      {
        "term": "Singapore",
        "meaning": "新加坡"
      },
      {
        "term": "Malaysia",
        "meaning": "马来西亚"
      },
      {
        "term": "African",
        "meaning": "非洲的；非洲人的；非洲语言的"
      },
      {
        "term": "base",
        "meaning": "以...为根据n.基部；基地；基础"
      },
      {
        "term": "native",
        "meaning": "本地人adj.本土的；本国的"
      },
      {
        "term": "actually",
        "meaning": "实际上"
      },
      {
        "term": "gradual",
        "meaning": "逐渐的；逐步的"
      },
      {
        "term": "gradually",
        "meaning": "逐渐地；逐步地"
      },
      {
        "term": "accent",
        "meaning": "口音，音调；重音"
      },
      {
        "term": "spelling",
        "meaning": "拼写；拼法"
      },
      {
        "term": "expression",
        "meaning": "词语；表示；表达"
      },
      {
        "term": "usage",
        "meaning": "使用；用法"
      },
      {
        "term": "vocabulary",
        "meaning": "词汇；词汇表"
      },
      {
        "term": "because of",
        "meaning": "因为"
      },
      {
        "term": "block",
        "meaning": "大块；（木、石等）块；街区；路障vl.阻塞；阻挡"
      },
      {
        "term": "fuent",
        "meaning": "流利的；流畅的"
      },
      {
        "term": "fuently",
        "meaning": "流利地；流畅地"
      },
      {
        "term": "command",
        "meaning": "命令；指挥"
      },
      {
        "term": "come up",
        "meaning": "走近；上来"
      },
      {
        "term": "straight",
        "meaning": "直接，挺直；直的，正直的"
      },
      {
        "term": "apartment",
        "meaning": "公寓住宅；单元房"
      },
      {
        "term": "gas",
        "meaning": "气体；汽油；煤气"
      },
      {
        "term": "cab",
        "meaning": "出租车"
      },
      {
        "term": "request",
        "meaning": "请求；要求的事物"
      },
      {
        "term": "elevator",
        "meaning": "电梯"
      },
      {
        "term": "petrol",
        "meaning": "石油；汽油"
      },
      {
        "term": "lorry",
        "meaning": "运货汽车；卡车"
      },
      {
        "term": "recognize",
        "meaning": "认出"
      },
      {
        "term": "latter",
        "meaning": "较后的；后半的；（两者中)后者的"
      },
      {
        "term": "AD",
        "meaning": "公元"
      },
      {
        "term": "Danish",
        "meaning": "丹麦语adj.丹麦的；丹麦人的"
      },
      {
        "term": "midwestem",
        "meaning": "中西部的"
      }
    ]
  },
  {
    "articleId": "article-03",
    "articleIndex": 3,
    "unitTitle": "Travel journal",
    "articleTitle": "A Hard Trip",
    "sourcePdfPage": 11,
    "entries": [
      {
        "term": "be determined to",
        "meaning": "决心做……"
      },
      {
        "term": "persuade",
        "meaning": "说服；劝说"
      },
      {
        "term": "give in",
        "meaning": "屈服；让步；投降"
      },
      {
        "term": "schedule",
        "meaning": "时间表；进度表；日程"
      },
      {
        "term": "fond",
        "meaning": "喜欢的；宠爱的"
      },
      {
        "term": "be fond of",
        "meaning": "喜欢；喜爱"
      },
      {
        "term": "ever since",
        "meaning": "从那以后"
      },
      {
        "term": "graduate",
        "meaning": "毕业；大学毕业生"
      },
      {
        "term": "determine",
        "meaning": "决定；决心"
      },
      {
        "term": "determined",
        "meaning": "坚决的；有决心的"
      },
      {
        "term": "organize",
        "meaning": "组织；成立"
      },
      {
        "term": "temple",
        "meaning": "庙宇；寺庙"
      },
      {
        "term": "transport",
        "meaning": "运输"
      },
      {
        "term": "fare",
        "meaning": "乘车或船等的）费用；票（价）"
      },
      {
        "term": "cycle",
        "meaning": "骑自行车"
      },
      {
        "term": "care about",
        "meaning": "关心；忧虑；惦念"
      },
      {
        "term": "disadvantage",
        "meaning": "不利条件；不便之处"
      },
      {
        "term": "stubborn",
        "meaning": "顽固的；固执的"
      },
      {
        "term": "attitude",
        "meaning": "态度，看法"
      },
      {
        "term": "shortcoming",
        "meaning": "缺点"
      },
      {
        "term": "make up one's mind",
        "meaning": "下决心；决定"
      },
      {
        "term": "change one's mind",
        "meaning": "改变主意"
      },
      {
        "term": "finally",
        "meaning": "最后；终于"
      },
      {
        "term": "as usual",
        "meaning": "照常"
      },
      {
        "term": "prefer",
        "meaning": "更喜欢；选择某事物"
      },
      {
        "term": "reliable",
        "meaning": "可靠的"
      },
      {
        "term": "forecast",
        "meaning": "预测；预报"
      },
      {
        "term": "insurance",
        "meaning": "保险"
      },
      {
        "term": "journey",
        "meaning": "旅行；旅程"
      },
      {
        "term": "flow",
        "meaning": "流动；流出；流量"
      },
      {
        "term": "altitude",
        "meaning": "海拔高度"
      },
      {
        "term": "pace",
        "meaning": "缓慢而行；跛步；一步；速度"
      },
      {
        "term": "bend",
        "meaning": "弯；拐角；使弯腰；弯身"
      },
      {
        "term": "valley",
        "meaning": "山谷，溪谷"
      },
      {
        "term": "boil",
        "meaning": "沸腾；（水）开"
      },
      {
        "term": "joumal",
        "meaning": "日记，杂志；定期刊物"
      },
      {
        "term": "view",
        "meaning": "风景；观点vI.注视；考虑"
      },
      {
        "term": "pillow",
        "meaning": "枕头；枕垫"
      },
      {
        "term": "parcel",
        "meaning": "小包；包裹"
      },
      {
        "term": "wool",
        "meaning": "羊毛"
      },
      {
        "term": "beneath",
        "meaning": "在..下面"
      },
      {
        "term": "flame",
        "meaning": "火焰；光芒；热情"
      }
    ]
  },
  {
    "articleId": "article-04",
    "articleIndex": 4,
    "unitTitle": "Earthquakes",
    "articleTitle": "A Terrible Earthquake",
    "sourcePdfPage": 15,
    "entries": [
      {
        "term": "earthquake",
        "meaning": "地震"
      },
      {
        "term": "at an end",
        "meaning": "结束；终结"
      },
      {
        "term": "rescue",
        "meaning": "营救；援救"
      },
      {
        "term": "bury",
        "meaning": "埋葬；掩埋；隐藏"
      },
      {
        "term": "dig out",
        "meaning": "掘出；发现"
      },
      {
        "term": "quake",
        "meaning": "地震；震动；颜抖"
      },
      {
        "term": "judge",
        "meaning": "裁判；审判员；法官vI.判断；断定"
      },
      {
        "term": "as if",
        "meaning": "仿佛；好像"
      },
      {
        "term": "million",
        "meaning": "百万"
      },
      {
        "term": "brick",
        "meaning": "砖；砖块"
      },
      {
        "term": "a great number of",
        "meaning": "许多；大量"
      },
      {
        "term": "dam",
        "meaning": "水坝，堰堤"
      },
      {
        "term": "destroy",
        "meaning": "破坏，毁坏"
      },
      {
        "term": "track",
        "meaning": "轨道；足遗；痕适"
      },
      {
        "term": "useless",
        "meaning": "无用的"
      },
      {
        "term": "bar",
        "meaning": "条；棒；条状物"
      },
      {
        "term": "pipe",
        "meaning": "管子，输送管"
      },
      {
        "term": "mine",
        "meaning": "矿藏，矿山"
      },
      {
        "term": "miner",
        "meaning": "矿工"
      },
      {
        "term": "burst",
        "meaning": "突然发生；突然爆裂"
      },
      {
        "term": "smelly",
        "meaning": "发臭的；有臭味的"
      },
      {
        "term": "steam",
        "meaning": "蒸汽；水汽"
      },
      {
        "term": "crack",
        "meaning": "裂缝；薛啪声v(使)破裂；爆裂"
      },
      {
        "term": "trap",
        "meaning": "使陷入困境；陷阱；困境"
      },
      {
        "term": "cyclist",
        "meaning": "骑自行车的人"
      },
      {
        "term": "event",
        "meaning": "事件；大事"
      },
      {
        "term": "headline",
        "meaning": "报刊的大字标题"
      },
      {
        "term": "title",
        "meaning": "标题；头衔；黄格"
      },
      {
        "term": "reporter",
        "meaning": "记者"
      },
      {
        "term": "outline",
        "meaning": "要点；大纲；轮廊"
      },
      {
        "term": "disaster",
        "meaning": "灾难；祸患"
      },
      {
        "term": "nation",
        "meaning": "民族；国家；国民"
      },
      {
        "term": "shock",
        "meaning": "使）震惊；休克"
      },
      {
        "term": "damage",
        "meaning": "损失"
      },
      {
        "term": "extreme",
        "meaning": "极度的"
      },
      {
        "term": "suffering",
        "meaning": "苦难；病苦"
      },
      {
        "term": "survivor",
        "meaning": "幸存者；生还者"
      },
      {
        "term": "congratulation",
        "meaning": "祝贺"
      },
      {
        "term": "express",
        "meaning": "表示，表达；快丰；速递"
      },
      {
        "term": "sincerely",
        "meaning": "真诚地；真挚地"
      },
      {
        "term": "right away",
        "meaning": "立即；马上"
      },
      {
        "term": "injure",
        "meaning": "损害；伤害"
      },
      {
        "term": "frighten",
        "meaning": "使惊吓；吓克"
      },
      {
        "term": "frightened",
        "meaning": "受惊的；受恐吓的"
      },
      {
        "term": "frightening",
        "meaning": "令人恐惧的"
      }
    ]
  },
  {
    "articleId": "article-05",
    "articleIndex": 5,
    "unitTitle": "Nelson Mandela - a modern hero",
    "articleTitle": "A Great President",
    "sourcePdfPage": 19,
    "entries": [
      {
        "term": "devote oneself to",
        "meaning": "致力于；献身于"
      },
      {
        "term": "principle",
        "meaning": "原则；原理"
      },
      {
        "term": "violence",
        "meaning": "暴力；暴行"
      },
      {
        "term": "lose heart",
        "meaning": "失去勇气或信心"
      },
      {
        "term": "found",
        "meaning": "建立；建设"
      },
      {
        "term": "republic",
        "meaning": "共和国"
      },
      {
        "term": "president",
        "meaning": "总统；主席"
      },
      {
        "term": "quality",
        "meaning": "质量；性质；品质"
      },
      {
        "term": "come to power",
        "meaning": "当权；上台"
      },
      {
        "term": "generous",
        "meaning": "恢慨的；大方的"
      },
      {
        "term": "lawyer",
        "meaning": "律师"
      },
      {
        "term": "willing",
        "meaning": "乐意的；自愿的"
      },
      {
        "term": "self",
        "meaning": "自我；自身"
      },
      {
        "term": "selfish",
        "meaning": "自私的"
      },
      {
        "term": "selfless",
        "meaning": "无私的；忘我的"
      },
      {
        "term": "selflessly",
        "meaning": "无私地；忘我地"
      },
      {
        "term": "turn to",
        "meaning": "求助于；致力于"
      },
      {
        "term": "fee",
        "meaning": "费，酬金"
      },
      {
        "term": "legal",
        "meaning": "法律的；合法的"
      },
      {
        "term": "guidance",
        "meaning": "指导；领导"
      },
      {
        "term": "opinion",
        "meaning": "意见；看法；主张"
      },
      {
        "term": "out of work",
        "meaning": "失业"
      },
      {
        "term": "educate",
        "meaning": "教育；训练"
      },
      {
        "term": "educated",
        "meaning": "受过教育的；有教养的"
      },
      {
        "term": "mankind",
        "meaning": "人类"
      },
      {
        "term": "equal",
        "meaning": "平等的vt.等于；使等于"
      },
      {
        "term": "devote",
        "meaning": "献身；专心于"
      },
      {
        "term": "devoted",
        "meaning": "忠实的；深爱的"
      },
      {
        "term": "unfair",
        "meaning": "不公正的；不公平的"
      },
      {
        "term": "anti-",
        "meaning": "前缀)反；抗"
      },
      {
        "term": "anti-black",
        "meaning": "反黑人的"
      },
      {
        "term": "set up",
        "meaning": "设立；建立"
      },
      {
        "term": "youth",
        "meaning": "青春；青年"
      },
      {
        "term": "league",
        "meaning": "联盟；社团"
      },
      {
        "term": "Youth League",
        "meaning": "青年团"
      },
      {
        "term": "vote",
        "meaning": "选举；投票"
      },
      {
        "term": "peaceful",
        "meaning": "和平的；安宁的"
      },
      {
        "term": "terror",
        "meaning": "恐怖"
      },
      {
        "term": "mean",
        "meaning": "各蔷的；低劣的；卑邮的"
      },
      {
        "term": "blow up",
        "meaning": "使充气；爆炸"
      },
      {
        "term": "attack",
        "meaning": "进攻"
      },
      {
        "term": "relative",
        "meaning": "亲威；亲属"
      },
      {
        "term": "escape",
        "meaning": "逃脱；逃走；泄露"
      }
    ]
  },
  {
    "articleId": "article-06",
    "articleIndex": 6,
    "unitTitle": "Cultural relics",
    "articleTitle": "A Brave Maid",
    "sourcePdfPage": 23,
    "entries": [
      {
        "term": "valuable",
        "meaning": "贵重的；有价值的"
      },
      {
        "term": "survive",
        "meaning": "幸免；幸存；生还"
      },
      {
        "term": "remove",
        "meaning": "移开；搬开；脱掉"
      },
      {
        "term": "evidence",
        "meaning": "根据；证据"
      },
      {
        "term": "entrance",
        "meaning": "入口"
      },
      {
        "term": "wooden",
        "meaning": "木制的"
      },
      {
        "term": "vase",
        "meaning": "花）瓶；瓶饰"
      },
      {
        "term": "dynasty",
        "meaning": "朝代"
      },
      {
        "term": "reception",
        "meaning": "接待"
      },
      {
        "term": "amaze",
        "meaning": "使吃惊；惊"
      },
      {
        "term": "amazing",
        "meaning": "令人吃惊的"
      },
      {
        "term": "artist",
        "meaning": "艺术家"
      },
      {
        "term": "design",
        "meaning": "图案，图样；样式vt.设计；策划"
      },
      {
        "term": "rare",
        "meaning": "罕见的，稀有的"
      },
      {
        "term": "style",
        "meaning": "风格，格调"
      },
      {
        "term": "select",
        "meaning": "挑选；选择"
      },
      {
        "term": "jewel",
        "meaning": "珠宝；宝石"
      },
      {
        "term": "decorate",
        "meaning": "装饰；装修"
      },
      {
        "term": "think highly of",
        "meaning": "看重；器重"
      },
      {
        "term": "fancy",
        "meaning": "想象，喜爱adj.奇特的，异样的"
      },
      {
        "term": "honey",
        "meaning": "蜜；蜂蜜"
      },
      {
        "term": "painting",
        "meaning": "绘画，油画"
      },
      {
        "term": "belong",
        "meaning": "属，附属"
      },
      {
        "term": "belong to",
        "meaning": "属于"
      },
      {
        "term": "former",
        "meaning": "从前的"
      },
      {
        "term": "castle",
        "meaning": "城堡"
      },
      {
        "term": "at war",
        "meaning": "处于交战状态"
      },
      {
        "term": "troop",
        "meaning": "群；组；军队"
      },
      {
        "term": "explode",
        "meaning": "爆炸"
      },
      {
        "term": "debate",
        "meaning": "争论；辩论"
      },
      {
        "term": "doubt",
        "meaning": "怀疑，疑惑"
      },
      {
        "term": "less than",
        "meaning": "少于"
      },
      {
        "term": "informal",
        "meaning": "非正式"
      },
      {
        "term": "maid",
        "meaning": "女仆；侍女"
      },
      {
        "term": "apart",
        "meaning": "分离；分别地"
      },
      {
        "term": "take apart",
        "meaning": "拆开"
      },
      {
        "term": "sailor",
        "meaning": "水手，海员"
      },
      {
        "term": "sink",
        "meaning": "下沉；沉下"
      },
      {
        "term": "local",
        "meaning": "本地的；当地的"
      },
      {
        "term": "trial",
        "meaning": "试验；审讯；审判"
      },
      {
        "term": "in search of",
        "meaning": "寻找"
      }
    ]
  },
  {
    "articleId": "article-07",
    "articleIndex": 7,
    "unitTitle": "The Olympic Games",
    "articleTitle": "Competitions Must Be Fair",
    "sourcePdfPage": 27,
    "entries": [
      {
        "term": "fairness",
        "meaning": "公平；公正"
      },
      {
        "term": "deserve",
        "meaning": "应受；值得"
      },
      {
        "term": "competitor",
        "meaning": "竞争者；参赛者"
      },
      {
        "term": "bargain",
        "meaning": "讨价还价；便宜货"
      },
      {
        "term": "admit",
        "meaning": "允许进入；承认；接纳"
      },
      {
        "term": "basis",
        "meaning": "基础；依据"
      },
      {
        "term": "motto",
        "meaning": "座右铭；格言；警句"
      },
      {
        "term": "homeland",
        "meaning": "祖国；本国"
      },
      {
        "term": "glory",
        "meaning": "光荣；荣誉"
      },
      {
        "term": "nowadays",
        "meaning": "现今；现在"
      },
      {
        "term": "ancient",
        "meaning": "古代的，古老的"
      },
      {
        "term": "slave",
        "meaning": "奴隶"
      },
      {
        "term": "hopeless",
        "meaning": "没有希望的；绝望的"
      },
      {
        "term": "athlete",
        "meaning": "运动员"
      },
      {
        "term": "pain",
        "meaning": "疼痛；痛苦"
      },
      {
        "term": "take part in",
        "meaning": "参加；参与"
      },
      {
        "term": "medal",
        "meaning": "奖章，勋章，纪念章"
      },
      {
        "term": "magical",
        "meaning": "有魔力的"
      },
      {
        "term": "replace",
        "meaning": "取代"
      },
      {
        "term": "gymnastics",
        "meaning": "体操；体能训练"
      },
      {
        "term": "host",
        "meaning": "主人；节目主持人做东；主办"
      },
      {
        "term": "responsibility",
        "meaning": "责任；职责"
      },
      {
        "term": "advertise",
        "meaning": "为...做广告"
      },
      {
        "term": "poster",
        "meaning": "海报；招贴；广告（画）"
      },
      {
        "term": "stadium",
        "meaning": "露天）体育场（stadiums/stadia）"
      },
      {
        "term": "regular",
        "meaning": "规则的；定期的；常规的"
      },
      {
        "term": "physical",
        "meaning": "物理的；身体的；生理的"
      },
      {
        "term": "gymnasium",
        "meaning": "体操；体育馆；健身房"
      },
      {
        "term": "one after another",
        "meaning": "陆续地；一个接一个地"
      },
      {
        "term": "volunteer",
        "meaning": "志愿者；志愿的；自愿"
      },
      {
        "term": "charge",
        "meaning": "收费；控诉；费用；主管"
      },
      {
        "term": "in charge",
        "meaning": "主管；看管"
      },
      {
        "term": "foolish",
        "meaning": "愚蠢的，傻的"
      },
      {
        "term": "compete",
        "meaning": "比赛，竞赛"
      },
      {
        "term": "fine",
        "meaning": "罚款"
      },
      {
        "term": "as well",
        "meaning": "也；又"
      },
      {
        "term": "Greece",
        "meaning": "希腊"
      },
      {
        "term": "Greek",
        "meaning": "希腊（人）的，希腊语的；希腊人，希腊语"
      },
      {
        "term": "cheat",
        "meaning": "欺骗；作弊"
      },
      {
        "term": "strict",
        "meaning": "严格的；严厉的"
      },
      {
        "term": "goal",
        "meaning": "目标；目的；球门；得分"
      }
    ]
  },
  {
    "articleId": "article-08",
    "articleIndex": 8,
    "unitTitle": "Computers",
    "articleTitle": "The Computer",
    "sourcePdfPage": 31,
    "entries": [
      {
        "term": "simplify",
        "meaning": "简化"
      },
      {
        "term": "artificial intelligence",
        "meaning": "人工智能"
      },
      {
        "term": "download",
        "meaning": "下载"
      },
      {
        "term": "logical",
        "meaning": "合逻辑的；逻辑上的"
      },
      {
        "term": "anyhow",
        "meaning": "无论如何；即使如此"
      },
      {
        "term": "goal",
        "meaning": "目标；目的；球门；得分"
      },
      {
        "term": "calculate",
        "meaning": "计算"
      },
      {
        "term": "sum",
        "meaning": "总数；算术题；金额"
      },
      {
        "term": "with the help of",
        "meaning": "在的帮忙下"
      },
      {
        "term": "technology",
        "meaning": "技术"
      },
      {
        "term": "technological",
        "meaning": "科技的"
      },
      {
        "term": "electronic",
        "meaning": "电子的"
      },
      {
        "term": "chip",
        "meaning": "碎片，芯片"
      },
      {
        "term": "tube",
        "meaning": "管；管子；电子管"
      },
      {
        "term": "revolution",
        "meaning": "革命；变革"
      },
      {
        "term": "artificial",
        "meaning": "人造的"
      },
      {
        "term": "intelligence",
        "meaning": "智力；智能"
      },
      {
        "term": "intelligent",
        "meaning": "智能的；聪明的"
      },
      {
        "term": "arise",
        "meaning": "起来；升起；出现"
      },
      {
        "term": "from ... on",
        "meaning": "从时起"
      },
      {
        "term": "appearance",
        "meaning": "外观；外貌；出现"
      },
      {
        "term": "total",
        "meaning": "总的，整个的；合计，总数"
      },
      {
        "term": "totally",
        "meaning": "总合地，完全地"
      },
      {
        "term": "web",
        "meaning": "网"
      },
      {
        "term": "network",
        "meaning": "网络，网状系统"
      },
      {
        "term": "mobile",
        "meaning": "可移动的；机动的"
      },
      {
        "term": "signal",
        "meaning": "发信号；信号"
      },
      {
        "term": "solve",
        "meaning": "解决；解答"
      },
      {
        "term": "type",
        "meaning": "类型vt.打字"
      },
      {
        "term": "logically",
        "meaning": "逻辑上；合逻辑地；有条理地"
      },
      {
        "term": "operator",
        "meaning": "操作员；接线员"
      },
      {
        "term": "coach",
        "meaning": "教练"
      },
      {
        "term": "rocket",
        "meaning": "火箭"
      },
      {
        "term": "explore",
        "meaning": "探索；探测；探究"
      },
      {
        "term": "android",
        "meaning": "机器人"
      },
      {
        "term": "human race",
        "meaning": "人类"
      },
      {
        "term": "character",
        "meaning": "性格；特点"
      },
      {
        "term": "mop",
        "meaning": "拖把；用拖把拖洗"
      },
      {
        "term": "watch over",
        "meaning": "看守；监视"
      },
      {
        "term": "naughty",
        "meaning": "顽皮的，淘气的"
      },
      {
        "term": "niece",
        "meaning": "侄女；甥女"
      },
      {
        "term": "so ... that",
        "meaning": "如此以致"
      }
    ]
  },
  {
    "articleId": "article-09",
    "articleIndex": 9,
    "unitTitle": "Wildlife protection",
    "articleTitle": "Protect Wildlife",
    "sourcePdfPage": 35,
    "entries": [
      {
        "term": "in danger",
        "meaning": "在危险中；垂危"
      },
      {
        "term": "inspection",
        "meaning": "检查；视察"
      },
      {
        "term": "appreciate",
        "meaning": "鉴赏；感激；意识到"
      },
      {
        "term": "pay attention to",
        "meaning": "注意"
      },
      {
        "term": "dinosaur",
        "meaning": "恐龙"
      },
      {
        "term": "die out",
        "meaning": "消失；灭亡"
      },
      {
        "term": "unexpected",
        "meaning": "想不到的；意外的；未预料到"
      },
      {
        "term": "incident",
        "meaning": "事件；事变"
      },
      {
        "term": "wildlife",
        "meaning": "牙生动植物"
      },
      {
        "term": "harm",
        "meaning": "损害；危害"
      },
      {
        "term": "hunt",
        "meaning": "寻找；狩猎，猎取"
      },
      {
        "term": "fur",
        "meaning": "毛皮；皮子"
      },
      {
        "term": "carpet",
        "meaning": "地毯"
      },
      {
        "term": "so that",
        "meaning": "以至于；结果"
      },
      {
        "term": "secure",
        "meaning": "安全的；可靠的"
      },
      {
        "term": "reserve",
        "meaning": "储备；预定；保护区"
      },
      {
        "term": "mercy",
        "meaning": "仁慈；宽恕；怜阀"
      },
      {
        "term": "dust",
        "meaning": "灰尘"
      },
      {
        "term": "come into being",
        "meaning": "形成；产生"
      },
      {
        "term": "affect",
        "meaning": "影响"
      },
      {
        "term": "distant",
        "meaning": "远的；远处的"
      },
      {
        "term": "rub",
        "meaning": "擦"
      },
      {
        "term": "certain",
        "meaning": "确定的；某一；一定"
      },
      {
        "term": "insect",
        "meaning": "昆虫"
      },
      {
        "term": "protect ... from",
        "meaning": "保护不受危害"
      },
      {
        "term": "fierce",
        "meaning": "凶猛的；猛烈的"
      },
      {
        "term": "mosquito",
        "meaning": "蚊子"
      },
      {
        "term": "bite",
        "meaning": "咬；叮"
      },
      {
        "term": "according to",
        "meaning": "按照；根据所说"
      },
      {
        "term": "inspect",
        "meaning": "检查；视察"
      },
      {
        "term": "contain",
        "meaning": "包含；包括；能容纳"
      },
      {
        "term": "powerful",
        "meaning": "效力大的，强有力的，强大的"
      },
      {
        "term": "employ",
        "meaning": "雇用；利用"
      },
      {
        "term": "ending",
        "meaning": "结局；结尾"
      },
      {
        "term": "zone",
        "meaning": "区域；范围"
      },
      {
        "term": "loss",
        "meaning": "损失；丧失；损耗"
      },
      {
        "term": "laughter",
        "meaning": "笑；笑声"
      },
      {
        "term": "burst into laughter",
        "meaning": "突然笑起来；大声笑了出来"
      },
      {
        "term": "respond",
        "meaning": "回答；响应；作出反应"
      },
      {
        "term": "decrease",
        "meaning": "减少；支小或支少"
      },
      {
        "term": "income",
        "meaning": "收入"
      },
      {
        "term": "attention",
        "meaning": "注意，关心"
      }
    ]
  },
  {
    "articleId": "article-10",
    "articleIndex": 10,
    "unitTitle": "Music",
    "articleTitle": "My First Band",
    "sourcePdfPage": 39,
    "entries": [
      {
        "term": "rely on",
        "meaning": "依赖；依靠"
      },
      {
        "term": "be familiar with",
        "meaning": "熟悉；与……熟悉起来"
      },
      {
        "term": "broadcast",
        "meaning": "广播；播放"
      },
      {
        "term": "sensitive",
        "meaning": "敏感的；易受伤害的；灵敏的"
      },
      {
        "term": "dip into",
        "meaning": "浏览；稍加研究"
      },
      {
        "term": "brief",
        "meaning": "简短的；简要的；摘要；大纲"
      },
      {
        "term": "briefly",
        "meaning": "简短地；短暂地"
      },
      {
        "term": "to be honest",
        "meaning": "说实在地；实话说"
      },
      {
        "term": "dream of",
        "meaning": "梦见；梦想；设想"
      },
      {
        "term": "folk",
        "meaning": "民间的"
      },
      {
        "term": "actor",
        "meaning": "男演员；行动者"
      },
      {
        "term": "confident",
        "meaning": "自信的；确信的"
      },
      {
        "term": "devotion",
        "meaning": "投入"
      },
      {
        "term": "form",
        "meaning": "组成；形成；构成n.表格；形式；结构"
      },
      {
        "term": "roll",
        "meaning": "滚动，打滚n.面包圈，小圆面包；卷状物"
      },
      {
        "term": "rely",
        "meaning": "依赖；依靠"
      },
      {
        "term": "perform",
        "meaning": "表演；履行；行动"
      },
      {
        "term": "instrument",
        "meaning": "乐器；工具，器械"
      },
      {
        "term": "pub",
        "meaning": "酒馆；酒吧"
      },
      {
        "term": "passer-by",
        "meaning": "过客，过路人"
      },
      {
        "term": "earn",
        "meaning": "得，赚得"
      },
      {
        "term": "extra",
        "meaning": "额外的，外加的"
      },
      {
        "term": "cash",
        "meaning": "现金"
      },
      {
        "term": "in cash",
        "meaning": "用现金；有现钱"
      },
      {
        "term": "beard",
        "meaning": "胡须"
      },
      {
        "term": "pretend",
        "meaning": "假装；假扮"
      },
      {
        "term": "musician",
        "meaning": "音乐家，乐师"
      },
      {
        "term": "familiar",
        "meaning": "熟悉的；常见的；亲近的"
      },
      {
        "term": "be/getfamiliarwith",
        "meaning": "熟悉；与熟悉起来"
      },
      {
        "term": "addition",
        "meaning": "加；增加；加法"
      },
      {
        "term": "in addition",
        "meaning": "另外；也；此外，还有"
      },
      {
        "term": "attach",
        "meaning": "系上；附加；连接"
      },
      {
        "term": "attach ... to",
        "meaning": "认为有（重要性、意义)；附上；连接"
      },
      {
        "term": "humorous",
        "meaning": "曲默的；谈谐的"
      },
      {
        "term": "performance",
        "meaning": "演出，表演"
      },
      {
        "term": "play jokes on",
        "meaning": "戏弄"
      },
      {
        "term": "jazz",
        "meaning": "爵士音乐，爵士舞曲"
      },
      {
        "term": "invitation",
        "meaning": "邀请"
      },
      {
        "term": "afterwards",
        "meaning": "后来"
      },
      {
        "term": "sort out",
        "meaning": "分类"
      }
    ]
  },
  {
    "articleId": "article-11",
    "articleIndex": 11,
    "unitTitle": "Festivals around the world",
    "articleTitle": "An Interesting Festival",
    "sourcePdfPage": 43,
    "entries": [
      {
        "term": "look forward to",
        "meaning": "盼望；期待"
      },
      {
        "term": "origin",
        "meaning": "起源；由来"
      },
      {
        "term": "admire",
        "meaning": "赞美；钦佩；羡慕"
      },
      {
        "term": "apologize",
        "meaning": "道歉；谢罪"
      },
      {
        "term": "harvest",
        "meaning": "收获；收割"
      },
      {
        "term": "agriculture",
        "meaning": "农业"
      },
      {
        "term": "agricultural",
        "meaning": "农业的"
      },
      {
        "term": "feast",
        "meaning": "节日；盛宴"
      },
      {
        "term": "take place",
        "meaning": "发生"
      },
      {
        "term": "independence",
        "meaning": "独立"
      },
      {
        "term": "independent",
        "meaning": "独立的；自主的"
      },
      {
        "term": "worldwide",
        "meaning": "遍及全世界的；世界性的"
      },
      {
        "term": "celebration",
        "meaning": "庆祝；祝贺"
      },
      {
        "term": "Christian",
        "meaning": "基督徒；基督教的"
      },
      {
        "term": "Mexico",
        "meaning": "墨西哥"
      },
      {
        "term": "arrival",
        "meaning": "到来，到达"
      },
      {
        "term": "religious",
        "meaning": "宗教的"
      },
      {
        "term": "ancestor",
        "meaning": "祖宗；祖先"
      },
      {
        "term": "trick",
        "meaning": "诡计，把戏；欺骗，诈骗"
      },
      {
        "term": "play a trick on",
        "meaning": "搞恶作剧；诈骗；开玩笑"
      },
      {
        "term": "keep one's word",
        "meaning": "守信"
      },
      {
        "term": "turn up",
        "meaning": "到场，出现；开大（声音）"
      },
      {
        "term": "drown",
        "meaning": "溺死；淹没"
      },
      {
        "term": "starve",
        "meaning": "饿死；饿得要死"
      },
      {
        "term": "day and night",
        "meaning": "日日夜夜"
      },
      {
        "term": "weep",
        "meaning": "哭泣，流泪"
      },
      {
        "term": "gain",
        "meaning": "获得"
      },
      {
        "term": "forgive",
        "meaning": "原谅，宽想"
      },
      {
        "term": "poet",
        "meaning": "诗人"
      },
      {
        "term": "set off",
        "meaning": "出发；动手；使爆炸"
      },
      {
        "term": "permission",
        "meaning": "允许，许可；同意"
      },
      {
        "term": "wipe",
        "meaning": "擦去"
      },
      {
        "term": "sadness",
        "meaning": "悲伤"
      },
      {
        "term": "remind",
        "meaning": "提醒；使想起"
      },
      {
        "term": "remind ... of",
        "meaning": "使想起"
      },
      {
        "term": "belief",
        "meaning": "信任；信心；信仰"
      },
      {
        "term": "gather",
        "meaning": "聚集；采集"
      },
      {
        "term": "parking",
        "meaning": "停放"
      },
      {
        "term": "parking lot",
        "meaning": "停车场"
      },
      {
        "term": "dress up",
        "meaning": "穿上盛装；打扮"
      },
      {
        "term": "in memory of",
        "meaning": "纪念"
      },
      {
        "term": "hold one's breath",
        "meaning": "屏住呼吸"
      }
    ]
  },
  {
    "articleId": "article-12",
    "articleIndex": 12,
    "unitTitle": "Healthy eating",
    "articleTitle": "Balanced Diet",
    "sourcePdfPage": 47,
    "entries": [
      {
        "term": "in debt",
        "meaning": "负债"
      },
      {
        "term": "digestion",
        "meaning": "消化"
      },
      {
        "term": "consult",
        "meaning": "请教；查阅；商量"
      },
      {
        "term": "spy on",
        "meaning": "暗中监视；侦查"
      },
      {
        "term": "get away with",
        "meaning": "被放过；（做坏事）不受惩罚"
      },
      {
        "term": "earn one's living",
        "meaning": "谋生"
      },
      {
        "term": "barbecue",
        "meaning": "烧烤；烤肉"
      },
      {
        "term": "bacon",
        "meaning": "熏咸肉；腊肉"
      },
      {
        "term": "fry",
        "meaning": "油煎油炸"
      },
      {
        "term": "stir-fry",
        "meaning": "用旺火炒"
      },
      {
        "term": "breast",
        "meaning": "胸部；乳房"
      },
      {
        "term": "mutton",
        "meaning": "羊肉"
      },
      {
        "term": "roast",
        "meaning": "烤（肉）烤制的"
      },
      {
        "term": "pepper",
        "meaning": "辣椒；辣椒粉"
      },
      {
        "term": "garlic",
        "meaning": "大蒜"
      },
      {
        "term": "discount",
        "meaning": "折扣"
      },
      {
        "term": "customer",
        "meaning": "顾客，消费者"
      },
      {
        "term": "debt",
        "meaning": "债务；欠款"
      },
      {
        "term": "slim",
        "meaning": "变细；减肥adj.苗条的；纤细的"
      },
      {
        "term": "pea",
        "meaning": "豌豆"
      },
      {
        "term": "carrot",
        "meaning": "胡萝下"
      },
      {
        "term": "eggplant",
        "meaning": "茄子"
      },
      {
        "term": "raw",
        "meaning": "生的；未煮过的；未加工的"
      },
      {
        "term": "cucumber",
        "meaning": "黄瓜"
      },
      {
        "term": "vinegar",
        "meaning": "醋"
      },
      {
        "term": "hostess",
        "meaning": "女主人；女主持人"
      },
      {
        "term": "fibre",
        "meaning": "纤维"
      },
      {
        "term": "benefit",
        "meaning": "利益；使受益"
      },
      {
        "term": "digest",
        "meaning": "消化n.摘要"
      },
      {
        "term": "lie",
        "meaning": "谎言；说说"
      },
      {
        "term": "spy",
        "meaning": "窥探；秘密监视；间谦"
      },
      {
        "term": "glare",
        "meaning": "瞪眼；怒目而视；闪耀n.炫目的光"
      },
      {
        "term": "kjueri'osetr ]",
        "meaning": "好奇心"
      },
      {
        "term": "sigh",
        "meaning": "叹息；叹气"
      },
      {
        "term": "weakness",
        "meaning": "软弱；弱点"
      },
      {
        "term": "limit",
        "meaning": "限制；减少n.界限；限度"
      },
      {
        "term": "limited",
        "meaning": "有限的"
      },
      {
        "term": "strength",
        "meaning": "力量；强项；长处"
      },
      {
        "term": "put on weight",
        "meaning": "增加体重"
      },
      {
        "term": "lose weight",
        "meaning": "体重减轻；减肥"
      }
    ]
  },
  {
    "articleId": "article-13",
    "articleIndex": 13,
    "unitTitle": "The Million Pound Bank Note",
    "articleTitle": "Go Ahead",
    "sourcePdfPage": 51,
    "entries": [
      {
        "term": "adventure",
        "meaning": "奇遇；冒险"
      },
      {
        "term": "genuine",
        "meaning": "真的；真诚的；可信赖的"
      },
      {
        "term": "permit",
        "meaning": "许可；允许；通行证"
      },
      {
        "term": "account for",
        "meaning": "导致；做出解释"
      },
      {
        "term": "go ahead",
        "meaning": "前进；进行；请吧"
      },
      {
        "term": "novel",
        "meaning": "长篇）小说"
      },
      {
        "term": "unbelievable",
        "meaning": "难以置信的"
      },
      {
        "term": "author",
        "meaning": "著者；作家"
      },
      {
        "term": "businessman",
        "meaning": "商人"
      },
      {
        "term": "bring up",
        "meaning": "抚养；培养；教育；提出"
      },
      {
        "term": "birthplace",
        "meaning": "出生地；故乡"
      },
      {
        "term": "wander",
        "meaning": "漫游；漫步；漂泊"
      },
      {
        "term": "pavement",
        "meaning": "人行道"
      },
      {
        "term": "bay",
        "meaning": "湾；海湾"
      },
      {
        "term": "scene",
        "meaning": "戏剧、电影等的）一场；场景；布景；景色"
      },
      {
        "term": "envelope",
        "meaning": "信封"
      },
      {
        "term": "embassy",
        "meaning": "大使馆；大使及其官员"
      },
      {
        "term": "rude",
        "meaning": "无理的，粗鲁的"
      },
      {
        "term": "manner",
        "meaning": "礼貌，方式，态度，举止"
      },
      {
        "term": "bow",
        "meaning": "翔，弯腰行礼"
      },
      {
        "term": "stare",
        "meaning": "町，凝视"
      },
      {
        "term": "stare at",
        "meaning": "町着看"
      },
      {
        "term": "patience",
        "meaning": "容忍；耐心"
      },
      {
        "term": "fault",
        "meaning": "过错；缺点；故障"
      },
      {
        "term": "account",
        "meaning": "认为；说明；总计有n.说明；理由；账目"
      },
      {
        "term": "amount",
        "meaning": "数量"
      },
      {
        "term": "a large amount of",
        "meaning": "大量的"
      },
      {
        "term": "contrary",
        "meaning": "反面；对立面；相反的；相违的"
      },
      {
        "term": "on the contrary",
        "meaning": "与此相反；正相反"
      },
      {
        "term": "ahead",
        "meaning": "在前；向前；提前"
      },
      {
        "term": "spot",
        "meaning": "发现；认出n.斑点，污点；场所，地点"
      },
      {
        "term": "by accident",
        "meaning": "偶然"
      },
      {
        "term": "rag",
        "meaning": "破布；抹布"
      },
      {
        "term": "in rags",
        "meaning": "衣裳谥楼"
      },
      {
        "term": "indeed",
        "meaning": "确实；实在"
      },
      {
        "term": "scream",
        "meaning": "尖叫"
      },
      {
        "term": "steak",
        "meaning": "牛排；肉排；鱼排"
      },
      {
        "term": "pineapple",
        "meaning": "菠萝"
      },
      {
        "term": "dessert",
        "meaning": "甜点"
      },
      {
        "term": "passage",
        "meaning": "文章等的）一节，一段；通道；走廊；船费"
      }
    ]
  },
  {
    "articleId": "article-14",
    "articleIndex": 14,
    "unitTitle": "Astronomy: the science of the stars",
    "articleTitle": "Explore UKII",
    "sourcePdfPage": 55,
    "entries": [
      {
        "term": "fundamental",
        "meaning": "基本的；基础的"
      },
      {
        "term": "cheer up",
        "meaning": "感到高兴；感到振奋"
      },
      {
        "term": "in one's turn",
        "meaning": "轮到某人；接着"
      },
      {
        "term": "theory",
        "meaning": "学说；理论"
      },
      {
        "term": "gentle",
        "meaning": "温和的；文雅的"
      },
      {
        "term": "climate",
        "meaning": "气候"
      },
      {
        "term": "pull",
        "meaning": "拉（力)；拖；牵引力"
      },
      {
        "term": "gravity",
        "meaning": "重力"
      },
      {
        "term": "astronomy",
        "meaning": "天文学"
      },
      {
        "term": "oxygen",
        "meaning": "氧；氧气"
      },
      {
        "term": "atom",
        "meaning": "原子"
      },
      {
        "term": "carbon",
        "meaning": "碳"
      },
      {
        "term": "dioxide",
        "meaning": "二氧化物"
      },
      {
        "term": "carbon dioxide",
        "meaning": "二氧化碳"
      },
      {
        "term": "exist",
        "meaning": "存在"
      },
      {
        "term": "atmosphere",
        "meaning": "大气层；气氛"
      },
      {
        "term": "satellite",
        "meaning": "卫星；人造卫星"
      },
      {
        "term": "biology",
        "meaning": "生物学"
      },
      {
        "term": "biologist",
        "meaning": "生物学家"
      },
      {
        "term": "puzzle",
        "meaning": "难题；（使)迷惑；（使）为难"
      },
      {
        "term": "now that",
        "meaning": "既然"
      },
      {
        "term": "globe",
        "meaning": "球体；地球仪；地球"
      },
      {
        "term": "multiply",
        "meaning": "乘；增加；紫殖"
      },
      {
        "term": "lay eggs",
        "meaning": "下蛋"
      },
      {
        "term": "give birth to",
        "meaning": "产生；分娩"
      },
      {
        "term": "spaceship",
        "meaning": "宇宙飞船"
      },
      {
        "term": "unlike",
        "meaning": "不同；不象"
      },
      {
        "term": "thus",
        "meaning": "因此；于是"
      },
      {
        "term": "mass",
        "meaning": "团；块；大量；（复）群众"
      },
      {
        "term": "harmful",
        "meaning": "有害的；致伤的"
      },
      {
        "term": "acid",
        "meaning": "酸"
      },
      {
        "term": "float",
        "meaning": "漂浮，浮动n.漂浮物"
      },
      {
        "term": "violent",
        "meaning": "猛烈的；激烈的；暴力的"
      },
      {
        "term": "chain",
        "meaning": "链子；连锁；锁链"
      },
      {
        "term": "reaction",
        "meaning": "反应；反作用；反动（力）"
      },
      {
        "term": "break out",
        "meaning": "战争、火灾等）突然发生；爆发"
      },
      {
        "term": "block out",
        "meaning": "挡住(光线）"
      },
      {
        "term": "system",
        "meaning": "体系；系统"
      },
      {
        "term": "solar system",
        "meaning": "太阳系"
      },
      {
        "term": "watch out",
        "meaning": "密切注视；当心；提防"
      },
      {
        "term": "prevent... from",
        "meaning": "阻止，防止；制止"
      },
      {
        "term": "crash",
        "meaning": "碰撞；坠落"
      },
      {
        "term": "in time",
        "meaning": "及时"
      }
    ]
  },
  {
    "articleId": "article-15",
    "articleIndex": 15,
    "unitTitle": "Canada \"The True North\"",
    "articleTitle": "A Journey across Canada",
    "sourcePdfPage": 59,
    "entries": [
      {
        "term": "continent",
        "meaning": "大陆；大洲"
      },
      {
        "term": "border",
        "meaning": "边界；国界"
      },
      {
        "term": "settle down",
        "meaning": "定居；平静下来；专心于"
      },
      {
        "term": "have a gift for",
        "meaning": "对……有天赋"
      },
      {
        "term": "scenery",
        "meaning": "景色；风景"
      },
      {
        "term": "quiz",
        "meaning": "测验；问答比赛"
      },
      {
        "term": "eastward",
        "meaning": "向东"
      },
      {
        "term": "schoolmate",
        "meaning": "同学；校友"
      },
      {
        "term": "distance",
        "meaning": "距离；远方"
      },
      {
        "term": "in the distance",
        "meaning": "在远处"
      },
      {
        "term": "measure",
        "meaning": "测量；衡量；判定；计量制；计量单位；措施"
      },
      {
        "term": "approximately",
        "meaning": "接近；大约"
      },
      {
        "term": "surround",
        "meaning": "围绕；包围"
      },
      {
        "term": "confirm",
        "meaning": "证明；证实；批准"
      },
      {
        "term": "baggage",
        "meaning": "行李"
      },
      {
        "term": "aboard",
        "meaning": "在船、飞机、火车或公共汽车上"
      },
      {
        "term": "chat",
        "meaning": "聊天；闲聊"
      },
      {
        "term": "within",
        "meaning": "在.里面v与.接壤；接近"
      },
      {
        "term": "topic",
        "meaning": "话题"
      },
      {
        "term": "Canadian",
        "meaning": "加拿大人；加拿大的；加拿大人的"
      },
      {
        "term": "tradition",
        "meaning": "传统；风俗"
      },
      {
        "term": "minister",
        "meaning": "部长；牧师"
      },
      {
        "term": "prime minister",
        "meaning": "首相；丞相"
      },
      {
        "term": "mix",
        "meaning": "混合；调配"
      },
      {
        "term": "mixture",
        "meaning": "混合物；混合状态"
      },
      {
        "term": "terrify",
        "meaning": "使人感到恐怖"
      },
      {
        "term": "terrified",
        "meaning": "恐惧的；受惊吓的；"
      },
      {
        "term": "terrifying",
        "meaning": "恐惧的；受惊吓的；"
      },
      {
        "term": "buffet",
        "meaning": "自助餐；饮食柜台"
      },
      {
        "term": "pleased",
        "meaning": "欣喜的；高兴的；愉快的"
      },
      {
        "term": "impress",
        "meaning": "使印象深刻；使铭记"
      },
      {
        "term": "impressive",
        "meaning": "给人深刻印象的；感人的"
      },
      {
        "term": "harbour",
        "meaning": "港口"
      },
      {
        "term": "wealthy",
        "meaning": "富有的"
      },
      {
        "term": "urban",
        "meaning": "城市的；市镇的"
      },
      {
        "term": "maple",
        "meaning": "枫树"
      },
      {
        "term": "acre",
        "meaning": "英亩"
      },
      {
        "term": "manage to do",
        "meaning": "设法做"
      },
      {
        "term": "slightly",
        "meaning": "稍稍；略微"
      },
      {
        "term": "catch sight of",
        "meaning": "看见；瞥见"
      },
      {
        "term": "dawn",
        "meaning": "黎明；拂晓"
      },
      {
        "term": "rather than",
        "meaning": "而不是"
      }
    ]
  },
  {
    "articleId": "article-16",
    "articleIndex": 16,
    "unitTitle": "Women of achievement",
    "articleTitle": "A Woman Doctor Li Na",
    "sourcePdfPage": 63,
    "entries": [
      {
        "term": "inspire",
        "meaning": "鼓舞；激发；启示"
      },
      {
        "term": "carry on",
        "meaning": "继续；坚持"
      },
      {
        "term": "nest",
        "meaning": "巢；窝"
      },
      {
        "term": "lead a ... life",
        "meaning": "过着的生活"
      },
      {
        "term": "childhood",
        "meaning": "童年；幼年时代"
      },
      {
        "term": "look down upon",
        "meaning": "不起，轻视"
      },
      {
        "term": "generation",
        "meaning": "一代；一辈"
      },
      {
        "term": "intend",
        "meaning": "计划；打算"
      },
      {
        "term": "come across",
        "meaning": "偶然）遇见；碰见"
      },
      {
        "term": "by chance",
        "meaning": "碰巧；凑巧"
      },
      {
        "term": "deliver",
        "meaning": "投递（信件，邮包等)；生（小孩)；发表（演讲）"
      },
      {
        "term": "audience",
        "meaning": "听众；观众；读者"
      },
      {
        "term": "crowd",
        "meaning": "人群；观众vt.使拥挤；挤满"
      },
      {
        "term": "crowd in",
        "meaning": "想法、问题等）涌上心头；涌入脑海"
      },
      {
        "term": "move off",
        "meaning": "离开；起程；出发"
      },
      {
        "term": "support",
        "meaning": "支持；赞助"
      },
      {
        "term": "institute",
        "meaning": "学会；学院；协会"
      },
      {
        "term": "entertainment",
        "meaning": "娱乐"
      },
      {
        "term": "outspoken",
        "meaning": "直言的；坦诚"
      },
      {
        "term": "modest",
        "meaning": "谦虚的；谦迅逊的"
      },
      {
        "term": "respect",
        "meaning": "尊敬；尊重"
      },
      {
        "term": "argue",
        "meaning": "争辩；争论"
      },
      {
        "term": "observation",
        "meaning": "观察"
      },
      {
        "term": "specialist",
        "meaning": "专家，专科医生；专业人员"
      },
      {
        "term": "kindness",
        "meaning": "仁慈；善良"
      }
    ]
  },
  {
    "articleId": "article-17",
    "articleIndex": 17,
    "unitTitle": "Working the land",
    "articleTitle": "Tuan's New Farming Way",
    "sourcePdfPage": 67,
    "entries": [
      {
        "term": "struggle",
        "meaning": "斗争；拼搏；努力"
      },
      {
        "term": "rid ... of",
        "meaning": "使……摆脱；除去"
      },
      {
        "term": "expand",
        "meaning": "使变大；伸展"
      },
      {
        "term": "equip oneself with",
        "meaning": "使自己具备；配备"
      },
      {
        "term": "reduce",
        "meaning": "减少；减缩"
      },
      {
        "term": "Vietnam",
        "meaning": "越南"
      },
      {
        "term": "decade",
        "meaning": "十年"
      },
      {
        "term": "rid",
        "meaning": "摆脱；除去"
      },
      {
        "term": "hunger",
        "meaning": "饥饿；欲望v（使）饥饿"
      },
      {
        "term": "confuse",
        "meaning": "使迷惑"
      },
      {
        "term": "output",
        "meaning": "输出；产量"
      },
      {
        "term": "disturbing",
        "meaning": "引起烦恼的；令人不安的"
      },
      {
        "term": "lead to",
        "meaning": "导致；造成（后果）"
      },
      {
        "term": "regret",
        "meaning": "遗憾；惜；快悔"
      },
      {
        "term": "comment",
        "meaning": "评论；议论v表达意见；作出评论"
      },
      {
        "term": "underline",
        "meaning": "画底线标出；强调"
      },
      {
        "term": "nationality",
        "meaning": "国籍"
      },
      {
        "term": "occupation",
        "meaning": "工作；职业；占领"
      },
      {
        "term": "focus on",
        "meaning": "集中（注意力、精力等）于"
      },
      {
        "term": "discovery",
        "meaning": "发现；发觉"
      },
      {
        "term": "statistic",
        "meaning": "常用pl.）统计；统计数字；统计资料"
      },
      {
        "term": "circulate",
        "meaning": "循环；流通；流传"
      },
      {
        "term": "therefore",
        "meaning": "因此；所以；因为"
      },
      {
        "term": "pest",
        "meaning": "害虫"
      },
      {
        "term": "fertilizer",
        "meaning": "肥料"
      }
    ]
  },
  {
    "articleId": "article-18",
    "articleIndex": 18,
    "unitTitle": "A taste of English humour",
    "articleTitle": "A Great Master of Humour",
    "sourcePdfPage": 71,
    "entries": [
      {
        "term": "content",
        "meaning": "满足的；满意的"
      },
      {
        "term": "worn-out",
        "meaning": "磨破的；穿旧的；筋疲力尽的"
      },
      {
        "term": "bored",
        "meaning": "厌烦的"
      },
      {
        "term": "moustache",
        "meaning": "小胡子"
      },
      {
        "term": "gesture",
        "meaning": "姿态；手势v做手势"
      },
      {
        "term": "entertain",
        "meaning": "使欢乐"
      },
      {
        "term": "react",
        "meaning": "作出反应；回应"
      },
      {
        "term": "detective",
        "meaning": "侦探"
      },
      {
        "term": "drunk",
        "meaning": "醉的"
      },
      {
        "term": "slide",
        "meaning": "幻灯片；滑道v滑行；滑动"
      },
      {
        "term": "whisper",
        "meaning": "低语，私下说"
      },
      {
        "term": "particular",
        "meaning": "特殊的；个别的n.细节；细目"
      },
      {
        "term": "humour",
        "meaning": "曲默；滑稽"
      },
      {
        "term": "astonish",
        "meaning": "使惊"
      },
      {
        "term": "throughout",
        "meaning": "遍及；贯穿；到处"
      },
      {
        "term": "up to now",
        "meaning": "直到现在"
      },
      {
        "term": "badly off",
        "meaning": "穷的；缺少的"
      },
      {
        "term": "homeless",
        "meaning": "无家的，无家可归的"
      },
      {
        "term": "occasion",
        "meaning": "时刻；场合"
      },
      {
        "term": "snowstorm",
        "meaning": "暴风雪"
      },
      {
        "term": "overcome",
        "meaning": "战胜，克服"
      },
      {
        "term": "fortunate",
        "meaning": "幸运的；倪幸的"
      },
      {
        "term": "pick out",
        "meaning": "挑出；辨别出"
      },
      {
        "term": "chew",
        "meaning": "咀嚼"
      },
      {
        "term": "pancake",
        "meaning": "薄煎饼"
      }
    ]
  },
  {
    "articleId": "article-19",
    "articleIndex": 19,
    "unitTitle": "Body language",
    "articleTitle": "A Misunderstanding",
    "sourcePdfPage": 75,
    "entries": [
      {
        "term": "statement",
        "meaning": "陈述；说明"
      },
      {
        "term": "function",
        "meaning": "功能；作用；起作用"
      },
      {
        "term": "represent",
        "meaning": "代表；象征；描绘"
      },
      {
        "term": "approach",
        "meaning": "接近；方法；途径"
      },
      {
        "term": "in general",
        "meaning": "总的来说；通常"
      },
      {
        "term": "spoken",
        "meaning": "口语的"
      },
      {
        "term": "major",
        "meaning": "主要的"
      },
      {
        "term": "facial",
        "meaning": "面部的"
      },
      {
        "term": "yawn",
        "meaning": "打哈欠"
      },
      {
        "term": "turn one's back to",
        "meaning": "背对；背弃"
      },
      {
        "term": "fist",
        "meaning": "拳头"
      },
      {
        "term": "anger",
        "meaning": "怒气；怒火"
      },
      {
        "term": "subjective",
        "meaning": "主观的"
      },
      {
        "term": "misunderstanding",
        "meaning": "误会"
      },
      {
        "term": "association",
        "meaning": "社团；联系；联想"
      },
      {
        "term": "rank",
        "meaning": "等级；军衔"
      },
      {
        "term": "dormitory",
        "meaning": "宿舍"
      },
      {
        "term": "curiously",
        "meaning": "好奇地"
      },
      {
        "term": "greet",
        "meaning": "迎接；问候"
      },
      {
        "term": "dash",
        "meaning": "猛冲；突进"
      },
      {
        "term": "cheek",
        "meaning": "面颊，脸蛋"
      },
      {
        "term": "truly",
        "meaning": "真实地；真诚地；真正地"
      },
      {
        "term": "defend against",
        "meaning": "保卫以免受"
      },
      {
        "term": "lose face",
        "meaning": "丢脸"
      },
      {
        "term": "be likely to",
        "meaning": "很可能"
      }
    ]
  },
  {
    "articleId": "article-20",
    "articleIndex": 20,
    "unitTitle": "Theme parks",
    "articleTitle": "A Unique Theme Park",
    "sourcePdfPage": 79,
    "entries": [
      {
        "term": "preserve",
        "meaning": "保护；保存；保留"
      },
      {
        "term": "minority",
        "meaning": "少数；少数民族"
      },
      {
        "term": "in advance",
        "meaning": "提前"
      },
      {
        "term": "shuttle",
        "meaning": "往返与两个定点之间的火车、汽车、飞机）班车；班机；航天飞机"
      },
      {
        "term": "get close( to )",
        "meaning": "接近"
      },
      {
        "term": "theme",
        "meaning": "主题"
      },
      {
        "term": "freeway",
        "meaning": "高速公路"
      },
      {
        "term": "come to life",
        "meaning": "活跃起来"
      },
      {
        "term": "cloth",
        "meaning": "布"
      },
      {
        "term": "sneaker",
        "meaning": "复）轻便运动鞋"
      },
      {
        "term": "advance",
        "meaning": "推进，促进；前进"
      },
      {
        "term": "translator",
        "meaning": "翻译家，译者"
      },
      {
        "term": "admission",
        "meaning": "准入，接纳；承认"
      },
      {
        "term": "various",
        "meaning": "各种各样的；不同的"
      },
      {
        "term": "attraction",
        "meaning": "有吸引力的事情；吸引"
      },
      {
        "term": "brochure",
        "meaning": "小册子；指南"
      },
      {
        "term": "be famous for",
        "meaning": "以而闻名"
      },
      {
        "term": "deed",
        "meaning": "行动；事迹"
      },
      {
        "term": "settler",
        "meaning": "移居者；开拓者"
      },
      {
        "term": "jungle",
        "meaning": "丛林，密林"
      },
      {
        "term": "souvenir",
        "meaning": "旅游）纪念品，纪念物"
      },
      {
        "term": "carpenter",
        "meaning": "木匠"
      },
      {
        "term": "athletic",
        "meaning": "运动的"
      },
      {
        "term": "engine",
        "meaning": "发动机"
      },
      {
        "term": "be modelled after",
        "meaning": "根据模仿；仿造"
      }
    ]
  },
  {
    "articleId": "article-21",
    "articleIndex": 21,
    "unitTitle": "Great scientists",
    "articleTitle": "A Strange Severe Disease",
    "sourcePdfPage": 83,
    "entries": [
      {
        "term": "characteristic",
        "meaning": "特征；特性"
      },
      {
        "term": "suspect",
        "meaning": "怀疑；嫌疑犯"
      },
      {
        "term": "put forward",
        "meaning": "提出"
      },
      {
        "term": "challenge",
        "meaning": "挑战"
      },
      {
        "term": "construct",
        "meaning": "建造，修建，创立"
      },
      {
        "term": "construction",
        "meaning": "建造，建设；建筑物"
      },
      {
        "term": "firework",
        "meaning": "烟火（燃放)"
      },
      {
        "term": "pump",
        "meaning": "泵；抽水机vl.用泵抽水"
      },
      {
        "term": "painter",
        "meaning": "画家；油漆匠"
      },
      {
        "term": "neighbourhood",
        "meaning": "附近；邻近"
      },
      {
        "term": "defeat",
        "meaning": "击败；战胜"
      },
      {
        "term": "severe",
        "meaning": "严重的；严厉的；剧烈的"
      },
      {
        "term": "alike",
        "meaning": "相同的；类似的"
      },
      {
        "term": "expert",
        "meaning": "熟练的；经验或知识丰富的；专家；行家"
      },
      {
        "term": "physician",
        "meaning": "医生；内科医生"
      },
      {
        "term": "instruct",
        "meaning": "命令；指示；教导"
      },
      {
        "term": "victim",
        "meaning": "受害者"
      },
      {
        "term": "handle",
        "meaning": "柄，把手v.处理"
      },
      {
        "term": "foresee",
        "meaning": "预见；预知"
      },
      {
        "term": "pollute",
        "meaning": "污染；弄脏"
      },
      {
        "term": "-positive",
        "meaning": "积极的；肯定的；确定的；确信的"
      },
      {
        "term": "make sense",
        "meaning": "有意义"
      },
      {
        "term": "be strict with",
        "meaning": "对严格要求"
      },
      {
        "term": "contribute",
        "meaning": "捐献；贡献"
      },
      {
        "term": "apart from",
        "meaning": "除.之外；此外"
      }
    ]
  },
  {
    "articleId": "article-22",
    "articleIndex": 22,
    "unitTitle": "The United Kingdom",
    "articleTitle": "Sightseeing in the United Kingdom",
    "sourcePdfPage": 87,
    "entries": [
      {
        "term": "delight",
        "meaning": "快乐；高兴；使高兴"
      },
      {
        "term": "clarify",
        "meaning": "澄清；阐明"
      },
      {
        "term": "break away from",
        "meaning": "挣脱；脱离"
      },
      {
        "term": "arrange",
        "meaning": "筹备；安排；整理"
      },
      {
        "term": "roughly",
        "meaning": "粗略地；大致地"
      },
      {
        "term": "wedding",
        "meaning": "婚礼，结婚"
      },
      {
        "term": "unite",
        "meaning": "联合，团结"
      },
      {
        "term": "kingdom",
        "meaning": "王国"
      },
      {
        "term": "nationwide",
        "meaning": "全国性的；全国范国的"
      },
      {
        "term": "sightseeing",
        "meaning": "游览，观光传真（机);"
      },
      {
        "term": "fax",
        "meaning": "用传真传输（文件）快乐；乐事"
      },
      {
        "term": "tense",
        "meaning": "时态"
      },
      {
        "term": "error",
        "meaning": "错误；差错"
      },
      {
        "term": "description",
        "meaning": "描写；描述"
      },
      {
        "term": "currency",
        "meaning": "货币；通货"
      },
      {
        "term": "administration",
        "meaning": "管理；行政部门"
      },
      {
        "term": "institution",
        "meaning": "制度；机制；公共机构"
      },
      {
        "term": "divide ... into",
        "meaning": "把分成"
      },
      {
        "term": "province",
        "meaning": "省（一个国家的大行政区）"
      },
      {
        "term": "conflict",
        "meaning": "矛盾；冲突"
      },
      {
        "term": "quarrel",
        "meaning": "争吵；争论；吵架；"
      },
      {
        "term": "leave out",
        "meaning": "省去；遗漏；不考虑"
      },
      {
        "term": "countryside",
        "meaning": "乡下；农村"
      },
      {
        "term": "port",
        "meaning": "港口(城市)"
      },
      {
        "term": "break down",
        "meaning": "损坏；（把化合物等)分解；（汽车)抛锚"
      }
    ]
  },
  {
    "articleId": "article-23",
    "articleIndex": 23,
    "unitTitle": "Life in the future",
    "articleTitle": "An Air Crash",
    "sourcePdfPage": 91,
    "entries": [
      {
        "term": "tolerate",
        "meaning": "容忍；忍受"
      },
      {
        "term": "take up",
        "meaning": "拿起；接受；开始从事"
      },
      {
        "term": "resign",
        "meaning": "辞职；辞去"
      },
      {
        "term": "press",
        "meaning": "压，按；逼迫n.压，按；新闻界；出版社"
      },
      {
        "term": "button",
        "meaning": "纽扣；按钮"
      },
      {
        "term": "switch",
        "meaning": "开关，转换vt.转换"
      },
      {
        "term": "capsule",
        "meaning": "胶囊，太空舱"
      },
      {
        "term": "carriage",
        "meaning": "运输工具；四轮马车；（火车）客车厢"
      },
      {
        "term": "slide into",
        "meaning": "快捷而悄声地）移动；溜进..."
      },
      {
        "term": "sideways",
        "meaning": "往（向、从）一侧；侧着；侧面朝前"
      },
      {
        "term": "opening",
        "meaning": "出入的通路；开放；口子"
      },
      {
        "term": "optimistic",
        "meaning": "乐观的"
      },
      {
        "term": "adjustment",
        "meaning": "调整；调节"
      },
      {
        "term": "postage",
        "meaning": "邮资"
      },
      {
        "term": "postcode",
        "meaning": "邮政编码"
      },
      {
        "term": "typewriter",
        "meaning": "打宇机"
      },
      {
        "term": "motivation",
        "meaning": "动机；动力"
      },
      {
        "term": "representative",
        "meaning": "代表；典型人物；典型的；有代表性的"
      },
      {
        "term": "ecology",
        "meaning": "生态；生态学"
      },
      {
        "term": "dustbin",
        "meaning": "垃圾箱"
      },
      {
        "term": "timetable",
        "meaning": "时间表；时刻表"
      },
      {
        "term": "jet",
        "meaning": "喷气式飞机"
      },
      {
        "term": "receiver",
        "meaning": "接受者；接收器；电话听简"
      },
      {
        "term": "mask",
        "meaning": "戴面具；掩饰；伪装"
      },
      {
        "term": "belt",
        "meaning": "腰带；皮带"
      }
    ]
  },
  {
    "articleId": "article-24",
    "articleIndex": 24,
    "unitTitle": "Making the news",
    "articleTitle": "An Amateur Journalist",
    "sourcePdfPage": 95,
    "entries": [
      {
        "term": "dilemma",
        "meaning": "困境；窘境"
      },
      {
        "term": "depend on",
        "meaning": "依靠；依赖"
      },
      {
        "term": "accuse ... of",
        "meaning": "因……指责或控告……"
      },
      {
        "term": "department",
        "meaning": "部门；处；系"
      },
      {
        "term": "crime",
        "meaning": "法律上的）罪，犯罪"
      },
      {
        "term": "gifted",
        "meaning": "有天赋的；有才华的"
      },
      {
        "term": "admirable",
        "meaning": "值得赞扬的；令人钦佩的"
      },
      {
        "term": "accuse",
        "meaning": "指责；遣责；控告"
      },
      {
        "term": "eager",
        "meaning": "渴望的，热切的"
      },
      {
        "term": "profession",
        "meaning": "职业；专业"
      },
      {
        "term": "professional",
        "meaning": "专业的；职业的"
      },
      {
        "term": "concentrate on",
        "meaning": "集中，全神贯注"
      },
      {
        "term": "so as to( do sth. )",
        "meaning": "以使，为了（做）…"
      },
      {
        "term": "acquire",
        "meaning": "获得，取得"
      },
      {
        "term": "accurate",
        "meaning": "精确的"
      },
      {
        "term": "meanwhile",
        "meaning": "同时"
      },
      {
        "term": "assist",
        "meaning": "帮助；协助；援助"
      },
      {
        "term": "assess",
        "meaning": "评估；评定"
      },
      {
        "term": "deliberately",
        "meaning": "蓄意地，故意地；审慎地"
      },
      {
        "term": "skeptical",
        "meaning": "怀疑的"
      },
      {
        "term": "thorough",
        "meaning": "彻底的；详尽的"
      },
      {
        "term": "ahead of",
        "meaning": "在前面"
      },
      {
        "term": "editor",
        "meaning": "编辑"
      },
      {
        "term": "approve",
        "meaning": "认可；同意；批准"
      },
      {
        "term": "publish",
        "meaning": "出版；发行；发表；公布"
      }
    ]
  },
  {
    "articleId": "article-25",
    "articleIndex": 25,
    "unitTitle": "First aid",
    "articleTitle": "First Aid",
    "sourcePdfPage": 98,
    "entries": [
      {
        "term": "treatment",
        "meaning": "治疗；处理；对待"
      },
      {
        "term": "vital",
        "meaning": "至关重要的；生死攸关的"
      },
      {
        "term": "bandage",
        "meaning": "绷带"
      },
      {
        "term": "firm",
        "meaning": "动作）稳定有力的；坚定的；"
      },
      {
        "term": "firmly",
        "meaning": "稳定地；坚固地"
      },
      {
        "term": "in place",
        "meaning": "适当；在适当的位置"
      },
      {
        "term": "apply",
        "meaning": "涂；敷；应用；运用；申请；请求；使用；有效"
      },
      {
        "term": "pressure",
        "meaning": "压迫，压力，压强"
      },
      {
        "term": "bleed",
        "meaning": "出血，流血"
      },
      {
        "term": "scissors",
        "meaning": "剪刀"
      },
      {
        "term": "over and over again",
        "meaning": "反复，多次重复"
      },
      {
        "term": "put one's hands on",
        "meaning": "找到"
      },
      {
        "term": "damp",
        "meaning": "潮湿（的）"
      },
      {
        "term": "blouse",
        "meaning": "女衬衫"
      },
      {
        "term": "swollen",
        "meaning": "肿胀的"
      },
      {
        "term": "unbearable",
        "meaning": "难以忍受的；不能忍受的"
      },
      {
        "term": "first aid",
        "meaning": "急救"
      },
      {
        "term": "barrier",
        "meaning": "屏障；障碍（物）"
      },
      {
        "term": "organ",
        "meaning": "器官"
      },
      {
        "term": "radiation",
        "meaning": "放射，放射物；辐射，射线"
      },
      {
        "term": "injury",
        "meaning": "损伤；伤害"
      },
      {
        "term": "choke",
        "meaning": "住；室息"
      },
      {
        "term": "poison",
        "meaning": "毒药V毒害"
      },
      {
        "term": "cupboard",
        "meaning": "橱柜；衣柜"
      },
      {
        "term": "ankle",
        "meaning": "噪关节"
      }
    ]
  }
]

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

  while (distractors.length < 3) {
    const candidate = pool[(seed + step * 7) % pool.length]
    if (candidate !== correctMeaning && !distractors.includes(candidate)) {
      distractors.push(candidate)
    }
    step += 1
  }

  return distractors
}

function buildQuestionBank() {
  const meaningPool = articleBanks.flatMap((article) => article.entries.map((entry) => entry.meaning))
  let globalIndex = 0

  return articleBanks.flatMap((article) =>
    article.entries.map((entry, entryIndex) => {
      globalIndex += 1
      const optionTexts = shuffleBySeed(
        [entry.meaning].concat(getDistractors(meaningPool, entry.meaning, globalIndex + entryIndex)),
        globalIndex
      )
      const options = optionTexts.map((text, index) => ({
        key: optionKeys[index],
        text
      }))
      const correctOption = options.find((option) => option.text === entry.meaning)

      return {
        id: `${article.articleId}-q${entryIndex + 1}`,
        type: 'single',
        category: article.unitTitle,
        articleId: article.articleId,
        articleIndex: article.articleIndex,
        articleTitle: article.articleTitle,
        articleLabel: `?${article.articleIndex}? ? ${article.articleTitle}`,
        sourcePdfPage: article.sourcePdfPage,
        stem: entry.term,
        question: '请选择正确的释义',
        options,
        answer: correctOption ? correctOption.key : 'A',
        explanation: `${entry.term} ???????${entry.meaning}??`
      }
    })
  )
}

export const articleOptions = articleBanks.map((article) => ({
  value: article.articleId,
  label: `?${article.articleIndex}? ? ${article.articleTitle}`,
  unitTitle: article.unitTitle,
  articleTitle: article.articleTitle
}))

export const questionBank = buildQuestionBank()
