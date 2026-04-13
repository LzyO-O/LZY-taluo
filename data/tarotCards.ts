import { ArcanaType, TarotCard } from '../types';

// SWITCH BACK TO SACRED TEXTS (The Original, Stable Source)
const baseUrl = "https://sacred-texts.com/tarot/pkt/img";

export const majorArcana: TarotCard[] = [
  {
    id: 'm00',
    name: '愚人 (The Fool)',
    image: `${baseUrl}/ar00.jpg`,
    meaningUpright: "新的开始，乐观，信任生活，天真。",
    meaningReversed: "鲁莽，被利用，不顾后果，愚蠢。",
    arcana: ArcanaType.MAJOR,
    number: 0
  },
  {
    id: 'm01',
    name: '魔术师 (The Magician)',
    image: `${baseUrl}/ar01.jpg`,
    meaningUpright: "行动力，创造力，显化，专注。",
    meaningReversed: "操纵，计划不周，才能被埋没，欺骗。",
    arcana: ArcanaType.MAJOR,
    number: 1
  },
  {
    id: 'm02',
    name: '女祭司 (The High Priestess)',
    image: `${baseUrl}/ar02.jpg`,
    meaningUpright: "直觉，潜意识，神秘，内在智慧。",
    meaningReversed: "忽视直觉，压抑情感，肤浅，秘密。",
    arcana: ArcanaType.MAJOR,
    number: 2
  },
  {
    id: 'm03',
    name: '皇后 (The Empress)',
    image: `${baseUrl}/ar03.jpg`,
    meaningUpright: "丰饶，母性，自然，感官享受。",
    meaningReversed: "创造力受阻，过度依赖，忽视自我。",
    arcana: ArcanaType.MAJOR,
    number: 3
  },
  {
    id: 'm04',
    name: '皇帝 (The Emperor)',
    image: `${baseUrl}/ar04.jpg`,
    meaningUpright: "结构，权威，稳定，领导力。",
    meaningReversed: "暴政，僵化，冷酷，缺乏纪律。",
    arcana: ArcanaType.MAJOR,
    number: 4
  },
  {
    id: 'm05',
    name: '教皇 (The Hierophant)',
    image: `${baseUrl}/ar05.jpg`,
    meaningUpright: "传统，信仰，群体归属，精神指引。",
    meaningReversed: "叛逆，打破常规，盲目迷信，新的观念。",
    arcana: ArcanaType.MAJOR,
    number: 5
  },
  {
    id: 'm06',
    name: '恋人 (The Lovers)',
    image: `${baseUrl}/ar06.jpg`,
    meaningUpright: "爱，和谐，关系，价值观的选择。",
    meaningReversed: "失衡，分离，错误的选择，不和谐。",
    arcana: ArcanaType.MAJOR,
    number: 6
  },
  {
    id: 'm07',
    name: '战车 (The Chariot)',
    image: `${baseUrl}/ar07.jpg`,
    meaningUpright: "胜利，意志力，自律，克服障碍。",
    meaningReversed: "失控，缺乏方向，攻击性，失败。",
    arcana: ArcanaType.MAJOR,
    number: 7
  },
  {
    id: 'm08',
    name: '力量 (Strength)',
    image: `${baseUrl}/ar08.jpg`,
    meaningUpright: "勇气，耐心，内在力量，同情心。",
    meaningReversed: "自我怀疑，软弱，不安全感，原始本能。",
    arcana: ArcanaType.MAJOR,
    number: 8
  },
  {
    id: 'm09',
    name: '隐士 (The Hermit)',
    image: `${baseUrl}/ar09.jpg`,
    meaningUpright: "内省，孤独，寻求真理，指引。",
    meaningReversed: "孤立，寂寞，退缩，拒绝建议。",
    arcana: ArcanaType.MAJOR,
    number: 9
  },
  {
    id: 'm10',
    name: '命运之轮 (Wheel of Fortune)',
    image: `${baseUrl}/ar10.jpg`,
    meaningUpright: "周期，业力，命运的转折，好运。",
    meaningReversed: "厄运，抗拒改变，打破循环，意外。",
    arcana: ArcanaType.MAJOR,
    number: 10
  },
  {
    id: 'm11',
    name: '正义 (Justice)',
    image: `${baseUrl}/ar11.jpg`,
    meaningUpright: "公正，真理，法律，因果。",
    meaningReversed: "不公，逃避责任，不诚实，偏见。",
    arcana: ArcanaType.MAJOR,
    number: 11
  },
  {
    id: 'm12',
    name: '倒吊人 (The Hanged Man)',
    image: `${baseUrl}/ar12.jpg`,
    meaningUpright: "牺牲，新的视角，等待，放手。",
    meaningReversed: "停滞，无谓的牺牲，拖延，利己主义。",
    arcana: ArcanaType.MAJOR,
    number: 12
  },
  {
    id: 'm13',
    name: '死神 (Death)',
    image: `${baseUrl}/ar13.jpg`,
    meaningUpright: "结束，转变，放下，重生。",
    meaningReversed: "抗拒改变，停滞不前，恐惧结束，衰败。",
    arcana: ArcanaType.MAJOR,
    number: 13
  },
  {
    id: 'm14',
    name: '节制 (Temperance)',
    image: `${baseUrl}/ar14.jpg`,
    meaningUpright: "平衡，适度，耐心，目标感。",
    meaningReversed: "失衡，过度，急躁，缺乏远见。",
    arcana: ArcanaType.MAJOR,
    number: 14
  },
  {
    id: 'm15',
    name: '恶魔 (The Devil)',
    image: `${baseUrl}/ar15.jpg`,
    meaningUpright: "束缚，成瘾，物质主义，欲望。",
    meaningReversed: "挣脱束缚，重获自由，恢复控制，觉醒。",
    arcana: ArcanaType.MAJOR,
    number: 15
  },
  {
    id: 'm16',
    name: '高塔 (The Tower)',
    image: `${baseUrl}/ar16.jpg`,
    meaningUpright: "突变，灾难，觉醒，毁灭旧有。",
    meaningReversed: "避免灾难，恐惧改变，延迟的破坏。",
    arcana: ArcanaType.MAJOR,
    number: 16
  },
  {
    id: 'm17',
    name: '星星 (The Star)',
    image: `${baseUrl}/ar17.jpg`,
    meaningUpright: "希望，灵感，宁静，精神力量。",
    meaningReversed: "绝望，缺乏信心，消极，甚至自负。",
    arcana: ArcanaType.MAJOR,
    number: 17
  },
  {
    id: 'm18',
    name: '月亮 (The Moon)',
    image: `${baseUrl}/ar18.jpg`,
    meaningUpright: "幻觉，恐惧，潜意识，不安。",
    meaningReversed: "释放恐惧，揭穿谎言，困惑平息。",
    arcana: ArcanaType.MAJOR,
    number: 18
  },
  {
    id: 'm19',
    name: '太阳 (The Sun)',
    image: `${baseUrl}/ar19.jpg`,
    meaningUpright: "快乐，成功，活力，积极。",
    meaningReversed: "暂时的消沉，不切实际的期望，甚至自负。",
    arcana: ArcanaType.MAJOR,
    number: 19
  },
  {
    id: 'm20',
    name: '审判 (Judgement)',
    image: `${baseUrl}/ar20.jpg`,
    meaningUpright: "觉醒，重生，内心的召唤，宽恕。",
    meaningReversed: "自我怀疑，拒绝召唤，无法释怀。",
    arcana: ArcanaType.MAJOR,
    number: 20
  },
  {
    id: 'm21',
    name: '世界 (The World)',
    image: `${baseUrl}/ar21.jpg`,
    meaningUpright: "圆满，达成，旅行，整合。",
    meaningReversed: "未完成，缺乏封闭，停滞，延迟。",
    arcana: ArcanaType.MAJOR,
    number: 21
  }
];

