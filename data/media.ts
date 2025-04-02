export type MediaType = 'anime' | 'book' | 'movie' | 'drama' | 'game'
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
    date: '2007',
  },
  {
    name: '葬送のフリーレン',
    creator: '山田鐘人',
    date: '2018',
  },
  {
    name: 'ノーゲーム・ノーライフ No Game No Life',
    creator: '榎宮祐',
    date: '2014',
  },
  {
    name: 'Cyberpunk: Edgerunners',
    creator: 'CD Projekt Red',
    date: '2022',
  },
  {
    name: 'Fate/Zero',
    creator: '虚淵玄',
    date: '2011',
  },
  {
    name: '咒術廻戦',
    creator: '芥見下々',
    date: '2018',
  },
  {
    name: 'ID:INVADED イド：インヴェイデッド',
    creator: '舞城王太郎',
    date: '2020',
  },
  {
    name: 'Arcane',
    creator: 'Riot Games',
    date: '2021',
  },
  {
    name: 'デス・パレード Death Parade',
    creator: '立川讓',
    date: '2015',
  },
  {
    name: '青春ブタ野郎シリーズ',
    creator: '鴨志田一',
    date: '2013',
  },
  {
    name: '食戟のソーマ',
    creator: '附田祐斗',
    date: '2015',
  },
  {
    name: '血界戦線',
    creator: '内藤泰弘',
    date: '2014',
  },
  {
    name: 'チェンソーマン ChainSaw Man',
    creator: '藤本タツキ',
    date: '2018',
  },
  {
    name: '進撃の巨人',
    creator: '諫山創',
    date: '2013',
  },
  {
    name: 'デュラララ!!',
    creator: '成田良悟',
    date: '2010',
  },
  {
    name: '鬼滅の刃',
    creator: '吾峠呼世晴',
    date: '2016',
  },
  {
    name: 'ブルーピリオド Blue Period',
    creator: '山口飛翔',
    date: '2021',
  },
  {
    name: 'ヴァイオレット・エヴァーガーデン Violet Evergarden',
    creator: '暁佳奈',
    date: '2015',
  },
  {
    name: '寄生獣',
    creator: '岩明均',
    date: '2010',
  },
  {
    name: 'PSYCHO-PASS サイコパス',
    creator: '虚淵玄',
    date: '2012',
  },
  {
    name: 'Steins;Gate',
    creator: '林直孝',
    date: '2009',
  },
  {
    name: 'ダンダダン Dan Da Dan',
    creator: '龍幸伸',
    date: '2018',
  },
  {
    name: 'やはり俺の青春ラブコメはまちがっている',
    creator: '渡航',
    date: '2013',
  },
  {
    name: '賭ケグルイ',
    creator: '河本焰',
    date: '2014',
  },
  {
    name: 'ノラガミ 野良神',
    creator: 'あだちとか',
    date: '2014',
  },
  {
    name: '暗殺教室',
    creator: '松井優征',
    date: '2012',
  },
  {
    name: 'Re:ゼロから始める異世界生活',
    creator: '長月達平',
    date: '2014',
  },
  {
    name: 'かぐや様は告らせたい',
    creator: '赤坂アカ',
    date: '2015',
  },
  {
    name: 'ソードアート・オンライン Sword Art Online',
    creator: '川原礫',
    date: '2012',
  },
  {
    name: '一週間フレンズ',
    creator: '葉月抹茶',
    date: '2014',
  },
  {
    name: 'SPY x FAMILY',
    creator: '遠藤達哉',
    date: '2021',
  },
  {
    name: '東京喰種',
    creator: '石田スイ',
    date: '2014',
  },
  {
    name: '僕のヒーローアカデミア',
    creator: '堀越耕平',
    date: '2014',
  },
  {
    name: 'ワンパンマン One-Punch Man',
    creator: 'ONE',
    date: '2015',
  },
  {
    name: '時光代理人',
    creator: '李豪凌',
    date: '2021',
    lang: 'zh-cn',
  },
  {
    name: '怪獣8号',
    creator: '松本直也',
    date: '2024',
  },
  {
    name: '虚構推理',
    creator: '城平京',
    date: '2020',
  },
  {
    name: '富豪刑事 Balance:UNLIMITED',
    creator: '筒井康隆',
    date: '2020',
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
    name: 'The Pathless Path',
    creator: 'Paul Millerd',
  },
  {
    name: 'Outliers',
    creator: 'Malcolm Gladwel',
  },
  {
    name: 'Working in Public',
    creator: 'Nadia Eghbal',
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
    date: '2009',
  },
  {
    name: '君の名は。',
    creator: '新海誠',
    date: '2016',
  },
  {
    name: 'The Dark Knight',
    creator: 'Christopher Nolan',
    date: '2008',
  },
  {
    name: 'Inception',
    creator: 'Christopher Nolan',
    date: '2010',
  },
  {
    name: 'Interstellar',
    creator: 'Christopher Nolan',
    date: '2014',
  },
  {
    name: 'Tenet',
    creator: 'Christopher Nolan',
    date: '2020',
  },
  {
    name: 'Dune',
    creator: 'Denis Villeneuve',
    date: '2021',
  },
  {
    name: 'No Time to Die',
    creator: 'Cary Joji Fukunaga',
    date: '2021',
  },
  {
    name: 'Spider-Man: Across the Spider-Verse',
    creator: 'Joaquim Santos, Kemp Powers, Justin Thompson',
    date: '2023',
  },
  {
    name: 'Everything Everywhere All at Once',
    creator: 'The Daniels',
    date: '2022',
  },
  {
    name: 'The Imitation Game',
    creator: 'Morten Tyldum',
    date: '2014',
  },
  {
    name: 'HER',
    creator: 'Spike Jonze',
    date: '2013',
  },
  {
    name: 'The King\'s Speech',
    creator: 'Tom Hooper',
    date: '2010',
  },
  {
    name: 'The Truman Show',
    creator: 'Peter Weir',
    date: '1998',
  },
  {
    name: 'The Martain',
    creator: 'Ridley Scott',
    date: '2015',
  },
  {
    name: 'PERFECT DAYS',
    creator: 'Wim Wenders',
    date: '2024',
  },
  {
    name: 'Joker',
    creator: 'Todd Phillips',
    date: '2019',
  },
  {
    name: 'One Day',
    creator: 'Lenny Abrahamson',
    date: '2011',
  },
  {
    name: 'Anonymous',
    creator: 'Akan Satayev',
    date: '2016',
  },
  {
    name: '好东西',
    creator: '邵艺辉',
    date: '2024',
  },
]

