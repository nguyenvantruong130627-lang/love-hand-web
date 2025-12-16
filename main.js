const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const statusDiv = document.getElementById("status");

startBtn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    statusDiv.innerText = "📷 Camera đã bật";
  } catch (err) {
    statusDiv.innerText = "❌ Không mở được camera";
    console.error(err);
  }
};
