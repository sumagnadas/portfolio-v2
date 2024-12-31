// this function will always be ran whenever the file is loaded 
// no extra global variables when run this way
(function () {
    const apps = document.getElementsByClassName('app');
    document.body.addEventListener('mousemove', dragAndResize)// added to body as it can be dragged and resized anywhere
    document.body.addEventListener('mousedown', e => {
        const appWindow = document.getElementsByClassName('resized')[0];
        if (appWindow ?? false) {
            beingResized = true;
        }
    })// start resizing if its in a border of a window
    document.body.addEventListener('mouseup', e => {
        beingResized = false;
        document.body.style.cursor = 'auto';

        let elem = document.getElementsByClassName('resized')[0];
        if (elem ?? false)
            elem.classList.remove('resized');
        sizeX = false, sizeY = false, moveX = false, moveY = false;
    })// stop resizing if its in a border of a window
    document.body.addEventListener('click', removeSelection);
    for (let app of apps) {
        app.addEventListener('click', (e) => selection(app.id));
        app.addEventListener('dblclick', (e) => addApp(app.id));
        app.addEventListener('dblclick', (e) => showWindow(app.id));
    }
})()
animations = {};
function restore(e, id) {
    const appWindow = document.getElementById(`window-${id}`);
    if (appWindow.classList.contains('hidden')) {
        animations[id].play()
        setTimeout(() => {
            appWindow.parentElement.style.display = 'grid'

        }, 1);
        appWindow.style.minWidth = '10px';
        appWindow.style.minHeight = '10px';
        appWindow.classList.remove('hidden');
    }
    setFocus(appWindow);
}

function setFocus(appWindow) {
    const dockIcons = document.getElementsByClassName('focusIcon')
    if (dockIcons.length == 1)
        dockIcons[0].classList.remove('focusIcon');
    const dockIcon = document.getElementById(appWindow.id.replace('window', 'app'));
    dockIcon.classList.add('focusIcon');
    let y = document.getElementsByClassName('focused');
    if (y.length == 1)
        y[0].classList.remove("focused");
    appWindow.parentElement.classList.add('focused')
}
// add app to the dock
function addApp(id) {
    // the icon element going to be added to the dock
    const icon = document.createElement('div');
    icon.classList.add('icon');
    icon.id = `app-${id}`;
    icon.addEventListener('click', (e) => restore(e, id));

    // the img element containing the icon
    const img = document.getElementById(id).firstElementChild.firstElementChild;
    const new_img = document.createElement('img');
    new_img.src = img.src
    new_img.alt = img.alt;

    // adding the icon to the container 
    const navbar = document.getElementById('apps');// this is the container of the navbar extra apps
    icon.appendChild(new_img);
    navbar.appendChild(icon);
    navbar.style.borderLeftWidth = '1px';
}

// remove app from the dock
function removeApp(id) {
    const icon = document.getElementById(`app-${id}`);
    icon.remove();
    const navbar = document.getElementById('apps');
    if (!navbar.childNodes.length)
        navbar.style.borderLeftWidth = '0';
}

let beingResized = false;
// resize the window accordingly
function resize(appWindow, posX, posY, sizeX, sizeY, moveX, moveY) {
    setFocus(appWindow);
    if (sizeX && moveX) {
        // cursor on the left side
        // dont move the window by resizing or anything if its already at the min width
        // appWindow.offsetLeft + appWindow.offsetWidth - 10 = appWindwow.parentElement.offsetLeft+10 +appWindow.offsetWidth - 10
        if (posX <= appWindow.parentElement.offsetLeft + appWindow.offsetWidth) {
            appWindow.style.width = `${appWindow.offsetWidth - (posX - appWindow.parentElement.offsetLeft - 10)}px`;
            appWindow.parentElement.style.left = `${posX - 10}px`
        }
    }
    else if (sizeX) // cursor on the right side
        appWindow.style.width = `${appWindow.offsetWidth + (posX - appWindow.parentElement.offsetLeft - 10 - appWindow.offsetWidth)}px`;
    if (sizeY && moveY) {
        // cursor on the top side
        // dont move the window by resizing or anything if its already at the min height
        // appWindow.offsetTop + appWindow.offsetHeight - 10 = appWindwow.parentElement.offsetTop+10 +appWindow.offsetHeight - 10
        if (posY <= appWindow.parentElement.offsetTop + appWindow.offsetHeight) {
            appWindow.style.height = `${appWindow.offsetHeight - (posY - (appWindow.parentElement.offsetTop + 10))}px`;
            appWindow.parentElement.style.top = `${posY - 10}px`
        }
    }
    else if (sizeY) // cursor on the bottom side
        appWindow.style.height = `${appWindow.offsetHeight + (posY - (appWindow.parentElement.offsetTop + 10) - appWindow.offsetHeight)}px`;
}
// states whether only the size is increasing in X,Y axes resp (sizeX, sizeY)
// or is the top left corner (moveX, moveY) also going to be moved as if the window is being resized
let sizeX = false, sizeY = false, moveX = false, moveY = false;

