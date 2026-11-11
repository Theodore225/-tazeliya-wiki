export type ChronicleParagraph = { label?: string; text: string };

export type ChronicleCharacter = {
  id: string;
  name: string;
  sortKey: string;
  category: "special";
  paragraphs: ChronicleParagraph[];
};

export const characterCategories = [
  { id: "special", name: "特级冒险者特辑", note: "记录那些传说中的冒险者——看看其中有没有你所崇拜之人！" },
  { id: "stars", name: "明星冒险者合辑", note: "新的名字仍在等待被大陆记住。" },
] as const;

export const chronicleCharacters: ChronicleCharacter[] = [
  {
    id: "pure-white-string", name: "纯白之弦", sortKey: "chunbai", category: "special",
    paragraphs: [
      { label: "介绍", text: "传奇吟游诗人，每到一处便为人们带来和平与正义；高塔倾覆，希望重临。慈悲和善犹如静水流深，目光却灼灼似旭日，令一切邪恶阴谋无所遁形。当诗人拨动琴弦，也许连神明都会驻足聆听。" },
      { label: "备注", text: "在故事的末尾，吟游诗人与民间传说编纂者们总会提醒读者：在千年前的文献中，对其的记述便模糊而富有文学色彩，真实性有待考究。——故事虽好，切勿沉迷。" },
    ],
  },
  {
    id: "wicked-snow-awakened", name: "恶雪觉者", sortKey: "exue", category: "special",
    paragraphs: [
      { label: "介绍", text: "早在新纪前1400年就已声名鹊起的传奇红龙冒险家，其足迹早在冒险者协会建立之前，便已踏遍世间每一个角落——挖掘宝藏、追寻繁星，也一并把传奇与野火洒向整个世界！漫长黑夜，星辰匿行，烈火会在太阳重归前照亮半边天际；迷雾障烟，困顿难行，火星亦将照出坦然前路！他所行之路雪霁消融、欢歌永不止息，无人知晓他的下一个落脚点，只知远方天际升腾出一抹异样的赤红，便是他的又一次不告而来。" },
      { text: "【恶雪觉者】参与过那场冒险协会建立的盛会，却在之后突兀消失……他的旅途如同断章般戛然而止。但故事仍在传唱，野火仍在燃烧——直到世界尽头！" },
      { label: "备注", text: "井水清冽，行者不渴。" },
    ],
  },
  {
    id: "gold-red-resolve", name: "决意之金红", sortKey: "jueyi", category: "special",
    paragraphs: [
      { label: "介绍", text: "或许你们更熟悉她的另一个名字——『裁决者』，在成为『裁决者』之前『决意之金红』年纪轻轻便已成为特级冒险者中毫无争议的一人！虽其常独来独往，但其能力却丝毫不输当时有名的冒险队伍与其他同为特级冒险者之人。" },
      { text: "她强大、坚强而勇敢、敢为不公平之事打抱不平，决心为守护弱小而战！那颗金子般的心曾指引无数人方向！" },
      { label: "备注", text: "比起拯救世界她更想守护重要之物——为此不断向前，这份决意也造就她的传奇！" },
    ],
  },
  {
    id: "iridescent-mirage", name: "霓彩泡影", sortKey: "nicai", category: "special",
    paragraphs: [
      { label: "介绍", text: "她曾言家人便是她变得强大的动力，她机敏聪慧、善良热情、待人温和、坚守原则并拥有一颗宝石般美丽的心灵与同样美丽的外表，然而最最最令人印象深刻的毫无疑问是她那出神入化的水元素魔法使用！无数晶莹泡沫自她指尖升起，在阳光与月色下折映出的斑斓光辉如梦似幻——毫无意外地她便是水之宠儿，海洋之星！在千年之前最耀眼的辉煌人鱼！" },
      { label: "备注", text: "在那漫天泡沫弥漫之间，恍惚间你似乎听见了海浪的声音。" },
    ],
  },
  {
    id: "star-traveler", name: "群星旅者", sortKey: "qunxing", category: "special",
    paragraphs: [
      { label: "介绍", text: "新纪年前1500年便出现的存在——冒险家公会创始人之一！世间拥有无与伦比智慧与能力之智者，精灵之森内媲美精灵王之精灵！" },
      { text: "她曾踏遍大陆，历经无数冒险，创造多种术法仍不知疲惫向前！在她的眼中从无不知晓之物，无数研究手记令现代多少人梦寐以求狂热追随！" },
      { text: "虽『群星旅者』已销声匿迹不知所踪，但其求知精神却仍留存于大陆人心中，其智慧依旧存于世间！" },
      { label: "备注", text: "冷静、强大、神秘——哪怕她只是站在那里便足以让无数冒险者热血沸腾！" },
    ],
  },
].sort((a, b) => a.sortKey.localeCompare(b.sortKey, "en"));
