"use client";

import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const MapSection = () => {
  const mapRef = React.useRef<L.Map | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
  // Only run on client-side
  if (typeof window === 'undefined' || !mapContainerRef.current) return;

  const L = require('leaflet'); // Dynamic require to avoid SSR issues

  // Fix default icon
  const DefaultIcon = L.icon({
    iconUrl: 'https://i.pinimg.com/736x/13/ce/b6/13ceb6fa0032a8e61da1e035df26c370.jpg',
    iconSize: [29, 29],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  // Initialize map
  const map = L.map(mapContainerRef.current, {
    center: [0, 0],
    zoom: 2,
  });
  mapRef.current = map;

  // Add marker
  L.marker([-5.103911, -42.764982], {
    title: "AOS Software",
  }).addTo(map);

  // Add tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  // Remove attribution flag after tiles load
  map.on('load', () => {
    const flagElement = document.querySelector('.leaflet-attribution-flag');
    if (flagElement) {
      flagElement.remove();
    }
  });

  // Alternative: MutationObserver for dynamic attribution changes
  const observer = new MutationObserver(() => {
    const flagElement = document.querySelector('.leaflet-attribution-flag');
    if (flagElement) {
      flagElement.remove();
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => {
    if (mapRef.current) {
      mapRef.current.remove();
    }
  };
}, []);

  return (
    <div className='flex align-middle justify-center h-[70%] w-[700px] border-[3px] border-[#202020]'>
      <div
        ref={mapContainerRef} 
        style={{backgroundColor: '#090909', height: '100%', width: '100%', filter: 'invert(0%) hue-rotate(180deg) bightness(95%) contrast(90%)'}}
      />
    </div>
  );
};

export default MapSection;