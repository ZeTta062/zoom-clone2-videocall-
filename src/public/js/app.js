const frontSocket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras")

let myStream;
let muted = false;
let cameraOff = true;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const cameras = devices.filter((device) => device.kind === "videoinput");
        console.log(cameras);
        cameras.forEach(camera => {
            const option = document.createElement("option")
            option.value = camera.deviceId;
            option.innerText = camera.label;
            camerasSelect.appendChild(option);
        })
    } catch(error) {
        console.log(error);
    }
}

async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            {
                audio:true,
                video:false,
            });
            myFace.srcObject = myStream;
            await getCameras();
    } catch(error) {
        console.log(error)
    }
}

getMedia();

muteBtn.addEventListener("click", () => {
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled =! track.enabled));
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "mute";
        muted = false;
    }
});
cameraBtn.addEventListener("click", () => {
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled =! track.enabled));
    if(!cameraOff){
        cameraBtn.innerText = "Camera Off";
        cameraOff = true;
    } else {
        cameraBtn.innerText = "Camera On";
        cameraOff = false;
    }
}); 