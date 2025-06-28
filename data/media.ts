export type MediaType = 'anime' | 'book' | 'movie' | 'drama' | 'game' | 'song'
export type MediaState = 'done' | 'doing' | 'todo'

export interface MediaRecord {
  name: string
  creator?: string
  state?: MediaState
  date?: string
  note?: string
  lang?: string
}

export const anime: MediaRecord[] = [
  {
    name: '鋼の錬金術師 FULLMETAL ALCHEMIST',
    creator: '荒川弘',
  },
  {
    name: '葬送のフリーレン',
    creator: '山田鐘人',
  },
  {
    name: 'ノーゲーム・ノーライフ No Game No Life',
    creator: '榎宮祐',
  },
  {
    name: 'Cyberpunk: Edgerunners',
    creator: 'CD Projekt Red',
  },
  {
    name: 'Fate/Zero',
    creator: '虚淵玄',
  },
  {
    name: 'ID:INVADED イド：インヴェイデッド',
    creator: '舞城王太郎',
  },
  {
    name: '咒術廻戦',
    creator: '芥見下々',
  },
  {
    name: 'Arcane',
    creator: 'Riot Games',
  },
  {
    name: '青春ブタ野郎シリーズ',
    creator: '鴨志田一',
  },
  {
    name: 'PSYCHO-PASS サイコパス',
    creator: '虚淵玄',
  },
  {
    name: 'デス・パレード Death Parade',
    creator: '立川讓',
  },
  {
    name: '血界戦線',
    creator: '内藤泰弘',
  },
  {
    name: '寄生獣',
    creator: '岩明均',
  },
  {
    name: 'デュラララ!!',
    creator: '成田良悟',
  },
  {
    name: '鬼滅の刃',
    creator: '吾峠呼世晴',
  },
  {
    name: 'ブルーピリオド Blue Period',
    creator: '山口飛翔',
  },
  {
    name: 'ゾンビになるまでにしたい100のこと～',
    creator: '麻生羽吕',
  },
  {
    name: 'ヴァイオレット・エヴァーガーデン Violet Evergarden',
    creator: '暁佳奈',
  },
  {
    name: 'Steins;Gate',
    creator: '林直孝',
  },
  {
    name: '薬屋のひとりごと',
    creator: '日向夏',
  },
  {
    name: '蟲師',
    creator: '漆原友紀',
  },
  {
    name: 'ダンダダン Dan Da Dan',
    creator: '龍幸伸',
  },
  {
    name: 'ぼっち・ざ・ろっく!',
    creator: 'はまじあき',
  },
  {
    name: '冰菓',
    creator: '米澤穗信',
  },
  {
    name: 'Evangelion',
    creator: '庵野秀明',
  },
  {
    name: '四月は君の嘘',
    creator: '新川直司',
  },
  {
    name: 'やはり俺の青春ラブコメはまちがっている',
    creator: '渡航',
  },
  {
    name: '食戟のソーマ',
    creator: '附田祐斗',
  },
  {
    name: 'チェンソーマン Chainsaw Man',
    creator: '藤本タツキ',
  },
  {
    name: '賭ケグルイ',
    creator: '河本焰',
  },
  {
    name: 'ノラガミ 野良神',
    creator: 'あだちとか',
  },
  {
    name: '暗殺教室',
    creator: '松井優征',
  },
  {
    name: 'かぐや様は告らせたい',
    creator: '赤坂アカ',
  },
  {
    name: 'Re:ゼロから始める異世界生活',
    creator: '長月達平',
  },
  {
    name: 'ソードアート・オンライン Sword Art Online',
    creator: '川原礫',
  },
  {
    name: '進撃の巨人',
    creator: '諫山創',
  },
  {
    name: '一週間フレンズ',
    creator: '葉月抹茶',
  },
  {
    name: 'SPY x FAMILY',
    creator: '遠藤達哉',
  },
  {
    name: '東京喰種',
    creator: '石田スイ',
  },
  {
    name: 'ワンパンマン One-Punch Man',
    creator: 'ONE',
  },
  {
    name: '時光代理人',
    creator: '李豪凌',
    lang: 'zh-cn',
  },
  {
    name: '怪獣8号',
    creator: '松本直也',
  },
  {
    name: '富豪刑事 Balance:UNLIMITED',
    creator: '筒井康隆',
  },
  {
    name: 'ダンジョン飯',
    creator: '九井諒子',
  },
  {
    name: '無職転生',
    creator: '理不尽な孫の手',
  },
  {
    name: 'Dr.STONE',
    creator: '稻垣理一郎',
  },
  {
    name: '僕のヒーローアカデミア',
    creator: '堀越耕平',
  },
  {
    name: '異世界スーサイド・スクワッド',
    creator: 'DCコミックス',
  },
  {
    name: '映像研には手を出すな!',
    creator: '大童澄瞳',
  },
  {
    name: 'サマータイムレンダ Summer Time Rendering',
    creator: '田中靖規',
  },
  {
    name: 'アンデッドアンラック Undead Unluck',
    creator: '戸塚慶文',
  },
  {
    name: 'メイドインアビス Made in Abyss',
    creator: 'つくしあきひと',
  },
  {
    name: '推しの子',
    creator: '赤坂アカ',
  },
  {
    name: '虚構推理',
    creator: '城平京',
  },
  {
    name: 'アカメが斬る!',
    creator: 'タカヒロ',
  },
  {
    name: '夏目友人帳',
    creator: '緑川ゆき',
  },
  {
    name: 'とある科学の超電磁砲',
    creator: '鎌池和馬',
  },
  {
    name: 'とらドラ!',
    creator: '竹宮ゆゆこ',
  },
  {
    name: 'とある魔術の禁書目録',
    creator: '鎌池和馬',
  },
  {
    name: '3月のライオン',
    creator: '羽海野チカ',
  },
  {
    name: 'ゆるキャン△',
    creator: 'あfろ',
  },
  {
    name: '宝石の国',
    creator: '市川春子',
  },
  {
    name: 'バクマン BAKUMAN',
    creator: '大場つぐみ',
  },
  {
    name: 'はたらく細胞',
    creator: '清水茜',
  },
  {
    name: '幼女戦記',
    creator: 'ルロ・ゼン',
  },
  {
    name: '化物語',
    creator: '西尾維新',
  },
  {
    name: 'Overlord',
    creator: '丸山くがね',
  },
  {
    name: '未来日記',
    creator: 'えすのサカエ',
  },
  {
    name: '転生したらスライムだった件',
    creator: '伏瀬',
  },
  {
    name: '僕らはみんな河合荘',
    creator: '宮原るり',
  },
  {
    name: '나 혼자만 레벨업 - 俺だけレベルアップな件',
    creator: '추공',
  },
]

