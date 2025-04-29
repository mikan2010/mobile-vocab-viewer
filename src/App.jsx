import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";

function MobileVocabViewer() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [learned, setLearned] = useState({});

  // 📌 アプリ起動時に vocab.json をロード
  useEffect(() => {
    fetch("/vocab.json")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Failed to load vocab list:", err));
  }, []);

  // 📌 アプリ起動時に localStorage から学習記録もロード
  useEffect(() => {
    const saved = localStorage.getItem('learnedWords');
    if (saved) {
      setLearned(JSON.parse(saved));
    }
  }, []);

  // 📌 学習済みトグルボタン
  const toggleLearned = (word) => {
    setLearned((prev) => {
      const updated = { ...prev, [word]: !prev[word] };
      localStorage.setItem('learnedWords', JSON.stringify(updated));  // 保存
      return updated;
    });
  };

  // 📌 検索フィルタ
  const filtered = records.filter((r) =>
    r.Word?.toLowerCase().includes(query.toLowerCase()) ||
    r.JapaneseMeaning?.includes(query)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Eiken Grade-1 Vocabulary</h1>

      {/* 検索窓 */}
      {records.length > 0 && (
        <Input
          placeholder="Search word or meaning…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sticky top-4 z-10 shadow-md bg-white"
        />
      )}

      {/* リスト表示 */}
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLearned(rec.Word);
                    }}
                    className={`ml-2 text-xs px-2 py-1 rounded ${
                      learned[rec.Word] ? "bg-green-200 text-green-900" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {learned[rec.Word] ? "✅" : "未"}
                  </button>
                </summary>
                <p className="mt-2 text-sm text-gray-700">{rec.ExampleSentence}</p>
              </details>
            </CardContent>
          </Card>
        ))}

        {/* 検索ヒットなし表示 */}
        {records.length > 0 && filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No matches found.</p>
        )}
      </div>
    </div>
  );
}

export default MobileVocabViewer;
