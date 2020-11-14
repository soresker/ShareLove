const { ipcRenderer } = require('electron')
let filePaths = [];
let myVideo;

document.addEventListener('drop', (event) => { 
  event.preventDefault(); 
  event.stopPropagation(); 

  for (let index = 0; index < event.dataTransfer.files.length; index++) {
    const element = event.dataTransfer.files[index];
    console.log('File Path of dragged files: ', element.path)
    filePaths[index] = element.path;
  }

  myVideo = document.getElementById("video"); 
  myVideo.src = filePaths[0];

  ipcRenderer.send('drop-files', filePaths)
}); 

function playPause() { 

  if (myVideo.paused) 
    myVideo.play(); 
  else 
    myVideo.pause(); 
  }

document.addEventListener('dragover', (e) => { 
  e.preventDefault(); 
  e.stopPropagation(); 
}); 

document.addEventListener('dragenter', (event) => { 
  console.log('File is in the Drop Space'); 
}); 

document.addEventListener('dragleave', (event) => { 
  console.log('File has left the Drop Space'); 
}); 


