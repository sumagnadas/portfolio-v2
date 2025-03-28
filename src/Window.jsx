// import { useState } from "react";

import { useImmer } from "use-immer";
import { removeSelection, hide, maxRestore } from "./helpers";

const cursCols = ["w", "", "e"];
const cursRows = ["n", "", "s"];
function Border({ id, beingResized, updateResizeProps, children, setResized }) {
  let elems = [];
  let curs_type = "";
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (!(y == 1 && x == 1)) {
        curs_type = cursRows[y] + cursCols[x] + "-resize";
        elems.push(
          <div
            style={{ cursor: curs_type }}
            onMouseEnter={() => {
              document.getElementById(id + "-cont").classList.add("resized");
            }}
            onMouseOut={() => {
              if (!beingResized)
                document
                  .getElementById(id + "-cont")
                  .classList.remove("resized");
            }}
            onMouseDown={() => {
              updateResizeProps((draft) => {
                draft.id = id;
              });
              if (x != 1)
                updateResizeProps((draft) => {
                  draft.size.x = true;
                });
              if (x == 0)
                updateResizeProps((draft) => {
                  draft.move.x = true;
                });
              if (y != 1)
                updateResizeProps((draft) => {
                  draft.size.y = true;
                });
              if (y == 0)
                updateResizeProps((draft) => {
                  draft.move.y = true;
                });
              document.body.style.cursor =
                cursRows[y] + cursCols[x] + "-resize";
              setResized(true);
            }}
            key={id + "-" + curs_type}
          ></div>
        );
      } else {
        elems.push(children);
      }
    }
  }
  return <>{elems}</>;
}
function TitleBar({
  id,
  setIsShown,
  updateOpenApps,
  setDragged,
  updateDragProps,
  animations,
  prevState,
  setPrevState,
  beingDragged,
}) {
  return (
    <div
      className="title_bar"
      onMouseDown={() => {
        setDragged(true);
        updateDragProps((draft) => {
          draft.id = id;
        });
        // e.stopPropagation();
      }}
      onMouseMove={(e) => {
        if (beingDragged) maxRestore(e, true, id, prevState, setPrevState);
      }}
      onMouseUp={() => {
        setDragged(false);
        updateDragProps((draft) => {
          draft.offset = { x: undefined, y: undefined };
        });
      }}
    >
      <div className="title hide" onClick={() => hide(animations, id)}></div>
      <div
        className="title max"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onMouseUp={(e) => {
          maxRestore(e, false, id, prevState, setPrevState);
        }}
      ></div>
      <div
        className="title close"
        onClick={() => {
          setIsShown(false);
          updateOpenApps((arr) => arr.filter((elem) => elem.id != id));
        }}
      ></div>
    </div>
  );
}
function Window({
  app,
  beingResized,
  updateResizeProps,
  setIsWindow,
  updateOpenApps,
  setResized,
  setDragged,
  updateDragProps,
  isFocus,
  setFocusApp,
  animations,
  beingDragged,
}) {
  let app_id = "window-" + app.id;
  removeSelection();
  const [prevState, setPrevState] = useImmer({
    top: null,
    left: null,
    height: null,
    width: null,
  });
  return (
    <div
      className={"window-cont" + (isFocus ? " focused" : "")}
      id={app_id + "-cont"}
      onMouseDown={() => setFocusApp(app.id)}
    >
      {/* style="top: 92px; left: 444px;"> */}
      <Border
        id={app_id}
        beingResized={beingResized}
        updateResizeProps={updateResizeProps}
        setResized={setResized}
      >
        <div className="window" id={app_id}>
          <TitleBar
            id={app.id}
            setIsShown={setIsWindow}
            updateOpenApps={updateOpenApps}
            setDragged={setDragged}
            updateDragProps={updateDragProps}
            animations={animations}
            prevState={prevState}
            setPrevState={setPrevState}
            beingDragged={beingDragged}
          />
          Hello
        </div>
      </Border>
    </div>
  );
}
export default Window;
