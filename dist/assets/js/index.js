var convertBtn = document.querySelector('.convert-button');
var URLinput = document.querySelector('.URL-input');
var dataWidget = document.querySelector('.dataWidget');
var suggestionWidget = document.querySelector('.dropdown-content');
var videoWidget = document.querySelector('.videoWidget');
const baseURL = 'https://ytconvertor.com/';
const apiKey = 'AIzaSyDcqNz1O2jdac8u7VaJAron5zhdxuydmxk';

convertBtn.addEventListener('click', () => {
   sendURL(URLinput.value);
});

URLinput.addEventListener('input', () => {
   sendURL(URLinput.value);
});

function sendURL(URL) {
   dataWidget.innerHTML = null;
   const isLoading = document.createElement('span');
   isLoading.innerHTML =
      '<span style="padding-bottom:8px;"> Processing the link to download. Stay on the page...</span>';
   dataWidget.appendChild(isLoading);
   fetch(`https://ytconvertor.com/.netlify/functions/api/download?URL=${URL}`)
      .then(res => res.json())
      .then(json => {
         dataWidget.innerHTML = null;
         if (json.status == 400) {
            getVideoSuggestions(URLinput.value);
         } else {
            const title = document.createElement('div');
            const thumb = document.createElement('div');
            const table = document.createElement('table');
            title.className = 'row';
            thumb.className = 'row';
            table.className = 'mg-t--20 col-md-12 table table-bordered table-hover table-sm';
            table.innerHTML =
               '<thead class="thead-light"><tr><th scope="col">Resolution</th><th scope="col">Extension</th><th scope="col">Size</th><th scope="col">Download</th></tr></thead>';
            title.innerHTML =
               '<div class="col-md-6 ml-auto mr-auto"><h1 class="h3 text-center">' +
               json.info.title +
               '</h1></div>';
            thumb.innerHTML =
               '<div class="col-md-4 ml-auto mr-auto mt-5"><img class="img-responsive" height="180px" src=' +
               json.info.player_response.videoDetails.thumbnail.thumbnails[0].url +
               '/></div>';
            const tRow = document.createElement('tbody');
            json.info.formats.map((e, i) => {
               const fileSize =
                  e.contentLength == null ? '- ' : (e.contentLength * 0.000001).toFixed(2);
               if (e.qualityLabel != null) {
                  const cell = document.createElement('tr');
                  const a = document.createElement('td');
                  a.style.textDecoration = 'none';
                  a.innerHTML =
                     '<button class="btn text-white bg-primary"><span class="fas fa-download"style="font-size: 16px;padding-right: 4px"></span>Download</button>';
                  a.onclick = event => {
                     event.preventDefault();
                     window.location.href =
                        baseURL +
                        'download.html?id=' +
                        json.info.video_id +
                        '&link=' +
                        encodeURIComponent(e.url);
                  };
                  cell.innerHTML =
                     '<td>' +
                     e.qualityLabel +
                     '</td><td>' +
                     e.container +
                     '</td><td>' +
                     fileSize +
                     'MB' +
                     '</td>';
                  cell.appendChild(a);
                  tRow.appendChild(cell);
               }
            });
            table.appendChild(tRow);
            dataWidget.appendChild(title);
            dataWidget.appendChild(thumb);
            dataWidget.appendChild(table);
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
