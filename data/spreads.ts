import { Spread, Topic } from '../types';

export const spreads: Spread[] = [
  // --- Complex Spreads (10+ cards) ---
  {
    id: 'celtic-cross',
    name: '凯尔特十字 (Celtic Cross)',
    description: '经典的十张牌阵。全方位深度解析现状、阻碍、潜意识、过去、未来及结果。',
    category: ['general', 'complex'],
    positions: [
      // 核心区域 (Center Cluster) - Moved slightly left to make room for the staff
      { id: 1, name: '核心', description: '当前的处境', x: 30, y: 50 },
      { id: 2, name: '阻碍/助力', description: '横跨在核心之上的力量', x: 30, y: 50, rotation: 90 },
      { id: 3, name: '潜意识', description: '事情的基础或根源', x: 30, y: 78 }, // Lower
      { id: 4, name: '过去', description: '刚刚过去的影响', x: 12, y: 50 },  // Further Left
      { id: 5, name: '显意识', description: '最高的目标或可能性', x: 30, y: 22 }, // Higher
      { id: 6, name: '未来', description: '即将发生的事情', x: 48, y: 50 },  // Right of center
      
      // 权杖区域 (The Staff) - Moved further right to separate from center
      { id: 7, name: '自我', description: '你的态度和立场', x: 82, y: 85 },
      { id: 8, name: '环境', description: '周围人或环境的影响', x: 82, y: 65 },
      { id: 9, name: '希望/恐惧', description: '内心的期待或担忧', x: 82, y: 45 },
      { id: 10, name: '结果', description: '最终的走向', x: 82, y: 25 }
    ]
  },

  // --- Medium Spreads (7 cards) ---
  {
    id: 'weekly-horseshoe',
    name: '七星马蹄 (The Horseshoe)',
    description: '七张牌阵。适用于分析特定的困难或展望未来一周的运势。',
    category: ['general', 'future'],
    positions: [
      { id: 1, name: '过去', description: '过去的背景', x: 10, y: 25 },
      { id: 2, name: '现在', description: '当下的情况', x: 20, y: 50 },
      { id: 3, name: '未来', description: '近期的发展', x: 32, y: 75 },
      { id: 4, name: '建议', description: '核心的应对策略', x: 50, y: 85 }, // Center Bottom
      { id: 5, name: '环境', description: '周围的影响', x: 68, y: 75 },
      { id: 6, name: '阻碍', description: '面临的困难', x: 80, y: 50 },
      { id: 7, name: '结果', description: '最终的结果', x: 90, y: 25 }
    ]
  },

  // --- General / Daily ---
  {
    id: 'single',
    name: '灵光一闪 (Single Card)',
    description: '单刀直入。适用于每日指引或简单问题的快速回答。',
    category: ['general', 'daily'],
    positions: [
      { id: 1, name: '核心指引', description: '宇宙当下的回应', x: 50, y: 50 }
    ]
  },
  {
    id: 'time-flow',
    name: '时间之流 (Time Flow)',
    description: '线性布局。洞察过去的原因、现在的状况与未来的趋势。',
    category: ['general', 'daily'],
    positions: [
      { id: 1, name: '过去', description: '过去的因', x: 20, y: 50 },
      { id: 2, name: '现在', description: '当下的境', x: 50, y: 50 },
      { id: 3, name: '未来', description: '未来的果', x: 80, y: 50 }
    ]
  },
  {
    id: 'body-mind-spirit',
    name: '身心灵 (Body Mind Spirit)',
    description: '三角形布局。分析你当下的身心状态与灵性需求。',
    category: ['general', 'daily'],
    positions: [
      { id: 1, name: '身体', description: '现实层面的状态', x: 50, y: 82 }, // Lowered slightly
      { id: 2, name: '心智', description: '思想与情绪的状态', x: 25, y: 35 },
      { id: 3, name: '灵性', description: '潜意识与高我的讯息', x: 75, y: 35 }
    ]
  },

  // --- Love ---
  {
    id: 'love-heart',
    name: '真心之门 (The Heart)',
    description: '心形布局。深度剖析双方情感连结与内心真实渴望。',
    category: ['love'],
    positions: [
      { id: 1, name: '我的心', description: '你的真实感受', x: 30, y: 35, rotation: -15 },
      { id: 2, name: 'Ta的心', description: '对方的真实感受', x: 70, y: 35, rotation: 15 },
      { id: 3, name: '阻碍/连接', description: '你们之间的关键点', x: 50, y: 60 }, // Lowered to avoid overlap with top
      { id: 4, name: '结果', description: '关系的走向', x: 50, y: 85 }
    ]
  },
  {
    id: 'love-cross',
    name: '关系十字 (Relationship Cross)',
    description: '十字布局。分析关系中的互动模式与潜在问题。',
    category: ['love'],
    positions: [
      { id: 1, name: '现状', description: '目前的关系状态', x: 50, y: 50 },
      { id: 2, name: '挑战', description: '面临的困难', x: 50, y: 50, rotation: 90 }, // Overlapping center
      { id: 3, name: '基础', description: '关系的根基', x: 50, y: 85 },
      { id: 4, name: '高阶', description: '理想的发展方向', x: 50, y: 15 },
      { id: 5, name: '结果', description: '最终的趋势', x: 85, y: 50 }
    ]
  },
  {
    id: 'love-pyramid',
    name: '爱情金字塔 (Love Pyramid)',
    description: '金字塔布局。从基础现状层层递进到未来结果。',
    category: ['love'],
    positions: [
      { id: 1, name: '自己', description: '你的状态', x: 20, y: 85 }, // Spread out X, Lower Y
      { id: 2, name: '对方', description: '对方的状态', x: 80, y: 85 }, // Spread out X, Lower Y
      { id: 3, name: '互动', description: '目前的互动模式', x: 50, y: 50 },
      { id: 4, name: '未来', description: '关系的顶点', x: 50, y: 15 }
    ]
  },

  // --- Career ---
  {
    id: 'career-arrow',
    name: '破局之箭 (The Arrow)',
    description: '箭头布局。像利箭一样刺破职场迷雾，直指目标。',
    category: ['career'],
    positions: [
      { id: 1, name: '现状', description: '目前的位置', x: 15, y: 50 },
      { id: 2, name: '阻力', description: '需要克服的困难', x: 35, y: 25 },
      { id: 3, name: '助力', description: '可以利用的资源', x: 35, y: 75 },
      { id: 4, name: '行动', description: '具体的建议', x: 60, y: 50 },
      { id: 5, name: '目标', description: '最终的结果', x: 85, y: 50 }
    ]
  },
  {
    id: 'career-ladder',
    name: '晋升阶梯 (Career Ladder)',
    description: '阶梯布局。一步步分析职业发展的进阶之路。',
    category: ['career'],
    positions: [
      // Adjusted Y coordinates for MAX vertical spacing (spread out from 12% to 92%)
      // With board height 1100px, 20% gap is ~220px, well enough for ~190px cards
      { id: 1, name: '基石', description: '目前的技能与能力', x: 50, y: 92 },
      { id: 2, name: '机遇', description: '眼前的机会', x: 50, y: 65 },
      { id: 3, name: '挑战', description: '必须跨越的障碍', x: 50, y: 38 },
      { id: 4, name: '成就', description: '未来的成就', x: 50, y: 12 }
    ]
  },
  {
    id: 'swot-analysis',
    name: '职场四维 (SWOT)',
    description: '矩阵布局。全方位分析职场优劣势。',
    category: ['career'],
    positions: [
      { id: 1, name: '优势', description: '你的核心竞争力', x: 30, y: 30 },
      { id: 2, name: '劣势', description: '需要补足的短板', x: 70, y: 30 },
      { id: 3, name: '机会', description: '外部的利好', x: 30, y: 70 },
      { id: 4, name: '威胁', description: '潜在的风险', x: 70, y: 70 }
    ]
  },

  // --- Choice ---
  {
    id: 'choice-balance',
    name: '天平抉择 (The Scales)',
    description: '天平布局。左右权衡，看清两个选项的轻重与后果。',
    category: ['choice'],
    positions: [
      { id: 1, name: '核心', description: '问题的本质', x: 50, y: 20 },
      { id: 2, name: '选项A', description: '选择A的发展', x: 20, y: 45, rotation: -10 },
      { id: 3, name: '选项B', description: '选择B的发展', x: 80, y: 45, rotation: 10 },
      { id: 4, name: '结果A', description: '选择A的结局', x: 20, y: 80 },
      { id: 5, name: '结果B', description: '选择B的结局', x: 80, y: 80 }
    ]
  },
  {
    id: 'fork-road',
    name: '分岔路口 (The Fork)',
    description: 'Y形布局。直观展示不同道路通向的风景。',
    category: ['choice'],
    positions: [
      { id: 1, name: '起点', description: '目前的立足点', x: 50, y: 80 },
      { id: 2, name: '路径一', description: '第一条路的过程', x: 30, y: 50, rotation: -20 },
      { id: 3, name: '路径二', description: '第二条路的过程', x: 70, y: 50, rotation: 20 },
      { id: 4, name: '终点一', description: '第一条路的终点', x: 15, y: 20 },
      { id: 5, name: '终点二', description: '第二条路的终点', x: 85, y: 20 }
    ]
  },
  {
    id: 'triangle-choice',
    name: '盲点三角 (Blind Spot)',
    description: '三角布局。揭示你在做选择时可能忽略的因素。',
    category: ['choice'],
    positions: [
      { id: 1, name: '已知', description: '你已经知道的信息', x: 50, y: 80 },
      { id: 2, name: '未知', description: '你忽略或不知道的信息', x: 20, y: 35 },
      { id: 3, name: '建议', description: '综合考量的建议', x: 80, y: 35 },
      { id: 4, name: '结果', description: '最终的指引', x: 50, y: 15 }
    ]
  }
];

