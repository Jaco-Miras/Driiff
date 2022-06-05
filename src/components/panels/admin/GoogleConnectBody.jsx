import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useAdminActions, useToaster, useTranslationActions } from "../../hooks";

import { getGoogleAuthSettings, postRevokeGoogleToken } from "../../../redux/actions/adminActions";

const Wrapper = styled.div`
  button {
    padding: 8px;
    border-width: 2px !important;
    border-color: #839aaa;
    border-radius: 5px;    
  }
  .connect-label {
    padding: 15px;
  }
  .connect-btn {
    justify-content: center;
    white-space: nowrap;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  cursor: pointer;
  
  .icon-body {
    width: 100px;  //change to this size will effect the icon size
    height: 100px;
    margin-right: 10px;
    margin-left: 10px;  
    .content {
      width: 100%;
      height: 100%;
      padding: 10px
    }
    .border {
      border-width: 3px !important;
      border-color: #839aaa !important;
      border-radius: 5px;
    }
  }
  
`;

const ActionWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
`;

const MainWrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-flow: column;
  background-color: ${(props) => props.theme.colors.third};
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 10px;

  .label.hint {
    font-size: 12px;
    background-color: #fff;
    padding-top: 10px;
    padding-bottom: 10px;
    border-width: 2px !important;
    border-color: ${(props) => props.theme.colors.primary} !important;    
  }

  .label.success {
    font-size: 14px;
    color: green;
    padding-top: 10px;
    padding-bottom: 10px;
    border-width: 2px !important;
    border-color: #8da7b0 !important;    
  }
  .label.warnning {
    font-size: 14px;
    color: #ec455d;    
    border-width: 2px !important;
    border-color: ${(props) => props.theme.colors.third} !important;  
    margin-left: 20px;  
  }  
`;

const GoogleConnectBody = () => {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();

  const dictionary = {
    adminConnectGoogleLabel: _t("ADMIN.AUTOMATION_LABEL_CONNECT_GOOGLE", "Connect Google Drive"),
    buttonConnect: _t("BUTTON.CONNECT_ACTIVE", "Connection active"),
    buttonCancel: _t("BUTTON.CANCEL", "Cancel"),
    buttonDisconnect: _t("BUTTON.DISCONNECT", "Disconnect"),
    buttonAddGoogleDrive: _t("BUTTON.ADD-GDRIVE", "Add Google Drive"),
    connectSuccess: _t("TOAST.CONNECT_GDRIVE_SUCCESS", "Connect success!"),
    connectNewGDAccount: _t("LABEL.GDRIVE_CONNECT_NEW", "Connect a new Google Drive account"),
    liveSyncConnection: _t("LAVEL.GDRIVE_SYNC_CONNECTION", "This Driff has a live sync connection with Google"),
    addGoogleDriveDescription: _t("LAVEL.GDRIVE_DESCRIPTION", "When you click on Add Google Drive button, you will be forwarded to Google authorization page"),
    connectGoogleDriveDescription: _t("LAVEL.GDRIVE_COONECT_DESCRIPTION", "Driff is successfully connected to Google Drive.\n\n All files shared on Driff are now stored direct in the Google Drive you selected."),
    disconnectGoogleDriveDescription: _t("LAVEL.GDRIVE_DISCOONECT_DESCRIPTION", "Disconnecting stops the sync of Driff to Google. And prevents the function to generate Google docs inside the Driff workspace."),
  };

  const [googleAuth, setGoogleAuth] = useState("");
  const [isConnected, setConnected] = useState(false);
  const [show, setShow] = useState(null);
  const { REACT_APP_google_redirect_uri } = process.env
  const arrowsIcon = require("../../../assets/icon/arrows.svg");
  const driffIcon = require("../../../assets/icon/driff-logo.svg");
  const googleDriveIcon = require("../../../assets/icon/google_drive_icon.svg");
  const toaster = useToaster();

  useEffect(() => {
    fetchGoogleAuthURL();
  }, [googleAuth]);
  useEffect(() => {
    if (isConnected)
      toaster.success(dictionary.connectSuccess);
  }, [isConnected])

  const fetchGoogleAuthURL = () => {
    const payload = {
      redirect_url: REACT_APP_google_redirect_uri
    }
    dispatch(
      getGoogleAuthSettings(payload, (err, res) => {
        if (err) return;
        setGoogleAuth(res.data.auth_url);
        let isEnable = res.data.google_drive_enable == 1 ? true : false;
        setConnected(isEnable)        
      })
    );
  };

  const handleConnectGoogle = (e) => {
    if (isConnected) {
      handleDisconnectGoogle();
    } else if (googleAuth != "") {
      window.location.href = googleAuth;
    }
  }

  const handleDisconnectGoogle = () => {
    dispatch(
      postRevokeGoogleToken((err, res) => {
        if (err) return;
        if (res.data.success) {
          setConnected(false);
        }
      })
    );
  }

  const handleDisconnectWarning = (e) => {
    setShow(e);
  }

  return (
    <Wrapper>
      <h5 className="mb-3">{dictionary.adminConnectGoogleLabel}</h5>
      <div className="mb-3">
        <label className="btn btn-primary connect-label">
          {dictionary.buttonConnect}
        </label>
      </div>
      <div>
        <ActionWrapper>
          <ImageWrapper>
            <div className="icon-body">
              <img className="content border" src={driffIcon} />
            </div>
            <div className="icon-body">
              <img className="content" src={arrowsIcon} />
            </div>
            <div className="icon-body">
              <img className="content border" src={googleDriveIcon} />
            </div>
          </ImageWrapper>

        </ActionWrapper>
        <MainWrapper>
          <h4 style={{ background: '#caf0fe' }}>{isConnected ? dictionary.liveSyncConnection : dictionary.connectNewGDAccount}</h4>

          <label className="label hint">{dictionary.addGoogleDriveDescription}</label>
          {
            isConnected && (
              <label className="label success">{dictionary.connectGoogleDriveDescription}</label>
            )
          }

          <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', height: 40 }}>
            <button className="btn btn-warning connect-btn"
              onMouseEnter={() => isConnected ? handleDisconnectWarning(true) : null}
              onMouseLeave={() => handleDisconnectWarning(false)}
              onClick={handleConnectGoogle}
            >
              {isConnected ? dictionary.buttonDisconnect : dictionary.buttonAddGoogleDrive}
            </button>
            {
              show && (
                <label className="label warnning">{dictionary.disconnectGoogleDriveDescription}</label>
              )
            }
          </div>
        </MainWrapper>
      </div>
    </Wrapper>
  );
};

export default GoogleConnectBody;
