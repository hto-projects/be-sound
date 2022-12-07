self.addEventListener("push", (event) => {
  event.waitUntil(self.registration.showNotification("BeSound"));
});
