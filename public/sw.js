function receivePushNotification(event) {
    //console.log("[Service Worker] Push Received.", event, event.data.json());
  
    const { reference_title, id, channel_code, code, strip_body, user, author, title, body, redirect_link, code_data, workspaces, SOCKET_TYPE } = event.data.json();
    let options = {
      //data: redirect_link,
      data: `/chat/${channel_code}/${code}`,
      body: strip_body,
      vibrate: [200, 100, 200],
      tag: id,
      badge: "./favicon.ico",
      actions: [{ action: "Detail", title: "View", icon: "./favicon.ico" }]
    };
    let notification_title = reference_title;
    //Get URL objects for each client's location.
    let showNotification = true;
    let link = "";
    if (SOCKET_TYPE === "CHAT_DELETE") {
      self.registration.getNotifications({tag: id}).then(notifications => {
        notifications.forEach(notification => {
          //notification.body = "removed message"
          notification.close()
        })
      })
    } else {
      const replaceChar = (name, char = "-") => {
        return name.toLowerCase().replace(/\s|\//g, char);
      };

       if (SOCKET_TYPE === "POST_COMMENT_CREATE") {
        const { push_title, post_id, post_title } = code_data;
        notification_title = push_title;
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
          data: `${link}`,
          body: body.replace(/(<([^>]+)>)/gi, ""),
          image: author.profile_image_link,
          icon: author.profile_image_link,
        }
      } else if (SOCKET_TYPE === "POST_CREATE") {
        //const { base_link } = code_data;
        notification_title = `${author.name} shared a post`;
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
          data: `${link}`,
          image: author.profile_image_link,
          icon: author.profile_image_link,
        }
      } else if (SOCKET_TYPE === "ADVANCE_REMIND_TODO") {
        const { data, link_type } = event.data.json();
        notification_title = `You asked to be reminded about ${title}`;
        link = "/todos";
        if (link_type) {
          if (link_type === "POST_COMMENT" || link_type === "POST") {
            if (data.workspaces.length) {
              if (data.workspaces[0].workspace){
                link = `/workspace/posts/${data.workspaces[0].workspace.id}/${replaceChar(data.workspaces[0].workspace.name)}/${data.workspaces[0].topic.id}/${replaceChar(data.workspaces[0].topic.name)}/post/${data.post.id}/${replaceChar(data.post.title)}`;
              } else {
                link = `/workspace/posts/${data.workspaces[0].topic.id}/${replaceChar(data.workspaces[0].topic.name)}/post/${data.post.id}/${replaceChar(data.post.title)}`;
              }
            } else {
              link = `/posts/${data.post.id}/${replaceChar(data.post.title)}`;
            }
          } else if (link_type === "CHAT") {
            link = `/chat/${data.channel.code}/${data.chat_message.code}`;
          }
        } 
        options = {
          ...options,
          body: title,
          data: link,
          // image: author.profile_image_link,
          // icon: author.profile_image_link,
        }
      } else if (SOCKET_TYPE === "CHAT_CREATE") {
        options = {
          ...options,
          body: reference_title.includes("in a direct message") ? strip_body : `${user.first_name}: ${strip_body}`
        }
      }

      self.clients.matchAll({includeUncontrolled: true}).then(clients => {
        for (const client of clients) {
          const clientUrl = new URL(client.url);
          if (SOCKET_TYPE === "CHAT_CREATE" && clientUrl.pathname === `/chat/${channel_code}`) {
            showNotification = false;
          }
          if (SOCKET_TYPE === "POST_COMMENT_CREATE" && link !== "" && clientUrl.pathname === link) {
            showNotification = false;
          }
          if (client.visibilityState !== 'visible' || SOCKET_TYPE === "ADVANCE_REMIND_TODO") {
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
  self.addEventListener('notificationclick', event => {
    //console.log("[Service Worker] Notification click Received.", event.notification.data);
    event.waitUntil(async function() {
      const allClients = await clients.matchAll();
      
      if (allClients.length) {
        //if there's a current tab open
        allClients[0].navigate(event.notification.data);
        allClients[0].focus();
      } else {
        clients.openWindow(event.notification.data);
        event.notification.close();
      }
    }());
  });