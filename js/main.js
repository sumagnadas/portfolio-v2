let justnow = false;
(function () {
    const apps = document.getElementsByClassName('app');
    for (let app of apps) {
        // const selec = selection.apply(null, [app.id]);
        app.addEventListener('click', (e) => selection(app.id));
        app.addEventListener('dblclick', showModal);
    }
})()

let offsetX, offsetY;
function showModal() {
    const modals = document.getElementsByClassName('modal');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const title_bar = document.createElement('div');
    title_bar.classList.add('title_bar');
    const close_button = document.createElement('div');
    close_button.classList.add('close')
    modal.dragged = false;
    const drag = function (e) {
        if (modal.classList.contains('dragged')) {
            offsetX = offsetX ?? (e.pageX - modal.offsetLeft);
            offsetY = offsetY ?? (e.pageY - modal.offsetTop);
            modal.style.left = `${e.pageX - offsetX}px`;
            modal.style.top = `${e.pageY - offsetY}px`;
        }
    }

    title_bar.addEventListener('mousedown', (e) => modal.classList.add('dragged'))
    document.body.addEventListener('mousemove', drag)// added to body as it can be dragged anywhere
    title_bar.addEventListener('mouseup', (e) => { modal.classList.remove('dragged'); offsetX = undefined; offsetY = undefined });

    title_bar.appendChild(close_button);
    close_button.addEventListener('click', function (e) { modal.remove() })
    modal.appendChild(title_bar);
    modal.appendChild(document.createTextNode('Hello'));
    document.body.insertAdjacentElement('beforeend', modal);
    modal.style.display = 'block';

    if (modals.length > 1) {
        let last = document.body.childNodes[document.body.childNodes.length - 2];
        console.log(last);
        modal.style.top = `${last.offsetTop + 10}px`;
        modal.style.left = `${last.offsetLeft + 10}px`;
    }
    else {
        modal.style.top = `${modal.offsetTop}px`;
        modal.style.left = `${modal.offsetLeft}px`;
    }
}
function selection(id) {
    if (id) {
        let x = document.getElementById(id);
        let y = document.getElementsByClassName('select');

        if (y.length == 1)
            y[0].classList.remove("select");

        x.classList.add("select");
        justnow = true;
    }
}
function remove() {
    if (!justnow) { // countering for the effect that pressing on the icon also triggers this function
        var x = document.getElementsByClassName('select');
        for (; x.length > 0;) {
            x[0].classList.remove("select");
        }
    }
    else
        justnow = false;
}