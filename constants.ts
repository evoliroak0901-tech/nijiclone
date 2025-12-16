
import { AspectRatioOption, ModelOption, StyleOption, PoseOption } from './types';

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: '縦長', ratio: '3:4', displayRatio: '(3:4)', iconClass: 'w-3 h-4' },
  { label: '風景画', ratio: '4:3', displayRatio: '(4:3)', iconClass: 'w-4 h-3' }, 
  { label: 'スマホ壁紙', ratio: '9:16', displayRatio: '(9:16)', iconClass: 'w-[9px] h-4' },
  { label: '正方形', ratio: '1:1', displayRatio: '(1:1)', iconClass: 'w-4 h-4' },
  { label: 'ポートレート', ratio: '3:4', displayRatio: '(3:4)', iconClass: 'w-3 h-4' },
  { label: '壁紙', ratio: '16:9', displayRatio: '(16:9)', iconClass: 'w-4 h-[9px]' },
];

export const STYLES: StyleOption[] = [
  { id: 'default', name: 'デフォルト', image: 'https://picsum.photos/seed/anime1/100/100', description: 'Standard Niji Style' },
  { id: 'expressive', name: '迫力', image: 'https://picsum.photos/seed/anime_exp/100/100', description: 'Bold and distinct' },
  { id: 'cute', name: 'キュート', image: 'https://picsum.photos/seed/anime_cute/100/100', description: 'Pastel and cute' },
  { id: 'scenic', name: '風景', image: 'https://picsum.photos/seed/anime_scenic/100/100', description: 'Background focus' },
  { id: 'manga', name: 'マンガ', image: 'https://picsum.photos/seed/anime_manga/100/100', description: 'Monochrome style' },
  { id: 'raw', name: 'RAW', image: 'https://picsum.photos/seed/anime_raw/100/100', description: 'Unfiltered' },
];

export const MODELS: ModelOption[] = [
  { 
    id: 'niji-v6', 
    name: 'にじジャーニー V6', 
    version: 'V6', 
    image: 'https://picsum.photos/seed/v6/100/100',
    description: '最新モデル。線画が繊細で、光と影の表現がリッチ。書き込み量が多く、現代的なアニメ・イラスト調に最適。'
  },
  { 
    id: 'niji-v5', 
    name: 'にじジャーニー V5', 
    version: 'V5', 
    image: 'https://picsum.photos/seed/v5/100/100',
    description: '以前の標準モデル。V6より少し柔らかい表現で、典型的な「アニメ塗り」が得意。シンプルな絵柄を好む場合に推奨。'
  },
  { 
    id: 'mid-v6', 
    name: 'Midjourney V6', 
    version: 'V6', 
    image: 'https://picsum.photos/seed/mjv6/100/100',
    description: 'リアル志向。3Dレンダリング、厚塗り、実写のような質感。背景美術やコンセプトアート向け。'
  },
];

export const POSES: PoseOption[] = [
  { id: 'portrait', label: '正面', prompt: 'front view, looking at viewer, portrait', icon: '👤' },
  { id: 'dynamic', label: '躍動感', prompt: 'dynamic angle, action pose, foreshortening, motion lines', icon: '⚡️' },
  { id: 'floating', label: '浮遊感', prompt: 'floating in air, weightless, flowing hair, dreamy atmosphere', icon: '🍃' },
  { id: 'close_up', label: '顔アップ', prompt: 'extreme close up, face focus, detailed eyes, emotional expression', icon: '👀' },
  { id: 'profile', label: '横顔', prompt: 'side profile, looking away, emotional atmosphere', icon: '🌓' },
  { id: 'back', label: '後ろ姿', prompt: 'view from behind, back view, atmospheric', icon: '🔙' },
  { id: 'sitting', label: '座り', prompt: 'sitting, relaxed pose, comfortable atmosphere', icon: '🪑' },
  { id: 'low_angle', label: '見下ろし', prompt: 'view from below, low angle, imposing, tall', icon: '📐' },
  { id: 'looking_back', label: '見返り', prompt: 'looking back, over shoulder, dynamic composition', icon: '↩️' },
  { id: 'scenery_focus', label: '風景重視', prompt: 'wide angle, tiny character, massive landscape, atmospheric perspective', icon: '🏞️' },
];

// Label mapping for categories
export const CHARACTER_CATEGORY_LABELS: Record<string, string> = {
  genders: '性別',
  skinTones: '肌の色',
  hairColors: '髪色',
  hairStyles: '髪型',
  eyeColors: '目の色',
  expressions: '表情',
  outfits: '服装',
  accessories: 'アクセサリー',
};

