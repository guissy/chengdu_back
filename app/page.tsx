// app/page.tsx
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { queryClient } from "../lib/api/queryClient";
import ClientComponent from "./(client)/ClientComponent";
import client from "@/lib/api/client";

export default async function HomePage() {
  await queryClient.prefetchQuery({
    queryKey: ["cityList"],
    queryFn: () =>
      client
        .GET("/api/city/cityList")
        .then((res) => ({ data: res.data, error: res.error })),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientComponent />
    </HydrationBoundary>
  );
}
