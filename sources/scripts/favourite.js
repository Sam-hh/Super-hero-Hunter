// Constants
const publicKey = "df1a8e82bfc2aa0b7d62c8e00bc70527";
const md5Hash = "d1e4c7d4c1ffb2ab12806b4d1b487c59";
const API_BASE_URL = "https://gateway.marvel.com/v1/public/characters";
const TS = 1;
const FAVORITE_KEY = "FavoriteIdArray";

// Event Listeners
window.addEventListener("load", displayFavoriteSuperheroes); // When the window loads, display favorite superheroes
document.addEventListener("click", handleDocumentClick); // Listen for click events

// Fetches superhero by ID from Marvel API
async function fetchSuperheroById(id) {
  if (!id) {
    throw new Error("Invalid ID: ID cannot be null");
  }

  const response = await fetch(
    `${API_BASE_URL}/${id}?ts=${TS}&apikey=${publicKey}&hash=${md5Hash}`
  );
  const data = await response.json();

  if (response.status === 404) {
    throw new Error(`Superhero with ID ${id} not found.`);
  }

  if (
    !data ||
    !data.data ||
    !data.data.results ||
    data.data.results.length === 0
  ) {
    throw new Error("No superhero data found in the response");
  }

  return data.data.results[0];
}

// Toggles favorite status of a superhero
function toggleFavorite(heroId) {
  const favoriteIdArray = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
  const index = favoriteIdArray.indexOf(heroId);

  if (index === -1) {
    favoriteIdArray.push(heroId);
    showSplashNotification("Added to Favorites", "#218838");
  } else {
    favoriteIdArray.splice(index, 1);
    showSplashNotification("Removed from Favorites", "#dc3545");
  }

  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favoriteIdArray));
  displayFavoriteSuperheroes();
}

// Handles click events on document
function handleDocumentClick(event) {
  const target = event.target;
  const addToFavBtn = target.closest(".addToFavBtn");

  if (addToFavBtn) {
    const heroId = addToFavBtn.dataset.heroId;
    toggleFavorite(heroId);
  } else if (target.classList.contains("knowmorejs")) {
    const heroId = target
      .closest(".container")
      .querySelector(".tag i").textContent;
    localStorage.setItem("id", heroId);
    window.location.assign("./about.html");
  }
}

// Displays splash notification
function showSplashNotification(message, color) {
  const splash = document.getElementById("splash");
  splash.innerText = message;
  splash.style.backgroundColor = color;
  splash.classList.add("show");
  setTimeout(() => {
    splash.classList.remove("show");
  }, 1000);
}

// Displays favorite superheroes
function displayFavoriteSuperheroes() {
  const favResults = document.getElementById("fav-results");
  const favoriteIdArray = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];

  if (favoriteIdArray.length > 0) {
    favResults.innerHTML = "";
    favoriteIdArray.forEach((id) => {
      fetchSuperheroById(id)
        .then((hero) => {
          const isFavorite = favoriteIdArray.includes(hero.id);
          const heroElement = createHeroElement(hero, isFavorite);
          favResults.appendChild(heroElement);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } else {
    favResults.innerHTML =
      "<h2>No favorite superheroes found. Please add heroes to favorites to see them on this page</h2>";
  }
}

// Creates HTML element for a superhero
function createHeroElement(hero, isFavorite) {
  const container = document.createElement("div");
  container.classList.add("container");
  container.setAttribute("data-hero-id", hero.id);

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
        <button class="addToFavBtn" data-hero-id="${hero.id}">
          ${
            isFavorite
              ? '<i class="fa-solid fa-heart remFavBtn"></i> &nbsp; Add to Favorites'
              : '<i class="fa-solid fa-x"></i> &nbsp; Remove from Favorites'
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
