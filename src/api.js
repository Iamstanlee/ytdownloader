const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const path = require('path');
// api routes
app.use(cors());
app.listen(process.env.PORT || 4000, function() {
   console.log('node js server is running at', process.env.PORT);
});
app.get('/download', (req, res) => {
   var URL = req.query.URL;
   if (validateURL(URL)) {
      ytdl.getInfo(URL, (err, info) => {
         if (err) throw err;
         res.send({
            info: info
         });
      });
   } else {
      res.send({
         status: 400,

         err: 'Invalid URL'
      });
   }
});
app.get('/mp3Info', (req, res) => {
   var URL = req.query.URL;
   if (validateURL(URL)) {
      ytdl.getInfo(URL, (err, info) => {
         if (err) throw err;
         let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
         res.send({
            formats: audioFormats,
            info: info
         });
      });
   } else {
      res.send({
         status: 400,
         err: 'Invalid URL'
      });
   }
});
app.get('/downloadMp3', (req, res) => {
   var URL = req.query.URL;
   var name = req.query.name;
   res.header('Content-Disposition', `attachment; filename="${name}.mp3"`);
   ytdl(URL, {
      filter: 'audioonly'
   }).pipe(res);
});

function validateURL(url) {
   return ytdl.validateURL(url);
}
