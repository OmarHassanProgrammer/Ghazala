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

'use strict';

let data = {};

class Carousel {
  constructor(el) {
    
    fetch('./data.json')
    .then((response) => response.json())
    .then((json) => {
        data = json; 
        this.carouselData = data;
        this.setupCarousel();
    });

    this.el = el;
    this.carouselOptions = ['previous', 'play', 'next'];
    this.carouselData = data;
    this.carouselInView = [1, 2, 3, 4, 5];
    this.carouselContainer;
    this.carouselPlayState;
  }

  mounted() {

    if (/iPhone|Android|Windows Phone/i.test(navigator.userAgent)) {
      this.play();
    }
  }

  // Build carousel html
  setupCarousel() {
    const container = document.createElement('div');
    const controls = document.createElement('div');

    // Add container for carousel items and controls
    this.el.append(container, controls);
    container.className = 'carousel-container';
    controls.className = 'carousel-controls';

    // Take dataset array and append items to container
    this.carouselData.forEach((item, index) => {
      const carouselItem = document.createElement('div');

      // Create a div to hold the content
      const contentDiv = document.createElement('div');

      // Create a paragraph for the bolded line
      const boldLine = document.createElement('p');
      boldLine.textContent = item.content.bold;
      boldLine.style.fontWeight = 'bold';

      // Create a paragraph for the description
      const description = document.createElement('p');
      description.textContent = item.content.description;

      // Append the paragraphs to the content div
      contentDiv.append(boldLine, description);

      // Append the content div to the carousel item
      carouselItem.append(contentDiv);

      container.append(carouselItem);

      // Add item attributes
      carouselItem.className = `carousel-item carousel-item-${index + 1}`;
      carouselItem.setAttribute('data-index', `${index + 1}`);
    });

    this.carouselOptions.forEach((option) => {
      const btn = document.createElement('button');
      const axSpan = document.createElement('span');

      // Add accessibilty spans to button
      axSpan.innerText = option;
      axSpan.className = 'ax-hidden';
      btn.append(axSpan);

      // Add button attributes
      btn.className = `carousel-control carousel-control-${option}`;
      btn.setAttribute('data-name', option);

      // Add carousel control options
      controls.append(btn);
    });

    // After rendering carousel to our DOM, setup carousel controls' event listeners
    this.setControls([...controls.children]);

    // Set container property
    this.carouselContainer = container;
  }

setControls(controls) {
    controls.forEach(control => {
        control.onclick = (event) => {
        event.preventDefault();

        // Manage control actions, update our carousel data first then with a callback update our DOM
        this.controlManager(control.dataset.name);
    };
    });
}

controlManager(control) {
    if (control === 'previous') return this.previous();
    if (control === 'next') return this.next();
    if (control === 'add') return this.add();
    if (control === 'play') return this.play();

    return;
}

previous() {
    // Update order of items in data array to be shown in carousel
    this.carouselData.unshift(this.carouselData.pop());

    // Push the first item to the end of the array so that the previous item is front and center
    this.carouselInView.push(this.carouselInView.shift());

    // Update the css class for each carousel item in view
    this.carouselInView.forEach((item, index) => {
        this.carouselContainer.children[index].className = `carousel-item carousel-item-${item}`;
    });
}

next() {
    // Update order of items in data array to be shown in carousel
    this.carouselData.push(this.carouselData.shift());

    // Take the last item and add it to the beginning of the array so that the next item is front and center
    this.carouselInView.unshift(this.carouselInView.pop());

    // Update the css class for each carousel item in view
    this.carouselInView.forEach((item, index) => {
        this.carouselContainer.children[index].className = `carousel-item carousel-item-${item}`;
    });
}

add() {
    const newItem = {
        'id': '',
        'content': {
        'bold': 'New Bolded Line',
        'description': 'New Description',
        },
    };
    const lastItem = this.carouselData.length;

    // Assign properties for new carousel item
    Object.assign(newItem, {
        id: `${lastItem + 1}`,
        content: {
        'bold': `New Bolded Line ${lastItem + 1}`,
        'description': `New Description ${lastItem + 1}`,
        },
    });

    // Then add it to the "last" item in our carouselData
    this.carouselData.push(newItem);

    // Shift carousel to display new item
    this.next();
}

    play() {
        const playBtn = document.querySelector('.carousel-control-play');
        const startPlaying = () => this.next();

        if (playBtn.classList.contains('playing')) {
        // Remove class to return to play button state/appearances
        playBtn.classList.remove('playing');

        // Remove setInterval
        clearInterval(this.carouselPlayState);
        this.carouselPlayState = null;
        } else {
        // Add class to change to pause button state/appearance
        playBtn.classList.add('playing');

        // First run initial next method
        this.next();

        // Use play state prop to store interval ID and run next method on a 1.5 second interval
        this.carouselPlayState = setInterval(startPlaying, 1500);
        };
    }
}

// Refers to the carousel root element you want to target, use specific class selectors if using multiple carousels
const el = document.querySelector('.carousel');
// Create a new carousel object
const exampleCarousel = new Carousel(el);
// Setup carousel and methods
exampleCarousel.mounted();


let submitBtn = document.querySelector('.submit-button');


submitBtn.onclick = function(e) {
    let name = document.getElementById('name').value;
    let message = document.getElementById('message').value;
    
    e.stopPropagation();
    let fs = require('fs');

    fs.exists('data.json', function(exists) {
        if(exists) {
            fs.readFile('data.json', function readFileCallBack(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    obj = JSON.parse(data);
                    obj.table.push({
                        name: name,
                        message: message
                    });
                    
                    let json = JSON.stringify(obj);
                    fs.writeFile('data.json', json);
                }
            })
        }
    } );

}
