function receivePushNotification(event) {
    console.log("[Service Worker] Push Received.", event, event.data.json());
  
    const { reference_title, id, channel_code, strip_body, user, author, title, body, redirect_link, code_data, workspaces, SOCKET_TYPE } = event.data.json();
    let options = {
      data: redirect_link,
      body: strip_body,
      vibrate: [200, 100, 200],
      tag: id,
      badge: "./favicon.ico",
      actions: [{ action: "Detail", title: "View", icon: "./favicon.ico" }]
    };
    let notification_title = reference_title;
    //Get URL objects for each client's location.
    let showNotification = true;
    if (SOCKET_TYPE === "CHAT_DELETE") {
      self.registration.getNotifications({tag: id}).then(notifications => {
        notifications.forEach(notification => {
          //console.log(notification)
          //notification.body = "removed message"
          notification.close()
        })
      })
    } else {
      const replaceChar = (name, char = "-") => {
        return name.toLowerCase().replace(/\s|\//g, char);
      };
      self.clients.matchAll({includeUncontrolled: true}).then(clients => {
        for (const client of clients) {
          const clientUrl = new URL(client.url);
          if (SOCKET_TYPE === "CHAT_CREATE" && clientUrl.pathname === `/chat/${channel_code}`) {
            notification_title = reference_title;
            options = {
              ...options,
              image: user.profile_image_link,
              icon: user.profile_image_link,
            }
          } else if (SOCKET_TYPE === "POST_COMMENT_CREATE") {
            const { base_link, push_title, post_id, post_title } = code_data;
            notification_title = push_title;
            let link = "";
            if (workspaces.length) {
              if (workspaces[0].workspace_id){
                link = `/workspace/posts/${workspaces[0].workspace_id}/${replaceChar(workspaces[0].workspace_name)}/${workspaces[0].topic_id}/${replaceChar(workspaces[0].topic_name)}/post/${post_id}/${replaceChar(post_title)}`;
              } else {
                link = `/workspace/posts/${workspaces[0].topic_id}/${replaceChar(workspaces[0].topic_name)}/post/${post_id}/${replaceChar(post_title)}`;
              }
            } else {
              link = `/posts/${post_id}/${replaceChar(post_title)}`;
            }
            options = {
              ...options,
              data: `${base_link}${link}`,
              body: body.replace(/(<([^>]+)>)/gi, ""),
              image: author.profile_image_link,
              icon: author.profile_image_link,
            }
          } else if (SOCKET_TYPE === "POST_CREATE") {
            const { base_link } = code_data;
            notification_title = `${author.name} shared a post`;
            let link = "";
            if (workspaces.length) {
              if (workspaces[0].workspace_id){
                link = `/workspace/posts/${workspaces[0].workspace_id}/${replaceChar(workspaces[0].workspace_name)}/${workspaces[0].topic_id}/${replaceChar(workspaces[0].topic_name)}/post/${id}/${replaceChar(title)}`;
              } else {
                link = `/workspace/posts/${workspaces[0].topic_id}/${replaceChar(workspaces[0].topic_name)}/post/${id}/${replaceChar(title)}`;
              }
            } else {
              link = `/posts/${id}/${replaceChar(title)}`;
            }
            options = {
              ...options,
              body: title,
              data: `${base_link}${link}`,
              image: author.profile_image_link,
              icon: author.profile_image_link,
            }
          } else {
            showNotification = false;
          }
          if (client.visibilityState !== 'visible') {
            showNotification = true
          }
        }
        if (showNotification){
          self.registration.showNotification(notification_title, options)
        }
      });
    }
  }
  
  self.addEventListener("push", receivePushNotification);
  // self.addEventListener('notificationclick', function(event) {
  //   console.log("[Service Worker] Notification click Received.", event.notification.data, event.notification, clients);
  //   let matchingClient = false;
  //   self.clients.matchAll().then(clients => {
  //     for (const client of clients) {
  //       const clientUrl = new URL(client.url);
  //       const originUrl = new URL(event.notification.data);
  //       console.log('client for loop', client,  clientUrl.hostname === originUrl.hostname, clientUrl.hostname, originUrl.hostname)
  //         if (clientUrl.hostname === originUrl.hostname) {
  //           matchingClient = true;
  //         } 
  //     }
  //     if (matchingClient) {
  //       client.navigate(event.notification.data);
  //       client.focus();
  //       console.log("focus", event.notification.data)
  //     } else {
  //       console.log("open", event.notification.data)    
  //       // there are no visible windows. Open one.
  //       self.clients.openWindow(event.notification.data);
  //       event.notification.close();
  //     }
  //   })
  // });

  self.addEventListener('notificationclick', event => {
    event.waitUntil(async function() {
      const allClients = await clients.matchAll({
        includeUncontrolled: true
      });
  
      let matchingClient = false;
  
      for (const client of allClients) {
        const clientUrl = new URL(client.url);
        const originUrl = new URL(event.notification.data);
        console.log('client for loop', client,  clientUrl.hostname === originUrl.hostname, clientUrl.hostname, originUrl.hostname)
        if (clientUrl.hostname === originUrl.hostname) {
          console.log("focus", event.notification.data)
          client.navigate(event.notification.data);
          client.focus();
          matchingClient = true;
          break;
        } 
      }
  
      if (!matchingClient) {
        console.log("open", event.notification.data)   
        clients.openWindow(event.notification.data);
        event.notification.close();
      }
    }());
  });