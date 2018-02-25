var testFolder = './videos/';
const fs = require('fs');

var addic7edApi = require('addic7ed-api');

const langs = { 'fre': 'fr', 'eng': 'en' };  

const videoType = ['avi', 'mkv', 'mp4', 'mpg'];

class Addicted {

  isItVideoFromFilename(fileName){
    const re = /(?:\.([^.]+))?$/.exec(fileName);
    return ez && re.length > 0 && videoType.indexOf(re[1]) > -1;
  }

  searchAndDownload(folderName, file, langId){
    if(file.split('.').length < 2 || file.split('.')[0].length < 1){
      //console.log('ignored', file, file.split('.')[0].length);
      return;
    }

    if(!this.isItVideoFromFilename(file)){
      return;
    }
    //console.log(file, file.split('.'));
    const seTbl = file.match(/S?0*(\d+)?[xE]0*(\d+)/gm)
    if(!seTbl) {
      return ;
    }
    const se =  seTbl[0];
    if(!se){
      return;
    }
    //console.log(file);
    const fileWithoutExtension = file.replace(/\.[^/.]+$/, '');
    const subtitleFile = folderName + fileWithoutExtension + '.' + langs[langId] + '.srt';
    if (!fs.existsSync(subtitleFile)) {
      
      const season = se.replace('S', '').split('E')[0];
      const episode = se.replace('S', '').split('E')[1];
  
      const seriesRaw = file.substr(0, file.indexOf(se));
      const series = seriesRaw.replace(/\./g, ' ');
      addic7edApi.search(series, season, episode, langId).then(function (subtitlesList) {
          const subInfo = subtitlesList[0];
          if (subInfo) {
            addic7edApi.download(subInfo, subtitleFile).then(function () {
              console.log(subtitleFile);
            }, (error) => console.log('error : ', error));
          }
      }, (error) => console.log('error : ', error));
    }
  }

  downloadFileSubtitles(folderName){
    fs.readdir(folderName, (err, files) => {
      files.forEach(file => {
        if(fs.lstatSync(folderName + file).isDirectory()) {
          this.downloadFileSubtitles(folderName + file + '/');
        }
        else {
          this.searchAndDownload(folderName, file, 'fre');
          this.searchAndDownload(folderName, file, 'eng');
        }
      });
    })
  }


}

process.argv.forEach(function (val, index, array) {
  if(val.indexOf('node') > 0 || val.indexOf('index.js') > 0 || val.indexOf('addic7ed') > 0){
    return;
  }
  testFolder = val;
});

const addic7ed = new Addicted();

addic7ed.downloadFileSubtitles(testFolder);