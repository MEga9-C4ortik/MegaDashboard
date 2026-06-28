export async function GET() {
    const username = process.env.LEETCODE_USERNAME;
    const year = new Date().getFullYear();

    // Хелпер чтобы не повторять fetch + headers каждый раз
    const gql = (query, variables = {}) =>
        fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        }).then(res => res.json());

    // Три запроса параллельно
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
    // submissionCalendar это строка — парсим в объект { "timestamp": count }
    const calendar = JSON.parse(
        calendarData.data.matchedUser.userCalendar.submissionCalendar
    );

    // Конвертируем timestamps в Set из дат "YYYY-MM-DD" для быстрого поиска
    const activeDates = new Set(
        Object.keys(calendar).map(ts =>
            new Date(parseInt(ts) * 1000).toISOString().split('T')[0]
        )
    );

    // --- ТЕКУЩИЙ СТРИК (считаем вручную) ---
    // LeetCode в API даёт max streak, а не текущий — считаем сами
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Если сегодня ещё не решал — начинаем со вчера
    let checkStr = activeDates.has(todayStr) ? todayStr : yesterdayStr;
    let checkDate = new Date(checkStr + 'T00:00:00Z');
    let streak = 0;

    while (activeDates.has(checkStr)) {
        streak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
        checkStr = checkDate.toISOString().split('T')[0];
    }

    // --- HEATMAP НЕДЕЛИ (последние 20 недель) ---
    // Строим массив недель как у GitHub: [{date, count}, ...][]
    const weeks = [];
    const endDate = new Date();
    endDate.setUTCHours(0, 0, 0, 0);

    // Откатываемся на 20 недель назад и выравниваем на воскресенье
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

    // --- СТАТЫ Easy/Medium/Hard ---
    const acStats  = statsData.data.matchedUser.submitStats.acSubmissionNum;
    const totals   = statsData.data.allQuestionsCount;

    const find = (arr, diff) => arr.find(s => s.difficulty === diff)?.count ?? 0;

    const stats = {
        easy:   { solved: find(acStats, 'Easy'),   total: find(totals, 'Easy') },
        medium: { solved: find(acStats, 'Medium'), total: find(totals, 'Medium') },
        hard:   { solved: find(acStats, 'Hard'),   total: find(totals, 'Hard') },
    };

    // --- ПОСЛЕДНИЕ РЕШЁННЫЕ ---
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