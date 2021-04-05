const video=document.getElementById('videoElm')

const loadFaceAPI=async () =>{
    await faceapi.nets.faceLandmark68Net.loadFromUri('/FaceDetetion/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('/FaceDetetion/models'),
    await faceapi.nets.tinyFaceDetector.loadFromUri('/FaceDetetion/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('/FaceDetetion/models')
}
function getCameraStream(){
if(navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({ video:{} })
    .then(stream => {
        video.srcObject=stream
    })
}
}

video.addEventListener('playing',()=>{
    const canvas=faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize={
        width: video.videoWidth,
        height: video.videoHeight
    }
    setInterval(async()=>{
        const detects=await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

        const  resizeDetects=faceapi.resizeResults(detects,displaySize)
        canvas.getContext('2d').clearRect(0,0,displaySize.width,displaySize.height)
        faceapi.draw.drawDetections(canvas,resizeDetects)
        faceapi.draw.drawFaceLandmarks(canvas,resizeDetects)
        faceapi.draw.drawFaceExpressions(canvas,resizeDetects)
    },300)
})
loadFaceAPI().then(getCameraStream)


