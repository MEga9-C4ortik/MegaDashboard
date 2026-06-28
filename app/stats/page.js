import Study from '../../components/widgets/Study';
import Hobby from '../../components/widgets/Hobbies';
import LeetCode from '../../components/widgets/LeetCode';

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
            <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800/50 flex flex-col min-h-0 overflow-hidden">
                <Hobby />
            </div>
            <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800/50 col-span-2">
                <LeetCode />
            </div>
        </main>
    );
}