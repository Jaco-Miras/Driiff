function receivePushNotification(event) {
    console.log("[Service Worker] Push Received.", event, event.data.json());
  
    const { reference_title, message, message_from, id, slug, channel_code } = event.data.json();

    const options = {
      data: slug ? `https://${slug}.driff.io/chat/${channel_code}` : `https://dev.drevv.com/chat/${channel_code}`,
      body: message,
      icon: message_from.profile_image_link,
      vibrate: [200, 100, 200],
      tag: id,
      image: message_from.profile_image_link,
      badge: "./favicon.ico",
      actions: [{ action: "Detail", title: "View", icon: "./favicon.ico" }]
    };

    //Get URL objects for each client's location.
    let isOnSelectedChatChannel = false
    let isWindowVisible = false
    self.clients.matchAll({includeUncontrolled: true}).then(clients => {
      for (const client of clients) {
        const clientUrl = new URL(client.url);
        if (clientUrl.pathname === `/chat/${channel_code}`) {
          isOnSelectedChatChannel = true
        }
        if (client.visibilityState === 'visible') {
          isWindowVisible = true
        }
      }
      if (!isOnSelectedChatChannel || !isWindowVisible){
        event.waitUntil(self.registration.showNotification(reference_title, options));
      }
    });
  }
  
  function openPushNotification(event) {
    console.log("[Service Worker] Notification click Received.", event.notification.data, event.notification);
    
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
  }
  
  self.addEventListener("push", receivePushNotification);
  self.addEventListener("notificationclick", openPushNotification);