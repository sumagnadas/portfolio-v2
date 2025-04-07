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
            let newApps = [
              {
                ...app,
                priority: 1,
                hidden: false,
                win: (
                  <Window
                    key={app.id}
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
                ),
              },
              ...openApps,
            ];
            for (let index = 1; index < newApps.length; index++) {
              newApps[index].priority += 1;
            }
            updateOpenApps(newApps);
            setFocusApp(app.id);
          }
        }}
      >
        <Icon img={app.img} id={app.id} />
        <div className="name">{app.name}</div>
      </div>
    </>
  );
}
export default Cont;