// the offset of the cursor from the window position to drag it
// this offset stays fixed making it look like its being dragged around
let offsetX, offsetY;
// drag the window around or set the parameters for resizing
function dragAndResize(e) {
    const appWindows = document.getElementsByClassName('window');
    // if its being resized, dont do anything else like dragging and checking whether its going to be resized
    if (beingResized) {
        let elem = document.getElementsByClassName('resized')[0];
        // setFocus(elem, appWindows);
        resize(elem, e.pageX, e.pageY, sizeX, sizeY, moveX, moveY);
    }
    else {
        for (let appWindow of appWindows) {
            // check if a window is being dragged around and set the topleft corner respectively
            if (appWindow.classList.contains('max'))
                continue;
            if (appWindow.classList.contains('dragged')) {
                setFocus(appWindow);
                offsetX = offsetX ?? (e.pageX - appWindow.parentElement.offsetLeft);
                offsetY = offsetY ?? (e.pageY - appWindow.parentElement.offsetTop);

                // moving the element now is all on the container
                appWindow.parentElement.style.left = `${e.pageX - offsetX}px`;
                appWindow.parentElement.style.top = `${e.pageY - offsetY}px`;
            }
        }
    }
}

// resize to maximum and also restore it to previous size when dragged or max button pressed
function maxRestore(e, id, drag) {
    const appWindow = document.getElementById(`window-${id}`);
    if (!appWindow.classList.contains('max') && !drag) {
        // save eveything of the previous state to varbiables
        prevTop = appWindow.parentElement.offsetTop;
        prevLeft = appWindow.parentElement.offsetLeft;
        prevHeight = appWindow.offsetHeight;
        prevWidth = appWindow.offsetWidth;

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
            appWindow.parentElement.style.left = `${e.pageX - prevWidth * offsetRatioX - 10}px`;
            appWindow.parentElement.style.top = `${e.pageY - prevHeight * offsetRatioY - 10}px`;
        }
        else {
            appWindow.parentElement.style.left = `${prevLeft}px`
            appWindow.parentElement.style.top = `${prevTop}px`;
        }
        // set everything back to normal
        appWindow.parentElement.style.display = 'grid';
        for (let x = 0; x < 9; x++) { if (x != 4) appWindow.parentElement.childNodes[x].style.display = 'block'; }
        appWindow.parentElement.style.removeProperty('height')
        appWindow.parentElement.style.removeProperty('width');
        appWindow.style.width = `${prevWidth}px`;
        appWindow.style.height = `${prevHeight}px`;
        appWindow.classList.remove('max');
    }
}

// hide the window into the dock
function hide(e, id) {
    const appWindow = document.getElementById(`window-${id}`);
    appWindow.classList.add('hidden');

    const icon = document.getElementById(`app-${id}`);
    appWindow.style.minWidth = '0';
    appWindow.style.minHeight = '0';

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
    animations[id] = appWindow.animate([
        initialState,
        finalState
    ],
        {
            duration: 200,
            iterations: 2,
            direction: 'alternate',
            playbackRate: 0.5
        }
    )
    // just before the window goes to the dock, get it out from display
    setTimeout(() => appWindow.parentElement.style.display = 'none', 199);

    // pause it midway as if its hidden
    // playing it will return it to its location
    setTimeout(() => animations[id].pause(), 200);
}

