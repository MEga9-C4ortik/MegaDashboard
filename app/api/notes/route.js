import notion from '@/lib/notion.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (pageId) {
        const response = await notion.blocks.children.list({
            block_id: pageId
        });

        const bullets = response.results
            .filter(b => b.type === "bullet_list_item")
            .map(b => ({
                id: b.id,
                text: b.bulleted_list_item.rich_text[0].plain_text
            }));
        return Response.json(bullets);
    } else {
        const response = await notion.blocks.children.list({
            block_id: process.env.NOTION_NOTES
        });

        const pages = response.results
            .filter(b => b.type === "child_page")
            .map(b => ({
                id: b.id,
                title: b.child_page.title
            }));
        return Response.json(pages);
    }
}