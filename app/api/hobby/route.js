import notion from "@/lib/notion";

export async function GET () {
    try {
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
                tasks: project.properties.Tasks.rich_text[0]?.plain_text,
                description: project.properties.Description.rich_text[0]?.plain_text,
            }
        });

        return Response.json(mapped);
    } catch (error) {
        console.error('Hobbies API error:', error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}