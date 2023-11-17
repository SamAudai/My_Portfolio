let tabLinks = document.getElementsByClassName('tab-link');
let tabContents = document.getElementsByClassName('tab-content');

let sidemenu = document.getElementById('sidemenu');
let menu = document.querySelector('#checkbox');

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

menu.onclick = () => {
	sidemenu.classList.toggle('active');
};

function openMenu() {
    this.sidemenu.style.right = '0px';
}
function closeMenu() {
    this.sidemenu.style.right = '-200px';
}

function onSubmit() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwEL3blOQxK2VZSXseIjKcjbq2Oflw8qcr6vfNPHvaKpVX1akokqacnryfTkGPwXfRJeQ/exec';
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('msg');
    let btn = document.getElementById('btn');        
    
    form.addEventListener('submit', e => {
        e.preventDefault();        
        btn.textContent = 'Process...';           
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(() => {
                msg.innerHTML = "Message sent successfully!";
                btn.textContent = "Send"
                setTimeout(()=> {
                    msg.innerHTML = ''                    
                }, 3000);

                form.reset();
            })
            .catch(error => console.error('Error!', error.message))
    })
}

let rootElement = document.documentElement;
function scrollToTop() {
    rootElement.scrollTo({
        top: 0,
        behavior: "smooth",        
    })
}

let topBtn = document.getElementById("topBtn");
// When the page is loaded, hide the scroll-to-top button
window.onload = () => {
    topBtn.style.visibility = "hidden";
    topBtn.style.opacity = 0;
}
// If the page is scrolled more than 150px,
// display the scroll-to-top button
// Otherwise keep the button hidden
window.onscroll = () => {
 if (window.scrollY > 150) {
    topBtn.style.visibility = "visible";
    topBtn.style.opacity = 1;
    topBtn.style.cursor = "pointer";
 } else {
    topBtn.style.visibility = "hidden";
    topBtn.style.opacity = 0;
 }
};

const sr = ScrollReveal ({
	distance: '40px',
	duration: 2700,
	reset: true
});

/* sr.reveal('.work-list',{delay:200, origin:'bottom'})
sr.reveal('.contact-left, .about-col-1',{delay:200, origin:'left'});
sr.reveal('.contact-right form, .about-col-2',{delay:200, origin:'right'})  */