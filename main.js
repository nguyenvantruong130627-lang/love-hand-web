const video = document.getElementById("video");
const statusDiv = document.getElementById("status");

// Khởi tạo MediaPipe Hands
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

// Hàm kiểm tra ngón tay có duỗi không
function isFingerOpen(tip, pip) {
  return tip.y < pip.y;
}

hands.onResults((results) => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    statusDiv.innerText = "Không thấy tay";
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
    statusDiv.innerText = "✊ NẮM TAY";
  } else if (openCount === 1 && index) {
    statusDiv.innerText = "☝ CHỌN ẢNH";
