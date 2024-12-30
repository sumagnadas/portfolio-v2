// this function will always be ran whenever the file is loaded 
// no extra global variables when run this way
(function () {
    const apps = document.getElementsByClassName('app');
    document.body.addEventListener('mousemove', dragAndResize)// added to body as it can be dragged and resized anywhere
    document.body.addEventListener('mousedown', e => {
        const appWindow = document.getElementById('resized');
        if (appWindow ?? false) {
            beingResized = true;
        }
    })// start resizing if its in a border of a window
    document.body.addEventListener('mouseup', e => {
        beingResized = false;
        document.body.style.cursor = 'auto';

        let elem = document.getElementById('resized');
        if (elem ?? false)
            elem.removeAttribute('id');
    })// stop resizing if its in a border of a window
    document.body.addEventListener('click', removeSelection);
    for (let app of apps) {
        app.addEventListener('click', (e) => selection(app.id));
        app.addEventListener('dblclick', (e) => showWindow(app.id));
        app.addEventListener('dblclick', (e) => addApp(app.id));
    }
})()

// add app to the dock
function addApp(id) {
    // the icon element going to be added to the dock
    const icon = document.createElement('div');
    icon.classList.add('icon');
    icon.id = `app-${id}`;

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
        let elem = document.getElementById('resized');
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
                appWindow.id = 'resized'
            }
            if (curs_type == '') {
                let elem = document.getElementById('resized');
                document.body.style.cursor = 'auto';
                if (elem ?? false)
                    elem.removeAttribute('id');
            }
            else {
                document.body.style.cursor = curs_type + '-resize';
                break;
            }
        }
    }
}

// show the window
function showWindow(id) { // too much extra code, will clean later
    removeSelection();
    // Create a template app window
    const appWindows = document.getElementsByClassName('window');
    const appWindow = document.createElement('div');
    appWindow.classList.add('window');

    // add a basic title bar
    const title_bar = document.createElement('div');
    title_bar.classList.add('title_bar');
    title_bar.addEventListener('mousedown', (e) => appWindow.classList.add('dragged'))
    document.body.addEventListener('mousemove', (e) => {
        if (appWindow.classList.contains('dragged'))
            maxRestore(e, true);
    })
    document.body.addEventListener('mouseup', (e) => { appWindow.classList.remove('dragged'); offsetX = undefined; offsetY = undefined });

    // add button for closing, max size, hiding the window
    const close_button = document.createElement('div');
    const max_button = document.createElement('div');
    const hide_button = document.createElement('div');

    close_button.classList.add('title', 'close')
    max_button.classList.add('title', 'max')
    hide_button.classList.add('title', 'hide')

    close_button.addEventListener('click', function (e) { appWindow.remove(); removeApp(id) })
    let prevTop, prevLeft, prevHeight, prevWidth;
    const maxRestore = function (e, drag) {
        if (!appWindow.classList.contains('max') && !drag) {
            appWindow.classList.add('max');
            prevTop = appWindow.offsetTop;
            prevLeft = appWindow.offsetLeft;
            prevHeight = appWindow.offsetHeight;
            prevWidth = appWindow.offsetWidth;
            appWindow.style.top = '0';
            appWindow.style.left = '0';
            appWindow.style.height = '100%';
            appWindow.style.width = '100%';
        }
        else if (appWindow.classList.contains('max')) {
            if (drag) {
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
    max_button.addEventListener('click', maxRestore)

    title_bar.appendChild(hide_button);
    title_bar.appendChild(max_button);
    title_bar.appendChild(close_button);
    // add the elements created to their respective containers
    appWindow.appendChild(title_bar);
    appWindow.appendChild(document.createTextNode('Hello'));
    document.body.insertAdjacentElement('beforeend', appWindow);
    appWindow.style.display = 'block';

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