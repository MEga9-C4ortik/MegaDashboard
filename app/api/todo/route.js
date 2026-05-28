import notion from '@/lib/notion.js';

export async function GET() {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_WEEK_PLAN,

    });
    const currentWeek = response.results.find(page => page.properties.Status.status.name === "In progress");
    const currentWeekId = currentWeek.id;
    const blocks = await notion.blocks.children.list({ block_id: currentWeekId })

    return Response.json(parseBlocks(blocks.results));
}

export function parseBlocks(blocks) {
    let result = [];
    let currentCategory = "";
    for (const block of blocks) {
        if (block.type === "heading_1") {
            currentCategory = block.heading_1.rich_text[0].plain_text;
            result.push({ category: currentCategory, todos: [] });
            currentCategory = result[result.length - 1];
        } else if (block.type === "to_do") {
            currentCategory.todos.push(
                {
                    id: block.id,
                    name: block.to_do.rich_text[0].plain_text,
                    checked: block.to_do.checked
                }
            )
        }
    }
    return result;
}