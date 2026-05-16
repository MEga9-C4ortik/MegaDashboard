import DailyFocus from "../components/widgets/DailyFocus";

export default function Home() {

    return (
        <>
            <div className="date">
                {new Date().toLocaleDateString("en-US")}
            </div>

            <div className="daily-focus">

            </div>
        </>
    )
}