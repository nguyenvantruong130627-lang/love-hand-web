const startBtn = document.getElementById("startBtn");
const video = document.getElementById("video");

startBtn.addEventListener("click", startCamera);

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error("Camera error:", error);
            alert("Không mở được camera, kiểm tra quyền hoặc console!");
        });
}
