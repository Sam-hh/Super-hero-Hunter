// Constants
const publicKey = "df1a8e82bfc2aa0b7d62c8e00bc70527";
const md5Hash = "d1e4c7d4c1ffb2ab12806b4d1b487c59";
const API_BASE_URL = "https://gateway.marvel.com/v1/public/characters";
const TS = 1;
const FAVORITE_KEY = "FavoriteIdArray";

// Global variables
let favoriteIdArray = [];

//fetches and displays hero details
async function fetchAndDisplayHeroDetails(heroId) {
  try {
    const hero = await fetchSuperheroById(heroId);
    displayHeroDetails(hero);
  } catch (error) {
    console.error("Error fetching hero details:", error);
  }
}

//fetches superhero details by ID
async function fetchSuperheroById(id) {
  const response = await fetch(
    `${API_BASE_URL}/${id}?ts=${TS}&apikey=${publicKey}&hash=${md5Hash}`
  );
  const data = await response.json();
  return data.data.results[0];
}

//displays hero details on the page
function displayHeroDetails(hero) {
  const favResults = document.getElementById("fav-results");
  favResults.innerHTML = "";

  const isFavorite = favoriteIdArray.includes(hero.id.toString());
  const buttonClass = isFavorite ? "add" : "remove"; // Determine the button class based on whether the hero is a favorite

  const heroCardHTML = `
        <div class="container">
            <div class="card">
                <img src="${hero.thumbnail.path}/standard_fantastic.${
    hero.thumbnail.extension
  }" alt="${hero.name}">
                <div class="card__details">
                    <span class="tag">ID : <i>${hero.id}</i></span>
                    <span class="tag">Name: ${hero.name}</span>
                    <span class="tag">Comics : ${hero.comics.available}</span>
                    <span class="tag">Events : ${hero.events.available}</span>
                    <span class="tag">Series : ${hero.series.available}</span>
                    <span class="tag">Stories : ${hero.stories.available}</span>
                    <div class="description">Description: ${
                      hero.description
                        ? hero.description
                        : "Description not available"
                    }</div>
                </div>
            </div>
            <div class="favBtnNew">
                <div class="cardi">
                    <button class="addToFavBtn ${buttonClass}" data-hero-id="${
    hero.id
  }">
                      <i class="heart-icon fa-solid ${
                        isFavorite ? "fa-x" : "fa-heart"
                      }"></i> 
                      <span class="btn-text">${
                        isFavorite
                          ? "Remove from Favorites"
                          : "Add to Favorites"
                      }</span>
                    </button>
                </div>
            </div>
        </div>
    `;

  favResults.innerHTML = heroCardHTML;

  const addToFavBtn = document.querySelector(".addToFavBtn");
  addToFavBtn.addEventListener("click", toggleFavorite);
}

//toggles favorite status for a hero
function toggleFavorite(event) {
  const button = event.target.closest(".addToFavBtn");
  const heroId = button.dataset.heroId;

  if (!favoriteIdArray.includes(heroId)) {
    favoriteIdArray.push(heroId);
    showSplashNotification("Added to Favorites", "#218838");
  } else {
    const index = favoriteIdArray.indexOf(heroId);
    if (index !== -1) {
      favoriteIdArray.splice(index, 1);
      showSplashNotification("Removed from Favorites", "#dc3545");
    }
  }

  const isFavorite = favoriteIdArray.includes(heroId.toString());
  updateButtonAppearance(button, isFavorite);

  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteIdArray));
}

//shows the splash notification
function showSplashNotification(message, color) {
  const splash = document.getElementById("splash");
  splash.innerText = message;
  splash.style.backgroundColor = color; // Sets the background color
  splash.classList.add("show");
  setTimeout(() => {
    splash.classList.remove("show");
  }, 1000);
}

//updates button appearance based on favorite status
function updateButtonAppearance(button, isFavorite) {
  const heartIcon = button.querySelector(".heart-icon");
  const btnText = button.querySelector(".btn-text");

  heartIcon.classList.remove("fa-x", "fa-heart"); // Remove all classes to reset
  if (isFavorite) {
    heartIcon.classList.add("fa-x"); // Adds x icon class if it's a favorite
    button.classList.remove("remove");
    button.classList.add("add");
  } else {
    heartIcon.classList.add("fa-heart"); // Adds heart icon class if it's not a favorite
    button.classList.remove("add");
    button.classList.add("remove");
  }

  btnText.textContent = isFavorite
    ? "Remove from Favorites"
    : "Add to Favorites";
}

//initializes the page
document.addEventListener("DOMContentLoaded", function () {
  favoriteIdArray = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
  const heroId = localStorage.getItem("id");
  fetchAndDisplayHeroDetails(heroId);
});
