const displayOptionsDropdown = document.getElementById("displayOptionsDropdown");
const sortMethodsDropdown = document.getElementById("sortMethodsDropdown");
const artistCards = document.querySelectorAll(".artistCard");

// Listner on page load
document.addEventListener("DOMContentLoaded", function() {
  // Get Query Params
  const sortMethod = new URLSearchParams(window.location.search).get("sortMethod");
  let defaultSortMethod = "";

  if (window.location.pathname === "/music/albums/")
  { // All Albums view
    displayOptionsDropdown.value = "Albums";
    defaultSortMethod = "Rating (High -> Low)";

    // Hide back button
    document.getElementById("backButtonLink").style.opacity = "0";
  }
  else if (window.location.pathname === "/music/artists/")
  { // All Artists View
    displayOptionsDropdown.value = "Artists";
    defaultSortMethod = "Random";

    // Hide back button
    document.getElementById("backButtonLink").style.opacity = "0";
  }
  else if (/^\/music\/artists\/.+$/.test(window.location.pathname))
  { // Artist's Albums View
    displayOptionsDropdown.value = "Artist's Albums";
    defaultSortMethod = "Rating (High -> Low)";

    // Show back button
    document.getElementById("backButtonLink").style.opacity = "100";
  }
  else
  { // Location not handled
    return;
  }

  // Handle sort methods
  if (sortMethod === null || sortMethod === defaultSortMethod)
  { // Default sort method
    sortMethodsDropdown.value = defaultSortMethod;
  }
  else
  { // User-defined sort method
    sortMethodsDropdown.value = sortMethod;
    handleSort(sortMethod);
  }
});

// Listener for type of card to display
displayOptionsDropdown.addEventListener('change', function() {
  const selectedValue = displayOptionsDropdown.value;
  if (selectedValue === "Albums")
  {
    window.location.href = "/music/albums/";
  }
  else if (selectedValue === "Artists")
  {
    window.location.href = "/music/artists/";
  }
});

// Listener for how to sort cards
sortMethodsDropdown.addEventListener('change', function() {
  // Get URL without query params
  let url = window.location.href;
  const urlObj = new URL(url);

  if (urlObj.searchParams.has("sortMethod"))
  { // if sortMethod exists, modify it
    urlObj.searchParams.set("sortMethod", sortMethodsDropdown.value);
  }
  else
  { // if sortMethod does not exist, add it
    urlObj.searchParams.append("sortMethod", sortMethodsDropdown.value);
  }

  // Set URL to new path, but do not reload (sorts elements in place on page - faster + looks nicer not reloading all items and then sorting)
  url = urlObj.toString();
  window.history.pushState(null, null, url);

  handleSort(sortMethodsDropdown.value);
});

// Listener for displayed artist name
artistCards.forEach(card => {
  const artistLink = card.querySelector(".artistLink");
  artistLink.addEventListener('click', function(event) {
    const url = new URL(this.href);
    const artistName = url.searchParams.get("artistName");
  });
});

// Card sorting
function handleSort(newSortMethod) {
  let musicCardGrid = document.getElementById("musicCardGrid");
  let toSort = musicCardGrid.children;
  toSort = Array.prototype.slice.call(toSort, 0);

  if (newSortMethod === "A-Z")
  {
   toSort.sort((a, b) => {
      if (a.id < b.id) return -1;
      else if (a.id > b.id) return 1;
      else return 0;
    })
  }
  else if (newSortMethod === "Z-A")
  {
    toSort.sort((a, b) => {
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      else return 0;
    })
  }
  else if (newSortMethod === "Random")
  {
    toSort = toSort
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value)
  }
  else if (newSortMethod === "Rating (High -> Low)")
  {
    toSort.sort((a, b) => {
      if (a.getAttribute("rating") > b.getAttribute("rating")) return -1;
      else if (a.getAttribute("rating") < b.getAttribute("rating")) return 1;
      else return 0;
    })
  }
  else if (newSortMethod === "Rating (Low -> High)")
  {
    toSort.sort((a, b) => {
      if (a.getAttribute("rating") < b.getAttribute("rating")) return -1;
      else if (a.getAttribute("rating") > b.getAttribute("rating")) return 1;
      else return 0
    })
  }

  // Clear
  musicCardGrid.innerHTML = "";

  // Re-populate cards
  let i = 0;
  for (l = toSort.length; i < l; i++)
  {
    musicCardGrid.appendChild(toSort[i]);
  }
}

function toggleCardFlip(card) {
  var parentCard = card.parentElement;
  if (parentCard.classList.contains("flip")) {
    console.log("removing!")
    parentCard.classList.remove("flip");
  }
  else {
    console.log("adding!")
    parentCard.classList.add("flip");
  }

  console.log(card);
}
