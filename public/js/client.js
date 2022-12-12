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

addBtn.addEventListener("click", (ev) => {
  fetch("/api/newPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => console.log("sent"));
});
