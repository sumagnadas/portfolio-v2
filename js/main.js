let justnow = false;
function selection(id) {
    if (id) {
        var x = document.getElementById(id);
        var y = document.getElementsByClassName('select');

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