export const book: MediaRecord[] = [
  {
    name: 'Die with Zero',
    creator: 'Bill Perkins',
  },
  {
    name: 'Clear Thinking',
    creator: 'Shane Parrish',
  },
  {
    name: 'L\'étranger',
    creator: 'Albert Camus',
  },
  {
    name: 'Outliers',
    creator: 'Malcolm Gladwel',
  },
  {
    name: '夜は短し歩けよ乙女',
    creator: '森見登美彦',
  },
  {
    name: 'Working in Public',
    creator: 'Nadia Eghbal',
  },
  {
    name: 'The Pathless Path',
    creator: 'Paul Millerd',
  },
  {
    name: 'The Psychology of Money',
    creator: 'Morgan Housel',
  },
  {
    name: '10x Is Easier Than 2x',
    creator: 'Benjamin Hardy and Dan Sullivan',
  },
  {
    name: '三体',
    creator: '刘慈欣',
    lang: 'zh-cn',
  },
  {
    name: '独唱团',
    creator: '韩寒',
    lang: 'zh-cn',
  },
  {
    name: '白夜行',
    creator: '东野圭吾',
  },
  {
    name: 'ナミヤ雑貨店の奇蹟',
    creator: '东野圭吾',
  },
  {
    name: '容疑者Xの献身',
    creator: '东野圭吾',
  },
  {
    name: 'The Difference Engine',
    creator: 'William Gibson and Bruce Sterling',
  },
  {
    name: 'Neuromancer',
    creator: 'William Gibson',
  },
]

