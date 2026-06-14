import notion from "@/lib/notion";

export async function GET () {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_STUDY,
            filter: {
                property: "Status",
                status: {
                    does_not_equal: "Done"
                },
            },
            sorts: [
                {
                    property: 'Deadline',
                    direction: 'ascending'
                }
            ]
        });
        const subjects = response.results;
        if (subjects.length <= 0) return Response.json([], {status: 200});

        const mapped = subjects.map((subject) => {
            return {
                id: subject.id,
                url: subject.url,
                name: subject.properties.Subject.title?.[0].plain_text,
                deadline: subject.properties.Deadline.date.start,
                tasks: subject.properties.Tasks.rich_text[0]?.plain_text,
                description: subject.properties.Description.rich_text[0]?.plain_text,
                status: subject.properties.Status.status.name,
                grades: subject.properties.Grades.rich_text[0]?.plain_text
            }
        });

        return Response.json(mapped);
    } catch (error) {
        console.error('Study API error:', error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}