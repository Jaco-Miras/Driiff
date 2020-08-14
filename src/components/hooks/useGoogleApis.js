import React from "react";
import {useFileActions} from "./index";

const useGoogleApis = () => {

  const {addGoogleDriveFile} = useFileActions();

  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );

  const CLIENT_ID = process.env.REACT_APP_google_client_id;
  const API_KEY = isLocalhost ? process.env.REACT_APP_google_dev_key_local : process.env.REACT_APP_google_dev_key;

  const attachSignIn = (e) => {
    e.preventDefault();
    window.gapi.auth2.getAuthInstance().signIn();
  }

  const updateSigninStatus = (isSignedIn, element, fileId) => {
    if (isSignedIn) {
      window.gapi.client.load('drive', 'v2', function () {
        let file = window.gapi.client.drive.files.get({
          fileId: fileId,
          includePermissionsForView: 'published',
          supportsAllDrives: true,
        });
        file.execute(function (resp) {
          if (resp.error) {
            addGoogleDriveFile({
              file_id: fileId,
              metadata: {
                title: <span className="link">{element.href}</span>
              }
            });
            element.innerHTML = `<span class="link">${element.href}</span>`;
            element.onclick = null;
          } else {
            addGoogleDriveFile({
              file_id: fileId,
              metadata: resp
            });
            element.innerHTML = resp.title;
            element.onclick = null;
          }
        });

      });
    } else {
      element.onclick = attachSignIn;
    }
  }

  const getFile = async (e, fileId) => {
    /*window.gapi.load('auth', () => {
      window.gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
        immediate: true
      }, (response) => {
        if (response.access_token) {

        } else {
          element.innerHTML = `Google drive file link.`
          element.onclick = attachSignIn;
        }
      });
    });*/

    window.gapi.load('client:auth2', async () => {
      window.gapi.client
        .init({
          clientId: CLIENT_ID,
          apiKey: API_KEY,
          scope: "https://www.googleapis.com/auth/drive.metadata.readonly"
        })
        .then(async () => {
          const auth = await window.gapi.auth2.getAuthInstance();

          //var accessToken = gapi.auth.getToken().access_token;
          /*var xhr = new XMLHttpRequest();
          xhr.open('GET', `https://www.googleapis.com/drive/v2/files/${fileId}`);
          xhr.setRequestHeader('Authorization', 'Bearer ya29.a0AfH6SMDd8jT5DeWQ6qDWX6NXGqHBZnCAvUi911D5k6puTxuDnXQWPYlc3czk5Gp1EDXktMQJZP3kfCvv6t4E34lP9HX8Bz-MzO2V675zae5bWoRP8UdksVGanHDtanJouuE8Rjp5VKgh8zy27T6dkenkt1CHwHxvOwdw');
          xhr.onload = function() {
            callback(xhr.responseText);
          };
          xhr.onerror = function() {
            callback(null);
          };
          xhr.send();*/

          /*dispatch(
            getGoogleDriveFile({file_id: fileId}, (err, res) => {
              console.log(ref);
              console.log(err, res);
            })
          )*/

          // Listen for sign-in state changes.
          auth.isSignedIn.listen(() => {
            updateSigninStatus(auth.isSignedIn.get(), e, fileId)
          });

          // Handle the initial sign-in state.
          updateSigninStatus(auth.isSignedIn.get(), e, fileId);
        });
    });
  }

  return {
    getFile
  }
};

export default useGoogleApis;
