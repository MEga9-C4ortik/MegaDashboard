'use client';
import { useState, useEffect } from 'react';
import { Droplets, Sunrise, Sunset } from 'lucide-react';

export default function Weather() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
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
            <div className="h-3 w-48 bg-neutral-800 rounded" />
            <div className="h-3 w-36 bg-neutral-800 rounded" />
        </div>
    );

    if (error) return <div className="text-neutral-500 text-xs">{error}</div>;

    return (
        <div className="flex flex-col gap-0.5 w-full min-w-100">
            {/* Raw 1 */}
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                    alt={weather.description}
                    className="w-8 h-8 object-contain shrink-0 -ml-1"
                />
                <span className="text-2xl font-light text-white shrink-0">{weather.temp}°</span>
                <span className="flex items-center ml-2 gap-1">
                    <Droplets size={24} className="text-sky-500/70" /> {weather.humidity}%
                </span>
                <span className="text-sm text-neutral-300 font-medium truncate">{weather.city}</span>
            </div>

            {/* Raw 2 */}
            <div className="flex items-center gap-3 text-xs text-neutral-200 pl-0.5 flex-wrap">
                <span className="capitalize mr-2">{weather.description}</span>

                <span className="flex items-center gap-1">
                    <Sunrise size={20} className="text-amber-500/60" />
                    {weather.sunrise}
                </span>
                <span className="flex items-center gap-1">
                    <Sunset size={20} className="text-orange-500/60" />
                    {weather.sunset}
                </span>
            </div>
        </div>
    );
}