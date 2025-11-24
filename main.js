let push = document.getElementById("push");
let pull = document.getElementById("pull");

let alltimePushDIV = document.getElementById("pushalltime");
let alltimePullDIV = document.getElementById("pullalltime");

let resetButton = document.getElementById("reset");
let resetAlltimeButton = document.getElementById("resetalltime");

resetAlltimeButton.onclick = function() {
    //prompt the user to confirm
    if (!confirm("Are you sure you want to reset ALL TIME counts? This cannot be undone.")) {
        return;
    }
    localStorage.removeItem("alltimePush");
    localStorage.removeItem("alltimePull");
    alltimePush = 0;
    alltimePull = 0;
    alltimePushDIV.innerText = "ALL Time Pushups: " + alltimePush;
    alltimePullDIV.innerText = "ALL Time Pullups: " + alltimePull;
}
resetButton.onclick = function() {
    //prompt the user to confirm
    if (!confirm("Are you sure you want to reset current counts? This cannot be undone.")) {
        return;
    }
    localStorage.removeItem("pushCount");
    localStorage.removeItem("pullCount");
    pushCount = 0;
    pullCount = 0;
    push.innerText = pushCount;
    pull.innerText = pullCount;
}

let alltimePush = 0
let alltimePull = 0

let pushCount = 0;
let pullCount = 0;
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
push.onclick = function() {
    pushCount += 1;
    alltimePush += 1;
    alltimePushDIV.innerText = "ALL Time Pushups: " + alltimePush;
    push.innerText = pushCount;
    localStorage.setItem("pushCount", pushCount);
    localStorage.setItem("alltimePush", alltimePush);
}

pull.onclick = function() {
    pullCount += 1;
    alltimePull += 1;
    alltimePullDIV.innerText = "ALL Time Pullups: " + alltimePull;
    pull.innerText = pullCount;
    localStorage.setItem("pullCount", pullCount);
    localStorage.setItem("alltimePull", alltimePull);
}