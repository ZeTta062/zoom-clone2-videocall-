const frontSocket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            {
                audio:true,
                video:true,
            });
            myFace.srcObject = myFace;
    } catch(error) {
        console.log(error)
    }
}

getMedia();

muteBtn.addEventListener("click", () => {
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "mute";
        muted = false;
    }
});
cameraBtn.addEventListener("click", () => {
    if(!cameraOff){
        cameraBtn.innerText = "Camera On";
        cameraOff = true;
    } else {
        cameraBtn.innerText = "Camera Off";
        cameraOff = false;
    }
}); 