export const movie: MediaRecord[] = [
  {
    name: 'Avatar',
    creator: 'James Cameron',
  },
  {
    name: '君の名は。',
    creator: '新海誠',
  },
  {
    name: 'The Dark Knight',
    creator: 'Christopher Nolan',
  },
  {
    name: 'Inception',
    creator: 'Christopher Nolan',
  },
  {
    name: 'Spider-Man: Across the Spider-Verse',
    creator: 'Joaquim Santos, Kemp Powers, Justin Thompson',
  },
  {
    name: 'Interstellar',
    creator: 'Christopher Nolan',
  },
  {
    name: 'Tenet',
    creator: 'Christopher Nolan',
  },
  {
    name: '知らないカノジョ',
    creator: '三木孝浩',
  },
  {
    name: 'Dune',
    creator: 'Denis Villeneuve',
  },
  {
    name: 'No Time to Die',
    creator: 'Cary Joji Fukunaga',
  },
  {
    name: 'Everything Everywhere All at Once',
    creator: 'The Daniels',
  },
  {
    name: 'The Imitation Game',
    creator: 'Morten Tyldum',
  },
  {
    name: 'HER',
    creator: 'Spike Jonze',
  },
  {
    name: 'BLUE GIANT',
    creator: '石塚真一',
  },
  {
    name: 'The King\'s Speech',
    creator: 'Tom Hooper',
  },
  {
    name: 'The Truman Show',
    creator: 'Peter Weir',
  },
  {
    name: 'The Martain',
    creator: 'Ridley Scott',
  },
  {
    name: 'PERFECT DAYS',
    creator: 'Wim Wenders',
  },
  {
    name: 'Joker',
    creator: 'Todd Phillips',
  },
  {
    name: 'One Day',
    creator: 'Lenny Abrahamson',
  },
  {
    name: 'Anonymous',
    creator: 'Akan Satayev',
  },
  {
    name: '好东西',
    creator: '邵艺辉',
  },
]

export const drama: MediaRecord[] = [
  {
    name: 'グランメゾン東京 La Grande Maison Tokyo',
  },
  {
    name: 'アンナチュラル Unnatural',
  },
  {
    name: 'リーガル・ハイ LEGAL HIGH',
  },
  {
    name: '今際の国のアリス Alice in Borderland',
  },
  {
    name: '半沢直樹',
  },
  {
    name: 'Silo',
  },
  {
    name: 'The Last of Us',
  },
  {
    name: 'Sherlock',
  },
  {
    name: 'You',
  },
  {
    name: 'The Queen\'s Gambit',
  },
  {
    name: 'コンフィデンスマンJP',
  },
  {
    name: 'One Piece',
  },
  {
    name: 'Three Body',
  },
  {
    name: 'Wednesday',
  },
  {
    name: 'アンチヒーロー Anti Hero',
  },
]

