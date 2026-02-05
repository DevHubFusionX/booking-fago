// Dashboard JavaScript
let allBookings = [];

document.addEventListener('DOMContentLoaded', async () => {
  initMobileMenu();
  await loadUserData();
  initDashboard();
  setTimeout(updateNavbarAuth, 100);
});

async function loadUserData() {
  try {
    const response = await fetch(`${window.API_BASE_URL || ''}/api/user`);
    const data = await response.json();

    if (!data.user) {
      window.location.href = '/login';
      return;
    }

    document.getElementById('user-name').textContent = data.user.name;
    await loadBookings();
  } catch (error) {
    window.location.href = '/login';
  }
}

async function loadBookings() {
  const bookingsList = document.getElementById('bookings-list');

  // Show skeletons while loading
  if (window.showSkeletons) {
    showSkeletons(bookingsList, 'booking-card', 3);
  }

  try {
    const response = await fetch(`${window.API_BASE_URL || ''}/api/bookings`);
    const data = await response.json();

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (data.success && data.bookings.length > 0) {
      allBookings = data.bookings;
      const bookingCards = data.bookings.map(booking => createBookingCard(booking)).join('');
      if (window.hideSkeletons) {
        hideSkeletons(bookingsList, bookingCards);
      } else {
        bookingsList.innerHTML = bookingCards;
      }
    } else {
      allBookings = [];
      const noBookingsHTML = '<div class="no-bookings"><p>No bookings found. <a href="/hotels">Book your first hotel</a></p></div>';
      if (window.hideSkeletons) {
        hideSkeletons(bookingsList, noBookingsHTML);
      } else {
        bookingsList.innerHTML = noBookingsHTML;
      }
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
    const errorHTML = '<div class="error-message">Failed to load bookings</div>';
    if (window.hideSkeletons) {
      hideSkeletons(bookingsList, errorHTML);
    } else {
      bookingsList.innerHTML = errorHTML;
    }
  }
}

function initDashboard() {
  // Tab navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
      const tab = this.dataset.tab;

      // Update nav
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');

      // Update sections
      document.querySelectorAll('.dashboard-section').forEach(section => section.classList.remove('active'));
      document.getElementById(tab).classList.add('active');
    });
  });

  // Booking filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      filterBookings(filter);
    });
  });
}

function filterBookings(filter) {
  const bookings = document.querySelectorAll('.booking-card');

  bookings.forEach(booking => {
    const status = booking.dataset.status;
    let show = false;

    switch (filter) {
      case 'all':
        show = true;
        break;
      case 'upcoming':
        show = booking.classList.contains('upcoming') && status !== 'cancelled';
        break;
      case 'past':
        show = booking.classList.contains('past') && status !== 'cancelled';
        break;
      case 'cancelled':
        show = status === 'cancelled';
        break;
    }

    booking.style.display = show ? 'block' : 'none';
  });
}

function bookAgain(hotelId) {
  window.location.href = `/hotel/${hotelId}`;
}