import React, { useState } from "react";
import styled from "styled-components";
import GooglePicker from "react-google-picker";

const Wrapper = styled.div`
  padding: 0.75rem 1.5rem;
  .dropdown-menu {
    padding: 10px;
    width: 100%;
  }
`;

const GoogleDrive = (props) => {
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const handleAuthenticate = (token) => {
    console.log("oauth token:", token);
    if (localStorage.getItem("gdrive") === null) {
      localStorage.setItem("gdrive", token);
    }
  };
  return (
    <Wrapper className={"dropdown"} onClick={toggle}>
      Google drive
      <div className={`dropdown-menu ${show ? "show" : ""}`}>
        {localStorage.getItem("gdrive") === null ? (
          <GooglePicker
            clientId={process.env.REACT_APP_google_client_id}
            developerKey={process.env.REACT_APP_google_dev_key}
            scope={["https://www.googleapis.com/auth/drive.file"]}
            onChange={(data) => console.log("on change:", data)}
            onAuthenticate={(token) => handleAuthenticate(token)}
            onAuthFailed={(data) => console.log("on auth failed:", data)}
            multiselect={true}
            navHidden={true}
            authImmediate={false}
            viewId={"DOCS"}
          >
            <div>Link your google drive first</div>
          </GooglePicker>
        ) : (
          <>
            <GooglePicker
              clientId={process.env.REACT_APP_google_client_id}
              developerKey={process.env.REACT_APP_google_dev_key}
              scope={["https://www.googleapis.com/auth/drive.file"]}
              onChange={(data) => console.log("on change:", data)}
              onAuthenticate={(token) => handleAuthenticate(token)}
              onAuthFailed={(data) => console.log("on auth failed:", data)}
              multiselect={true}
              navHidden={true}
              authImmediate={localStorage.getItem("gdrive") === null ? false : true}
              viewId={"DOCS"}
            >
              <div>Attach a file</div>
            </GooglePicker>
            <GooglePicker
              clientId={process.env.REACT_APP_google_client_id}
              developerKey={process.env.REACT_APP_google_dev_key}
              scope={["https://www.googleapis.com/auth/drive.file"]}
              onChange={(data) => console.log("on change:", data)}
              onAuthenticate={(token) => handleAuthenticate(token)}
              onAuthFailed={(data) => console.log("on auth failed:", data)}
              multiselect={true}
              navHidden={true}
              authImmediate={localStorage.getItem("gdrive") === null ? false : true}
              viewId={"FOLDERS"}
              createPicker={(google, oauthToken) => {
                const googleViewId = google.picker.ViewId.FOLDERS;
                const docsView = new google.picker.DocsView(googleViewId).setIncludeFolders(true).setMimeTypes("application/vnd.google-apps.folder").setSelectFolderEnabled(true);

                const picker = new window.google.picker.PickerBuilder()
                  .addView(docsView)
                  .setOAuthToken(oauthToken)
                  .setDeveloperKey(process.env.REACT_APP_google_dev_key)
                  .setCallback(() => {
                    console.log("Custom picker is ready!");
                  });

                picker.build().setVisible(true);
              }}
            >
              <div>Attach a folder</div>
            </GooglePicker>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default GoogleDrive;
