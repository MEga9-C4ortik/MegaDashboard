import notion from "@/lib/notion";

export async function GET (request) {
    try {
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
                database_id: process.env.NOTION_HOBBIES,
                sorts: [
                    {
                        property: 'Deadline',
                        direction: 'ascending'
                    }
                ]
            });
            const projects = response.results;
            if (projects.length <= 0) return Response.json([], {status: 200});

            const mapped = projects.map((project) => {
                return {
                    id: project.id,
                    url: project.url,
                    name: project.properties.Projects.title?.[0].plain_text,
                    deadline: project.properties.Deadline.date?.start,
                    description: project.properties.Description.rich_text[0]?.plain_text,
                }
            });

            return Response.json(mapped);
        }
    } catch (error) {
        console.error('Hobbies API error:', error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    const {pageId, text} = await request.json();
    const task = await notion.blocks.children.append({
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

    return Response.json(task.results[0]);
}

export async function PATCH(request) {
    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get('blockId');
    const { text } = await request.json();

    const task = await notion.blocks.update({
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