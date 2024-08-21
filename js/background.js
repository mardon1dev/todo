let toggleImage = true;

function changeBackground() {
    let backgroundImage = toggleImage ? 'url(./images/bg2.jpg)' : 'url(./images/bg4.jpg)';
    document.body.style.backgroundImage = backgroundImage;
    document.body.classList.toggle("dark");
}
let toggleBg = document.querySelector('.toggle-button');
toggleBg.addEventListener('click', () => {
    toggleImage = !toggleImage;
    changeBackground();
});

changeBackground();