export const game: MediaRecord[] = [
  {
    name: 'Factorio',
    creator: 'Wube Software',
  },
  {
    name: 'Bloodborne',
    creator: 'FromSoftware',
  },
  {
    name: 'ELDEN RING',
    creator: 'FromSoftware',
  },
  {
    name: 'Dark Souls 3',
    creator: 'FromSoftware',
  },
  {
    name: 'Baldur\'s Gate 3',
    creator: 'Larian Studios',
  },
  {
    name: 'The Witcher 3: Wild Hunt',
    creator: 'CD Projekt Red',
  },
  {
    name: 'FEZ',
    creator: 'Polytron',
  },
  {
    name: 'Frostpunk',
    creator: '11 bit studios',
  },
  {
    name: 'Besiege',
    creator: 'Landfall',
  },
  {
    name: 'Portal 2',
    creator: 'Valve',
  },
  {
    name: 'Terraria',
    creator: 'Re-Logic',
  },
  {
    name: 'Balatro',
    creator: 'LocalThunk',
  },
  {
    name: 'Slay the Spire',
    creator: 'Mega Crit Games',
  },
  {
    name: 'Satisfactory',
    creator: 'Coffee Stain Studios',
  },
  {
    name: 'There is no Game',
    creator: 'Kazuma Kondou',
  },
  {
    name: 'Papers, Please',
    creator: 'Lucas Pope',
  },
  {
    name: 'Undertale',
    creator: 'Toby Fox',
  },
  {
    name: 'Inscryption',
    creator: 'Daniel Mullins Games',
  },
  {
    name: 'Sekiro: Shadows Die Twice',
    creator: 'FromSoftware',
  },
  {
    name: 'Gorogoa',
    creator: 'Jason Roberts',
  },
  {
    name: 'It Takes Two',
    creator: 'Hazelight Studios',
  },
  {
    name: 'Desperados III',
    creator: 'Mimimi Games',
  },
  {
    name: 'What Remains of Edith Finch',
    creator: 'The Finch Team',
  },
  {
    name: 'Bastion',
    creator: 'Supergiant Games',
  },
  {
    name: 'Antichamber',
    creator: 'Alexander Bruce',
  },
  {
    name: 'Super Meat Boy',
    creator: 'Team Meat',
  },
  {
    name: 'The Stanley Parable',
    creator: 'The Stanley Parable Team',
  },
  {
    name: 'FAR: Lone Sails',
    creator: 'Okomotive',
  },
  {
    name: 'Machinarium',
    creator: 'Amanita Design',
  },
  {
    name: 'Die in the Dungeon',
    creator: 'ATICO',
  },
  {
    name: 'Risk of Rain',
    creator: 'Hopoo Games',
  },
  {
    name: 'Into the Breach',
    creator: 'Subset Games',
  },
  {
    name: 'Shogun Showdown',
    creator: 'Roboatino',
  },
  {
    name: 'Boomerang Fu',
    creator: 'Cranky Watermelon',
  },
  {
    name: 'SHENZHEN I/O',
    creator: 'Zachtronics',
  },
  {
    name: 'Opus Magnum',
    creator: 'Zachtronics',
  },
  {
    name: 'Last Call BBS',
    creator: 'Zachtronics',
  },
  {
    name: 'Hitman: Absolution',
    creator: 'IO Interactive',
  },
  {
    name: 'DmC: Devil May Cry',
    creator: 'Ninja Theory',
  },
  {
    name: 'dotAGE',
    creator: 'Michele Pirovano',
  },
  {
    name: 'Unrailed!',
    creator: 'Indoor Astronaut',
  },
  {
    name: 'World of Goo',
    creator: '2D Boy',
  },
  {
    name: 'Overcooked! 2',
    creator: 'Team17',
  },
  {
    name: '7 Billion Humans',
    creator: 'Tomorrow Corporation',
  },
  {
    name: 'UnEpic',
    creator: 'Unepic Games',
  },
  {
    name: 'Assassin\'s Creed 2',
    creator: 'Ubisoft',
  },
  {
    name: 'Aces & Adventures',
    creator: 'Triple.B.Titles',
  },
  {
    name: 'Storyteller',
    creator: 'Daniel Benmergui',
  },
  {
    name: 'Tom Clancy\'s Splinter Cell Blacklist',
    creator: 'Ubisoft',
  },
]

