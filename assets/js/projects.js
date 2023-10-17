const projectsSearchBar = document.getElementById("searchBar");
const posts = document.getElementById("posts");
let toSearch = posts.children;
toSearch = Array.prototype.slice.call(toSearch, 0);

// Search bar handler
projectsSearchBar.addEventListener('input', function() {
  searchHandler();
});

function searchHandler() {
  const searchText = projectsSearchBar.value.toLowerCase();
  const searchTerms = searchText.split(" ");

  toSearch.forEach(article => {
    const isMatch = searchTerms.every(term => article.innerText.toLowerCase().includes(term));

    article.hidden = !isMatch;
  });
}

function tagSearchHandler(tag) {
  // By default, Hugo adds dashes to make tags more readable
  tag = tag.replace("-", " ");

  toSearch.forEach(article => {
    const articleTags = article.querySelector(".articleTags").textContent.split(",").map(item => item.trim());

    const isMatch = articleTags.includes(tag);

    article.hidden = !isMatch;
  });
}

const tagLinks = document.querySelectorAll(".tagLink");

// Tag click handler
tagLinks.forEach(tagLink => {
  tagLink.addEventListener('click', function(event) {
    projectsSearchBar.value = tagLink.textContent;
    tagSearchHandler(tagLink.textContent);
  });
});

const clearButton = document.getElementById("clearSearchBar");

clearButton.addEventListener('click', function(event) {
  projectsSearchBar.value = "";
  searchHandler();
});
