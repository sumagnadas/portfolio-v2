// import { useState } from "react";
// import "./App.css";
import Cont from "./Cont";
import NavBar from "./NavBar";
import { useImmer } from "use-immer";
import { resize } from "./helpers";

const apps = [
  { id: "file", name: "hello", img: "assets/test.png" },
  {
    id: "TING",
    name: "There Is NO Game Wrong Dimension",
    img: "assets/test.png",
  },
  { id: "random", name: "random app", img: "assets/test.png" },
];
let animations = [];
function App() {
  const [beingResized, setResized] = useImmer(false);
  const [beingDragged, setDragged] = useImmer(false);
  const [openApps, updateOpenApps] = useImmer([]);
  const [resizeProps, updateResizeProps] = useImmer({
    size: {
      x: false,
      y: false,
    },
    move: {
      x: false,
      y: false,
    },
    id: "",
  });
  const [dragProps, updateDragProps] = useImmer({
    id: "",
    offset: {
      x: undefined,
      y: undefined,
    },
  });
  const [focusApp, setFocusApp] = useImmer("");
  document.body.onmousemove = (e) => {
    if (beingResized) {
      // setFocus(elem, appWindows);
      resize(e.pageX, e.pageY, resizeProps);
    } else if (beingDragged) {
      const appWindow = document.getElementById(`window-${dragProps.id}-cont`);
      let offsetX = dragProps.offset.x ?? e.pageX - appWindow.offsetLeft;
      let offsetY = dragProps.offset.y ?? e.pageY - appWindow.offsetTop;

      // moving the element now is all on the container
      appWindow.style.left = `${e.pageX - offsetX}px`;
      appWindow.style.top = `${e.pageY - offsetY}px`;

      updateDragProps((draft) => {
        draft.offset.x = offsetX;
        draft.offset.y = offsetY;
      });
    }
  }; // added to body as it can be dragged and resized anywhere
  document.body.onmouseup = () => {
    setResized(false);
    setDragged(false);
    updateResizeProps({
      size: {
        x: false,
        y: false,
      },
      move: {
        x: false,
        y: false,
      },
      id: "",
    });
    updateDragProps((draft) => {
      draft.offset.x = null;
      draft.offset.y = null;
    });
  };
  if (!beingResized) {
    document.body.style.cursor = "auto";
  }
  const deskIcons = apps.map((app) => (
    <Cont
      key={app.id}
      app={app}
      beingResized={beingResized}
      updateResizeProps={updateResizeProps}
      updateOpenApps={updateOpenApps}
      openApps={openApps}
      setResized={setResized}
      setDragged={setDragged}
      updateDragProps={updateDragProps}
      isFocus={focusApp === app.id}
      setFocusApp={setFocusApp}
      animations={animations}
      beingDragged={beingDragged}
    />
  ));
  return (
    <>
      {deskIcons}
      <NavBar
        openApps={openApps}
        focusApp={focusApp}
        animations={animations}
        setFocusApp={setFocusApp}
      />
    </>
  );
}

export default App;
