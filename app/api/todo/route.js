import notion from '@/lib/notion.js';

export async function GET() {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_WEEK_PLAN,

    });
    const currentWeek = response.results.find(page => page.properties.Status.status.name === "In progress");
    const currentWeekId = currentWeek.id;
    const blocks = await notion.blocks.children.list({ block_id: currentWeekId })
    return Response.json(blocks.results);
}