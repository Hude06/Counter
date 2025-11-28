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
const chart = document.getElementById('mychart').getContext('2d');
const myChart = new Chart(chart, {
  type: 'bar', // better for multiple users
  data: {
    labels: [], // usernames will go here
    datasets: [{
      label: 'Pushups',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Pullups',
      data: [],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});
document.getElementById("username").innerText = "Username: " + (localStorage.getItem("username") || "Guest");
let username = localStorage.getItem("username")
document.getElementById("setusername").onclick = function() {
  let newName = prompt("Enter your username:", username || "Guest");
  if (newName) {
    localStorage.setItem("username", newName);
    username = newName
    document.getElementById("username").innerText = "Username: " + newName;
  }
}
document.getElementById("reload").onclick = function() {
  location.reload();
}
// --- User ID for server ---

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
      body: JSON.stringify({ id: username, push: type === 'push' ? amount : 0, pull: type === 'pull' ? amount : 0 })
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
  getTodayCounts();
};

pull.onclick = function() {
  pullCount += 1;
  alltimePull += 1;
  pull.innerText = pullCount;
  alltimePullDIV.innerText = "ALL Time Pullups: " + alltimePull;
  localStorage.setItem("pullCount", pullCount);
  localStorage.setItem("alltimePull", alltimePull);
  sendDailyCount('pull', 1);
  getTodayCounts();
};

// --- Fetch current daily counts from server (optional) ---
async function getTodayCounts() {
  try {
    const response = await fetch('/api/counts');
    const data = await response.json();

    // Update leaderboard
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = '';
    for (let user in data) {
      const li = document.createElement('li');
      li.innerText = `${user} — Push: ${data[user].push}, Pull: ${data[user].pull}`;
      leaderboardList.appendChild(li);
    }

    // Update chart
    const labels = Object.keys(data);
    const pushData = labels.map(u => data[u].push);
    const pullData = labels.map(u => data[u].pull);

    myChart.data.labels = labels;
    myChart.data.datasets[0].data = pushData;
    myChart.data.datasets[1].data = pullData;
    myChart.update();

    return data;
  } catch (err) {
    console.error('Error fetching counts:', err);
  }
}

// Initial fetch
getTodayCounts();
// Poll every 5 seconds
setInterval(getTodayCounts, 30000);
