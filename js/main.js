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
    })// stop resizing if its in a border of a window
    document.body.addEventListener('click', removeSelection);
    for (let app of apps) {
        app.addEventListener('click', (e) => selection(app.id));
        app.addEventListener('dblclick', (e) => showWindow(app.id));
        app.addEventListener('dblclick', (e) => addApp(app.id));
    }
})()
animations = {};
function restore(e, id) {

    const appWindow = document.getElementById(`window-${id}`);
    if (appWindow.classList.contains('hidden')) {
        animations[id].play()
        setTimeout(() => {
            appWindow.style.display = 'block';

        }, 1);
        appWindow.style.minWidth = '10px';
        appWindow.style.minHeight = '10px';
        appWindow.classList.remove('hidden');
        appWindow.style.zIndex = 2;

    }
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
    if (sizeX && moveX) {
        // cursor on the left side
        // dont move the window by resizing or anything if its already at the min width
        if (posX <= appWindow.offsetLeft + appWindow.offsetWidth - 10) {
            appWindow.style.width = `${appWindow.offsetWidth - (posX - appWindow.offsetLeft)}px`;
            appWindow.style.left = `${posX}px`
        }
    }
    else if (sizeX) // cursor on the right side
        appWindow.style.width = `${appWindow.offsetWidth + (posX - appWindow.offsetLeft - appWindow.offsetWidth)}px`;
    if (sizeY && moveY) {
        // cursor on the top side
        // dont move the window by resizing or anything if its already at the min height
        if (posY <= appWindow.offsetTop + appWindow.offsetHeight - 10) {
            appWindow.style.height = `${appWindow.offsetHeight - (posY - appWindow.offsetTop)}px`;
            appWindow.style.top = `${posY}px`
        }
    }
    else if (sizeY) // cursor on the bottom side
        appWindow.style.height = `${appWindow.offsetHeight + (posY - appWindow.offsetTop - appWindow.offsetHeight)}px`;
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
        resize(elem, e.pageX, e.pageY, sizeX, sizeY, moveX, moveY);
    }
    else {
        for (let appWindow of appWindows) {
            // check if a window is being dragged around and set the topleft corner respectively
            if (appWindow.classList.contains('max'))
                continue;
            if (appWindow.classList.contains('dragged')) {
                offsetX = offsetX ?? (e.pageX - appWindow.offsetLeft);
                offsetY = offsetY ?? (e.pageY - appWindow.offsetTop);
                appWindow.style.left = `${e.pageX - offsetX}px`;
                appWindow.style.top = `${e.pageY - offsetY}px`;
            }
            else {
                const distFromRightEdge = e.pageX - appWindow.offsetWidth - appWindow.offsetLeft;
                const distFromLeftEdge = e.pageX - appWindow.offsetLeft;
                const distFromBottomEdge = e.pageY - appWindow.offsetHeight - appWindow.offsetTop;
                const distFromTopEdge = e.pageY - appWindow.offsetTop;
                let curs_type = '';

                // check if the cursor is in a 4px border rectangle of a window
                if (distFromBottomEdge <= 4 && distFromTopEdge >= -4 && distFromRightEdge <= 4 && distFromLeftEdge >= -4) {
                    if (distFromBottomEdge <= 4 && distFromBottomEdge >= -4) {
                        // currently on the bottom side
                        curs_type += 's';
                        sizeY = true;
                    }
                    else if (distFromTopEdge <= 4 && distFromTopEdge >= -4) {
                        // currently on the top side
                        curs_type += 'n';
                        sizeY = true;
                        moveY = true;
                    }
                    else {
                        sizeY = false; moveY = false;
                    }
                    if (distFromRightEdge <= 4 && distFromRightEdge >= 0) {
                        // currently on the right side
                        curs_type += 'e';
                        sizeX = true;
                    }
                    else if (distFromLeftEdge >= -4 && distFromLeftEdge <= 0) {
                        // currently on the left side
                        curs_type += 'w';
                        sizeX = true;
                        moveX = true;
                    }
                    else { sizeX = false; moveX = false; }
                    appWindow.classList.add('resized')
                }
                if (curs_type == '') {
                    let elem = document.getElementsByClassName('resized')[0];
                    document.body.style.cursor = 'auto';
                    if (elem ?? false)
                        elem.classList.remove('resized');
                }
                else {
                    document.body.style.cursor = curs_type + '-resize';
                    break;
                }
            }
        }
    }
}

// resize to maximum and also restore it to previous size when dragged or max button pressed
function maxRestore(e, id, drag) {
    const appWindow = document.getElementById(`window-${id}`);
    if (!appWindow.classList.contains('max') && !drag) {
        // save eveything of the previous state to varbiables
        prevTop = appWindow.offsetTop;
        prevLeft = appWindow.offsetLeft;
        prevHeight = appWindow.offsetHeight;
        prevWidth = appWindow.offsetWidth;

        // set everything to max and also
        appWindow.classList.add('max');
        appWindow.style.top = '0';
        appWindow.style.left = '0';
        appWindow.style.height = '100%';
        appWindow.style.width = '100%';
    }
    else if (appWindow.classList.contains('max')) {
        if (drag) {
            // the ratio of the cursor position in the rectangle of status bar is used for OS-like feeling
            let offsetRatioX = (e.pageX - appWindow.offsetLeft) / appWindow.offsetWidth;
            let offsetRatioY = (e.pageY - appWindow.offsetTop) / appWindow.offsetHeight;

            appWindow.style.left = `${e.pageX - prevWidth * offsetRatioX}px`;
            appWindow.style.top = `${e.pageY - prevHeight * offsetRatioY}px`;
        }
        else {
            appWindow.style.left = `${prevLeft}px`
            appWindow.style.top = `${prevTop}px`;
        }
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
        left: `${icon.offsetLeft + icon.offsetWidth / 2}px`,
        top: `${document.body.offsetHeight - icon.offsetHeight / 2}px`,
        height: '0',
        width: '0',
        offset: 1,
    }
    let initialState =
    {
        left: `${appWindow.offsetLeft}px`,
        top: `${appWindow.offsetTop}px`,
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
    setTimeout(() => appWindow.style.display = 'none', 199);

    // pause it midway as if its hidden
    // playing it will return it to its location
    setTimeout(() => animations[id].pause(), 200);
}

// show the window
function showWindow(id) { // too much extra code, will clean later
    removeSelection();
    // Create a template app window
    const appWindows = document.getElementsByClassName('window');
    const appWindow = document.createElement('div');
    appWindow.classList.add('window');
    appWindow.id = `window-${id}`;
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
    close_button.addEventListener('click', function (e) { appWindow.remove(); removeApp(id) })
    max_button.addEventListener('click', (e) => maxRestore(e, id, false))
    hide_button.addEventListener('click', (e) => hide(e, id));

    // add the buttons to the title bar
    title_bar.appendChild(hide_button);
    title_bar.appendChild(max_button);
    title_bar.appendChild(close_button);

    // add the elements created to their respective containers
    appWindow.appendChild(title_bar);
    appWindow.appendChild(document.createTextNode('Hello'));
    document.body.insertAdjacentElement('beforeend', appWindow);

    // (for now)place the new window (10,10) distance away from the last added window
    if (appWindows.length > 1) {
        let last = document.body.childNodes[document.body.childNodes.length - 2];
        appWindow.style.top = `${last.offsetTop + 10}px`;
        appWindow.style.left = `${last.offsetLeft + 10}px`;
    }
    else {
        // fix the window in place
        appWindow.style.top = `${appWindow.offsetTop}px`;
        appWindow.style.left = `${appWindow.offsetLeft}px`;
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