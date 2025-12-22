import { useEffect, useState } from "react";

function Notifs() {
    let notifLists = [{ "title": "Sumagna Das", mesg: "Check out my latest blog post" }]
    let notifs = notifLists.map((elem) => {
        return (

            <div className="notif-area" style={{ backgroundColor: "rgba(63, 63, 63, 0.98)", display: "flex", width: "60%", height: "20%", padding: "3%", alignContent: "start", boxSizing: "border-box", justifyContent: "start", flexDirection: "column", borderRadius: "1.5%/1.5%" }}>
                <div>{elem.title}</div>
                <div>{elem.mesg}</div>
            </div>
        );
    })
    return <div style={{ color: "white", boxSizing: "border-box", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "start", position: "absolute", width: "45vw", height: "50vh", top: "4.5vh", left: "27.5vw", backgroundColor: "rgba(26, 26, 26, 0.98)", borderRadius: "1.5%/1.5%" }}>
        <div className="notif-main" style={{ boxSizing: "border-box", height: "100%", display: "flex", flexDirection: "row", width: "100%", }}>
            {notifs}
        </div>
    </div>

}
function NotifBar() {
    let [curr_time, setCurrTime] = useState(new Date(Date.now()));
    let [showNotifs, setShowNotifs] = useState(false);
    setTimeout(() => { setCurrTime(new Date(Date.now())) }, 1000)

    return (
        <div className="notif-bar" style={{ zIndex: "100", position: "relative", padding: "auto", boxSizing: "border-box", justifyContent: "space-between", display: "flex", height: "4vh", width: "100vw", backgroundColor: "black", color: "white" }}>
            <div >Activites</div>
            <div className="notif-button" onClick={() => { setShowNotifs(!showNotifs) }}>{`${curr_time.toDateString()} ${String(curr_time.getHours()).padStart(2, "0")}:${String(curr_time.getMinutes()).padStart(2, "0")}`}</div>
            <div >Activites</div>
            {showNotifs && <Notifs />}
        </div>
    );
}
export default NotifBar;