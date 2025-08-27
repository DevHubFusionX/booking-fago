let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");
let videoBtn = document.querySelectorAll('.vid-btn');

window.onscroll = () => {
  searchBtn.classList.remove('fa-times');
  searchBar.classList.remove('active');
  menu.classList.remove ("fa-times");
  navbar.classList.remove("active");
  loginForm.classList.remove("active");
}

menu.addEventListener("click", () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
});

searchBtn.addEventListener('click', () => {
  searchBtn.classList.toggle('fa-times');
  searchBar.classList.toggle('active');
})




videoBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.controls .active').classList.remove('active');
    btn.classList.add('active');
    let src = btn.getAttribute('data-src');
    document.querySelector('#video-slider').src = src;
  }); 
});

var swiper = new Swiper(" .review-slider", {
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});


var swiper = new Swiper(" .brand-slider", {
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerview: 3,
    },
    991: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 5,
    },
  },
});


function handleFormSubmit(e) {
  e.preventDefault(); 
  clearForm(); 
  sendMail();
}

function sendMail(){
  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    number: document.getElementById("number").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("service_m1xwet5", "template_zli4e8d",parms).then(alert("Email Sent"));
}