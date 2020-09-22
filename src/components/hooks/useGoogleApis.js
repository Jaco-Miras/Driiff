import React from "react";
import {useFileActions} from "./index";

const useGoogleApis = () => {

  const {addGoogleDriveFile} = useFileActions();

  const CLIENT_ID = process.env.REACT_APP_google_client_id;
  const API_KEY = process.env.REACT_APP_google_key;

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

  const getFile = (e, fileId) => {
    window.gapi.load('client:auth2', async () => {
      window.gapi.client
        .init({
          clientId: CLIENT_ID,
          apiKey: API_KEY,
          scope: "email https://www.googleapis.com/auth/drive.metadata.readonly",
          access_type: "offline"
        })
        .then(async () => {
          const auth = await window.gapi.auth2.getAuthInstance();

          window.gapi.auth.authorize({
            client_id: CLIENT_ID,
            api_key: API_KEY,
            scope: "email https://www.googleapis.com/auth/drive.metadata.readonly",
            immediate: true
          }, (response) => {
            if (response.access_token) {
              updateSigninStatus(response.access_token, e, fileId)
            } else {
              updateSigninStatus(null, e, fileId)
            }
          });

          // Listen for sign-in state changes.
          auth.isSignedIn.listen(() => {
            updateSigninStatus(auth.isSignedIn.get(), e, fileId)
          });
        });
    });
  }


  return {
    getFile
  }
};

export default useGoogleApis;
