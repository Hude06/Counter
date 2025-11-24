let push = document.getElementById("push");
let pull = document.getElementById("pull");

let pushCount = 0;
let pullCount = 0;

// Load today's counts
fetch('/counts')
  .then(res => res.json())
  .then(data => {
    pushCount = data.push;
    pullCount = data.pull;
    push.innerText = pushCount;
    pull.innerText = pullCount;
  });

// Increment push
push.onclick = function() {
  pushCount += 1;
  push.innerText = pushCount;

  fetch('/counts', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ push: 1, pull: 0 })
  });
}

// Increment pull
pull.onclick = function() {
  pullCount += 1;
  pull.innerText = pullCount;

  fetch('/counts', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ push: 0, pull: 1 })
  });
}

// Reset button (optional)
document.getElementById('reset').onclick = function() {
  pushCount = 0;
  pullCount = 0;
  push.innerText = pushCount;
  pull.innerText = pullCount;

  fetch('/reset', { method: 'POST' });
}
