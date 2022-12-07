console.log("hello world");

const VAPID_PUBLIC_KEY =
  "BLee58G5uGzsPUYzAez62gDRR84T-Z6Gu4ZnorAZwLLQaVyGeKS93N_YxpKxmJSzF_rlMx46ybA67U45fOW6NzE";

const subscribeBtn = document.getElementById("subscribe");

subscribeBtn.addEventListener("click", (ev) => {
  console.log(Notification.permission);
  Notification.requestPermission((result) => {
    console.log("2 " + result);
  });
  const notif = new Notification("TestNotif", { body: "hi!!!" });
  const worker = navigator.serviceWorker
    .register("./service-worker2.js")
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
      }).then(() => console.log("Request Sent"));
    })
    .catch((err) => {
      console.warn(err);
    });
});
