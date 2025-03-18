"use client";

import { useState, useEffect, memo } from 'react';
import { MyProtoMessage } from './protoUtils';
import { ResponseFactory } from '@/lib/api/response_stream';

function Page() {
  const [items, setItems] = useState<Array<{ id: number; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStream = async () => {
      try {
        const response = await fetch('/api/stream');
        if (!response.body) throw new Error("Empty response body");
        for await (const result of ResponseFactory.decodeStream(response.body, MyProtoMessage)) {
          if (result.status === "success") {
            setItems(prev => [...prev, result.data]); // 增量更新
          } else {
            setError(result.error.message);
            break;
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    loadStream();
  }, []);

  console.log('ClientStream render');
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">实时数据流</h1>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="p-2 border rounded">
            #{item.id}: {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(Page);
