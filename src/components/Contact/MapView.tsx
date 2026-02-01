'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />
});

export default function MapView() {
  return (
    <div className="h-full w-full">
      <MapComponent />
    </div>
  );
}