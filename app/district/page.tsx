"use client";
import { Suspense } from 'react'
import DistrictList from '@/(pages)/district/list'
import LoadingSpinner from '@/components/ui/loading-spinner.tsx';

// export const metadata = {
//   title: '行政区划 - Business System',
// }

export default function DistrictListPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DistrictList />
    </Suspense>
  )
}

