import React, { useState, useEffect } from 'react';
import { Key, Save, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';

export const ProfileView: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [savedKey, setSavedKey] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'saved' | 'removed'>('idle');

    useEffect(() => {
        const key = localStorage.getItem('GEMINI_API_KEY');
        if (key) {
            setSavedKey(key);
        }
    }, []);

    const handleSave = () => {
        if (!apiKey.trim()) return;
        localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
        setSavedKey(apiKey.trim());
        setApiKey('');
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 3000);
    };

    const handleRemove = () => {
        localStorage.removeItem('GEMINI_API_KEY');
        setSavedKey(null);
        setStatus('removed');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-gray-200 overflow-y-auto">
            <div className="max-w-md w-full bg-[#252630] rounded-xl p-6 shadow-xl border border-[#3a3a45]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                        <Key className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold">API Key 設定</h2>
                </div>

                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    画像生成にはGoogle Gemini APIキーが必要です。
                    キーはお使いのブラウザにのみ保存され、外部サーバーに送信されることはありません。
                </p>

                {savedKey ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-green-400 font-medium">
                            <ShieldCheck size={20} />
                            <span>APIキーは保存されています</span>
                        </div>
                        <div className="text-xs text-gray-400">
                            現在保存されているキー: ••••••••••••••••••••••{savedKey.slice(-4)}
                        </div>
                        <button 
                            onClick={handleRemove}
                            className="flex items-center justify-center gap-2 bg-[#3a3a45] hover:bg-[#4a4a55] text-white py-2 rounded-md text-sm transition-colors mt-2"
                        >
                            <Trash2 size={16} /> キーを削除する
                        </button>
                    </div>
                ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-center gap-2 text-yellow-400">
                        <AlertTriangle size={20} />
                        <span className="text-sm">APIキーが設定されていません</span>
                    </div>
                )}

                {!savedKey && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                                Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full bg-[#1a1b23] border border-[#3a3a45] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                            />
                        </div>

                        <button 
                            onClick={handleSave}
                            disabled={!apiKey.trim()}
                            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                                apiKey.trim() 
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shdaow-blue-900/20' 
                                    : 'bg-[#3a3a45] text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <Save size={18} /> 保存する
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4"
                    >
                        Google AI StudioでAPIキーを取得 →
                    </a>
                </div>
            </div>

            {status !== 'idle' && (
                <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 ${
                    status === 'saved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {status === 'saved' ? 'APIキーを保存しました' : 'APIキーを削除しました'}
                </div>
            )}
        </div>
    );
};
