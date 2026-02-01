// 'use client';

// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet'; // Import the raw Leaflet library
// import 'leaflet/dist/leaflet.css';

// const Map = () => {
//   const mapRef = useRef<L.Map | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     // 1. Only initialize if we have the container and NO existing map
//     if (!mapContainerRef.current || mapRef.current) return;

//     // 2. Initialize the map instance directly
//     const map = L.map(mapContainerRef.current).setView([33.8938, 35.5018], 13);
//     mapRef.current = map;

//     // 3. Add Tile Layer
//     L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//       attribution: '&copy; OpenStreetMap contributors'
//     }).addTo(map);

//     // 4. Add Polyline (Example Red Line)
//     const redLinePoints: L.LatLngExpression[] = [
//       [33.8938, 35.5018], [33.8880, 35.4950], [33.8800, 35.4850]
//     ];
//     L.polyline(redLinePoints, { color: 'red', weight: 4 }).addTo(map);

//     // 5. Cleanup on unmount
//     return () => {
//       map.remove();
//       mapRef.current = null;
//     };
//   }, []);

//   // Render a simple div. We handle everything inside the useEffect above.
//   return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
// };

// export default Map;
'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons not showing in Next.js/Webpack
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

const Map = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    fixLeafletIcon();

    // 1. Initialize map centered near Dora
    const map = L.map(mapContainerRef.current).setView([33.8940, 35.5460], 14);
    mapRef.current = map;

    // 2. Add the Light Tile Layer for the LG branding look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 3. Add LG Store & Service Center (SEALCO Dora)
    const sealcoDora: L.LatLngExpression = [33.8906, 35.5458]; 
    L.marker(sealcoDora)
      .addTo(map)
      .bindPopup(`
        <div style="font-family: 'LG Smart', sans-serif;">
          <strong style="color: #AD003A;">LG Store & Service Center</strong><br/>
          SEALCO - Dora Highway<br/>
          Jdeideh, Lebanon
        </div>
      `)
      .openPopup();

    // 4. Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} className="h-full w-full" style={{ minHeight: '100%' }} />;
};

export default Map;