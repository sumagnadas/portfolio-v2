export function Icon({ img, onclick, id, isFocus }) {
  return (
    <div
      className={"icon" + (isFocus ? " focusIcon" : "")}
      onClick={onclick}
      id={id}
    >
      <img src={img} alt="text" />
    </div>
  );
}
