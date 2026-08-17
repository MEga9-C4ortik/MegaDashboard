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
                        repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
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
    let i = allDays.length - 1;
    if (allDays[i]?.contributionCount === 0) i--;
    for (; i >= 0; i--) {
        if (allDays[i].contributionCount > 0) streak++;
        else break;
    }

    const lastCommitRepo = user.repositories.nodes
        .find(repo => repo.defaultBranchRef?.target?.history?.nodes?.[0]);
    const lastCommit = lastCommitRepo ? {
        message: lastCommitRepo.defaultBranchRef.target.history.nodes[0].message,
        date: lastCommitRepo.defaultBranchRef.target.history.nodes[0].committedDate,
        repo: lastCommitRepo.name
    } : null;

    return Response.json({
        username: user.login,
        totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
        streak: streak,
        weeks: user.contributionsCollection.contributionCalendar.weeks,
        lastCommit: lastCommit,
    });
}