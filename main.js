const tree = document.getElementById("tree");
const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const statusDiv = document.getElementById("status");

// =======================
// MediaPipe Hands setup
// =======================
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

// =======================
// Camera (MediaPipe)
// =======================
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480,
});

// =======================
// Start camera on click
// =======================
startBtn.addEventListener("click", async () => {
  try {
    await camera.start();
    statusDiv.innerText = "📷 Camera đã bật – đưa tay vào nhé ✋";
  } catch (err) {
    statusDiv.innerText = "❌ Không mở được camera";
    console.error(err);
  }
});

// =======================
// Hand logic
// =======================
function isFingerOpen(tip, pip) {
  return tip.y < pip.y;
}

hands.onResults((results) => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    statusDiv.innerText = "❌ Không thấy tay";
    tree.classList.add("hidden");
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
    statusDiv.innerText = "✊ NẮM TAY – CÂY THÔNG NOEL 🎄";
    tree.classList.remove("hidden");
  } 
  else {
    tree.classList.add("hidden");

    if (openCount === 1 && index) {
      statusDiv.innerText = "☝ TRỎ TAY";
    } else {
      statusDiv.innerText = "🖐 MỞ TAY";
    }
  }
});

