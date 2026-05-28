import notion from '@/lib/notion.js';

export async function GET() {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_WEEK_PLAN,
    });

    return Response.json(response);
}