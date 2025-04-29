import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";

function MobileVocabViewer() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");

  // 📌 アプリ起動時に public/vocab.json を自動ロード
  useEffect(() => {
    fetch("/vocab.json")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Failed to load vocab list:", err));
  }, []);

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
                  {rec.Word}
                  <span className="text-sm text-gray-500 ml-2">{rec.JapaneseMeaning}</span>
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
