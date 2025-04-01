import { useImmer } from "use-immer";
import { useRef } from "react";
import { selection } from "./helpers";
import Window from "./Window";
import { Icon } from "./Icon";
function Cont({
  app,
  beingResized,
  updateResizeProps,
  updateOpenApps,
  openApps,
  setResized,
  setDragged,
  updateDragProps,
  isFocus,
  setFocusApp,
  animations,
  beingDragged,
}) {
  const [isWindow, setIsWindow] = useImmer(false);
  let contRef = useRef();
  return (
    <>
      <div
        className="app"
        id={app.id}
        ref={contRef}
        onClick={(e) => selection(e, contRef)}
        onDoubleClick={() => {
          if (!isWindow) {
            setIsWindow(true);
            updateOpenApps([...openApps, app]);
          }
          setFocusApp(app.id);
        }}
      >
        <Icon img={app.img} id={app.id} />
        <div className="name">{app.name}</div>
      </div>
      {isWindow && (
        <Window
          app={app}
          beingResized={beingResized}
          updateResizeProps={updateResizeProps}
          setIsWindow={setIsWindow}
          updateOpenApps={updateOpenApps}
          setResized={setResized}
          setDragged={setDragged}
          updateDragProps={updateDragProps}
          isFocus={isFocus}
          setFocusApp={setFocusApp}
          animations={animations}
          beingDragged={beingDragged}
        ></Window>
      )}
    </>
  );
}
export default Cont;
