import { useImmer } from "use-immer";
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
}) {
  const [isWindow, setIsWindow] = useImmer(false);
  //   isWindow && setFocus("window-" + app.id + "-cont");
  return (
    <>
      <div
        className="app"
        id={app.id}
        onClick={(e) => selection(e, app.id)}
        onDoubleClick={() => {
          setIsWindow(true);
          updateOpenApps([...openApps, app]);
          setFocusApp(app.id);
        }}
      >
        <Icon app={app} />
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
        ></Window>
      )}
    </>
  );
}
export default Cont;
