import notion from '@/lib/notion.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (pageId) {
        const response = await notion.blocks.children.list({
            block_id: pageId
        });

        const bullets = response.results
            .filter(b => b.type === "bulleted_list_item")
            .map(b => ({
                id: b.id,
                text: b.bulleted_list_item.rich_text[0].plain_text
            }));
        return Response.json(bullets);
    } else {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_NOTES
        });

        const pages = response.results
            .map(b => ({
                id: b.id,
                title: b.properties.Name.title[0].plain_text
            }));
        return Response.json(pages);
    }
}

export async function POST(request) {
    const {pageId, text} = await request.json();
    const note = await notion.blocks.children.append({
       page_id: pageId,
       text: text,
    });

    return Response.json({ok: true});
}