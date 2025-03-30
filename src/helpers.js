import { createContext } from "react";

export function selection(e, contRef) {
    e.stopPropagation();
    let x = contRef.current;
    let y = document.getElementsByClassName("select");

    if (y.length == 1) y[0].classList.remove("select");

    x.classList.add("select");
}
export function removeSelection() {// countering for the effect that pressing on the icon also triggers this function
    var x = document.getElementsByClassName('select');
    for (; x.length > 0;) {
        x[0].classList.remove("select");
    }
}
// resize the window accordingly
export function resize(posX, posY, resizeProps) {
    const appWindow = resizeProps.window;
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
export function hide(animations, winRef) {
    const appWindow = winRef;
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
    animations[appWindow.id] = {height: `${appWindow.offsetHeight}px`,
    width: `${appWindow.offsetWidth}px`,}
    // just before the window goes to the dock, get it out from display
    setTimeout(() => appWindow.parentElement.style.display = 'none', 199);

    // pause it midway as if its hidden
    // playing it will return it to its location
    // setTimeout(() => animations[id].pause(), 200);
}
export function restore(animations, id, appWindow) {
    let app_id = `window-${id}`;
    if (appWindow.classList.contains('hidden')) {
        // animations[id].play() // for later animation purposes
        appWindow.parentElement.style.display = 'grid'
        setTimeout(() => {
            appWindow.parentElement.style.display = 'grid'

        }, 1);
        appWindow.style.height =animations[app_id].height;
        appWindow.style.width= animations[app_id].width;
        
        appWindow.style.minWidth = '10px';
        appWindow.style.minHeight = '10px';
        appWindow.classList.remove('hidden');
    }
}
export const WindowContext = createContext()
export function maxRestore(e, drag,winRef, prevState, setPrevState) {
    const appWindow = winRef;
    if (!appWindow.classList.contains('max') && !drag) {
        // save eveything of the previous state to varbiables
        setPrevState({
        top: appWindow.parentElement.offsetTop,
        left: appWindow.parentElement.offsetLeft,
        height: appWindow.offsetHeight,
        width: appWindow.offsetWidth,
        })

        // set everything to max and also
        appWindow.classList.add('max');

        // moving the element now is all on the container
        appWindow.parentElement.style.top = '0';
        appWindow.parentElement.style.left = '0';
        // the container element to full size
        appWindow.parentElement.style.height = '100%';
        appWindow.parentElement.style.width = '100%';

        // grid doesn't work well with elements being display: none
        appWindow.parentElement.style.display = 'block';

        // set the main window to max
        appWindow.style.height = '100%';
        appWindow.style.width = '100%';

        // remove the border pieces
        for (let x = 0; x < 9; x++) { if (x != 4) appWindow.parentElement.childNodes[x].style.display = 'none'; }
    }
    else if (appWindow.classList.contains('max')) {
        if (drag) {
            // the ratio of the cursor position in the rectangle of status bar is used for OS-like feeling
            let offsetRatioX = e.pageX / appWindow.offsetWidth;
            let offsetRatioY = e.pageY / appWindow.offsetHeight;

            // moving the element now is all on the container
            appWindow.parentElement.style.left = `${e.pageX - prevState.width * offsetRatioX - 10}px`;
            appWindow.parentElement.style.top = `${e.pageY - prevState.height * offsetRatioY - 10}px`;
        }
        else {
            appWindow.parentElement.style.left = `${prevState.left}px`
            appWindow.parentElement.style.top = `${prevState.top}px`;
        }
        // set everything back to normal
        appWindow.parentElement.style.display = 'block';
        for (let x = 0; x < 9; x++) { if (x != 4) appWindow.parentElement.childNodes[x].style.display = 'block'; }
        appWindow.parentElement.style.removeProperty('height')
        appWindow.parentElement.style.removeProperty('width');
        appWindow.style.width = `${prevState.width}px`;
        appWindow.style.height = `${prevState.height}px`;
        appWindow.classList.remove('max');
    }
}
export let winRefs = [];