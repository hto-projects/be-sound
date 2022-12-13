self.addEventListener("push", (event) => {
  event.waitUntil(
    self.registration.showNotification("BeSound: Share your song!", {
      body: "Now's your reminder to post what you're listening to!",
      icon: "./image.png",
    })
  );
});
