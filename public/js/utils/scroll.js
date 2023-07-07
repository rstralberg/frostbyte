
// Funkar inte som ChatGP trodde det skulle göra


var scrollPosition = null; //window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

function disableScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    window.addEventListener('scroll', preventScroll);
}

function enableScroll() {
    window.removeEventListener('scroll', preventScroll);
    window.scrollTo(0, scrollPosition);
}

function preventScroll(event) {
    if (is_valid(event)) {
        event.preventDefault();
    }
}
