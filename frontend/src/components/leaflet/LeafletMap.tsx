import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

interface Props {
  onSelectLocation: (location: { lat: number; lng: number; placeName: string }) => void;
  hospitalLocations?: { lat: number; lng: number; hospitalName: string; bloodAvailability: string }[];
}

const LeafletMap: React.FC<Props> = ({ onSelectLocation, hospitalLocations }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Initialize the map
    const map = L.map("map").setView([20.5937, 78.9629], 5); // Center of India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Delay and trigger a size invalidation so the map renders correctly in its full container
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Also invalidate once the map is fully ready
    map.whenReady(() => {
      map.invalidateSize();
    });

    // @ts-ignore
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", async function (e: any) {
        const latlng = e.geocode.center;
        const placeName = e.geocode.name;

        map.setView(latlng, 15);

        if (markerRef.current) {
          markerRef.current.setLatLng(latlng);
        } else {
          markerRef.current = L.marker(latlng, { draggable: true }).addTo(map);
        }

        onSelectLocation({ lat: latlng.lat, lng: latlng.lng, placeName });

        markerRef.current.on("dragend", async function (event) {
          const newPos = (event.target as L.Marker).getLatLng();
          const reversePlace = await fetchPlaceName(newPos.lat, newPos.lng);
          onSelectLocation({
            lat: newPos.lat,
            lng: newPos.lng,
            placeName: reversePlace,
          });
        });
      })
      .addTo(map);

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

    // Store reference for potential future use and cleanup
    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
