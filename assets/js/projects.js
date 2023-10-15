const projectsSearchBar = document.getElementById("projectsSearchBar");
const posts = document.getElementById("posts");
let toSearch = posts.children;
toSearch = Array.prototype.slice.call(toSearch, 0);

projectsSearchBar.addEventListener('input', function() {
  const searchText = projectsSearchBar.value.toLowerCase();
  const searchTerms = searchText.split(" ");

  toSearch.forEach(article => {
    const isMatch = searchTerms.every(term => article.innerText.toLowerCase().includes(term));

    article.hidden = !isMatch;
  });

});
