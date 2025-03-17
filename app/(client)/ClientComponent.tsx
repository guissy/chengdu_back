'use client';

import client from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";

// Client Component
function ClientComponent() {
  const { data, isLoading } = useQuery({ queryKey: ["cityList"], queryFn: () => client.GET('/api/city/cityList') });

  if (isLoading) return <div>Loading...</div>;
  return <div className="text-red-500">{data?.data?.data?.list?.map((city) => <p key={city.id}>{city.name}</p>)}</div>;
}

export default ClientComponent;