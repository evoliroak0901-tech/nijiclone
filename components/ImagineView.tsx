import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Ruler,
  SlidersHorizontal,
  Wand2,
  X,
  Plus,
  ChevronRight,
  Ban,
  User,
  Move,
  Save,
  Trash2,
  Dice5,
  ArrowLeft,
  PenTool,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { ASPECT_RATIOS, MODELS, STYLES, POSES, CHARACTER_OPTS, CHARACTER_CATEGORY_LABELS } from '../constants';
import { generateImage } from '../services/geminiService';
import { GeneratedImage, PoseOption, CharacterAttributes, SavedCharacter, StyleCoordinates } from '../types';

interface ImagineViewProps {
  onImageGenerated: (image: GeneratedImage) => void;
  initialPrompt?: string;
}

export const ImagineView: React.FC<ImagineViewProps> = ({ onImageGenerated, initialPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // New State for Features
  const [showStyleGraph, setShowStyleGraph] = useState(false);
  const [styleCoords, setStyleCoords] = useState<StyleCoordinates>({ x: 0, y: 0 }); // X: Cute/Cool, Y: Simple/Detail

  const [showPoseSelector, setShowPoseSelector] = useState(false);
  const [selectedPose, setSelectedPose] = useState<PoseOption | null>(null);

  const [showCharBuilder, setShowCharBuilder] = useState(false);
  const [character, setCharacter] = useState<CharacterAttributes>({
    gender: '', skinTone: '', hairColor: '', eyeColor: '', hairStyle: '', expression: '', outfit: '', accessory: ''
  });
  const [savedCharacters, setSavedCharacters] = useState<SavedCharacter[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[2]);
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [stylizeLevel, setStylizeLevel] = useState(50);
  const [activeModel, setActiveModel] = useState(MODELS[0].id);
  const [useHandDrawnLines, setUseHandDrawnLines] = useState(false);

  // Image Reference State
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved characters on mount
  useEffect(() => {
    const saved = localStorage.getItem('niji_saved_characters');
    if (saved) {
      try {
        setSavedCharacters(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load characters", e);
      }
    }
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleGenerate = async () => {
    if (isGenerating) return;

    // Ensure there is *some* prompt or features selected
    const hasChar = Object.values(character).some(v => v);
    if (!prompt.trim() && !hasChar && !selectedPose && !referenceImage) {
      alert("プロンプトを入力するか、画像/キャラクター/ポーズを選択してください");
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(
        prompt,
        selectedRatio.ratio,
        selectedStyle,
        negativePrompt,
        styleCoords,
        selectedPose || undefined,
        hasChar ? character : undefined,
        activeModel,
        useHandDrawnLines,
        referenceImage || undefined
      );

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt || "Character Generation",
        aspectRatio: selectedRatio.displayRatio,
        timestamp: Date.now()
      };
      onImageGenerated(newImage);
    } catch (error: any) {
      const message = error.message || "画像の生成に失敗しました。もう一度お試しください。";
      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Character Builder Functions ---
  const randomizeCharacter = () => {
    const randomPick = (arr: { value: string, label: string }[]) => arr[Math.floor(Math.random() * arr.length)].value;

    setCharacter({
      gender: randomPick(CHARACTER_OPTS.genders),
      skinTone: randomPick(CHARACTER_OPTS.skinTones),
      hairColor: randomPick(CHARACTER_OPTS.hairColors),
      eyeColor: randomPick(CHARACTER_OPTS.eyeColors),
      hairStyle: randomPick(CHARACTER_OPTS.hairStyles),
      expression: randomPick(CHARACTER_OPTS.expressions),
      outfit: randomPick(CHARACTER_OPTS.outfits),
      accessory: randomPick(CHARACTER_OPTS.accessories),
    });
  };

  const saveCharacter = () => {
    const name = window.prompt("キャラクター名を入力してください", "新しいキャラクター");
    if (!name) return;
    const newChar: SavedCharacter = { id: Date.now().toString(), name, attributes: { ...character } };
    const updated = [...savedCharacters, newChar];
    setSavedCharacters(updated);
    localStorage.setItem('niji_saved_characters', JSON.stringify(updated));
  };

  const loadCharacter = (saved: SavedCharacter) => {
    setCharacter(saved.attributes);
  };

  const deleteCharacter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("このキャラクターを削除しますか？");
    if (!confirmDelete) return;

    const updated = savedCharacters.filter(c => c.id !== id);
    setSavedCharacters(updated);
    localStorage.setItem('niji_saved_characters', JSON.stringify(updated));
  };

  // --- Style Graph Logic ---
  const handleGraphClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = Math.round(((x / rect.width) * 200) - 100);
    const normY = Math.round((1 - (y / rect.height)) * 200 - 100);

    setStyleCoords({ x: Math.max(-100, Math.min(100, normX)), y: Math.max(-100, Math.min(100, normY)) });
  };

  // Get current active model object for description
  const activeModelObj = MODELS.find(m => m.id === activeModel);

  return (
    <div className="flex flex-col h-full bg-[#f8f8f8] text-gray-900 rounded-t-3xl overflow-hidden shadow-2xl relative">

      {/* Draggable Handle Indicator */}
      <div className="w-full flex justify-center pt-3 pb-1 bg-white">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Input Area */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="relative">
          {/* Reference Image Preview Overlay */}
          {referenceImage && (
            <div className="absolute top-2 left-2 z-10">
              <div className="relative group">
                <img src={referenceImage} alt="Ref" className="w-16 h-16 object-cover rounded-lg border-2 border-indigo-500 bg-white" />
                <button
                  onClick={() => setReferenceImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white text-center py-0.5 rounded-b-lg">
                  画風を参照中
                </div>
              </div>
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={referenceImage ? "この画風で何を描きますか？ (例: 宇宙を泳ぐクジラ)..." : "プロンプトを入力 (例: 公園で遊ぶ猫)..."}
            // Adjust padding if image is present
            className={`w-full min-h-[80px] p-3 text-base bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none placeholder-gray-400 ${referenceImage ? 'pl-20' : ''}`}
          />

          <div className="absolute bottom-3 right-3 flex gap-2">
            {/* Image Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full transition-colors ${referenceImage ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}
              title="画風・タッチを参照する画像をアップロード"
            >
              <ImageIcon size={20} />
            </button>

            {prompt && (
              <button
                onClick={() => setPrompt('')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Feature Toolbar */}
        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setShowCharBuilder(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${Object.values(character).some(v => v) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <User size={14} /> キャラクター
          </button>
          <button
            onClick={() => setShowPoseSelector(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${selectedPose ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <Move size={14} /> ポーズ/構図
          </button>
          <button
            onClick={() => setShowStyleGraph(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${styleCoords.x !== 0 || styleCoords.y !== 0 ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <SlidersHorizontal size={14} /> スタイル調整
          </button>
        </div>

        {/* Generate Button Row */}
        <div className="flex items-center justify-between mt-2 mb-2">
          <div className="flex items-center gap-4 text-gray-400">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`transition-colors ${showAdvanced ? 'text-indigo-600' : 'text-gray-700'}`}
            >
              <SlidersHorizontal size={22} />
            </button>
            <button className="text-gray-700"><Palette size={22} /></button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`
                h-10 px-6 flex items-center justify-center rounded-full transition-all shadow-md font-bold text-sm
                ${isGenerating
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg active:scale-95'
              }
            `}
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>生成する <Wand2 size={16} className="ml-2" /></>
            )}
          </button>
        </div>
      </div>

      {/* Settings Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-gray-50">

        {/* Advanced: Negative Prompt */}
        {showAdvanced && (
          <div className="py-4 bg-indigo-50 mb-3 px-4 border-l-4 border-indigo-500 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2">
              <Ban size={16} className="text-indigo-900" />
              <h3 className="font-bold text-indigo-900 text-sm">ネガティブプロンプト</h3>
            </div>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="除外したい要素 (例: 文字, 低画質)..."
              className="w-full min-h-[50px] p-2 text-base bg-white rounded-lg border border-indigo-200 focus:outline-none"
            />
          </div>
        )}

        {/* Aspect Ratio */}
        <div className="py-4 bg-white mb-3 px-4">
          <div className="flex items-center gap-2 mb-4">
            <Ruler size={18} className="text-gray-800" />
            <h3 className="font-bold text-gray-800 text-sm">アスペクト比</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {ASPECT_RATIOS.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRatio(option)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-lg transition-all
                  ${selectedRatio.displayRatio === option.displayRatio
                    ? 'bg-gray-800 text-white shadow-lg transform scale-105'
                    : 'bg-transparent text-gray-400 hover:bg-gray-100'
                  }
                `}
              >
                <div className={`border-2 mb-2 ${selectedRatio.displayRatio === option.displayRatio ? 'border-white' : 'border-gray-300'} rounded-sm ${option.iconClass}`}></div>
                <span className="text-xs font-bold">{option.label}</span>
                <span className={`text-[10px] ${selectedRatio.displayRatio === option.displayRatio ? 'text-gray-300' : 'text-gray-400'}`}>
                  {option.displayRatio}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="py-4 bg-white mb-3 px-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-gray-800" />
              <h3 className="font-bold text-gray-800 text-sm">スタイル</h3>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`flex-shrink-0 relative w-24 h-32 rounded-lg overflow-hidden border-2 transition-all ${selectedStyle === style.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent'
                  }`}
              >
                <img src={style.image} alt={style.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                  <span className="text-white text-xs font-bold text-center w-full">{style.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stylize Strength & Line Quality */}
        <div className="py-4 bg-white mb-3 px-4">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal size={18} className="text-gray-800" />
            <h3 className="font-bold text-gray-800 text-sm">スタイライズ設定</h3>
          </div>

          <div className="relative h-12 px-2 mb-6">
            <h4 className="text-xs text-gray-500 font-bold mb-2">スタイライズ強度</h4>
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2 mt-3"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-gray-800 rounded-full -translate-y-1/2 mt-3 transition-all duration-300"
              style={{ width: `${stylizeLevel}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="100"
              value={stylizeLevel}
              onChange={(e) => setStylizeLevel(Number(e.target.value))}
              className="absolute top-1/2 left-0 w-full opacity-0 cursor-pointer -translate-y-1/2 h-8 mt-3"
            />
            <div
              className="absolute top-1/2 w-6 h-8 bg-gray-800 rounded-[4px] -translate-y-1/2 -ml-3 mt-3 pointer-events-none shadow-md transition-all duration-100"
              style={{ left: `${stylizeLevel}%` }}
            ></div>
            <div className="flex justify-between mt-8 text-xs text-gray-400 font-medium">
              <span>低い</span>
              <span className="text-gray-800 font-bold">高い</span>
              <span>かなり高い</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PenTool size={16} className="text-indigo-600" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">手書き風ライン補正</span>
                <span className="text-[10px] text-gray-400">AI特有の均一な線を緩和し自然なタッチにします</span>
              </div>
            </div>
            <button
              onClick={() => setUseHandDrawnLines(!useHandDrawnLines)}
              className={`w-12 h-6 rounded-full transition-colors relative ${useHandDrawnLines ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${useHandDrawnLines ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </div>

        {/* Model Selection with Description */}
        <div className="py-4 bg-white mb-3 px-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white text-[8px]">M</div>
            <h3 className="font-bold text-gray-800 text-sm">モデル</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar mb-3">
            {MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={`flex-shrink-0 relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeModel === model.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
              >
                <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                  <div className="w-full">
                    <div className="text-[10px] text-white leading-tight font-bold">{model.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {/* Model Description Box */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-indigo-600 block mb-1">{activeModelObj?.name}:</span>
              {activeModelObj?.description}
            </p>
          </div>
        </div>
      </div>

      {/* --- MODALS (Overlays) --- */}

      {/* Style Graph Modal */}
      {showStyleGraph && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b flex items-center justify-between bg-white">
            <button onClick={() => setShowStyleGraph(false)} className="p-2 -ml-2 text-gray-600"><ArrowLeft /></button>
            <h3 className="font-bold">スタイル調整</h3>
            <div className="w-8"></div>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50">
            <div className="relative w-full max-w-[300px] aspect-square bg-white rounded-2xl shadow-sm border border-gray-200" onClick={handleGraphClick}>
              {/* Grid Lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-gray-200"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-[1px] bg-gray-200"></div>
              </div>

              {/* Labels */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500">書き込み多い</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500">シンプル</span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">かわいい</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">かっこいい</span>

              {/* Dot */}
              <div
                className="absolute w-6 h-6 bg-indigo-600 rounded-full border-2 border-white shadow-lg transition-all duration-200 pointer-events-none"
                style={{
                  left: `${(styleCoords.x + 100) / 2}%`,
                  top: `${(100 - styleCoords.y) / 2}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
            <p className="mt-6 text-sm text-gray-500 text-center">
              タップしてスタイルを微調整<br />
              X: {styleCoords.x}, Y: {styleCoords.y}
            </p>
            <button
              onClick={() => setStyleCoords({ x: 0, y: 0 })}
              className="mt-4 px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg font-bold"
            >
              リセット
            </button>
          </div>
        </div>
      )}

      {/* Pose Selector Modal */}
      {showPoseSelector && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b flex items-center justify-between bg-white">
            <button onClick={() => setShowPoseSelector(false)} className="p-2 -ml-2 text-gray-600"><ArrowLeft /></button>
            <h3 className="font-bold">ポーズ・構図を選択</h3>
            <div className="w-8"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              {POSES.map(pose => (
                <button
                  key={pose.id}
                  onClick={() => { setSelectedPose(pose); setShowPoseSelector(false); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${selectedPose?.id === pose.id ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-transparent hover:border-gray-200'}`}
                >
                  <div className="text-2xl mb-2">{pose.icon}</div>
                  <div className="font-bold text-sm text-gray-800">{pose.label}</div>
                  <div className="text-[10px] text-gray-400 mt-1 leading-tight">{pose.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Character Builder Modal */}
      {showCharBuilder && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b flex items-center justify-between bg-white shadow-sm z-10">
            <button onClick={() => setShowCharBuilder(false)} className="p-2 -ml-2 text-gray-600"><ArrowLeft /></button>
            <h3 className="font-bold">キャラクター作成</h3>
            <button onClick={randomizeCharacter} className="p-2 text-indigo-600"><Dice5 /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pb-20 bg-gray-50">

            {/* Save/Load Area */}
            {savedCharacters.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">保存されたキャラクター</h4>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {savedCharacters.map(char => (
                    <div key={char.id} className="flex-shrink-0 relative group">
                      <button
                        onClick={() => loadCharacter(char)}
                        className="px-4 py-3 bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-700 min-w-[100px]"
                      >
                        {char.name}
                      </button>
                      <button
                        onClick={(e) => deleteCharacter(char.id, e)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Render inputs dynamically */}
              {Object.entries(CHARACTER_OPTS).map(([key, options]) => (
                <div key={key} className="bg-white p-4 rounded-xl border border-gray-100">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">
                    {CHARACTER_CATEGORY_LABELS[key] || key}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCharacter(prev => ({ ...prev, [key.slice(0, -1)]: opt.value }))} // remove 's' from keys like 'genders' -> 'gender'
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          // @ts-ignore
                          character[key.slice(0, -1)] === opt.value
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        {opt.color && (
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
                            style={{ background: opt.color }}
                          ></span>
                        )}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
            <button
              onClick={() => setCharacter({ gender: '', skinTone: '', hairColor: '', eyeColor: '', hairStyle: '', expression: '', outfit: '', accessory: '' })}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold text-sm"
            >
              クリア
            </button>
            <button
              onClick={saveCharacter}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} /> 保存する
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
