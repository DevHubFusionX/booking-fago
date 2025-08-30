// Header Component
function createHeader(user = null) {
  return `
    <header>
      <div id="menu-bar" class="fas fa-bars"></div>
      <a href="/" class="logo"><span>F</span>AGO</a>
      
      <nav class="navbar">
        <a href="/">Home</a>
        <a href="/hotels">Hotels</a>
        <a href="/deals">Deals</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        ${user ? 
          `<a href="/dashboard">Dashboard</a>
           <a href="#" onclick="logout()" class="login-btn">Logout (${user.name})</a>` :
          `<a href="/login" class="login-btn">Login / Sign Up</a>`
        }
      </nav>

      <div class="icons">
        <i class="fas fa-search" id="search-btn"></i>
      </div>

      <form class="search-bar-container" onsubmit="handleSearch(event)">
        <input type="search" id="search-bar" placeholder="Search hotels, destinations...">
        <label for="search-bar" class="fas fa-search"></label>
      </form>
    </header>
  `;
}

// Initialize header
async function initHeader() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    document.body.insertAdjacentHTML('afterbegin', createHeader(data.user));
    initHeaderEvents();
  } catch (error) {
    document.body.insertAdjacentHTML('afterbegin', createHeader());
    initHeaderEvents();
  }
}

// Header event listeners
function initHeaderEvents() {
  const menu = document.querySelector("#menu-bar");
  const navbar = document.querySelector(".navbar");
  const searchBtn = document.querySelector('#search-btn');
  const searchBar = document.querySelector('.search-bar-container');

  if (menu) {
    menu.addEventListener("click", () => {
      menu.classList.toggle("fa-times");
      navbar.classList.toggle("active");
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchBtn.classList.toggle('fa-times');
      searchBar.classList.toggle('active');
    });
  }

  window.onscroll = () => {
    if (searchBtn) searchBtn.classList.remove('fa-times');
    if (searchBar) searchBar.classList.remove('active');
    if (menu) menu.classList.remove("fa-times");
    if (navbar) navbar.classList.remove("active");
  }
}

// Logout function
async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Search function
function handleSearch(event) {
  event.preventDefault();
  const searchTerm = document.getElementById('search-bar').value.trim();
  if (searchTerm) {
    window.location.href = `/hotels?search=${encodeURIComponent(searchTerm)}`;
  }
}

// Update navbar auth state
async function updateNavbarAuth() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    
    const navAuth = document.querySelector('.nav-auth');
    const sidebarAuth = document.querySelector('.sidebar-auth');
    
    if (data.user) {
      const authHTML = `
        <div class="user-menu">
          <span class="user-name">Hi, ${data.user.name.split(' ')[0]}</span>
          <div class="dropdown">
            <a href="/dashboard">Dashboard</a>
            <a href="#" onclick="logout()">Logout</a>
          </div>
        </div>
      `;
      if (navAuth) navAuth.innerHTML = authHTML;
      if (sidebarAuth) sidebarAuth.innerHTML = authHTML;
    } else {
      const authHTML = '<a href="/login" class="login-btn">Login / Sign Up</a>';
      if (navAuth) navAuth.innerHTML = authHTML;
      if (sidebarAuth) sidebarAuth.innerHTML = authHTML;
    }
  } catch (error) {
    console.error('Failed to update auth state:', error);
  }
}