import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 默认缓存 1 分钟
      refetchOnWindowFocus: false,
    },
  },
});