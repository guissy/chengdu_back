"use client";

import useTheme from "@/components/layout/useTheme";
import { queryClient } from "@/lib/api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { Toaster } from 'react-hot-toast';
import PageLayout from '@/components/layout/page-layout'


export function Providers({ children }: { children: React.ReactNode }) {
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration queryClient={queryClient}>
        <PageLayout>{children}</PageLayout>
      </ReactQueryStreamedHydration>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}