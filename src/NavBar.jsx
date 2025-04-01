import { Icon } from "./Icon";
import { restore, winRefs } from "./helpers";

const socialLinks = [
  { id: "github", link: "https://github.com/sumagnadas", file: "svg" },
  { id: "linkedin", link: "https://linkedin.com/in/sumagnadas" },
  { id: "leetcode", link: "https://leetcode.com/sumagnadas" },
  {
    id: "codeforces",
    link: "https://codeforces.com/profile/sumagnadas",
    file: "svg",
  },
];
function DockApps({ openApps, focusApp, animations, setFocusApp }) {
  const appIcons = openApps.map((app) => (
    <Icon
      key={app.id}
      img={app.img}
      onclick={() => {
        restore(animations, app.id, winRefs[app.id]);
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

function NavBar({ openApps, focusApp, animations, setFocusApp, theme }) {
  const socialApps = socialLinks.map((social) => {
    const img = `assets/${social.id}-${theme}.${social.file ?? "png"}`;
    return (
      <Icon
        key={social.id}
        img={img}
        id={social.id}
        onclick={() => open(social.link)}
      />
    );
  });
  console.log(socialApps);
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
