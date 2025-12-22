import { Icon } from "./Icon";
import { restore, winRefs } from "./helpers";
import { socialLinks } from "./info";

function DockApps({ openApps, focusApp, animations, setFocusApp }) {
  const appIcons = openApps.map((app) => (
    <div className="nav-app" key={app.id}>
      <Icon
        img={app.img}
        onclick={() => {
          restore(animations, app.id, winRefs[app.id]);
          setFocusApp(app.id);
        }}
        isFocus={focusApp === app.id}
      ></Icon>
    </div>
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

function NavBar({ openApps, focusApp, animations, setFocusApp, theme }) {
  const socialApps = socialLinks.map((social) => {
    const img = `assets/${social.id}-${theme}.${social.file ?? "png"}`;
    return (
      <div className="nav-app" key={social.id}>
        <Icon
          img={img}
          id={social.id}
          onclick={() => open(social.link)}
        />
      </div>
    );
  });
  return (
    <div className="nav">
      <div className="cont">
        {socialApps}
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
