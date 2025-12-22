import { useEffect, useState } from "react";

function Notifs() {

}
function NotifBar() {
    let [curr_time, setCurrTime] = useState(new Date(Date.now()));
    setTimeout(() => { setCurrTime(new Date(Date.now())) }, 1000)

    return (
        <div className="notif-bar" style={{ zIndex: "100", position: "relative", padding: "auto", boxSizing: "border-box", justifyContent: "space-between", display: "flex", height: "4vh", width: "100vw", backgroundColor: "black", color: "white" }}>
            <div >Activites</div>
            <div className="notif-area">{`${curr_time.toDateString()} ${String(curr_time.getHours()).padStart(2, "0")}:${String(curr_time.getMinutes()).padStart(2, "0")}`}</div>
            <div >Activites</div>
        </div>
    );
}
export default NotifBar;