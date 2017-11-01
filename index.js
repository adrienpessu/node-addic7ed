var testFolder = './videos/';
const fs = require('fs');

var addic7edApi = require('addic7ed-api');

process.argv.forEach(function (val, index, array) {
  if(val.indexOf('node') > 0 || val.indexOf('index.js') > 0 || val.indexOf('addic7ed') > 0){
    return;
  }
  testFolder = val;
});

function downloadFileSubtitles(folderName){
  fs.readdir(folderName, (err, files) => {
    files.forEach(file => {
      if(fs.lstatSync(folderName + file).isDirectory()) {
        downloadFileSubtitles(folderName + file + '/');
      }
      else {
        if(file.split('.').length < 2 || file.split('.')[0].length < 1){
          console.log('ignored', file, file.split('.')[0].length);
          return;
        }
        console.log(file, file.split('.'));
        const se =  file.match(/S?0*(\d+)?[xE]0*(\d+)/gm)[0];
        if(!se){
          return;
        }
        console.log(file);
        const fileWithoutExtension = file.replace(/\.[^/.]+$/, '');
        const subtitleFile = folderName + fileWithoutExtension + '.srt';
        if (!fs.existsSync(folderName + subtitleFile)) {
          
          const season = se.replace('S', '').split('E')[0];
          const episode = se.replace('S', '').split('E')[1];
    
          const seriesRaw = file.substr(0, file.indexOf(se));
          const series = seriesRaw.replace(/\./g, ' ');
          addic7edApi.search(series, season, episode, 'fre').then(function (subtitlesList) {
              var subInfo = subtitlesList[0];
              if (subInfo) {
                addic7edApi.download(subInfo, subtitleFile).then(function () {
                  console.log(subtitleFile);
                });
              }
          });
        }
      }
    });
  })
}


downloadFileSubtitles(testFolder);