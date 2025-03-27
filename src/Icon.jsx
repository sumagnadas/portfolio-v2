export function Icon({ app, onclick, id, isFocus }) {
  return (
    <div
      className={"icon" + (isFocus ? " focusIcon" : "")}
      onClick={onclick}
      id={id}
    >
      <img src={"/portfolio-v2" + app.img} alt="text" />
    </div>
  );
}
