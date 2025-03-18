"use client";

import client from "@/lib/api/client";
import { useStreamingQuery } from "@/lib/api/stream";
import { memo } from "react";

function _CityItem({ city }: { city: { id: string; name: string } }) {
  const randColor = Math.floor(Math.random() * 16777215).toString(16);
  return <span style={{ color: `#${randColor}` }}>{city.name}</span>;
}
const CityItem = memo(_CityItem);


// Client Component
function ClientComponent() {

  const { data: stream, isLoading } = useStreamingQuery<{ list: { id: string; name: string }[] }>({
    queryKey: ["cityList"],
    queryFn: () =>
      client
        .GET("/api/city/cityList", { parseAs: "stream" })
        .then((res) => res?.data as ReadableStream<Uint8Array>),
  });

// console.log(stream?.data?.list?.length, "ο▬▬▬▬▬▬▬▬◙▅▅▆▆▇▇◤")

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="text-red-500">
      <pre className={"text-blue-500 whitespace-pre-wrap"}>
{`╔————————————————————————————————————————————————————————————————————————————————————╗
`}
      {stream?.data?.list?.slice(0, 10000).map((city, i) => (
        <CityItem key={i} city={city} />
      ))}
{`
╚————————————————————————————————————————————————————————————————————————————————————╝`}
      </pre>
    </div>
  );
}

export default ClientComponent;
