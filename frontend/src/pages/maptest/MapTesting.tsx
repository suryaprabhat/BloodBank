import React, { useState, useEffect } from "react";
import ArcGISMap from "../../components/leaflet/LeafletMap";
import { hospitalMockData } from "@/data/hospitalMockData";

function Map() {
    const [inputValue, setInputValue] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const handleSelectLocation = (location: { lat: number; lng: number; placeName: string }) => {
        console.log("Selected location:", location);
    };

    // Fetch address suggestions with debounce
    useEffect(() => {
        if (!inputValue) {
            setSuggestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const resp = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
                        inputValue
                    )}&limit=5&countrycodes=in`
                );
                const data = await resp.json();
                setSuggestions(data);
            } catch (err) {
                console.error("Suggestion fetch error", err);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleSuggestionClick = (place: any) => {
        setInputValue(place.display_name);
        setSearchQuery(place.display_name);
        setSuggestions([]);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setSearchQuery(inputValue);
            setSuggestions([]);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col relative">
            {/* Search bar */}
            <div className="p-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search for area..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        className="w-full p-2 border rounded"
                    />
                    {suggestions.length > 0 && (
                        <div className="absolute mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto" style={{ zIndex: 10000 }}>
                            {suggestions.map((s) => (
                                <div
                                    key={s.place_id}
                                    onClick={() => handleSuggestionClick(s)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {s.display_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Map container */}
            <div className="flex-1">
                <ArcGISMap
                    onSelectLocation={handleSelectLocation}
                    hospitalLocations={hospitalMockData}
                    searchQuery={searchQuery}
                />
            </div>
        </div>
    );
}
export default Map