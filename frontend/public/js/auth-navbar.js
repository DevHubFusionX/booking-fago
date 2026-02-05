// Auth Navbar Helper
async function updateNavbarAuth() {
  try {
    const response = await fetch(`${window.API_BASE_URL || ''}/api/user`);
    const data = await response.json();

    const authElement = document.querySelector('.nav-auth');
    const sidebarAuth = document.querySelector('.sidebar-auth');

    console.log('Auth data:', data); // Debug log

    if (data.user) {
      // User is logged in
      if (authElement) {
        authElement.innerHTML = `
          <div class="user-menu">
            <span>Hi, ${data.user.name}</span>
            <a href="/dashboard" class="dashboard-btn">Dashboard</a>
            <a href="#" onclick="logout()" class="logout-btn">Logout</a>
          </div>
        `;
      }

      if (sidebarAuth) {
        sidebarAuth.innerHTML = `
          <div class="sidebar-user">
            <span>Hi, ${data.user.name}</span>
            <a href="/dashboard" class="login-btn">Dashboard</a>
            <a href="#" onclick="logout()" class="logout-btn">Logout</a>
          </div>
        `;
      }
    } else {
      // User is not logged in
      if (authElement) {
        authElement.innerHTML = `<a href="/login" class="login-btn">Login / Sign Up</a>`;
      }
      if (sidebarAuth) {
        sidebarAuth.innerHTML = `<a href="/login" class="login-btn">Login / Sign Up</a>`;
      }
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
}

async function logout() {
  try {
    await fetch(`${window.API_BASE_URL || ''}/api/logout`, { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}