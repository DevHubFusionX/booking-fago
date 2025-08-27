<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
</head>
<body>
  
    <header>

    <div id="menu-bar" class="fas fa-bars"></div>

    <a href="#home" class="logo"><span>F</span>ago's-<span>B</span>ooking</a>
    <nav class="navbar">
      <a href="Home.php ">Home</a>
      <a href="#book">book</a><
      <a href="#services">services</a>
      <a href="packages.html">packages</a>
      <a href="Gallery.html">gallery</a>
      <a href="review.html">review</a>
      <a href="Contact.html">contact</a>
    </nav>

    <div class="icons">
      <i class="fas fa-search" id="search-btn"></i>
    </div>

     <form action="" class="search-bar-container">
      <input type="search" id="search-bar" placeholder="search here..">
      <label for="search-bar" class="fas fa-search"></label>
     </form>

   <script>
    let map;
    let service;
    let infowindow;


    function initMap() {
      const lagos = {lat:6.5244, lng: 3.3792};
      map = new google.maps.Map(document.getElementById("map"), {
        center: lagos,
        zoom:13,
      });

      const request = {
        location: lagos,
        radius: "5000",
        type: ["lodging"],
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);


      const input = document.getElementById("search-bar");
      input.addEventListener("Keypress", function(e) {
        if (e.key === "Enter") {
          searchHotels(input.value);
        }
      });
    }

    function searchHotels(query){
      const request = {
        query: query + "hotels in lagos",
        fields: ["name", "geometry", "formatted_address"], 
      };

      service.textSearch(request, function(results,status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          clearMarkers();
          for (let i = 0; i < results.length; i++){
            createMarker(results[i]);
          }
          map.setCenter(results[0].geometry.location);
        }
      });
    }

    let markets = [];
    function createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });

      google.maps.event.addEventListener(marker, "click", () => {
        if (!infowindow) {
          infowindow = new google.maps.InfoWindow();
        }
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
      });

      markers.push(marker);
    }

    function clearMarkers() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }
   </script>


      <script async defer 
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBqDZI2rY1F3Vvr3GAX0HSad0UfLYYvSM8&libraries=places&callback=initMap" ></script>

   </header>

     <!-- Home-Section -->
      <section class="home" id="home">
        <div class="content">
          <h3>Welcome to a global icon of luxury</h3>
          <p>discover new places with us, luxury awaits</p>
          <a href="#packages" class="btn">discover more</a>
          <audio id="myAudio"   loop src="dinner-at-the-luxury-hotel-166721.mp3">
            <source src="dinner-at-the-luxury-hotel-166721.mp3">
            <source src="dinner-at-the-luxury-hotel-166721.mp3">
            Your browser does not support the audio element
          </audio>
        
          <button class="btn" onclick="document.getElementById('myAudio').play()">Play Music</button>
        </div>

        <div class="controls">
          <span class="vid-btn active" data-src="img/vid-1.mp4"></span>
          <span class="vid-btn" data-src="img/vid-2.mp4"></span>
          <span class="vid-btn" data-src="img/vid-3.mp4"></span>
          <span class="vid-btn" data-src="img/vid-4.mp4"></span>
          <span class="vid-btn" data-src="img/vid-5.mp4"></span>
        </div>

        <div class="video-container">
          <video src="img/vid-1.mp4" id="video-slider" loop autoplay muted></video>
        </div>
      </section>



            <!-- book section starts -->

       <section class="book" id="book">
        <h1 class="heading">
          <span>b</span>
          <span>o</span>
          <span>o</span>
          <span>k</span>
          <span class="space"></span>
          <span>n</span>
          <span>o</span>
          <span>w</span>
        </h1>


        <div class="row">
          <div class="img">
            <img src="img/reshot-icon-hotel-WZEX8SU7H9.svg" alt="">
          </div>

          <form id="book-form">
            <div class="inputBox">
            <h3>where to</h3>
            <input id="place" name="place" type="text" placeholder="place name" required>
          </div>

          <div class="inputBox">
            <h3>Guests</h3>
            <input id="guests" name="guests" type="number" placeholder="number of guests">
          </div>

          <div class="inputBox">
            <h3>Rooms</h3>
            <input id="rooms" name="rooms" type="number" placeholder="number of rooms">
          </div>
          

          <div class="inputBox">
            <h3>arrivals</h3>
            <input id="arrival" name="arrival" type="Date" placeholder="Date of Arrival">
          </div>

          <div class="inputBox">
            <h3>leaving</h3>
            <input id="departure" name="departure" type="Date" placeholder="Date of Departure">
          </div>  

          
          <input  type="submit" id="btn" class="btn" value="book now">

          </form>
           
          <script>
document.getElementById("book-form").addEventListener("submit", function(e) {
  e.preventDefault(); 

  this.reset();

  alert("Message sent successfully");
});
</script>
                      
        </div>
       </section>


                <!-- services section -->

   <section class="services" id="services">
    <h1 class="heading">
      <span>s</span>
      <span>e</span>
      <span>r</span>
      <span>v</span>
      <span>i</span>
      <span>c</span>
      <span>e</span>
      <span>s</span>
    </h1>

    <div class="box-container">
      <div class="box">
        <i class="fas fa-hotel"></i>
          <h3>affordable hotels</h3>
          <p>Here at Fago's Bookings we offer a minimum variety of hotels and affordable and sometimes cheap prices</p>
      </div>
      <div class="box">
        <i class="fas fa-utensils"></i>
          <h3>Food and drinks</h3>
          <p>Here at Fago's Bookings we offer a minimum variety of hotels and affordable and sometimes cheap prices</p>
      </div>
      <div class="box">
        <i class="fas fa-bullhorn"></i>
          <h3>Safety guide</h3>
          <p>Here at Fago's Bookings we offer a minimum variety of hotels and affordable and sometimes cheap prices</p>
      </div>
      <div class="box">
        <i class="fas fa-globe-asia"></i>
          <h3>Around the world</h3>
          <p>Here at Fago's Bookings we offer a minimum variety of hotels and affordable and sometimes cheap prices</p>
      </div>
      <div class="box">
        <i class="fas fa-plane"></i>
          <h3>Fastest travel</h3>
          <p>Here at Fago's Bookings we offer a minimum variety of hotels and affordable and sometimes cheap prices</p>
      </div>
      <div class="box">
        <i class="fas fa-hiking"></i>
          <h3>Adventure</h3>
          <p>Here at Fago's Bookings we offer a minimum variety of hotels and affordable and sometimes cheap prices</p>
      </div>
    </div>
   </section>



      <script src="script.js"></script>  
</body>
</html>