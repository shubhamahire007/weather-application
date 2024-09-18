// lat & long ? for finding current location
// https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=bb1b94e0b07a4a1f2f53dce5b7bf2011
// city ?  
// https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bb1b94e0b07a4a1f2f53dce5b7bf2011        

const API_KEY="bb1b94e0b07a4a1f2f53dce5b7bf2011";

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currTab = userTab;
currTab.classList.add("curr-tab");

getFromSessionStorage();

userTab.addEventListener("click", () => {
  //pass clicked tab as a input
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function switchTab(clickedTab) {
  if (clickedTab != currTab) {
    currTab.classList.remove("curr-tab");
    currTab = clickedTab;
    clickedTab.classList.add("curr-tab"); /// check ?

    if (!searchForm.classList.contains("active")) {
      //if search form container is invisible, then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // i already present in seach tab , then your weather container make visible
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main your weather tab main aagya hu, toh weather bhi display karna padega. so lets check local storage first for coordinates , if we have saved them there
      getFromSessionStorage();
    }
  }
}

function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates; //chaeck ? long-> lon

  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  // API call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");

    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  //fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloud = document.querySelector("[data-cloud]");

  ///fetch values from weatherInfo object and put in elements
  cityName.innerText = weatherInfo?.name;

  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  desc.innerText = weatherInfo?.weather?.[0]?.description;

  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  temp.innerText = `${weatherInfo?.main?.temp} °C`;

  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;

  humidity.innerText = `${weatherInfo?.main?.humidity}%`;

  cloud.innerText = `${weatherInfo?.clouds?.all}%`;
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("No geolacation support available");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "")
    return;
  else {
      fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    
    renderWeatherInfo(data);
    // searchForm.classList.remove("active");
  } catch (err) {
    loadingScreen.classList.remove("active");
    console.log("error searh city");
  }
}
