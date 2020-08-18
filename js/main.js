// data store
var timerStore;
var singleLyrics = document.getElementById("single-lyrics");
var searchRelated = document.getElementById("search-related");
var searchInput = document.getElementById("search-input");

// search input function with interval
function searchMethod() {
  var searchInputValue = searchInput.value;
  clearTimeout(timerStore);
  timerStore = setTimeout(function () {
    getSongsSuggestion(searchInputValue);
  }, 1000);
}

// get suggestion for input field with live
function getSongsSuggestion(songName) {
  singleLyrics.style.display = "none";
  searchRelated.style.display = "block";
  searchRelated.innerHTML = "";
  fetch("https://api.lyrics.ovh/suggest/" + songName)
    .then((response) => response.json())
    .then((data) => {
      data.data.slice(0, 5).map((item) => {
        document.getElementById(
          "search-related"
        ).innerHTML += `<div class="search-related-li w-100" >
                        <a href="#">
                            <p class="author lead" data-title="${item.title}" onclick="getSearch(event)"><strong data-title="${item.title}">${item.title} by ${item.artist.name}</strong></p>
                        </a>
                    </div>`;
      });
    })
    .catch((error) => console.log("NoT wOrKiNg! :)"));
}

// get search list
function getSearch(e) {
  var title = e.target.dataset.title || searchInput.value;
  if (e.target.dataset.title) {
    searchInput.value = e.target.dataset.title;
  }

  searchRelated.style.display = "block";
  searchRelated.innerHTML = "";
  fetch("https://api.lyrics.ovh/suggest/" + title)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("search-related").innerHTML = "";
      data.data.slice(0, 5).map((item) => {
        document.getElementById(
          "search-related"
        ).innerHTML += `<!-- single result -->
                <div class="single-result row align-items-center my-3 p-3">
                    <div class="col-md-9">
                        <h3 class="lyrics-name">${item.title}</h3>
                        <p class="author lead">Album by <span>${item.album.title}</span></p>
                    </div>
                    <div class="col-md-3 text-md-right text-center">
                        <button class="btn btn-success" data-title="${item.title}" data-artist="${item.artist.name}" onclick="getSingle(event)">Get Lyrics</button>
                    </div>
                </div>
                <!-- ./ single result -->`;
      });
    })
    .catch((error) => console.log("NoT wOrKiNg! :)"));
}

// get single Lyric
function getSingle(e) {
  var title = e.target.dataset.title;
  var artist = e.target.dataset.artist;
  singleLyrics.style.display = "block";
  searchRelated.style.display = "none";
  fetch("https://api.lyrics.ovh/v1/" + artist + "/" + title)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("lyric-title").innerHTML = title;
      document.getElementById("lyric-text").innerHTML =
        data.lyrics || data.error;
    })
    .catch((error) => console.log("NoT wOrKiNg! :)"));
}
