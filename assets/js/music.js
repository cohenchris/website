document.addEventListener('DOMContentLoaded', function() {
  var artistNames = document.querySelectorAll('.artist-name');
  var albumDisplay = document.getElementById('album-display');

  artistNames.forEach(function(artistName) {
    artistName.addEventListener('click', function(e) {
      e.preventDefault();
      var albums = JSON.parse(this.getAttribute('data-albums'));
      var artistName = this.textContent;

      // Display the albums in a div or other element
      var albumList = albums.map(function(album) {
        return '<li>' + album + '</li>';
      });

      albumDisplay.innerHTML = '<h2>' + artistName + ' Albums</h2><ul>' + albumList.join('') + '</ul>';
    });
  });
});
