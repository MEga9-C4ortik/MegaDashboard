import prisma from '@/lib/prisma';

function getCurrentPeriod() {
    const now = new Date();
    if (now.getHours() < 12) {
        return new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
    }
    return now.toLocaleDateString('en-CA');
}

function getPreviousPeriod() {
    const now = new Date();
    if (now.getHours() < 12) {
        return new Date(Date.now() - 172800000).toLocaleDateString('en-CA');
    }
    return new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const habits = await prisma.habit.findMany({
        orderBy: { createdAt: 'asc' }
    });

    const currentPeriod = searchParams.get('current') || getCurrentPeriod();
    const previousPeriod = searchParams.get('previous') || getPreviousPeriod();

    const toReset = habits.filter(h =>
        h.streak > 0 &&
        h.markedForDate !== null &&
        h.markedForDate !== currentPeriod &&
        h.markedForDate !== previousPeriod
    );

    if (toReset.length > 0) {
        await Promise.all(toReset.map(h =>
            prisma.habit.update({
                where: { id: h.id },
                data: { streak: 0, previousStreak: 0 }
            })
        ));
    }

    return Response.json(habits.map(h =>
        toReset.find(r => r.id === h.id)
            ? { ...h, streak: 0, previousStreak: 0 }
            : h
    ));
}

export async function POST(request) {
    const { label } = await request.json();
    const habit = await prisma.habit.create({
        data: { label }
    });
    return Response.json(habit);
}

export async function PATCH(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    const { label, streak, previousStreak, markedForDate } = await request.json();
    const habit = await prisma.habit.update({
        where: { id },
        data: { label, streak, previousStreak, markedForDate }
    });
    return Response.json(habit);
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    await prisma.habit.delete({ where: { id } });
    return Response.json({ ok: true });
}