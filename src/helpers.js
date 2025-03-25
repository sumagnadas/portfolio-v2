export function selection(e, id) {
    e.stopPropagation();
    if (id) {
      let x = document.getElementById(id);
      let y = document.getElementsByClassName("select");

      if (y.length == 1) y[0].classList.remove("select");

      x.classList.add("select");
    }
}
export function removeSelection() {// countering for the effect that pressing on the icon also triggers this function
    var x = document.getElementsByClassName('select');
    for (; x.length > 0;) {
        x[0].classList.remove("select");
    }
}
// resize the window accordingly
export function resize(posX, posY, resizeProps) {
    const appWindow = document.getElementById(resizeProps.id)
    if (resizeProps.size.x && resizeProps.move.x) {
        // cursor on the left side
        // dont move the window by resizing or anything if its already at the min width
        // appWindow.offsetLeft + appWindow.offsetWidth - 10 = appWindwow.parentElement.offsetLeft+10 +appWindow.offsetWidth - 10
        if (posX <= appWindow.parentElement.offsetLeft + appWindow.offsetWidth) {
            appWindow.style.width = `${appWindow.offsetWidth - (posX - appWindow.parentElement.offsetLeft - 10)}px`;
            appWindow.parentElement.style.left = `${posX - 10}px`
        }
    }
    else if (resizeProps.size.x) // cursor on the right side
        appWindow.style.width = `${appWindow.offsetWidth + (posX - appWindow.parentElement.offsetLeft - 10 - appWindow.offsetWidth)}px`;
    if (resizeProps.size.y && resizeProps.move.y) {
        // cursor on the top side
        // dont move the window by resizing or anything if its already at the min height
        // appWindow.offsetTop + appWindow.offsetHeight - 10 = appWindwow.parentElement.offsetTop+10 +appWindow.offsetHeight - 10
        if (posY <= appWindow.parentElement.offsetTop + appWindow.offsetHeight) {
            appWindow.style.height = `${appWindow.offsetHeight - (posY - (appWindow.parentElement.offsetTop + 10))}px`;
            appWindow.parentElement.style.top = `${posY - 10}px`
        }
    }
    else if (resizeProps.size.y) // cursor on the bottom side
        appWindow.style.height = `${appWindow.offsetHeight + (posY - (appWindow.parentElement.offsetTop + 10) - appWindow.offsetHeight)}px`;
}
// hide the window into the dock
export function hide(animations, id) {
    const appWindow = document.getElementById(`window-${id}`);
    appWindow.classList.add('hidden');

    appWindow.style.minWidth = '0';
    appWindow.style.minHeight = '0';
     appWindow.style.height ='0';
     appWindow.style.width= '0';

    // add animation for the hiding
    let finalState = {
        height: '0',
        width: '0',
        offset: 1,
    }
    let initialState =
    {
        height: `${appWindow.offsetHeight}px`,
        width: `${appWindow.offsetWidth}px`,
        offset: 0,

    }
    animations[id] = {height: `${appWindow.offsetHeight}px`,
    width: `${appWindow.offsetWidth}px`,}
    // just before the window goes to the dock, get it out from display
    setTimeout(() => appWindow.parentElement.style.display = 'none', 199);

    // pause it midway as if its hidden
    // playing it will return it to its location
    // setTimeout(() => animations[id].pause(), 200);
}
export function restore(animations, id) {
    const appWindow = document.getElementById(`window-${id}`);
    if (appWindow.classList.contains('hidden')) {
        setTimeout(() => {
            appWindow.parentElement.style.display = 'grid'

        }, 1);
        appWindow.style.height =animations[id].height;
        appWindow.style.width= animations[id].width;
        
        appWindow.style.minWidth = '10px';
        appWindow.style.minHeight = '10px';
        appWindow.classList.remove('hidden');
    }
}