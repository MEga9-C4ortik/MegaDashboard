import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const timeMin = new Date(`${date}T00:00:00+08:00`).toISOString();
    const timeMax = new Date(`${date}T23:59:59+08:00`).toISOString();

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return Response.json(res.data.items);
}