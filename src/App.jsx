import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";

function MobileVocabViewer() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [learned, setLearned] = useState({});

  // 📌 単語リスト読み込み
  useEffect(() => {
    fetch("/vocab.json")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Failed to load vocab list:", err));
  }, []);

  // 📌 学習済み記録読み込み
  useEffect(() => {
    const saved = localStorage.getItem("learnedWords");
    if (saved) {
      setLearned(JSON.parse(saved));
    }
  }, []);

  // 📌 学習済み切替
  const toggleLearned = (word) => {
    setLearned((prev) => {
      const updated = { ...prev, [word]: !prev[word] };
      localStorage.setItem("learnedWords", JSON.stringify(updated));
      return updated;
    });
  };

  // 📌 音声読み上げ機能
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
  
      // ✅ 音声リストを取得
      const voices = window.speechSynthesis.getVoices();
  
      // ✅ 好きな声を選ぶ（例：英語の女性）
      const selectedVoice = voices.find(v => v.lang === 'en-AU' && v.name.includes('Female')) 
                         || voices.find(v => v.lang === 'en-AU') 
                         || voices[0];
  
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
  
      utterance.lang = 'en-AU'; // 言語設定
      utterance.rate = 0.9;     // 読む速度（1が標準）
      utterance.pitch = 0.9;    // 声の高さ（1が標準）
  
      window.speechSynthesis.speak(utterance);
    } else {
      alert("このブラウザでは音声合成がサポートされていません。");
    }
  };
  

  // 📌 検索フィルタ
  const filtered = records.filter((r) =>
    r.Word?.toLowerCase().includes(query.toLowerCase()) ||
    r.JapaneseMeaning?.includes(query)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Eiken Grade-1 Vocabulary</h1>

      {/* 検索ボックス */}
      {records.length > 0 && (
        <Input
          placeholder="Search word or meaning…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sticky top-4 z-10 shadow-md bg-white"
        />
      )}

      {/* 単語リスト */}
      <div className="space-y-2 pb-16">
        {filtered.map((rec, idx) => (
          <Card key={idx} className="hover:shadow-md transition-all">
            <CardContent className="p-3">
              <details>
                <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center">
                  <div className="flex flex-col">
                    <span>{rec.Word}</span>
                    <span className="text-sm text-gray-500">{rec.JapaneseMeaning}</span>
                  </div>
                  <div className="flex space-x-2 items-center">
                    {/* ✅ 学習済みボタン */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLearned(rec.Word);
                      }}
                      className={`text-xs px-2 py-1 rounded ${
                        learned[rec.Word]
                          ? "bg-green-200 text-green-900"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {learned[rec.Word] ? "✅" : "未"}
                    </button>

                    {/* ▶️ 再生ボタン */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        speak(rec.ExampleSentence);
                      }}
                      className="text-xs bg-yellow-100 text-yellow-800 rounded px-2 py-1"
                    >
                      ▶️
                    </button>
                  </div>
                </summary>
                <p className="mt-2 text-sm text-gray-700">{rec.ExampleSentence}</p>
              </details>
            </CardContent>
          </Card>
        ))}

        {/* 検索結果なし */}
        {records.length > 0 && filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No matches found.</p>
        )}
      </div>
    </div>
  );
}

export default MobileVocabViewer;
