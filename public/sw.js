function receivePushNotification(event) {
    console.log("[Service Worker] Push Received.", event, event.data.json());
  
    const { reference_title, id, slug, channel_code, strip_body, user, author, title, body, SOCKET_TYPE } = event.data.json();
    let options = {
      data: `https://${slug}.drevv.com/chat/${channel_code}`,
      body: strip_body,
      icon: user.profile_image_link,
      vibrate: [200, 100, 200],
      tag: id,
      image: user.profile_image_link,
      badge: "./favicon.ico",
      actions: [{ action: "Detail", title: "View", icon: "./favicon.ico" }]
    };
    let notification_title = "";
    //Get URL objects for each client's location.
    let showNotification = false;
    self.clients.matchAll({includeUncontrolled: true}).then(clients => {
      for (const client of clients) {
        const clientUrl = new URL(client.url);
        if (SOCKET_TYPE === "CHAT_CREATE" && clientUrl.pathname === `/chat/${channel_code}`) {
          showNotification = true;
          notification_title = reference_title;
        } else if (SOCKET_TYPE === "POST_COMMENT_CREATE") {
          notification_title = `${author.name} replied in`;
          options = {
            ...options,
            body: body.replace(/(<([^>]+)>)/gi, ""),
            image: author.profile_image_link,
            icon: author.profile_image_link,
          }
        } else if (SOCKET_TYPE === "POST_CREATE") {
          notification_title = `${author.name} shared a post`;
          options = {
            ...options,
            body: title,
            image: author.profile_image_link,
            icon: author.profile_image_link,
          }
        }
        if (client.visibilityState === 'visible') {
          showNotification = true
        }
      }
      if (showNotification){
        self.registration.showNotification(notification_title, options)
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