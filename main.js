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

const tree = document.getElementById("tree");

hands.onResults((results) => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    statusDiv.innerText = "❌ Không thấy tay";
    tree.classList.add("hidden");
    return;
  }

  const hand = results.multiHandLandmarks[0];

  // ĐẦU NGÓN
  const tips = [8, 12, 16, 20];
  // GỐC NGÓN
  const mcps = [5, 9, 13, 17];

  let foldedFingers = 0;

  for (let i = 0; i < tips.length; i++) {
    const tip = hand[tips[i]];
    const mcp = hand[mcps[i]];

    // Nếu đầu ngón thấp hơn gốc → đang co
    if (tip.y > mcp.y) {
      foldedFingers++;
    }
  }

  // 👉 NẮM TAY = ít nhất 3 ngón co
  if (foldedFingers >= 3) {
    statusDiv.innerText = "✊ NẮM TAY – CÂY NOEL 🎄";
    tree.classList.remove("hidden");
  } else {
    tree.classList.add("hidden");
    statusDiv.innerText = "🖐 MỞ / TRỎ TAY";
  }
});
