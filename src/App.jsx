// import { useState } from "react";
// import "./App.css";
import Cont from "./Cont";
import NavBar from "./NavBar";
import { useImmer } from "use-immer";
import { resize } from "./helpers";
import { useRef } from "react";
import { apps } from "./info";

let animations = [];
function App() {
  const [theme, setTheme] = useImmer("light");
  const [leftPositions, setLeft] = useImmer({});
  const [rightPositions, setRight] = useImmer({});
  const [leftContPositions, setLeftCont] = useImmer({});
  const [rightContPositions, setRightCont] = useImmer({});
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
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
    window: null,
  });
  const [dragProps, updateDragProps] = useImmer({
    window: null,
    offset: {
      x: undefined,
      y: undefined,
    },
  });
  const [focusApp, setFocusApp] = useImmer("");
  document.body.onmousemove = (e) => {
    const leftStyle = leftEyeRef.current.style;
    const rightStyle = rightEyeRef.current.style;

    const leftParentStyle = leftEyeRef.current.parentElement.style;
    const rightParentStyle = rightEyeRef.current.parentElement.style;

    const bodyStyle = window.getComputedStyle(document.body);

    let x1 =
      parseFloat(bodyStyle.width) / 2 -
      parseInt(bodyStyle.getPropertyValue("--absPos"));
    let y1 = parseFloat(bodyStyle.height) / 2;
    let angle1 = Math.atan2(e.pageY - y1, e.pageX - x1);

    let x2 =
      parseFloat(bodyStyle.width) / 2 +
      parseInt(bodyStyle.getPropertyValue("--absPos"));
    let y2 = parseFloat(bodyStyle.height) / 2;
    let angle2 = Math.atan2(e.pageY - y2, e.pageX - x2);

    leftStyle.setProperty("--angle", `${angle1}`);
    rightStyle.setProperty("--angle", `${angle2}`);

    leftParentStyle.setProperty("--angle", `${angle1}`);
    rightParentStyle.setProperty("--angle", `${angle2}`);

    if (beingResized) {
      // setFocus(elem, appWindows);
      resize(e.pageX, e.pageY, resizeProps);
    } else if (beingDragged) {
      const appWindow = dragProps.window.parentElement;
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
      <div
        className="eye-cont leftEye"
        onMouseMove={(e) => {
          setLeftCont({
            left: `${
              document.body.offsetWidth / 2 -
              135 +
              (e.pageX - (e.currentTarget.offsetLeft + 45)) / 4.5
            }px`,
            top: `${
              document.body.offsetHeight / 2 -
              45 +
              (e.pageY - (e.currentTarget.offsetTop + 45)) / 4.5
            }px`,
          });
          if (
            Math.sqrt(
              (e.pageX - (e.currentTarget.offsetLeft + 45)) ** 2 +
                (e.pageY - (e.currentTarget.offsetTop + 45)) ** 2
            ) <= 22.5
          ) {
            setLeft({
              left: `${e.pageX - e.currentTarget.offsetLeft - 22.5}px`,
              top: `${e.pageY - e.currentTarget.offsetTop - 22.5}px`,
            });
          } else {
            () => setLeft({});
          }
        }}
        onMouseLeave={() => {
          setLeft({});
          setLeftCont({});
        }}
        style={leftContPositions}
      >
        <div
          className="cursor-follower leftEye"
          id="leftEye"
          ref={leftEyeRef}
          style={leftPositions}
        ></div>
      </div>
      <div
        className="eye-cont rightEye"
        onMouseMove={(e) => {
          setRightCont({
            left: `${
              document.body.offsetWidth / 2 +
              45 +
              (e.pageX - (e.currentTarget.offsetLeft + 45)) / 4.5
            }px`,
            top: `${
              document.body.offsetHeight / 2 -
              45 +
              (e.pageY - (e.currentTarget.offsetTop + 45)) / 4.5
            }px`,
          });
          if (
            Math.sqrt(
              (e.pageX - (e.currentTarget.offsetLeft + 45)) ** 2 +
                (e.pageY - (e.currentTarget.offsetTop + 45)) ** 2
            ) <= 22.5
          ) {
            setRight({
              left: `${e.pageX - e.currentTarget.offsetLeft - 22.5}px`,
              top: `${e.pageY - e.currentTarget.offsetTop - 22.5}px`,
            });
          } else {
            () => setRight({});
          }
        }}
        onMouseLeave={() => {
          setRight({});
          setRightCont({});
        }}
        style={rightContPositions}
      >
        <div
          className="cursor-follower rightEye"
          id="rightEye"
          ref={rightEyeRef}
          style={rightPositions}
        ></div>
      </div>
      {deskIcons}
      <NavBar
        openApps={openApps}
        focusApp={focusApp}
        animations={animations}
        setFocusApp={setFocusApp}
        theme={theme}
      />
    </>
  );
}

export default App;