export const minorArcana: TarotCard[] = [
  // WANDS (wa)
  { id: 'w01', name: '权杖王牌', image: `${baseUrl}/wa01.jpg`, meaningUpright: '创造力，热情，新机会', meaningReversed: '延误，缺乏动力', arcana: ArcanaType.MINOR, suit: 'Wands', number: 1 },
  { id: 'w02', name: '权杖二', image: `${baseUrl}/wa02.jpg`, meaningUpright: '计划，未来，发现', meaningReversed: '恐惧未知，计划不周', arcana: ArcanaType.MINOR, suit: 'Wands', number: 2 },
  { id: 'w03', name: '权杖三', image: `${baseUrl}/wa03.jpg`, meaningUpright: '扩张，预见，海外机会', meaningReversed: '障碍，失望', arcana: ArcanaType.MINOR, suit: 'Wands', number: 3 },
  { id: 'w04', name: '权杖四', image: `${baseUrl}/wa04.jpg`, meaningUpright: '庆祝，和谐，回家', meaningReversed: '家庭冲突，不稳定', arcana: ArcanaType.MINOR, suit: 'Wands', number: 4 },
  { id: 'w05', name: '权杖五', image: `${baseUrl}/wa05.jpg`, meaningUpright: '冲突，竞争，分歧', meaningReversed: '避免冲突，尊重差异', arcana: ArcanaType.MINOR, suit: 'Wands', number: 5 },
  { id: 'w06', name: '权杖六', image: `${baseUrl}/wa06.jpg`, meaningUpright: '胜利，成功，认可', meaningReversed: '失败，自负', arcana: ArcanaType.MINOR, suit: 'Wands', number: 6 },
  { id: 'w07', name: '权杖七', image: `${baseUrl}/wa07.jpg`, meaningUpright: '坚持，防卫，挑战', meaningReversed: '放弃，被压倒', arcana: ArcanaType.MINOR, suit: 'Wands', number: 7 },
  { id: 'w08', name: '权杖八', image: `${baseUrl}/wa08.jpg`, meaningUpright: '迅速，行动，消息', meaningReversed: '延误，沮丧', arcana: ArcanaType.MINOR, suit: 'Wands', number: 8 },
  { id: 'w09', name: '权杖九', image: `${baseUrl}/wa09.jpg`, meaningUpright: '韧性，最后的坚持', meaningReversed: '疲惫，防御过度', arcana: ArcanaType.MINOR, suit: 'Wands', number: 9 },
  { id: 'w10', name: '权杖十', image: `${baseUrl}/wa10.jpg`, meaningUpright: '负担，责任，压力', meaningReversed: '释放压力，崩溃', arcana: ArcanaType.MINOR, suit: 'Wands', number: 10 },
  { id: 'w11', name: '权杖侍从', image: `${baseUrl}/wa11.jpg`, meaningUpright: '灵感，新消息，探索', meaningReversed: '坏消息，缺乏创意', arcana: ArcanaType.MINOR, suit: 'Wands', number: 11 },
  { id: 'w12', name: '权杖骑士', image: `${baseUrl}/wa12.jpg`, meaningUpright: '冲动，热情，行动', meaningReversed: '鲁莽，急躁', arcana: ArcanaType.MINOR, suit: 'Wands', number: 12 },
  { id: 'w13', name: '权杖皇后', image: `${baseUrl}/wa13.jpg`, meaningUpright: '自信，魅力，独立', meaningReversed: '嫉妒，不安全感', arcana: ArcanaType.MINOR, suit: 'Wands', number: 13 },
  { id: 'w14', name: '权杖国王', image: `${baseUrl}/wa14.jpg`, meaningUpright: '远见，领导，荣耀', meaningReversed: '冲动，独断', arcana: ArcanaType.MINOR, suit: 'Wands', number: 14 },

  // CUPS (cu)
  { id: 'c01', name: '圣杯王牌', image: `${baseUrl}/cu01.jpg`, meaningUpright: '新感情，直觉，爱', meaningReversed: '情感压抑，空虚', arcana: ArcanaType.MINOR, suit: 'Cups', number: 1 },
  { id: 'c02', name: '圣杯二', image: `${baseUrl}/cu02.jpg`, meaningUpright: '伙伴，结合，吸引', meaningReversed: '不平衡，断联', arcana: ArcanaType.MINOR, suit: 'Cups', number: 2 },
  { id: 'c03', name: '圣杯三', image: `${baseUrl}/cu03.jpg`, meaningUpright: '庆祝，友谊，社群', meaningReversed: '孤立，过度放纵', arcana: ArcanaType.MINOR, suit: 'Cups', number: 3 },
  { id: 'c04', name: '圣杯四', image: `${baseUrl}/cu04.jpg`, meaningUpright: '冷漠，沉思，错过', meaningReversed: '抓住机会，觉醒', arcana: ArcanaType.MINOR, suit: 'Cups', number: 4 },
  { id: 'c05', name: '圣杯五', image: `${baseUrl}/cu05.jpg`, meaningUpright: '失落，悲伤，遗憾', meaningReversed: '接受，继续前进', arcana: ArcanaType.MINOR, suit: 'Cups', number: 5 },
  { id: 'c06', name: '圣杯六', image: `${baseUrl}/cu06.jpg`, meaningUpright: '怀旧，童年，回忆', meaningReversed: '活在过去，不成熟', arcana: ArcanaType.MINOR, suit: 'Cups', number: 6 },
  { id: 'c07', name: '圣杯七', image: `${baseUrl}/cu07.jpg`, meaningUpright: '幻想，选择，白日梦', meaningReversed: '看清现实，做出选择', arcana: ArcanaType.MINOR, suit: 'Cups', number: 7 },
  { id: 'c08', name: '圣杯八', image: `${baseUrl}/cu08.jpg`, meaningUpright: '放弃，寻找真理，离开', meaningReversed: '恐惧改变，停滞', arcana: ArcanaType.MINOR, suit: 'Cups', number: 8 },
  { id: 'c09', name: '圣杯九', image: `${baseUrl}/cu09.jpg`, meaningUpright: '满足，愿望成真', meaningReversed: '贪婪，不满', arcana: ArcanaType.MINOR, suit: 'Cups', number: 9 },
  { id: 'c10', name: '圣杯十', image: `${baseUrl}/cu10.jpg`, meaningUpright: '幸福，家庭，和谐', meaningReversed: '家庭破碎，冲突', arcana: ArcanaType.MINOR, suit: 'Cups', number: 10 },
  { id: 'c11', name: '圣杯侍从', image: `${baseUrl}/cu11.jpg`, meaningUpright: '新消息，好奇，直觉', meaningReversed: '情感不成熟，坏消息', arcana: ArcanaType.MINOR, suit: 'Cups', number: 11 },
  { id: 'c12', name: '圣杯骑士', image: `${baseUrl}/cu12.jpg`, meaningUpright: '浪漫，魅力，想象力', meaningReversed: '情绪化，不切实际', arcana: ArcanaType.MINOR, suit: 'Cups', number: 12 },
  { id: 'c13', name: '圣杯皇后', image: `${baseUrl}/cu13.jpg`, meaningUpright: '慈悲，关怀，情感安全', meaningReversed: '依赖，情绪不稳定', arcana: ArcanaType.MINOR, suit: 'Cups', number: 13 },
  { id: 'c14', name: '圣杯国王', image: `${baseUrl}/cu14.jpg`, meaningUpright: '情感平衡，控制，宽容', meaningReversed: '冷漠，情绪操控', arcana: ArcanaType.MINOR, suit: 'Cups', number: 14 },

  // SWORDS (sw)
  { id: 's01', name: '宝剑王牌', image: `${baseUrl}/sw01.jpg`, meaningUpright: '突破，清晰，真理', meaningReversed: '混乱，思维不清', arcana: ArcanaType.MINOR, suit: 'Swords', number: 1 },
  { id: 's02', name: '宝剑二', image: `${baseUrl}/sw02.jpg`, meaningUpright: '僵局，决定，逃避', meaningReversed: '困惑，信息过载', arcana: ArcanaType.MINOR, suit: 'Swords', number: 2 },
  { id: 's03', name: '宝剑三', image: `${baseUrl}/sw03.jpg`, meaningUpright: '心碎，悲伤，痛苦', meaningReversed: '释放痛苦，乐观', arcana: ArcanaType.MINOR, suit: 'Swords', number: 3 },
  { id: 's04', name: '宝剑四', image: `${baseUrl}/sw04.jpg`, meaningUpright: '休息，恢复，沉思', meaningReversed: '过劳，觉醒', arcana: ArcanaType.MINOR, suit: 'Swords', number: 4 },
  { id: 's05', name: '宝剑五', image: `${baseUrl}/sw05.jpg`, meaningUpright: '冲突，失败，自私', meaningReversed: '和解，过去的怨恨', arcana: ArcanaType.MINOR, suit: 'Swords', number: 5 },
  { id: 's06', name: '宝剑六', image: `${baseUrl}/sw06.jpg`, meaningUpright: '过渡，离开，恢复', meaningReversed: '无法摆脱，阻碍', arcana: ArcanaType.MINOR, suit: 'Swords', number: 6 },
  { id: 's07', name: '宝剑七', image: `${baseUrl}/sw07.jpg`, meaningUpright: '欺骗，策略，逃避', meaningReversed: '坦白，面对', arcana: ArcanaType.MINOR, suit: 'Swords', number: 7 },
  { id: 's08', name: '宝剑八', image: `${baseUrl}/sw08.jpg`, meaningUpright: '束缚，受害心态', meaningReversed: '新的视角，自由', arcana: ArcanaType.MINOR, suit: 'Swords', number: 8 },
  { id: 's09', name: '宝剑九', image: `${baseUrl}/sw09.jpg`, meaningUpright: '焦虑，噩梦，恐惧', meaningReversed: '希望，绝望终结', arcana: ArcanaType.MINOR, suit: 'Swords', number: 9 },
  { id: 's10', name: '宝剑十', image: `${baseUrl}/sw10.jpg`, meaningUpright: '痛苦结束，背叛，失败', meaningReversed: '恢复，再生', arcana: ArcanaType.MINOR, suit: 'Swords', number: 10 },
  { id: 's11', name: '宝剑侍从', image: `${baseUrl}/sw11.jpg`, meaningUpright: '新想法，好奇，沟通', meaningReversed: '欺骗，无法兑现', arcana: ArcanaType.MINOR, suit: 'Swords', number: 11 },
  { id: 's12', name: '宝剑骑士', image: `${baseUrl}/sw12.jpg`, meaningUpright: '野心，行动，冲动', meaningReversed: '鲁莽，不可预测', arcana: ArcanaType.MINOR, suit: 'Swords', number: 12 },
  { id: 's13', name: '宝剑皇后', image: `${baseUrl}/sw13.jpg`, meaningUpright: '独立，洞察，清晰', meaningReversed: '冷酷，苦涩', arcana: ArcanaType.MINOR, suit: 'Swords', number: 13 },
  { id: 's14', name: '宝剑国王', image: `${baseUrl}/sw14.jpg`, meaningUpright: '理智，权威，真理', meaningReversed: '滥用权力，操纵', arcana: ArcanaType.MINOR, suit: 'Swords', number: 14 },

  // PENTACLES (pe)
  { id: 'p01', name: '星币王牌', image: `${baseUrl}/pe01.jpg`, meaningUpright: '新机会，繁荣，显化', meaningReversed: '错失机会，贪婪', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 1 },
  { id: 'p02', name: '星币二', image: `${baseUrl}/pe02.jpg`, meaningUpright: '平衡，适应，优先会', meaningReversed: '失衡，混乱', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 2 },
  { id: 'p03', name: '星币三', image: `${baseUrl}/pe03.jpg`, meaningUpright: '团队，合作，技能', meaningReversed: '缺乏协作，竞争', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 3 },
  { id: 'p04', name: '星币四', image: `${baseUrl}/pe04.jpg`, meaningUpright: '控制，稳定，保守', meaningReversed: '贪婪，放手', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 4 },
  { id: 'p05', name: '星币五', image: `${baseUrl}/pe05.jpg`, meaningUpright: '贫困，孤立，不安全', meaningReversed: '恢复，精神富足', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 5 },
  { id: 'p06', name: '星币六', image: `${baseUrl}/pe06.jpg`, meaningUpright: '慷慨，慈善，分享', meaningReversed: '债务，自私', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 6 },
  { id: 'p07', name: '星币七', image: `${baseUrl}/pe07.jpg`, meaningUpright: '耐心，投资，长期视野', meaningReversed: '缺乏回报，分心', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 7 },
  { id: 'p08', name: '星币八', image: `${baseUrl}/pe08.jpg`, meaningUpright: '勤奋，技能，细节', meaningReversed: '完美主义，无聊', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 8 },
  { id: 'p09', name: '星币九', image: `${baseUrl}/pe09.jpg`, meaningUpright: '富足，奢华，自给自足', meaningReversed: '过度投资，依赖', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 9 },
  { id: 'p10', name: '星币十', image: `${baseUrl}/pe10.jpg`, meaningUpright: '财富，遗产，家庭', meaningReversed: '财务失败，损失', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 10 },
  { id: 'p11', name: '星币侍从', image: `${baseUrl}/pe11.jpg`, meaningUpright: '显化，技能发展，新机会', meaningReversed: '缺乏进步，拖延', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 11 },
  { id: 'p12', name: '星币骑士', image: `${baseUrl}/pe12.jpg`, meaningUpright: '效率，常规，保守', meaningReversed: '懒惰，固执', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 12 },
  { id: 'p13', name: '星币皇后', image: `${baseUrl}/pe13.jpg`, meaningUpright: '实用，舒适，安全', meaningReversed: '失衡，工作狂', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 13 },
  { id: 'p14', name: '星币国王', image: `${baseUrl}/pe14.jpg`, meaningUpright: '丰富，商业，纪律', meaningReversed: '贪婪，独断', arcana: ArcanaType.MINOR, suit: 'Pentacles', number: 14 }
];

export const getDeck = () => [...majorArcana, ...minorArcana];