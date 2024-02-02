// Constants
const publicKey = "df1a8e82bfc2aa0b7d62c8e00bc70527";
const md5Hash = "d1e4c7d4c1ffb2ab12806b4d1b487c59";
const API_BASE_URL = "https://gateway.marvel.com/v1/public/characters";
const TS = 1;
const FAVORITE_KEY = "FavoriteIdArray";

// DOM Elements
const searchInput = document.querySelector("input");
const searchResults = document.getElementById("search-results");

// Initializes favoriteIdArray from localStorage or an empty array
let favoriteIdArray = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];

// Event Listeners
searchInput.addEventListener("input", () =>
  fetchSuperHeroes(searchInput.value)
);
document.addEventListener("click", handleDocumentClick);
window.addEventListener("load", () => {
  fetchSuperHeroes("");
  updateFavoriteButtons();
});

// Fetches superheroes from Marvel API
async function fetchSuperHeroes(searchedValue) {
  try {
    let apiUrl = `${API_BASE_URL}?ts=${TS}&apikey=${publicKey}&hash=${md5Hash}`;

    if (searchedValue) {
      apiUrl += `&nameStartsWith=${searchedValue}`;
    }

    const response = await fetch(apiUrl);
    const { data } = await response.json();

    if (data && data.results) {
      const superHeroes = data.results.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      showSearchResults(superHeroes);
      updateFavoriteButtons();
    }
  } catch (error) {
    console.error(error);
  }
}

// Displays search results
function showSearchResults(superHeroes) {
  searchResults.innerHTML = "";
  superHeroes.forEach((hero) => {
    const isFavorite = favoriteIdArray.includes(hero.id);
    const heroElement = createHeroElement(hero, isFavorite);
    searchResults.appendChild(heroElement);
  });
}

// Creates HTML element for a hero
function createHeroElement(hero, isFavorite) {
  const container = document.createElement("div");
  container.classList.add("container");
  container.innerHTML = `
    <div class="card">
      <img src="${hero.thumbnail.path}/standard_fantastic.${
    hero.thumbnail.extension
  }" alt="">
      <div class="card__details">
        <span class="tag">ID : <i>${hero.id}</i></span>
        <span class="tag">Comics : ${hero.comics.available}</span>
        <span class="tag">Events : ${hero.events.available}</span>
        <span class="tag">Series : ${hero.series.available}</span>
        <span class="tag">Stories : ${hero.stories.available}</span>
        <div class="name">${hero.name}</div>
      </div>
    </div>
    <div class="favBtnNew">
      <div class="cardi">
        <button class="addToFavBtn">
          ${
            isFavorite
              ? '<i class="fa-solid fa-heart remFavBtn"></i> &nbsp; Remove from Favorites'
              : '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favorites'
          }
        </button>
      </div>
    </div>
    <div class="knowmore">
      <div class="character-info">
        <div class="cardi">
          <button class="knowmorejs">
            <i class="fa-solid fa-circle-info"></i> &nbsp; Know More
          </button>
        </div>
      </div>
    </div>
  `;
  return container;
}

// Handles click events
function handleDocumentClick(event) {
  const target = event.target;
  const addToFavBtn = target.closest(".addToFavBtn");
  if (addToFavBtn) {
    const container = addToFavBtn.closest(".container");
    const heroId = container.querySelector(".tag i").textContent;
    toggleFavorite(heroId, addToFavBtn);
  } else if (target.classList.contains("knowmorejs")) {
    const heroId = target
      .closest(".container")
      .querySelector(".tag i").textContent;
    localStorage.setItem("id", heroId);
    window.location.assign("./about.html");
  }
}

// Toggles favorite status
function toggleFavorite(heroId, button) {
  const isFavorite = favoriteIdArray.includes(heroId);
  if (!isFavorite) {
    favoriteIdArray.push(heroId);
    showSplashNotification("Added to Favorites", "#218838");
  } else {
    const index = favoriteIdArray.indexOf(heroId);
    if (index !== -1) {
      favoriteIdArray.splice(index, 1);
    }
    showSplashNotification("Removed from Favorites", "#dc3545");
  }
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteIdArray));
  updateFavoriteButtons();
}

//shows the splash notification
function showSplashNotification(message, color) {
  const splash = document.getElementById("splash");
  splash.innerText = message;
  splash.style.backgroundColor = color;
  splash.classList.add("show");
  setTimeout(() => {
    splash.classList.remove("show");
  }, 1000);
}

// Updates favorite buttons
function updateFavoriteButtons() {
  const addToFavButtons = document.querySelectorAll(".addToFavBtn");
  addToFavButtons.forEach((button) => {
    const container = button.closest(".container");
    const heroId = container.querySelector(".tag i").textContent;
    const isFavorite = favoriteIdArray.includes(heroId);

    // Updates button color based on favorite status
    if (isFavorite) {
      button.innerHTML =
        '<i class="fa-solid fa-x"></i> &nbsp; Remove from Favorites';
      button.style.backgroundColor = "#dc3545";
    } else {
      button.innerHTML =
        '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favorites';
      button.style.backgroundColor = "";
    }
  });
}
