let push = document.getElementById("push");
let pull = document.getElementById("pull");

let alltimePushDIV = document.getElementById("pushalltime");
let alltimePullDIV = document.getElementById("pullalltime");

let resetButton = document.getElementById("reset");
let resetAlltimeButton = document.getElementById("resetalltime");

let alltimePush = 0;
let alltimePull = 0;
let pushCount = 0;
let pullCount = 0;
document.getElementById("reload").onclick = function() {
  location.reload();
}
// --- User ID for server ---
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = 'user-' + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("userId", userId);
}

// --- Load local counts ---
if (localStorage.getItem("pushCount")) {
  pushCount = parseInt(localStorage.getItem("pushCount"));
  push.innerText = pushCount;
}
if (localStorage.getItem("pullCount")) {
  pullCount = parseInt(localStorage.getItem("pullCount"));
  pull.innerText = pullCount;
}
if (localStorage.getItem("alltimePush")) {
  alltimePush = parseInt(localStorage.getItem("alltimePush"));
  alltimePushDIV.innerText = "ALL Time Pushups: " + alltimePush;
}
if (localStorage.getItem("alltimePull")) {
  alltimePull = parseInt(localStorage.getItem("alltimePull"));
  alltimePullDIV.innerText = "ALL Time Pullups: " + alltimePull;
}

// --- Reset buttons ---
resetAlltimeButton.onclick = function() {
  if (!confirm("Are you sure you want to reset ALL TIME counts?")) return;
  localStorage.removeItem("alltimePush");
  localStorage.removeItem("alltimePull");
  alltimePush = 0;
  alltimePull = 0;
  alltimePushDIV.innerText = "ALL Time Pushups: " + alltimePush;
  alltimePullDIV.innerText = "ALL Time Pullups: " + alltimePull;
};

resetButton.onclick = function() {
  if (!confirm("Are you sure you want to reset current counts?")) return;
  localStorage.removeItem("pushCount");
  localStorage.removeItem("pullCount");
  pushCount = 0;
  pullCount = 0;
  push.innerText = pushCount;
  pull.innerText = pullCount;
};

// --- Helper: send daily counts to server ---
async function sendDailyCount(type, amount) {
  try {
    const response = await fetch('/api/counts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, push: type === 'push' ? amount : 0, pull: type === 'pull' ? amount : 0 })
    });
    const data = await response.json();
    console.log('Server daily count updated:', data);
  } catch (err) {
    console.error('Error updating daily count:', err);
  }
}

// --- Button clicks ---
push.onclick = function() {
  pushCount += 1;
  alltimePush += 1;
  push.innerText = pushCount;
  alltimePushDIV.innerText = "ALL Time Pushups: " + alltimePush;
  localStorage.setItem("pushCount", pushCount);
  localStorage.setItem("alltimePush", alltimePush);
  sendDailyCount('push', 1);
};

pull.onclick = function() {
  pullCount += 1;
  alltimePull += 1;
  pull.innerText = pullCount;
  alltimePullDIV.innerText = "ALL Time Pullups: " + alltimePull;
  localStorage.setItem("pullCount", pullCount);
  localStorage.setItem("alltimePull", alltimePull);
  sendDailyCount('pull', 1);
};

// --- Fetch current daily counts from server (optional) ---
async function getTodayCounts() {
  try {
    const response = await fetch('/api/counts');
    const data = await response.json();
    document.getElementById("leaderboard-list").innerHTML = JSON.stringify(data, null, 2);

    console.log('Today’s counts from server:', data);
    return data;
  } catch (err) {
    console.error('Error fetching counts:', err);
  }
}

getTodayCounts();