export const topics: Topic[] = [
  { 
    id: 'love', 
    name: '爱情情感', 
    description: '探寻真心，解答关系中的迷茫。', 
    allowedSpreadIds: ['celtic-cross', 'love-heart', 'love-cross', 'love-pyramid', 'weekly-horseshoe'] 
  },
  { 
    id: 'career', 
    name: '事业财运', 
    description: '指引方向，把握职场晋升与财富机遇。', 
    allowedSpreadIds: ['celtic-cross', 'career-arrow', 'career-ladder', 'swot-analysis', 'weekly-horseshoe'] 
  },
  { 
    id: 'choice', 
    name: '抉择困境', 
    description: '左右为难时，看清不同道路的风景。', 
    allowedSpreadIds: ['choice-balance', 'fork-road', 'triangle-choice', 'single', 'celtic-cross'] 
  },
  { 
    id: 'daily', 
    name: '每日指引', 
    description: '获取今日的宇宙讯息与灵感。', 
    allowedSpreadIds: ['single', 'time-flow', 'body-mind-spirit', 'weekly-horseshoe'] 
  },
  { 
    id: 'custom', 
    name: '综合运势', 
    description: '万事皆可问，探索命运的全局。', 
    allowedSpreadIds: ['celtic-cross', 'weekly-horseshoe', 'time-flow', 'swot-analysis'] 
  },
  { 
    id: 'private_custom', 
    name: '私人定制', 
    description: '心中的具体疑惑，由你自己定义。', 
    allowedSpreadIds: ['single', 'time-flow', 'weekly-horseshoe', 'celtic-cross', 'choice-balance', 'body-mind-spirit'] 
  }
];