import { Icon } from "./Icon";
import { restore } from "./helpers";

function DockApps({ openApps, focusApp, animations, setFocusApp }) {
  const appIcons = openApps.map((app) => (
    <Icon
      key={app.id}
      app={app}
      onclick={() => {
        restore(animations, app.id);
        setFocusApp(app.id);
      }}
      isFocus={focusApp === app.id}
    ></Icon>
  ));
  return (
    <div
      id="apps"
      style={
        openApps.length >= 1 ? { borderWidth: "1px" } : { borderWidth: "0px" }
      }
    >
      {appIcons}
    </div>
  );
}

function NavBar({ openApps, focusApp, animations, setFocusApp }) {
  return (
    <div className="nav">
      <div className="cont">
        <div className="icon">
          <img src="assets/test.png" alt="text" />
        </div>
        <div className="icon">
          <img src="assets/test.png" alt="text" />
        </div>
        <div className="icon">
          <img src="assets/test.png" alt="text" />
        </div>
        <div className="icon">
          <img src="assets/test.png" alt="text" />
        </div>
        <DockApps
          openApps={openApps}
          focusApp={focusApp}
          animations={animations}
          setFocusApp={setFocusApp}
        />
      </div>
    </div>
  );
}
export default NavBar;
