(function () {
    const apps = document.getElementsByClassName('app');
    document.body.addEventListener('mousemove', dragAndResize)// added to body as it can be dragged anywhere
    document.body.addEventListener('mousedown', e => {
        const window = document.getElementById('resized');
        if (window ?? false) {
            beingResized = true;
        }
    })// start resizing if its in a border of a window
    document.body.addEventListener('mouseup', e => {
        beingResized = false;
        document.body.style.cursor = 'auto';

        let elem = document.getElementById('resized');
        if (elem?.id ?? false)
            elem.removeAttribute('id');
    })// stop resizing if its in a border of a window
    for (let app of apps) {
        app.addEventListener('click', (e) => selection(app.id));
        app.addEventListener('dblclick', (e) => showModal(app.id));
        app.addEventListener('dblclick', (e) => addApp(app.id));
    }
})()
function addApp(id) {
    const img = document.getElementById(id).firstElementChild.firstElementChild;
    const navbar = document.getElementById('apps');// this is the container of the navbar extra apps
    const icon = document.createElement('div');
    icon.classList.add('icon');
    icon.id = `app-${id}`;
    const new_img = document.createElement('img');
    new_img.src = img.src
    new_img.alt = img.alt;
    icon.appendChild(new_img);
    navbar.appendChild(icon);
    navbar.style.borderLeftWidth = '1px';
}
function removeApp(id) {
    const icon = document.getElementById(`app-${id}`);
    icon.remove();
    const navbar = document.getElementById('apps');
    if (!navbar.childNodes.length)
        navbar.style.borderLeftWidth = '0';
}
let beingResized = false;
function resize(modal, posX, posY, sizeX, sizeY, moveX, moveY) {

    if (sizeX && moveX) {
        if (posX <= modal.offsetLeft + modal.offsetWidth - 10) {
            modal.style.width = `${modal.offsetWidth - (posX - modal.offsetLeft)}px`;
            modal.style.left = `${posX}px`
        }
    }
    else if (sizeX)
        modal.style.width = `${modal.offsetWidth + (posX - modal.offsetLeft - modal.offsetWidth)}px`;
    if (sizeY && moveY) {
        if (posY <= modal.offsetTop + modal.offsetHeight - 10) {
            modal.style.height = `${modal.offsetHeight - (posY - modal.offsetTop)}px`;
            modal.style.top = `${posY}px`
        }
    }
    else if (sizeY)
        modal.style.height = `${modal.offsetHeight + (posY - modal.offsetTop - modal.offsetHeight)}px`;
}

let sizeX = false, sizeY = false, moveX = false, moveY = false;
function dragAndResize(e) {
    const modals = document.getElementsByClassName('modal');
    if (beingResized) {
        let elem = document.getElementById('resized');
        resize(elem, e.pageX, e.pageY, sizeX, sizeY, moveX, moveY);
    }
    else {
        for (let modal of modals) {
            if (modal.classList.contains('dragged')) {
                offsetX = offsetX ?? (e.pageX - modal.offsetLeft);
                offsetY = offsetY ?? (e.pageY - modal.offsetTop);
                modal.style.left = `${e.pageX - offsetX}px`;
                modal.style.top = `${e.pageY - offsetY}px`;
            }

            const distFromRightEdge = e.pageX - modal.offsetWidth - modal.offsetLeft;
            const distFromLeftEdge = e.pageX - modal.offsetLeft;
            const distFromBottomEdge = e.pageY - modal.offsetHeight - modal.offsetTop;
            const distFromTopEdge = e.pageY - modal.offsetTop;
            let curs_type = '';
            if (distFromBottomEdge <= 4 && distFromTopEdge >= -4 && distFromRightEdge <= 4 && distFromLeftEdge >= -4) {
                if (distFromBottomEdge <= 4 && distFromBottomEdge >= -4) {
                    curs_type += 's';
                    sizeY = true;
                }
                else if (distFromTopEdge <= 4 && distFromTopEdge >= -4) {
                    curs_type += 'n';
                    sizeY = true;
                    moveY = true;
                }
                else {
                    sizeY = false; moveY = false;
                }
                if (distFromRightEdge <= 4 && distFromRightEdge >= 0) {
                    curs_type += 'e';
                    sizeX = true;
                }
                else if (distFromLeftEdge >= -4 && distFromLeftEdge <= 0) {
                    curs_type += 'w';
                    sizeX = true;
                    moveX = true;
                }
                else { sizeX = false; moveX = false; }
                modal.id = 'resized'
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

let offsetX, offsetY;
function showModal(id) { // too much extra code, will clean later
    remove();
    const modals = document.getElementsByClassName('modal');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const title_bar = document.createElement('div');
    title_bar.classList.add('title_bar');
    const close_button = document.createElement('div');
    close_button.classList.add('close')
    modal.dragged = false;
    title_bar.addEventListener('mousedown', (e) => modal.classList.add('dragged'))
    document.body.addEventListener('mouseup', (e) => { modal.classList.remove('dragged'); offsetX = undefined; offsetY = undefined });

    title_bar.appendChild(close_button);
    close_button.addEventListener('click', function (e) { modal.remove(); removeApp(id) })
    modal.appendChild(title_bar);
    modal.appendChild(document.createTextNode('Hello'));
    document.body.insertAdjacentElement('beforeend', modal);
    modal.style.display = 'block';

    if (modals.length > 1) {
        let last = document.body.childNodes[document.body.childNodes.length - 2];
        modal.style.top = `${last.offsetTop + 10}px`;
        modal.style.left = `${last.offsetLeft + 10}px`;
    }
    else {
        modal.style.top = `${modal.offsetTop}px`;
        modal.style.left = `${modal.offsetLeft}px`;
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
function remove() {
    if (!appPressed) { // countering for the effect that pressing on the icon also triggers this function
        var x = document.getElementsByClassName('select');
        for (; x.length > 0;) {
            x[0].classList.remove("select");
        }
    }
    else
        appPressed = false;
}