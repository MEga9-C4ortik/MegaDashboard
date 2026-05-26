export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return Response.json({ error: 'coords required' }, { status: 400 });
    }

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
        { next: { revalidate: 1000 } }
    );

    if (!res.ok) return Response.json({ error: 'failed' }, { status: 502 });

    const data = await res.json();
    return Response.json({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name
    });
}