const displayOptionsDropdown = document.getElementById("displayOptionsDropdown");
const sortMethodsDropdown = document.getElementById("sortMethodsDropdown");
const artistCards = document.querySelectorAll(".artistCard");

// Listner on page load
document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname === "/music/albums/")
  {
    if (window.location.search === "")
    {
      displayOptionsDropdown.value = "Albums"
      sortMethodsDropdown.value = "Rating (High -> Low)"

      // Hide back button
      document.getElementById("backButtonLink").style.display = "none";
    }
    else
    {
      displayOptionsDropdown.value = "Artist's Albums"
      sortMethodsDropdown.value = "Rating (High -> Low)"

      // Filter albums down by artistName
      const artistName = new URLSearchParams(window.location.search).get("artistName");
      filterAlbumsByArtistName(artistName);

      // Show back button
      console.log(document.getElementById("backButtonLink"));
      document.getElementById("backButtonLink").style.display = "";
    }
  }
  else if (window.location.pathname === "/music/artists/")
  {
    displayOptionsDropdown.value = "Artists"
    sortMethodsDropdown.value = "Random"

    // Hide back button
    document.getElementById("backButtonLink").style.display = "none";
  }
  else {
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

// Filter displayed albums by artist name
function filterAlbumsByArtistName(artistName) {
  let musicCardGrid = document.getElementById("musicCardGrid");
  let toFilter = musicCardGrid.children;
  toFilter = Array.prototype.slice.call(toFilter, 0);
  let filtered = [];

  toFilter.forEach(card => {
    const cardArtistName = card.getAttribute("artist");

    if (cardArtistName === artistName)
    {
      filtered.push(card);
    }
  });

  // Clear
  musicCardGrid.innerHTML = "";

  // Re-populate cards
  let i = 0;
  for (l = filtered.length; i < l; i++)
  {
    musicCardGrid.appendChild(filtered[i]);
  }

}
