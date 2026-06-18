import Study from '../../components/widgets/Study';

export default function Page() {
    return (
        <main className="h-dvh bg-neutral-950 text-white p-2 overflow-hidden grid gap-2"
              style={{
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 240px',
              }}
        >
            <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800/50 flex flex-col min-h-0 overflow-hidden">
                <Study />
            </div>
            <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800/50 flex flex-col min-h-0">
                <span className="text-xs text-neutral-700 uppercase tracking-widest">Hobby</span>
            </div>
            <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800/50 col-span-2">
                <span className="text-xs text-neutral-700 uppercase tracking-widest">LeetCode</span>
            </div>
        </main>
    );
}