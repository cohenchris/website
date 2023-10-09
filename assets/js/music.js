const displayOptionsDropdown = document.getElementById("displayOptionsDropdown");
const sortMethodsDropdown = document.getElementById("sortMethodsDropdown");

// Listner on page load
document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname === "/music/albums/")
  {
    displayOptionsDropdown.value = "Albums"
    sortMethodsDropdown.value = "Rating (High -> Low)"
    handleSort(sortMethodsDropdown.value);
  }
  else if (window.location.pathname === "/music/artists/")
  {
    displayOptionsDropdown.value = "Artists"
    sortMethodsDropdown.value = "Random"
    handleSort(sortMethodsDropdown.value);
  }
});

// Listener for type of card to display
displayOptionsDropdown.addEventListener('change', function() {
  const selectedValue = displayOptionsDropdown.value;
  if (selectedValue === "Albums")
  {
    window.location.href = "/music/albums"
  }
  else if (selectedValue === "Artists")
  {
    window.location.href = "/music/artists";
  }
});

// Listener for how to sort cards
sortMethodsDropdown.addEventListener('change', function() {
  const newSortMethod = sortMethodsDropdown.value;
  handleSort(newSortMethod);
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
