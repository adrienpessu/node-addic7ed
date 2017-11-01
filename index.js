const testFolder = './videos/';
const fs = require('fs');

var addic7edApi = require('addic7ed-api');

function downloadFileSubtitles(folderName){
  fs.readdir(folderName, (err, files) => {

    console.log(files);
    files.forEach(file => {
      if(fs.lstatSync(folderName + file).isDirectory()) {
        downloadFileSubtitles(folderName + file + '/');
      }
      else {
        if(file === '.DS_Store'){
          return;
        }
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