export const drama: MediaRecord[] = [
  {
    name: 'グランメゾン東京 La Grande Maison Tokyo',
    date: '2022',
  },
  {
    name: 'アンナチュラル Unnatural',
    date: '2018',
  },
  {
    name: 'リーガル・ハイ LEGAL HIGH',
    date: '2012',
  },
  {
    name: '今際の国のアリス Alice in Borderland',
    date: '2020',
  },
  {
    name: '半沢直樹',
    date: '2013',
  },
  {
    name: 'Silo',
    date: '2024',
  },
  {
    name: 'The Last of Us',
    date: '2023',
  },
  {
    name: 'Sherlock',
    date: '2010',
  },
  {
    name: 'You',
    date: '2018',
  },
  {
    name: 'The Queen\'s Gambit',
    date: '2020',
  },
  {
    name: 'コンフィデンスマンJP',
    date: '2013',
  },
  {
    name: 'One Piece',
    date: '2023',
  },
  {
    name: 'Three Body',
    date: '2023',
  },
  {
    name: 'Wednesday',
    date: '2023',
  },
  {
    name: 'アンチヒーロー Anti Hero',
    date: '2023',
  },
]

export const game: MediaRecord[] = [
  {
    name: 'Factorio',
    creator: 'Wube Software',
    date: '2013',
  },
  {
    name: 'Bloodborne',
    creator: 'FromSoftware',
    date: '2015',
  },
  {
    name: 'ELDEN RING',
    creator: 'FromSoftware',
    date: '2022',
  },
  {
    name: 'Dark Souls 3',
    creator: 'FromSoftware',
    date: '2016',
  },
  {
    name: 'Baldur\'s Gate 3',
    creator: 'Larian Studios',
    date: '2023',
  },
  {
    name: 'The Witcher 3: Wild Hunt',
    creator: 'CD Projekt Red',
    date: '2015',
  },
  {
    name: 'FEZ',
    creator: 'Polytron',
    date: '2012',
  },
  {
    name: 'Frostpunk',
    creator: '11 bit studios',
    date: '2018',
  },
  {
    name: 'Besiege',
    creator: 'Landfall',
    date: '2014',
  },
  {
    name: 'Portal 2',
    creator: 'Valve',
    date: '2011',
  },
  {
    name: 'Terraria',
    creator: 'Re-Logic',
    date: '2011',
  },
  {
    name: 'Balatro',
    creator: 'LocalThunk',
    date: '2024',
  },
  {
    name: 'Slay the Spire',
    creator: 'Mega Crit Games',
    date: '2017',
  },
  {
    name: 'Satisfactory',
    creator: 'Coffee Stain Studios',
    date: '2016',
  },
  {
    name: 'There is no Game',
    creator: 'Kazuma Kondou',
    date: '2014',
  },
  {
    name: 'Papers, Please',
    creator: 'Lucas Pope',
    date: '2013',
  },
  {
    name: 'Undertale',
    creator: 'Toby Fox',
    date: '2015',
  },
  {
    name: 'Inscryption',
    creator: 'Daniel Mullins Games',
    date: '2021',
  },
  {
    name: 'Sekiro: Shadows Die Twice',
    creator: 'FromSoftware',
    date: '2019',
  },
  {
    name: 'Gorogoa',
    creator: 'Jason Roberts',
    date: '2017',
  },
  {
    name: 'It Takes Two',
    creator: 'Hazelight Studios',
    date: '2021',
  },
  {
    name: 'Desperados III',
    creator: 'Mimimi Games',
    date: '2020',
  },
  {
    name: 'What Remains of Edith Finch',
    creator: 'The Finch Team',
    date: '2016',
  },
  {
    name: 'Bastion',
    creator: 'Supergiant Games',
    date: '2011',
  },
  {
    name: 'Antichamber',
    creator: 'Alexander Bruce',
    date: '2013',
  },
  {
    name: 'Super Meat Boy',
    creator: 'Team Meat',
    date: '2010',
  },
  {
    name: 'The Stanley Parable',
    creator: 'The Stanley Parable Team',
    date: '2013',
  },
  {
    name: 'FAR: Lone Sails',
    creator: 'Okomotive',
    date: '2018',
  },
  {
    name: 'Machinarium',
    creator: 'Amanita Design',
    date: '2009',
  },
  {
    name: 'Die in the Dungeon',
    creator: 'ATICO',
    date: '2025',
  },
  {
    name: 'Risk of Rain',
    creator: 'Hopoo Games',
    date: '2013',
  },
  {
    name: 'Into the Breach',
    creator: 'Subset Games',
    date: '2018',
  },
  {
    name: 'Shogun Showdown',
    creator: 'Roboatino',
    date: '2024',
  },
  {
    name: 'Boomerang Fu',
    creator: 'Cranky Watermelon',
    date: '2020',
  },
  {
    name: 'SHENZHEN I/O',
    creator: 'Zachtronics',
    date: '2016',
  },
  {
    name: 'Opus Magnum',
    creator: 'Zachtronics',
    date: '2016',
  },
  {
    name: 'Last Call BBS',
    creator: 'Zachtronics',
    date: '2022',
  },
  {
    name: 'Hitman: Absolution',
    creator: 'IO Interactive',
    date: '2012',
  },
  {
    name: 'DmC: Devil May Cry',
    creator: 'Ninja Theory',
    date: '2013',
  },
  {
    name: 'dotAGE',
    creator: 'Michele Pirovano',
    date: '2023',
  },
  {
    name: 'Unrailed!',
    creator: 'Indoor Astronaut',
    date: '2020',
  },
  {
    name: 'World of Goo',
    creator: '2D Boy',
    date: '2008',
  },
  {
    name: 'Overcooked! 2',
    creator: 'Team17',
    date: '2018',
  },
  {
    name: '7 Billion Humans',
    creator: 'Tomorrow Corporation',
    date: '2018',
  },
  {
    name: 'UnEpic',
    creator: 'Unepic Games',
    date: '2014',
  },
  {
    name: 'Assassin\'s Creed 2',
    creator: 'Ubisoft',
    date: '2009',
  },
  {
    name: 'Aces & Adventures',
    creator: 'Triple.B.Titles',
    date: '2023',
  },
  {
    name: 'Storyteller',
    creator: 'Daniel Benmergui',
    date: '2023',
  },
  {
    name: 'Tom Clancy\'s Splinter Cell Blacklist',
    creator: 'Ubisoft',
    date: '2013',
  },
]

export const media: Record<MediaType, MediaRecord[]> = {
  anime,
  drama,
  movie,
  game,
  book,
}
