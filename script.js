const pages = {

    // divide caterories here and 
    "Aerospace": "aerospace.html",

   "Maths": "math.html",
   "Higher Engineering Mathematics":'math.html',
   "Advanced Engineering Mathematics":"math.html",
   "Mathematical Methods in the Physical Sciences":"math.html",
   "Discrete Mathematics and its Applications":"math.html",
   "Numerical Methods for Engineers":"math.html",
   "Algebra": "math.html",

    "physics": "physics.html"
    
};

const secondaryDataset = {
    "Car": "This is the car page content.",
    // Add more items as needed
};

document.getElementById('search-box').addEventListener('input', function() {
    let input = this.value.toLowerCase();
    if (input) {
        let suggestions = Object.keys(pages).filter(subject => subject.toLowerCase().startsWith(input)).slice(0, 3);
        suggestions = suggestions.concat(Object.keys(secondaryDataset).filter(subject => subject.toLowerCase().startsWith(input)).slice(0, 3));
        console.log('Suggestions:', suggestions);  // Log suggestions to console
        showSuggestions(suggestions);
    } else {
        hideSuggestions();
    }
});

document.getElementById('search-box').addEventListener('focus', function() {
    let input = this.value.toLowerCase();
    if (input) {
        let suggestions = Object.keys(pages).filter(subject => subject.toLowerCase().startsWith(input)).slice(0, 3);
        suggestions = suggestions.concat(Object.keys(secondaryDataset).filter(subject => subject.toLowerCase().startsWith(input)).slice(0, 3));
        console.log('Suggestions on focus:', suggestions);  // Log suggestions to console
        showSuggestions(suggestions);
    }
});

document.getElementById('search-box').addEventListener('blur', function() {
    setTimeout(hideSuggestions, 100);  // Delay hiding to allow item click
});

function showSuggestions(suggestions) {
    let suggestionsContainer = document.getElementById('suggestions');
    let searchBox = document.getElementById('search-box');
    let searchBoxRect = searchBox.getBoundingClientRect();
    
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.top = `${searchBoxRect.bottom}px`;
    suggestionsContainer.style.left = `${searchBoxRect.left}px`;
    suggestionsContainer.style.width = `${searchBoxRect.width}px`;

    if (suggestions.length > 0) {
        let list = document.createElement('ul');
        list.classList.add('bg-white', 'border', 'border-gray-300', 'rounded', 'shadow-lg', 'z-10', 'overflow-hidden');
        suggestions.forEach(suggestion => {
            let item = document.createElement('li');
            item.classList.add('block', 'px-4', 'py-3', 'hover:bg-blue-100', 'cursor-pointer', 'text-gray-800', 'hover:text-blue-700');

            let link = document.createElement('a');
            link.textContent = suggestion;
            link.href = pages[suggestion] ? pages[suggestion] : '#';
            
            if (!pages[suggestion]) {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    createDynamicPage(suggestion, secondaryDataset[suggestion]);
                });
            }

            item.appendChild(link);
            item.addEventListener('click', function() {
                if (pages[suggestion]) {
                    window.location.href = pages[suggestion];
                } else {
                    createDynamicPage(suggestion, secondaryDataset[suggestion]);
                }
                hideSuggestions();
            });

            list.appendChild(item);
        });
        suggestionsContainer.appendChild(list);
        suggestionsContainer.classList.remove('hidden');
    } else {
        hideSuggestions();
    }
}

function hideSuggestions() {
    let suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.classList.add('hidden');
    console.log('Hiding suggestions from DOM');
}

function createDynamicPage(title, content) {
    let dynamicPageContainer = document.getElementById('dynamic-page-container');
    
    if (!dynamicPageContainer) {
        dynamicPageContainer = document.createElement('div');
        dynamicPageContainer.id = 'dynamic-page-container';
        dynamicPageContainer.classList.add('p-4', 'm-4', 'border', 'border-gray-300', 'rounded', 'shadow-lg');
        document.body.appendChild(dynamicPageContainer);
    }

    dynamicPageContainer.innerHTML = `<h1 class="text-2xl font-bold mb-4">${title}</h1><p>${content}</p>`;
    window.location.hash = 'dynamic-page-container';
}

/////////////////////////////////


searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
}

let loginForm = document.querySelector('.login-form-container');

document.querySelector('#login-btn').onclick = () =>{
    loginForm.classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () =>{
    loginForm.classList.remove('active');
}
window.onscroll = () =>{
    if(window.scrollY > 80){
        document.querySelector('.header .header-2').classList.add('active');
    }else{
        document.querySelector('.header .header-2').classList.remove('active')
    }
}

window.onload = () =>{
    if(window.scrollY > 80){
        document.querySelector('.header .header-2').classList.add('active');
    }else{
        document.querySelector('.header .header-2').classList.remove('active')
    }
}

const filterButtons = document.querySelectorAll(".filter-buttons button");
const featuredslider = document.querySelectorAll(".featured-slider .wrapper");

// define the filtercard
const filterwrapper = e => {
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    
    // iterate over each filterable card
    featuredslider.forEach(wrapper => {
        // add hide class to hide the cadr initially 
        wrapper.classList.add("hide");
        // check if 
        if(wrapper.dataset.name === e.target.dataset.name || e.target.dataset.name === "all"){
            wrapper.classList.remove("hide");
        }
    });
};

// add click event listener to each button
filterButtons.forEach(button => button.addEventListener("click" , filterwrapper))