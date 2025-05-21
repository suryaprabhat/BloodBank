import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  onSelectLocation: (location: { lat: number; lng: number; placeName: string }) => void;
  hospitalLocations?: { lat: number; lng: number; hospitalName: string; bloodAvailability: string }[];
  searchQuery?: string;
}

const LeafletMap: React.FC<Props> = ({ onSelectLocation, hospitalLocations, searchQuery }) => {
  const geocoderRef = useRef<any>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Initialize the map
    const map = L.map("map").setView([20.5937, 78.9629], 5); // Center of India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Delay size invalidation
    setTimeout(() => map.invalidateSize(), 100);
    map.whenReady(() => map.invalidateSize());

    // Add hospital markers if provided
    if (hospitalLocations && hospitalLocations.length > 0) {
      hospitalLocations.forEach((loc) => {
        const hospitalMarker = L.marker([loc.lat, loc.lng]).addTo(map);
        hospitalMarker.bindTooltip(
          `<strong>${loc.hospitalName}</strong><br/>${loc.bloodAvailability}`,
          { direction: "top" }
        );
      });
    }

    // Store reference for manual search and cleanup
    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Perform geocoding via Nominatim whenever searchQuery changes
  useEffect(() => {
    if (!mapRef.current || !searchQuery) return;
    (async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}`
        );
        const results = await resp.json();
        if (results.length > 0) {
          const { lat, lon, display_name } = results[0];
          const latlng = L.latLng(parseFloat(lat), parseFloat(lon));
          mapRef.current!.setView(latlng, 13);
          if (markerRef.current) {
            markerRef.current.setLatLng(latlng);
          } else {
            markerRef.current = L.marker(latlng, { draggable: true }).addTo(
              mapRef.current!
            );
            markerRef.current.on("dragend", async function (e) {
              const newPos = (e.target as L.Marker).getLatLng();
              const reversePlace = await fetchPlaceName(newPos.lat, newPos.lng);
              onSelectLocation({
                lat: newPos.lat,
                lng: newPos.lng,
                placeName: reversePlace,
              });
            });
          }
          onSelectLocation({
            lat: latlng.lat,
            lng: latlng.lng,
            placeName: display_name,
          });
        }
      } catch (err) {
        console.error("Geocoding error", err);
      }
    })();
  }, [searchQuery]);

  const fetchPlaceName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (err) {
      console.error("Reverse geocoding failed", err);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  return <div id="map" className="w-full h-full" />;
};

export default LeafletMap;
