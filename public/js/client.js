const VAPID_PUBLIC_KEY =
  "BLee58G5uGzsPUYzAez62gDRR84T-Z6Gu4ZnorAZwLLQaVyGeKS93N_YxpKxmJSzF_rlMx46ybA67U45fOW6NzE";

const subscribeBtn = document.getElementById("subscribe");

subscribeBtn.addEventListener("click", (ev) => {
  Notification.requestPermission((result) => {
    console.log("Permission: " + result);
  });
  const notif = new Notification("BeSound", {
    body: "Now registered for notifications.",
  });
  const worker = navigator.serviceWorker
    .register("../service-worker.js")
    .then((registration) => {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then((pushSubscriptionObj) => {
      return fetch("/api/newSubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pushSubscriptionObj),
      });
    })
    .catch((err) => {
      console.warn(err);
    });
});

const addBtn = document.getElementById("addbereal");
const content = document.getElementById("content");

function createCard(username, albumName) {
  const date = new Date();
  const newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.innerHTML = `
    <h1 class='cardFriend'>${username}</h1>
    <h1 class='cardSong'>${albumName}</h1>
    <h1 class='cardTime'>${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}</h1>`;
  return newCard;
}

// at first, get all posts to display
async function getPosts() {
  const posts = await (await fetch("/api/getPosts")).json();
  posts.forEach((post) => {
    const card = createCard(post.username, post.albumName);
    content.appendChild(card);
  });
}

getPosts();

addBtn.addEventListener("click", (ev) => {
  // ERROR IF NOT LISTENING TO MUSIC
  fetch("/api/newPost")
    .then((response) => response.json())
    .then((body) => {
      const newCard = createCard(body.username, body.albumName);
      content.appendChild(newCard);
    });

  const date = new Date();

  fetch("/api/newPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
    }),
  });
});
