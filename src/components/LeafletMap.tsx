"use client";

import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapSectionProps {
  className?: string;
  containerStyle?: React.CSSProperties;
  center?: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  markerTitle?: string;
}

const LeafletMap = ({
  className = 'flex align-middle justify-center h-[70%] w-[700px] border-[3px] border-[#202020]',
  containerStyle = { backgroundColor: '#090909', height: '100%', width: '100%', filter: 'invert(0%) hue-rotate(180deg) brightness(95%) contrast(90%)' },
  center = [0, 0],
  zoom = 2,
  markerPosition = [-5.103911, -42.764982],
  markerTitle = "AOS Software"
}: MapSectionProps) => {
  const mapRef = React.useRef<L.Map | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    const L = require('leaflet');

    const DefaultIcon = L.icon({
      iconUrl: 'https://i.pinimg.com/736x/13/ce/b6/13ceb6fa0032a8e61da1e035df26c370.jpg',
      iconSize: [29, 29],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    const map = L.map(mapContainerRef.current, { center, zoom });
    mapRef.current = map;

    L.marker(markerPosition, { title: markerTitle }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const observer = new MutationObserver(() => {
      const flagElement = document.querySelector('.leaflet-attribution-flag');
      if (flagElement) {
        flagElement.remove();
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [center, zoom, markerPosition, markerTitle]);

  return (
    <div className={className}>
      <div ref={mapContainerRef} style={containerStyle} />
    </div>
  );
};

export default LeafletMap;