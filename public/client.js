// Push notification logic.

const VAPID_PUBLIC_KEY = 'VAPID_PUBLIC_KEY_VALUE_HERE';
const subscribeButton = document.getElementById('subscribe');
const unsubscribeButton = document.getElementById('unsubscribe');
const notifyMeButton = document.getElementById('notify-me');

async function subscribeButtonHandler() {
  // TODO
}

async function unsubscribeButtonHandler() {
  // TODO
}

// Convert a base64 string to Uint8Array.
// Must do this so the server can understand the VAPID_PUBLIC_KEY.
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray; 
}

// Startup logic.

// TODO add startup logic here

// Logic for the "Notify me" and "Notify all" buttons.

document.getElementById('notify-me').addEventListener('click', async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.getSubscription();
  fetch('/notify-me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({endpoint: subscription.endpoint})
  });
});

document.getElementById('notify-all').addEventListener('click', async () => {
  const response = await fetch('/notify-all', {
    method: 'POST'
  });
  if (response.status === 409) {
    document.getElementById('notification-status-message').textContent =
        'There are no subscribed endpoints to send messages to, yet.';
  }
});