let items = document.querySelectorAll('.sols .item');


window.onscroll = function(e) {
    check();
}


function check() {
    for (const item in items) {
        if (Object.hasOwnProperty.call(items, item)) {
            const element = items[item];
            
            if(element.classList.contains('hide')) {
                const rect = element.getBoundingClientRect();

                if(rect.bottom <= window.outerHeight && rect.top >= 0) { 
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            }
        }
    }
}

let Ar = document.getElementById('ar');
let En = document.getElementById('en');

let ArContainer = document.querySelector('.container.r');
let EnContainer = document.querySelector('.container.l');

let currLang = localStorage.getItem('lang');

if(currLang == "Ar") {
    ArContainer.classList.add('show');
    Ar.classList.add('active');
} else {
    currLang = "En";
    EnContainer.classList.add('show');
    En.classList.add('active');
}

Ar.onclick = function() {
    if(currLang != "Ar") {
        currLang = "Ar";
        ArContainer.classList.add('show');
        EnContainer.classList.remove('show');
        Ar.classList.add('active');
        En.classList.remove('active');
        localStorage.setItem('lang', 'Ar');
    }
}
En.onclick = function() {
    if(currLang != "En") {
        currLang = "En";
        EnContainer.classList.add('show');
        ArContainer.classList.remove('show');
        Ar.classList.remove('active');
        En.classList.add('active');
        localStorage.setItem('lang', 'En');
    }
}
