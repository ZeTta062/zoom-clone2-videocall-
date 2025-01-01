const frontSocket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        console.log(cameras);
        cameras.forEach((camera) => {
            const option = document.createElement("option")
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    } catch(error) {
        console.log(error);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true, 
        video: {facingMode: "user"}
    };
    const cameraConstraints = {
        audio: true,
        video: {deviceId: { exact: deviceId}}
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstrains
        );
            myFace.srcObject = myStream;
            if(!deviceId) {
                await getCameras();
            }
    } catch(error) {
        console.log(error)
    }
}

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
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Camera On";
        cameraOff = true;
    }
});

camerasSelect.addEventListener("input", async () => {
    await getMedia(camerasSelect.value);
});



// welcome Form (Join Room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");              // 웰컴폼의 인풋을 작성하면 방에 들어감

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

welcomeForm.addEventListener("submit", async (event) => {
    event.preventDefault();   
    const input = welcomeForm.querySelector("input");
    await initCall();
    frontSocket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";  
})


// Socket code  
frontSocket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer();         //offer를 만듦, 호스트
    myPeerConnection.setLocalDescription(offer);                //offer를 전송
    console.log("sent the offer");
    frontSocket.emit("offer", offer, roomName);
    //console.log("누군가 들어왔습니다.");
});

frontSocket.on("offer", async (offer) => {                      //offer를 받음, 참가자
    myPeerConnection.setRemoteDescription(offer);               //RemoteDescription을 설정함
    const answer = await myPeerConnection.createAnswer();       //answer를 만듦
    myPeerConnection.setLocalDescription(answer);               //answer를 전송
    frontSocket.emit("answer", answer, roomName);
});

frontSocket.on("answer", (answer) => {
    myPeerConnection.setRemoteDescription(answer);              //answer를 받음, 호스트 
})

// RTC Code
function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream));
}