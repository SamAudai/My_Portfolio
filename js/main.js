let sectionLinks = document.getElementsByClassName('section-link');
let sectionContents = document.getElementsByClassName('section-content');

let tabLinks = document.getElementsByClassName('tab-link');
let tabContents = document.getElementsByClassName('tab-content');

let sidemenu = document.querySelector('#sidemenu');
let menuButton = document.querySelector('#menuButton');

let moon = document.querySelector('.moon');
let sun = document.querySelector('.sun');

const scriptURL = 'https://script.google.com/macros/s/AKfycbyEYtV4D3WXzfpUui2sSgU3lKN2c8R_V1NDdc7BqifcJgUjE5TMZKj33ySK-5zN55FiyA/exec';
const form = document.forms['form-submit'];
const msg = document.getElementById('msg');
let loader = document.getElementById('loader');
let button = document.getElementById('button');

//Navegation between sections
function openSection(sectionName, link) {
    for (var sectionLink of sectionLinks) {
        sectionLink.classList.remove("active-link");
    }
    for (var sectionContent of sectionContents) {
        sectionContent.classList.remove("active-section");
    }

    document.getElementById(link).classList.add('active-link');
    document.getElementById(sectionName).classList.add('active-section');
    
    localStorage.setItem("section", sectionName);
    localStorage.setItem("link", link);
 
    const animation = document.getElementById(sectionName).animate(keyframes_sections, options);    
    animation.play();   
}

function openTab(tabName) {
    for (var tabLink of tabLinks) {
        tabLink.classList.remove("active-link");
    }
    for (var tabContent of tabContents) {
        tabContent.classList.remove("active-tab");
    }

    this.event.currentTarget.classList.add('active-link');
    document.getElementById(tabName).classList.add('active-tab');

    const animation = document.getElementById(tabName).animate(keyframes_tabs, options);    
    animation.play();
}

menuButton.onclick = () => {
    sidemenu.classList.toggle('active');    
}

//Submit information form to google sheet 
form.addEventListener('submit', event => {
    event.preventDefault();
    loader.style.display = "block";
    button.classList.add('disabled');
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(() => {
            msg.style.display = "block";
            loader.style.display = "none";
            setTimeout(() => {
                msg.style.display = "none";
                button.classList.remove('disabled');
            }, 2000);

            form.reset();
        })
        .catch(error => console.error('Error!', error.message))
});

//Switch between light and dark mode and reversed
function setThemeMode() {
    if (document.body.classList.contains('light')) {
        document.body.classList.toggle('light');
        moon.style.display = "none";
        sun.style.display = "inline-flex";
        localStorage.setItem('icon', "inline-flex")
        localStorage.setItem('theme', 'body');
    } else {
        sun.style.display = "none";
        moon.style.display = "inline-flex";
        document.body.classList.toggle('light');
        localStorage.setItem('icon', "inline-flex")
        localStorage.setItem('theme', 'light');
    }
}

window.onload = () => {
    document.getElementById(localStorage.getItem("link") || 'Home').classList.toggle('active-link');
    document.getElementById(localStorage.getItem("section") || 'home').classList.toggle('active-section');
    
    document.body.classList.toggle(localStorage.getItem("theme") || 'body');
    if (localStorage.getItem('theme') == 'light') {
        moon.style.display = localStorage.getItem('icon') || 'inline-flex';
    } else {
        sun.style.display = localStorage.getItem('icon') || 'inline-flex';
    }
}

/* function scrollToTop() {
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth"
    })
    topBtn.onclick=openSection(home);
}  */

/* window.onscroll = () => {
    if (window.scrollY > 150) {
        topBtn.style.visibility = "visible";
        topBtn.style.cursor = "pointer";
    } else {
        topBtn.style.visibility = "hidden";
    }
}; */

// Define the animations
const keyframes_sections = [
    { transform: 'translateY(-100px)', opacity: 0 },
    { transform: 'translateY(0px)', opacity: 1 }
];
const keyframes_tabs = [
    { transform: 'scale(1.0)', opacity: 0 },
    { transform: 'scale(1.0)', opacity: 1 }
];
const options = {
    duration: 700,
    easing: 'ease-in-out',
    fill: 'forwards' // Keeps the final state after the animation
};

/* $(document).ready(()=>{
    $("b").click(()=>{
        alert('hello world');
    })
}); */