const cursCols = ['w', '', 'e'];
const cursRows = ['n', '', 's'];
// show the window
function showWindow(id) { // too much extra code, will clean later
    removeSelection();
    // Create a template app window
    const appWindows = document.getElementsByClassName('window-cont');
    const appWindowCont = document.createElement('div');
    appWindowCont.classList.add('window-cont');
    const appWindow = document.createElement('div');
    appWindow.classList.add('window');
    for (let y = 0; y < 3; y++) {
        let curs_type = '';
        for (let x = 0; x < 3; x++) {
            if (!(y == 1 && x == 1)) {
                const borderPiece = document.createElement('div');
                curs_type = cursRows[y] + cursCols[x];
                borderPiece.style.cursor = curs_type + '-resize';
                appWindowCont.appendChild(borderPiece)
                borderPiece.addEventListener('mouseenter', (e) => appWindow.classList.add('resized'));
                borderPiece.addEventListener('mouseout', (e) => { if (!beingResized) appWindow.classList.remove('resized'); });
                borderPiece.addEventListener('mousedown', (e) => {
                    if (x != 1)
                        sizeX = true;
                    if (x == 0)
                        moveX = true;
                    if (y != 1)
                        sizeY = true;
                    if (y == 0)
                        moveY = true;
                    document.body.style.cursor = borderPiece.style.cursor;
                })

            }
            else
                appWindowCont.appendChild(appWindow);
        }
    }
    appWindow.id = `window-${id}`;
    setFocus(appWindow);
    appWindow.addEventListener('click', (e) => {
        if (appWindowCont.style.zIndex != 2) {
            setFocus(appWindow);
        }
    })
    // add a basic title bar
    const title_bar = document.createElement('div');
    title_bar.classList.add('title_bar');
    title_bar.addEventListener('mousedown', (e) => appWindow.classList.add('dragged'))
    document.body.addEventListener('mousemove', (e) => {
        if (appWindow.classList.contains('dragged'))
            maxRestore(e, id, true);
    })
    document.body.addEventListener('mouseup', (e) => { appWindow.classList.remove('dragged'); offsetX = undefined; offsetY = undefined });

    // add button for closing, max size, hiding the window
    const close_button = document.createElement('div');
    const max_button = document.createElement('div');
    const hide_button = document.createElement('div');

    // add the classes for the buttons
    close_button.classList.add('title', 'close')
    max_button.classList.add('title', 'max')
    hide_button.classList.add('title', 'hide')

    // add the click functions
    close_button.addEventListener('click', function (e) { appWindowCont.remove(); removeApp(id) })
    max_button.addEventListener('click', (e) => maxRestore(e, id, false))
    hide_button.addEventListener('click', (e) => hide(e, id));

    // add the buttons to the title bar
    title_bar.appendChild(hide_button);
    title_bar.appendChild(max_button);
    title_bar.appendChild(close_button);

    // add the elements created to their respective containers
    appWindow.appendChild(title_bar);
    appWindow.appendChild(document.createTextNode('Hello'));
    document.body.insertAdjacentElement('beforeend', appWindowCont);

    // (for now)place the new window (10,10) distance away from the last added window
    if (appWindows.length > 1) {
        setFocus(appWindow);
        const windows = document.getElementsByClassName('window');
        const last = windows[windows.length - 2];
        appWindowCont.style.top = `${Number.parseInt(last.parentElement.style.top) + 10}px`;
        appWindowCont.style.left = `${Number.parseInt(last.parentElement.style.left) + 10}px`;
    }
    else {
        // fix the window in place
        appWindowCont.style.top = `${appWindowCont.offsetTop}px`;
        appWindowCont.style.left = `${appWindowCont.offsetLeft}px`;
    }
}

let appPressed = false;
function selection(id) {
    if (id) {
        let x = document.getElementById(id);
        let y = document.getElementsByClassName('select');

        if (y.length == 1)
            y[0].classList.remove("select");

        x.classList.add("select");
        appPressed = true;
    }
}
function removeSelection() {
    if (!appPressed) { // countering for the effect that pressing on the icon also triggers this function
        var x = document.getElementsByClassName('select');
        for (; x.length > 0;) {
            x[0].classList.remove("select");
        }
    }
    else
        appPressed = false;
}