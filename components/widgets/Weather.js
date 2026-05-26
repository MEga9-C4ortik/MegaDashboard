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

            (err) => {
                setError('Location access denied');
                setLoading(false);
            }
        );
    }, []);

    if (loading) return (
        <div className="animate-pulse">
            <div className="h-8 w-16 bg-neutral-800 rounded mb-1" />
            <div className="h-4 w-24 bg-neutral-800 rounded" />
        </div>
    );

    if (error) return (
        <div className="text-neutral-500 text-sm">{error}</div>
    );

    return (
        <div className="flex flex-col gap-1">

            <div className="flex items-center gap-2">
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-light text-white">
                    {weather.temp}°
                </span>
            </div>

            <div className="text-sm text-neutral-300">
                {weather.city}
            </div>

            <div className="text-xs text-neutral-500 capitalize">
                {weather.description}
            </div>

            <div className="text-xs text-neutral-500">
                H: {weather.high}° · L: {weather.low}°
            </div>
        </div>
    );
}