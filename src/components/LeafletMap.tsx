"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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
  containerStyle = { backgroundColor: '#090909', height: '100%', width: '100%' },
  center = [0, -30],
  zoom = 3,
  markerPosition = [-5.109779, -42.765141],
  markerTitle = "NEST Datacenter",
}: MapSectionProps) => {
  const mapRef = React.useRef<L.Map | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const markerRef = React.useRef<L.Marker | null>(null);
  const dataConnector = () => {
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    const L = require('leaflet');

    const DefaultIcon = L.icon({
      iconUrl: '../images/map_pointer.png',
      iconSize: [35, 35],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    const map = L.map(mapContainerRef.current, { center, zoom });
    mapRef.current = map;

    // Create marker with click event
    const marker = L.marker(markerPosition, { 
      title: markerTitle,
      riseOnHover: true
    }).addTo(map);

    // Add click event to marker
    marker.on('click', () => {
      setIsSheetOpen(true);
    });

    markerRef.current = marker;

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
    <>
      <div className={className}>
        <div ref={mapContainerRef} style={containerStyle} />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetTitle>{markerTitle}</SheetTitle>
          <SheetDescription>
            Details and real time data about {markerTitle}
          </SheetDescription>

          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Close
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='bg-[#5200ff] text-[#fff] hover:bg-[#8c57ff]' onClick={dataConnector}>
                  + Connect data pipeline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Teste
                  </DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LeafletMap;