export const song = [
  {
    name: '陀飛輪',
    creator: '陳奕迅',
    lang: 'zh-Hant',
  },
  {
    name: '不用去猜',
    creator: 'Jony J',
    lang: 'zh-Hans',
  },
  {
    name: '知道',
    creator: '宋冬野',
    lang: 'zh-Hans',
  },
  {
    name: '山脚',
    creator: 'Jony J',
    lang: 'zh-Hans',
  },
  {
    name: '晚餐歌',
    creator: 'tuki.',
  },
  {
    name: '群青',
    creator: 'YOASOBI',
  },
  {
    name: 'たぶん',
    creator: 'YOASOBI',
  },
  {
    name: '博物館',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: 'Lemon',
    creator: '米津玄師',
  },
  {
    name: '說得簡單',
    creator: '脆樂團',
    lang: 'zh-Hant',
  },
  {
    name: '十年一刻',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '帶你飛',
    creator: '告五人',
    lang: 'zh-Hant',
  },
  {
    name: '唯一',
    creator: '告五人',
    lang: 'zh-Hant',
  },
  {
    name: '致姍姍來遲的你',
    creator: 'Asi & 林宥嘉',
    lang: 'zh-Hant',
  },
  {
    name: '藍眼睛',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: 'Ordinary Days',
    creator: 'milet',
  },
  {
    name: '空港曲',
    creator: '宋冬野',
    lang: 'zh-Hans',
  },
  {
    name: '梦遗少年',
    creator: '宋冬野',
    lang: 'zh-Hans',
  },
  {
    name: 'Mightnight Talk',
    creator: '幾田りら',
  },
  {
    name: '體面',
    creator: '于文文',
    lang: 'zh-Hant',
  },
  {
    name: 'Instagram',
    creator: 'DEAN',
  },
  {
    name: 'No Time to Die',
    creator: 'Billie Eilish',
  },
  {
    name: '想自由',
    creator: '林宥嘉',
    lang: 'zh-Hant',
  },
  {
    name: '耳朵',
    creator: '李荣浩',
    lang: 'zh-Hans',
  },
  {
    name: '大雨',
    creator: 'deca joins',
    lang: 'zh-Hant',
  },
  {
    name: 'idontwannabeyouanymore',
    creator: 'Billie Eilish',
  },
  {
    name: '烂俗的歌',
    creator: '汉堡黄',
    lang: 'zh-Hans',
  },
  {
    name: '乌鸦',
    creator: '汉堡黄',
    lang: 'zh-Hans',
  },
  {
    name: '頻率',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '喜歡寂寞',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '這天',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '被雨困住的城市',
    creator: '蘇打綠',
    lang: 'zh-Hant',
  },
  {
    name: '刚刚好',
    creator: '薛之谦',
    lang: 'zh-Hans',
  },
  {
    name: 'My Man',
    creator: 'Jony J',
    lang: 'zh-Hans',
  },
  {
    name: '前前前世',
    creator: 'RADWIMPS',
  },
  {
    name: 'Creep',
    creator: '蘇打綠',
  },
  {
    name: '有心論',
    creator: 'RADWIMPS',
  },
  {
    name: 'すずめ',
    creator: 'RADWIMPS',
  },
  {
    name: 'SPECIALZ',
    creator: 'King Gnu',
  },
  {
    name: '都是 Weather 你',
    creator: 'JOYCE 就以斯 & CAsPER',
    lang: 'zh-Hant',
  },
  {
    name: '百視達',
    creator: '黃玠瑋',
    lang: 'zh-Hant',
  },
  {
    name: '崇拜',
    creator: '薛之谦',
    lang: 'zh-Hans',
  },
  {
    name: 'Inside You',
    creator: 'milet',
  },
  {
    name: '打上花火',
    creator: 'DAOKO & 米津玄師',
  },
  {
    name: '易燃易爆炸',
    creator: '陈粒',
    lang: 'zh-Hans',
  },
  {
    name: '奇妙能力歌',
    creator: '陈粒',
    lang: 'zh-Hans',
  },
  {
    name: '路过人间',
    creator: '郁可唯',
    lang: 'zh-Hant',
  },
  {
    name: 'Encore un soir',
    creator: 'Céline Dion',
  },
  {
    name: 'masshiro',
    creator: '藤井風',
  },
  {
    name: 'I still',
    creator: 'milet',
  },
  {
    name: 'Les Champs-Élysées',
    creator: 'Joe Dassin',
  },
  {
    name: '黑暗的盡頭',
    creator: '脆樂團',
    lang: 'zh-Hant',
  },
  {
    name: '披星戴月的想你',
    creator: '告五人',
    lang: 'zh-Hant',
  },
  {
    name: '暧昧',
    creator: '薛之谦',
    lang: 'zh-Hans',
  },
  {
    name: 'Hello',
    creator: 'Adele',
  },
  {
    name: '走马',
    creator: '陈粒',
    lang: 'zh-Hans',
  },
  {
    name: '斑马,斑马',
    creator: '宋冬野',
    lang: 'zh-Hans',
  },
  {
    name: '遲到千年',
    creator: 'sodagreen',
    lang: 'zh-Hant',
  },
  {
    name: 'Normal',
    creator: 'Rouquine',
  },
]

export const media: Record<MediaType, MediaRecord[]> = {
  anime,
  drama,
  movie,
  game,
  song,
  book,
}
