export async function GET() {
    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `query {
                    user(login: "${process.env.GITHUB_USERNAME}") {
                        contributionsCollection {
                            contributionCalendar {
                                totalContributions
                                weeks {
                                    contributionDays {
                                        contributionCount
                                        date
                                    }
                                }
                            }
                        }
                        repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}) {
                            nodes {
                                name
                                defaultBranchRef {
                                    target {
                                        ... on Commit {
                                            history(first: 1) {
                                                nodes {
                                                    message
                                                    committedDate
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }`
        })
    });

    const json = await response.json();
    const user = json.data.user;

    const allDays = user.contributionsCollection.contributionCalendar.weeks
        .flatMap(week => week.contributionDays);
    let streak = 0;
    for (let i = allDays.length - 1; i > 0; i--) {
        if (allDays[i].contributionCount > 0) streak++;
        else break;
    }

    const lastCommitRepo = user.repositories.nodes
        .find(repo => repo.defaultBranchRef?.target?.history?.nodes?.[0]);
    const lastCommit = lastCommitRepo?.defaultBranchRef.target.history.nodes[0];

    return Response.json({
        totalContributions: user.contributionsCollection.totalContributions,
        streak: streak,
        weeks: user.contributionsCollection.contributionCalendar.weeks,
        lastCommit: lastCommit,
    });
}