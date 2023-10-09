const displayOptionsDropdown = document.getElementById("displayOptionsDropdown");
const sortMethodsDropdown = document.getElementById("sortMethodsDropdown");

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname === "/music/albums/")
  {
    console.log("albums")
    displayOptionsDropdown.value = "Albums"
    sortMethodsDropdown.value = "Rating (High -> Low)"
  }
  else if (window.location.pathname === "/music/artists/")
  {
    console.log("artist")
    displayOptionsDropdown.value = "Artists"
    sortMethodsDropdown.value = "Random"
  }


});

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

sortMethodsDropdown.addEventListener('change', function() {
  const selectedValue = sortMethodsDropdown.value;
  console.log(selectedValue);
  // change sortMethod
});

function shuffleCards() {
  const musicCardGrid = document.getElementById("musicCardGrid");
  const cards = Array.from(musicCardGrid.querySelectorAll(".albumCard"));

  for (let i = cards.length - 1; i > 0; i--)
  {
    const j = Math.floor(Math.random() * (i + 1))
    [cards[i], cards[j]] = [cards[j], cards[i]];
    console.log(cards[i]);
  }

  cards.forEach(card => musicCardGrid.appendChild(card));
}
