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


