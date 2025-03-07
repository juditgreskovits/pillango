'use client';

import { Heatmap } from '@/components/Heatmap';
import { useLeahData } from '@/hooks/useLeahData';

export default function Home() {
  const { data, isLoading, error } = useLeahData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Leah's Headache Calendar</h1>
      <Heatmap dates={data.headacheDates} />
    </main>
  );
}
