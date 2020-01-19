var downloadBtn = document.querySelector('.download-button');
var ytFrame = document.querySelector('.yt');
ytFrame.setAttribute('src', 'https://www.youtube.com/embed/' + getId('id'));

if (getId('mp3')) {
   downloadBtn.innerHTML = `<a href="https://ytconvertor-api.herokuapp.com/downloadMp3/?URL=${getId(
      'link'
   )}&name=${getId(
      'name'
   )}"><span class="download-button m-auto btn text-white bg-primary"><span class="fas fa-download" style="font-size: 16px;padding-right: 4px"></span>DOWNLOAD MP3</span></a>`;
} else {
   downloadBtn.innerHTML =
      '<a href=' +
      getlink() +
      '><span class="download-button m-auto btn text-white bg-primary"><span class="fas fa-download" style="font-size: 16px;padding-right: 4px"></span>Continue Download</span></a>';
}

function getId(Id) {
   var urlString = window.location.href;
   var url = new URL(urlString);
   var _id = url.searchParams.get(Id);
   return _id;
}
function getlink() {
   var arr = window.location.href.split('&').slice(1);
   return decodeURIComponent(arr.join('').slice(5));
}
