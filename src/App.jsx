import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";

function MobileVocabViewer() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [learned, setLearned] = useState({});
  const [filterMode, setFilterMode] = useState("unlearned"); // ★フィルターモード追加

  useEffect(() => {
    fetch("/vocab.json")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Failed to load vocab list:", err));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("learnedWords");
    if (saved) {
      setLearned(JSON.parse(saved));
    }
  }, []);

  const toggleLearned = (word) => {
    setLearned((prev) => {
      const updated = { ...prev, [word]: !prev[word] };
      localStorage.setItem("learnedWords", JSON.stringify(updated));
      return updated;
    });
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.lang === 'en-US') || voices[0];
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("このブラウザでは音声合成がサポートされていません。");
    }
  };

  // 📌 単語リストフィルタリング（3モード対応）
  const filtered = records.filter((r) => {
    const matchesQuery =
      r.Word?.toLowerCase().includes(query.toLowerCase()) ||
      r.JapaneseMeaning?.includes(query);

    const isLearned = learned[r.Word];

    if (filterMode === "unlearned") {
      return matchesQuery && !isLearned; // 未学習のみ
    } else if (filterMode === "learned") {
      return matchesQuery && isLearned; // 学習済みのみ
    } else {
      return matchesQuery; // 全部
    }
  });

  const totalWords = records.length;
  const learnedWords = Object.values(learned).filter(Boolean).length;
  const progress = totalWords > 0 ? (learnedWords / totalWords) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Eiken Grade-1 Vocabulary</h1>

      {/* 学習進捗バー */}
      {records.length > 0 && (
        <div className="flex flex-col items-center space-y-1">
          <p className="text-sm text-gray-700">
            学習済み: {learnedWords} / {totalWords} 単語 ({progress.toFixed(1)}%)
          </p>
          <div className="w-full max-w-md bg-gray-300 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-400 h-3 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 検索ボックスとモード切替ボタン */}
      {records.length > 0 && (
        <div className="flex flex-wrap items-center space-x-2">
          <Input
            placeholder="Search word or meaning…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sticky top-4 z-10 shadow-md bg-white flex-1"
          />
          <div className="flex space-x-1 mt-2">
            <button
              onClick={() => setFilterMode("unlearned")}
              className={`text-xs px-2 py-1 rounded ${
                filterMode === "unlearned" ? "bg-indigo-400 text-white" : "bg-indigo-100 text-indigo-800"
              }`}
            >
              未学習
            </button>
            <button
              onClick={() => setFilterMode("all")}
              className={`text-xs px-2 py-1 rounded ${
                filterMode === "all" ? "bg-indigo-400 text-white" : "bg-indigo-100 text-indigo-800"
              }`}
            >
              全て
            </button>
            <button
              onClick={() => setFilterMode("learned")}
              className={`text-xs px-2 py-1 rounded ${
                filterMode === "learned" ? "bg-indigo-400 text-white" : "bg-indigo-100 text-indigo-800"
              }`}
            >
              学習済み
            </button>
          </div>
        </div>
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

                    {/* ▶️ 音声ボタン */}
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

        {/* 検索ヒットなし */}
        {records.length > 0 && filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No matches found.</p>
        )}
      </div>
    </div>
  );
}

export default MobileVocabViewer;
