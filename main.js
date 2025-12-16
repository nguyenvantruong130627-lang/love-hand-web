const video = document.getElementById("video");
const statusDiv = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

// ==================
// 1. MediaPipe Hands
// ==================
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

// ==================
// 2. Camera control
// ==================
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480,
});

// BẮT BUỘC: bật camera bằng click
startBtn.addEventListener("click", async () => {
  try {
    await camera.start();
    statusDiv.innerText = "📷 Camera đang chạy...";
  } catch (e) {
    alert("Không mở được camera");
    console.error(e);
  }
});

// ==================
// 3. Hand logic
// ==================
function isFingerOpen(tip, pip) {
  return tip.y < pip.y;
}

hands.onResults((results) => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    statusDiv.innerText = "❌ Không thấy tay";
    return;
  }

  const hand = results.multiHandLandmarks[0];

  const thumb = isFingerOpen(hand[4], hand[3]);
  const index = isFingerOpen(hand[8], hand[6]);
  const middle = isFingerOpen(hand[12], hand[10]);
  const ring = isFingerOpen(hand[16], hand[14]);
  const pinky = isFingerOpen(hand[20], hand[18]);

  const openCount = [thumb, index, middle, ring, pinky].filter(Boolean).length;

  if (openCount === 0) {
    statusDiv.innerText = "✊ NẮM TAY – CÂY THÔNG 🎄";
  } 
  else if (openCount === 1 && index) {
    statusDiv.innerText = "☝ CHỌN ẢNH";
  } 
  else {
    statusDiv.innerText = "🖐 MỞ TAY – ẢNH XOAY ✨";
  }
});
