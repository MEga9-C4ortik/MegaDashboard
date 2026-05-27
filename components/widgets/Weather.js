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
                setError('Location denied');
                setLoading(false);
            }
        );
    }, []);

    if (loading) return (
        <div className="animate-pulse flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-neutral-800 rounded-full shrink-0" />
                <div className="h-6 w-10 bg-neutral-800 rounded" />
                <div className="h-4 w-24 bg-neutral-800 rounded" />
            </div>
            <div className="h-3 w-32 bg-neutral-800 rounded" />
        </div>
    );

    if (error) return (
        <div className="text-neutral-500 text-xs">{error}</div>
    );

    return (
        <div className="flex flex-col gap-0.5 w-full min-w-0">
            {/* строка 1: иконка + температура + город */}
            <div className="flex items-center gap-1.5 min-w-0">
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                    alt={weather.description}
                    className="w-8 h-8 object-contain shrink-0 -ml-1"
                />
                <span className="text-2xl font-light text-white shrink-0">
                    {weather.temp}°
                </span>
                <span className="text-sm text-neutral-300 font-medium truncate">
                    {weather.city}
                </span>
            </div>
            {/* строка 2: описание + влажность + sunrise/sunset */}
            <div className="text-xs text-neutral-500 capitalize truncate pl-0.5">
                {weather.description} · {weather.humidity}%
            </div>
        </div>
    );
}