var convertBtn = document.querySelector('.convert-button');
var URLinput = document.querySelector('.URL-input');
var dataWidget = document.querySelector('.dataWidget');
var suggestionWidget = document.querySelector('.dropdown-content');
var videoWidget = document.querySelector('.videoWidget');
// const baseURL = 'file:///home/stanlee/Documents/yt/dist/';
const baseURL = 'https://ytconvertor.com/';
const apiKey = 'AIzaSyDcqNz1O2jdac8u7VaJAron5zhdxuydmxk';

convertBtn.addEventListener('click', e => {
 sendURL(URLinput.value);
});
URLinput.addEventListener('input', () => {
 sendURL(URLinput.value);
});

function sendURL(URL) {
 dataWidget.innerHTML = null;
 const isLoading = document.createElement('span');
 isLoading.innerHTML =
  '<span style="padding-bottom:8px;"> Processing the link to download audio. Stay on the page...</span>';
 dataWidget.appendChild(isLoading);
 fetch(`https://ytconvertor.com/.netlify/functions/api/mp3Info?URL=${URL}`)
  .then(res => res.json())
  .then(json => {
   dataWidget.innerHTML = null;
   if (json.status == 400) {
    getVideoSuggestions(URLinput.value);
   } else {
    const title = document.createElement('div');
    const thumb = document.createElement('div');
    const mp3Frame = document.createElement('div');
    mp3Frame.innerHTML = `
     <button class="btn text-white bg-primary">
      <span class="fas fa-download" style="font-size: 16px;padding-right: 4px"></span>CONVERT TO MP3
     </button>`;
    mp3Frame.style.marginTop = '20px';
    mp3Frame.onclick = event => {
     event.preventDefault();
     window.location.href =
      baseURL +
      'download.html?mp3=yes&name=' +
      json.info.title +
      '&id=' +
      json.info.video_id +
      '&link=' +
      URL;
    };
    title.className = 'row';
    thumb.className = 'row';
    title.innerHTML =
     '<div class="col-md-6 ml-auto mr-auto"><h1 class="h3 text-center">' +
     json.info.title +
     '</h1></div>';
    thumb.innerHTML =
     '<div class="col-md-4 ml-auto mr-auto mt-5"><img class="img-responsive" height="180px" src=' +
     json.info.player_response.videoDetails.thumbnail.thumbnails[0].url +
     '/></div>';

    dataWidget.appendChild(title);
    dataWidget.appendChild(thumb);
    dataWidget.appendChild(mp3Frame);
   }
  })
  .catch(err => {
   dataWidget.innerHTML = err;
  });
}

function getVideoSuggestions(query) {
 suggestionWidget.innerHTML = null;
 fetch(
  `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&maxResults=4&type=video&part=snippet`
 )
  .then(res => res.json())
  .then(json => {
   if (json.error == null) {
    json.items.map(e => {
     var item = document.createElement('span');
     item.innerHTML = e.snippet.title;
     item.onclick = event => {
      suggestionWidget.innerHTML = null;
      loadSuggestionVideos(e.snippet.title);
     };
     suggestionWidget.appendChild(item);
    });
   } else {
    dataWidget.innerHTML = null;
   }
  })
  .catch(e => {
   dataWidget.innerHTML = null;
  });
}

function loadSuggestionVideos(query) {
 dataWidget.innerHTML = null;
 videoWidget.innerHTML = null;
 const isLoading = document.createElement('span');
 isLoading.innerHTML =
  '<span class="text-center" style="padding-bottom:16px;"> Please wait...</span>';
 dataWidget.appendChild(isLoading);
 fetch(
  `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&maxResults=12&type=video&part=snippet`
 )
  .then(res => res.json())
  .then(json => {
   dataWidget.innerHTML = null;
   videoWidget.innerHTML = null;
   json.items.map(e => {
    var item = document.createElement('div');
    item.className = 'col-xs-6 col-sm-4 col-md-3';
    item.innerHTML = `
     <small style="position: relative">
      <img
       style="width: 100%"
       alt=${e.snippet.title}
       src=${e.snippet.thumbnails.default.url}
      />
     </small>
     <div class="search-info">
      <span> ${e.snippet.title} </span>
      <br />
     </div>`;
    var btn = document.createElement('span');
    btn.className = 'btn';
    btn.innerHTML =
     '<button class="btn text-white bg-primary"><span class="fas fa-download"style="font-size: 16px;padding-right: 4px"></span>Download</button>';
    btn.onclick = event => {
     URLinput.value = 'https://www.youtube.com/watch?v=' + e.id.videoId;
     sendURL('https://www.youtube.com/watch?v=' + e.id.videoId);
    };
    item.appendChild(btn);
    videoWidget.appendChild(item);
   });
  })
  .catch(e => {
   videoWidget.innerHTML = null;
  });
}
