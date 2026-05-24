import prisma from '@/lib/prisma';

export async function GET() {
    const habits = await prisma.habit.findMany({
        orderBy: { createdAt: 'asc' }
    });
    return Response.json(habits);
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
    const { streak, lastChecked, markedForDate } = await request.json();
    const habit = await prisma.habit.update({
        where: { id },
        data: { streak, lastChecked, markedForDate }
    });
    return Response.json(habit);
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await prisma.habit.delete({ where: { id } });
    return Response.json({ ok: true });
}