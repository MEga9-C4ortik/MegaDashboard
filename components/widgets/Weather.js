'use client';
import { useState, useEffect } from 'react';

export default function Weather() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `/api/weather?lat=${latitude}&lon=${longitude}`
                    );
                    if (!res.ok) throw new Error('fetch failed');
                    const data = await res.json();
                    setWeather(data);
                } catch (e) {
                    setError('Failed to load weather');
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError('Location access denied');
                setLoading(false);
            }
        );
    }, []);

    if (loading) return (
        <div className="animate-pulse flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-neutral-800 rounded-full shrink-0" />
            <div className="flex flex-col gap-1">
                <div className="h-5 w-12 bg-neutral-800 rounded" />
                <div className="h-3 w-20 bg-neutral-800 rounded" />
            </div>
        </div>
    );

    if (error) return (
        <div className="text-neutral-500 text-xs">{error}</div>
    );

    return (
        <div className="flex items-center gap-3 w-full min-w-0">
            <div className="flex items-center gap-0.5 shrink-0">
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                    alt={weather.description}
                    className="w-8 h-8 object-contain"
                />
                <span className="text-2xl font-light text-white">
                    {weather.temp}°
                </span>
            </div>

            <div className="flex flex-col gap-0 min-w-0">
                <div className="text-sm text-neutral-300 font-medium truncate">
                    {weather.city}
                </div>
                <div className="text-xs text-neutral-500 capitalize truncate">
                    {weather.description}
                </div>
                <div className="text-xs text-neutral-600 truncate">
                    {weather.humidity}% · {weather.sunrise}–{weather.sunset}
                </div>
            </div>
        </div>
    );
}