// Character Options with Japanese Labels and English Values (for prompt)
// Added 'color' property for visual feedback
export const CHARACTER_OPTS = {
  genders: [
    { label: '女性', value: 'Girl' },
    { label: '男性', value: 'Boy' },
    { label: '中性的', value: 'Androgynous' },
    { label: '不明', value: 'Unknown gender' }
  ],
  skinTones: [
    { label: '色白', value: 'Pale skin', color: '#fff0e5' },
    { label: '普通', value: 'Fair skin', color: '#ffe4c4' },
    { label: '小麦色', value: 'Tan skin', color: '#eebb99' },
    { label: '褐色', value: 'Dark skin', color: '#8d5524' },
    { label: '異色肌(青)', value: 'Blue skin', color: '#aaddff' },
    { label: '異色肌(緑)', value: 'Green skin', color: '#aaffaa' },
  ],
  hairColors: [
    { label: '黒', value: 'Black', color: '#1a1a1a' },
    { label: '白', value: 'White', color: '#f5f5f5' },
    { label: '金', value: 'Blonde', color: '#ebd16e' },
    { label: '銀', value: 'Silver', color: '#c0c0c0' },
    { label: '茶', value: 'Brown', color: '#5d4037' },
    { label: '赤', value: 'Red', color: '#e53935' },
    { label: 'ピンク', value: 'Pink', color: '#f48fb1' },
    { label: '青', value: 'Blue', color: '#2196f3' },
    { label: '水色', value: 'Light Blue', color: '#80d8ff' },
    { label: '緑', value: 'Green', color: '#4caf50' },
    { label: '紫', value: 'Purple', color: '#9c27b0' },
    { label: '橙', value: 'Orange', color: '#ff9800' },
    { label: 'グラデ', value: 'Gradient', color: 'linear-gradient(45deg, #f48fb1, #80d8ff)' }
  ],
  hairStyles: [
    { label: 'ロング', value: 'Long flowing' },
    { label: 'ショート', value: 'Short cut' },
    { label: 'ボブ', value: 'Short bob' },
    { label: 'ツインテ', value: 'Twintails' },
    { label: 'ポニテ', value: 'Ponytail' },
    { label: '三つ編み', value: 'Braided' },
    { label: 'お団子', value: 'Hair buns' },
    { label: '無造作', value: 'Messy' },
    { label: 'ストレート', value: 'Straight' },
    { label: 'ウェーブ', value: 'Wavy' },
    { label: '姫カット', value: 'Hime cut' },
    { label: 'アホ毛', value: 'Ahoge' }
  ],
  eyeColors: [
    { label: '青', value: 'Blue', color: '#2196f3' },
    { label: '赤', value: 'Red', color: '#f44336' },
    { label: '緑', value: 'Green', color: '#4caf50' },
    { label: '黄', value: 'Yellow', color: '#ffeb3b' },
    { label: '金', value: 'Gold', color: '#ffd700' },
    { label: '紫', value: 'Purple', color: '#9c27b0' },
    { label: '黒', value: 'Black', color: '#212121' },
    { label: '茶', value: 'Brown', color: '#795548' },
    { label: 'オッドアイ', value: 'Heterochromia', color: 'linear-gradient(90deg, #2196f3, #ffd700)' },
    { label: 'ハート目', value: 'Heart-shaped pupils' },
    { label: '星目', value: 'Star-shaped pupils' }
  ],
  expressions: [
    { label: '笑顔', value: 'Smiling' },
    { label: '怒り', value: 'Angry' },
    { label: '泣き', value: 'Crying' },
    { label: '真剣', value: 'Serious' },
    { label: '驚き', value: 'Surprised' },
    { label: '照れ', value: 'Blushing' },
    { label: 'ジト目', value: 'Scornful eyes' },
    { label: 'ウィンク', value: 'Winking' },
    { label: '眠そう', value: 'Sleepy' },
    { label: '無表情', value: 'Expressionless' }
  ],
  outfits: [
    { label: '制服', value: 'School Uniform' },
    { label: 'セーラー服', value: 'Sailor Suit' },
    { label: 'ブレザー', value: 'Blazer Uniform' },
    { label: '私服(パーカー)', value: 'Casual Hoodie' },
    { label: 'ストリート', value: 'Streetwear' },
    { label: 'ファンタジー鎧', value: 'Fantasy Armor' },
    { label: '魔法使い', value: 'Mage Robe' },
    { label: '着物', value: 'Kimono' },
    { label: '浴衣', value: 'Yukata' },
    { label: 'サイバーパンク', value: 'Cyberpunk Techwear' },
    { label: 'メイド服', value: 'Maid Outfit' },
    { label: 'ゴスロリ', value: 'Gothic Lolita' },
    { label: 'ドレス', value: 'Princess Dress' },
    { label: '水着', value: 'Swimsuit' },
    { label: 'スポーツウェア', value: 'Sportswear' },
    { label: 'スーツ', value: 'Formal Suit' },
    { label: 'パジャマ', value: 'Pajamas' }
  ],
  accessories: [
    { label: '猫耳', value: 'Cat Ears' },
    { label: '犬耳', value: 'Dog Ears' },
    { label: 'うさ耳', value: 'Bunny Ears' },
    { label: 'エルフ耳', value: 'Elf Ears' },
    { label: '角', value: 'Horns' },
    { label: '天使の輪', value: 'Halo' },
    { label: '悪魔の翼', value: 'Demon Wings' },
    { label: 'メガネ', value: 'Glasses' },
    { label: 'サングラス', value: 'Sunglasses' },
    { label: '眼帯', value: 'Eyepatch' },
    { label: 'ヘッドホン', value: 'Headphones' },
    { label: 'リボン', value: 'Ribbon' },
    { label: 'マスク', value: 'Mask' },
    { label: '絆創膏', value: 'Bandage on face' },
    { label: 'チョーカー', value: 'Choker' },
    { label: '帽子', value: 'Hat' }
  ],
};
