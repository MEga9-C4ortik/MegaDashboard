export async function GET() {
    const username = process.env.LEETCODE_USERNAME;
    const year = new Date().getFullYear();

    const gql = (query, variables = {}) =>
        fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        }).then(res => res.json());

    const [calendarData, statsData, recentData] = await Promise.all([
        gql(`
            query userProfileCalendar($username: String!, $year: Int) {
                matchedUser(username: $username) {
                    userCalendar(year: $year) {
                        totalActiveDays
                        submissionCalendar
                    }
                }
            }
        `, { username, year }),

        gql(`
            query userSessionProgress($username: String!) {
                allQuestionsCount {
                    difficulty
                    count
                }
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }
            }
        `, { username }),

        gql(`
            query recentAcSubmissions($username: String!, $limit: Int!) {
                recentAcSubmissionList(username: $username, limit: $limit) {
                    id
                    title
                    titleSlug
                    timestamp
                }
            }
        `, { username, limit: 5 })
    ]);

    // --- CALENDAR ---
    const calendar = JSON.parse(
        calendarData.data.matchedUser.userCalendar.submissionCalendar
    );

    // CONVERT TO YYYY-MM-DD
    const activeDates = new Set(
        Object.keys(calendar).map(ts =>
            new Date(parseInt(ts) * 1000).toISOString().split('T')[0]
        )
    );

    // --- CURRENT STREAK ---
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // STREAK LOSS
    let checkStr = activeDates.has(todayStr) ? todayStr : yesterdayStr;
    let checkDate = new Date(checkStr + 'T00:00:00Z');
    let streak = 0;

    while (activeDates.has(checkStr)) {
        streak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
        checkStr = checkDate.toISOString().split('T')[0];
    }

    // --- HEATMAP CALENDAR ---
    const weeks = [];
    const endDate = new Date();
    endDate.setUTCHours(0, 0, 0, 0);

    // 20 weeks
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 20 * 7);
    startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());

    let cur = new Date(startDate);
    let week = [];

    while (cur <= endDate) {
        const dateStr = cur.toISOString().split('T')[0];
        const ts = Math.floor(cur.getTime() / 1000);

        week.push({
            date: dateStr,
            count: calendar[ts] || 0
        });

        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }

        cur = new Date(cur.getTime() + 86400000);
    }
    if (week.length > 0) weeks.push(week);

    // --- Easy/Medium/Hard ---
    const acStats  = statsData.data.matchedUser.submitStats.acSubmissionNum;
    const totals   = statsData.data.allQuestionsCount;

    const find = (arr, diff) => arr.find(s => s.difficulty === diff)?.count ?? 0;

    const stats = {
        easy:   { solved: find(acStats, 'Easy'),   total: find(totals, 'Easy') },
        medium: { solved: find(acStats, 'Medium'), total: find(totals, 'Medium') },
        hard:   { solved: find(acStats, 'Hard'),   total: find(totals, 'Hard') },
    };

    // --- LAST SOLVED ---
    const recent = recentData.data.recentAcSubmissionList.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.titleSlug,
        date: new Date(parseInt(s.timestamp) * 1000).toISOString()
    }));

    return Response.json({
        streak,
        totalActiveDays: calendarData.data.matchedUser.userCalendar.totalActiveDays,
        weeks,
        stats,
        recent
    });
}