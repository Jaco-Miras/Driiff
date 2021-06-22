import React, { useState } from "react";
import styled from "styled-components";
import GooglePicker from "react-google-picker";
import { SvgIconFeather } from "../../common";
import { useTranslationActions } from "../../hooks";

const Wrapper = styled.div`
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  opacity: ${(props) => (props.disabled ? ".5" : "1")};
  .dropdown-menu {
    width: 90%;
    left: 5%;
    top: 110%;
  }
  .link-div {
    padding: 10px;
  }
`;

const CompanyGoogleDrive = (props) => {
  const { className = "", onChange, disableOptions } = props;

  const { _t } = useTranslationActions();
  const [show, setShow] = useState(false);
  const toggle = () => {
    if (disableOptions) return;
    setShow(!show);
  };

  const handleAuthenticate = (token) => {
    if (localStorage.getItem("gdrive") === null) {
      localStorage.setItem("gdrive", token);
    }
  };

  let dictionary = {
    linkGoogleDrive: _t("FILE.LINK_GOOGLE_DRIVE", "Link your Google Drive first"),
    gDriveAttachFile: _t("FILE.ATTACH_GOOGLE_DRIVE_FILE", "Attach a file"),
    gDriveAttachFolder: _t("FILE.ATTACH_GOOGLE_DRIVE_FOLDER", "Attach a folder"),
  };

  return (
    <Wrapper className={`google-drive dropdown ${className}`} onClick={toggle} disabled={disableOptions}>
      <SvgIconFeather className="mr-2" icon="gdrive" viewBox="0 0 512 512" height="20" width="15" fill="#000" opacity=".8" /> Google Drive
      <div className={`dropdown-menu ${show ? "show" : ""}`}>
        {localStorage.getItem("gdrive") === null ? (
          <GooglePicker
            clientId={process.env.REACT_APP_google_client_id}
            developerKey={process.env.REACT_APP_google_key}
            scope={["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly"]}
            onChange={(data) => onChange(data)}
            onAuthenticate={(token) => handleAuthenticate(token)}
            //onAuthFailed={(data) => console.log("on auth failed:", data)}
            multiselect={true}
            navHidden={true}
            authImmediate={false}
            viewId={"DOCS"}
          >
            <div className="link-div">{dictionary.linkGoogleDrive}</div>
          </GooglePicker>
        ) : (
          <>
            <GooglePicker
              clientId={process.env.REACT_APP_google_client_id}
              developerKey={process.env.REACT_APP_google_key}
              scope={["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly"]}
              onChange={(data) => onChange(data)}
              onAuthenticate={(token) => handleAuthenticate(token)}
              //onAuthFailed={(data) => console.log("on auth failed:", data)}
              multiselect={true}
              navHidden={true}
              authImmediate={localStorage.getItem("gdrive") === null ? false : true}
              viewId={"DOCS"}
            >
              <div className="dropdown-item">{dictionary.gDriveAttachFile}</div>
            </GooglePicker>
            <GooglePicker
              clientId={process.env.REACT_APP_google_client_id}
              developerKey={process.env.REACT_APP_google_key}
              scope={["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive.metadata.readonly"]}
              //onChange={(data) => console.log("on change:", data)}
              onAuthenticate={(token) => handleAuthenticate(token)}
              //onAuthFailed={(data) => console.log("on auth failed:", data)}
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
                  .setDeveloperKey(process.env.REACT_APP_google_key)
                  .setCallback((data) => {
                    onChange(data);
                  });

                picker.build().setVisible(true);
              }}
            >
              <div className="dropdown-item">{dictionary.gDriveAttachFolder}</div>
            </GooglePicker>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default CompanyGoogleDrive;
