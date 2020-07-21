import React, { useState } from "react";
import styled from "styled-components";
import GooglePicker from "react-google-picker";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  .dropdown-menu {
    width: 90%;
    left: 5%;
    top: 110%;
  }
  .link-div {
    padding: 10px;
  }
`;

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const GoogleDrive = (props) => {
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const handleAuthenticate = (token) => {
    console.log("oauth token:", token);
    if (localStorage.getItem("gdrive") === null) {
      localStorage.setItem("gdrive", true);
    }
  };
  return (
    <Wrapper className={"dropdown"} onClick={toggle}>
      <SvgIconFeather className="mr-2" icon="gdrive" viewBox="0 0 512 512" height="20" width="15" fill="#000" opacity=".8"/> Google drive
      <div className={`dropdown-menu ${show ? "show" : ""}`}>
        {localStorage.getItem("gdrive") === null ? (
          <GooglePicker
            clientId={process.env.REACT_APP_google_client_id}
            developerKey={isLocalhost ? process.env.REACT_APP_google_dev_key_local : process.env.REACT_APP_google_dev_key}
            scope={["https://www.googleapis.com/auth/drive.file"]}
            onChange={(data) => console.log("on change:", data)}
            onAuthenticate={(token) => handleAuthenticate(token)}
            onAuthFailed={(data) => console.log("on auth failed:", data)}
            multiselect={true}
            navHidden={true}
            authImmediate={false}
            viewId={"DOCS"}
          >
            <div className="link-div">Link your google drive first</div>
          </GooglePicker>
        ) : (
          <>
            <GooglePicker
              clientId={process.env.REACT_APP_google_client_id}
              developerKey={isLocalhost ? process.env.REACT_APP_google_dev_key_local : process.env.REACT_APP_google_dev_key}
              scope={["https://www.googleapis.com/auth/drive.file"]}
              onChange={(data) => console.log("on change:", data)}
              onAuthenticate={(token) => handleAuthenticate(token)}
              onAuthFailed={(data) => console.log("on auth failed:", data)}
              multiselect={true}
              navHidden={true}
              authImmediate={localStorage.getItem("gdrive") === null ? false : true}
              viewId={"DOCS"}
            >
              <div className="dropdown-item">Attach a file</div>
            </GooglePicker>
            <GooglePicker
              clientId={process.env.REACT_APP_google_client_id}
              developerKey={isLocalhost ? process.env.REACT_APP_google_dev_key_local : process.env.REACT_APP_google_dev_key}
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
                  .setDeveloperKey(isLocalhost ? process.env.REACT_APP_google_dev_key_local : process.env.REACT_APP_google_dev_key)
                  .setCallback(() => {
                    console.log("Custom picker is ready!");
                  });

                picker.build().setVisible(true);
              }}
            >
              <div className="dropdown-item">Attach a folder</div>
            </GooglePicker>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default GoogleDrive;
