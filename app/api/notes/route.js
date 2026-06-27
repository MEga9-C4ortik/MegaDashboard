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
                text: b.bulleted_list_item.rich_text[0]?.plain_text ?? ''
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
        block_id: pageId,
        children: [
            {
                type: "bulleted_list_item",
                bulleted_list_item: {
                    rich_text: [
                        {
                            type: "text",
                            text: { content: text }
                        }
                    ]
                }
            }
        ]
    });

    return Response.json(note.results[0]);
}

export async function PATCH(request) {
    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get('blockId');
    const { text } = await request.json();

    const note = await notion.blocks.update({
        block_id: blockId,
        bulleted_list_item: {
            rich_text: [
                {
                    type: "text",
                    text: { content: text }
                }
            ]
        }
    });

    return Response.json({ok: true});
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get('blockId');
    if (!blockId) return Response.json({ error: 'id required' }, { status: 400 });
    await notion.blocks.delete({ block_id: blockId });
    return Response.json({ok: true});
}