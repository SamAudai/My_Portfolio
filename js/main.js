let tabLinks = document.getElementsByClassName('tab-link');
let tabContents = document.getElementsByClassName('tab-content');

let sidemenu = document.querySelector('#sidemenu');
let menu = document.querySelector('#checkbox1');

let topBtn = document.getElementById("topBtn");

let moon = document.querySelector('.moon');
let sun = document.querySelector('.sun');

function openTab(tabName) {
    for (var tabLink of tabLinks) {
        tabLink.classList.remove("active-link");
    }
    for (var tabContent of tabContents) {
        tabContent.classList.remove("active-tab");
    }

    this.event.currentTarget.classList.add('active-link');
    document.getElementById(tabName).classList.add('active-tab');
}

menu.onclick = ()=> {
    sidemenu.classList.toggle('active');
}

function onSubmit() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxLUc2Mx4omFleC-W8CMYrybIKaMv8lDTjb6yDevt1Z9GiMsuQ4QAUkxrSJmyMhjU4A/exec';
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('msg');
    let loader = document.getElementById('loader');
    let button = document.getElementById('button');

    form.addEventListener('submit', e => {
        e.preventDefault();
        loader.style.display = "block";
        button.classList.add('disabled');
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(() => {
                msg.style.display = "inline-block";
                loader.style.display = "none";                
                setTimeout(() => {
                    msg.style.display = "none";
                    button.classList.remove('disabled');
                }, 2000);

                form.reset();
            })
            .catch(error => console.error('Error!', error.message))
    })
}

function scrollToTop() {
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth",
    })
}

const sr = ScrollReveal({
    distance: '50px',
    duration: 2700,
    reset: true
});
sr.reveal('.header-text', { delay: 200, origin: 'left' });
sr.reveal('.header-image', { delay: 200, origin: 'right' });

function setThemeMode() {
    if (document.body.classList.contains('light')) {
        document.body.classList.remove('light');
        sun.style.display = "inline-flex";
        moon.style.display = "none";
        localStorage.setItem('icon',"inline-flex")
        localStorage.setItem('theme', 'body');

    } else {
        sun.style.display = "none";
        moon.style.display = "inline-flex";
        document.body.classList.add('light');
        localStorage.setItem('icon',"inline-flex")
        localStorage.setItem('theme', 'light');
    }
}

window.onload = () => {
    document.body.classList.add(localStorage.getItem("theme"));
    if (localStorage.getItem('theme') == 'light') {
        moon.style.display = localStorage.getItem('icon')||'inline-flex';
    } else {
        sun.style.display = localStorage.getItem('icon')||'inline-flex';
    }
    
    topBtn.style.visibility = "hidden";
};

window.onscroll = ()=> {
    if (window.scrollY > 150) {
        topBtn.style.visibility = "visible";
        topBtn.style.cursor = "pointer";
    } else {
        topBtn.style.visibility = "hidden";
    }
};
