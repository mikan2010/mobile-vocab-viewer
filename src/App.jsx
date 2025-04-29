import React, { useState } from 'react';
import Papa from 'papaparse';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';

function MobileVocabViewer() {
  const [records, setRecords] = useState([]);
  const [query, setQuery]   = useState('');

  /* CSV アップロード → 配列に格納 */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (res) => {
        setRecords(res.data.filter(r => r.Word));
      },
    });
  };

  /* 検索フィルタ */
  const filtered = records.filter(r =>
    r.Word?.toLowerCase().includes(query.toLowerCase()) ||
    r.JapaneseMeaning?.includes(query)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Eiken Grade-1 Vocabulary</h1>

      {records.length === 0 && (
        <div className="flex flex-col items-center space-y-3">
          <p className="text-sm text-gray-600">Upload the CSV file (1240 words)</p>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="max-w-xs"
          />
        </div>
      )}

      {records.length > 0 && (
        <Input
          placeholder="Search word or meaning…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="sticky top-4 z-10 shadow-md bg-white"
        />
      )}

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

        {records.length > 0 && filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No matches found.</p>
        )}
      </div>
    </div>
  );
}

export default MobileVocabViewer;   // ← ここがポイント
