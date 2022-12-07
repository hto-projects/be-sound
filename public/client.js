console.log("hello world");

const subscribeBtn = document.getElementById("subscribe");

subscribeBtn.addEventListener("click", (ev) => {
  console.log(Notification.permission);
  Notification.requestPermission((result) => {
    console.log("2 " + result);
  });
  const notif = new Notification("TestNotif", { body: "hi!!!" });
});
