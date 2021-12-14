import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { ZoomMtg } from "@zoomus/websdk";
import { generateZoomSignature, createZoomMeeting } from "../../../redux/actions/chatActions";
import { $_GET } from "../../../helpers/commonFunctions";

const Wrapper = styled.div`
  .chat-sidebar-panel {
    max-width: 540px;
  }
  .chat-content-panel {
    padding-right: 1.5rem;
    flex-grow: 1;
    flex: 1 1 auto;
    @media (min-width: 1920px) {
      max-width: calc(100% - 540px);
    }
  }
  @media (max-width: 1550px) {
    .chat-sidebar-panel {
      flex: 0 0 40%;
      max-width: 40%;
    }
    .chat-content-panel {
      flex: 0 0 60%;
      max-width: 60%;
    }
  }
  @media (max-width: 1280px) {
    .chat-sidebar-panel {
      flex: 0 0 45%;
      max-width: 45%;
    }
    .chat-content-panel {
      flex: 0 0 55%;
      max-width: 55%;
    }
  }
  @media (max-width: 991.99px) {
    .chat-sidebar-panel {
      flex: unset;
      max-width: 100%;
      padding: 0 !important;
    }
    .chat-content-panel {
      padding: 0;
      flex: auto;
      max-width: 100%;
    }
  }
  .row {
    flex-wrap: unset;
  }
`;

const ZoomPanel = (props) => {
  const user = useSelector((state) => state.session.user);
  const zoomData = useSelector((state) => state.global.zoomData);
  const dispatch = useDispatch();
  const params = useParams();
  let apiKeys = {
    apiKey: process.env.REACT_APP_ZOOM_API_KEY,
    apiSecret: process.env.REACT_APP_ZOOM_API_SECRET_KEY,
  };
  let meetConfig = {
    apiKey: apiKeys.apiKey,
    userName: user.name,
    userEmail: user.email,
  };

  function joinMeeting(signature, meetConfig) {
    console.log(meetConfig);
    ZoomMtg.init({
      leaveUrl: `${process.env.REACT_APP_localDNSProtocol}${localStorage.getItem("slug")}.${process.env.REACT_APP_localDNSName}/chat`,
      isSupportAV: true,
      success: function (success) {
        console.log("Init Success ", success);
        ZoomMtg.join({
          meetingNumber: meetConfig.meetingNumber,
          userName: meetConfig.userName,
          signature: signature,
          apiKey: meetConfig.apiKey,
          passWord: meetConfig.passWord,

          success: (success) => {
            console.log(success);
          },

          error: (error) => {
            console.log(error);
          },
        });
      },
    });
  }

  useEffect(() => {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.7/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    if (params.channelId && $_GET("join") && $_GET("join") === "1") {
      dispatch(
        createZoomMeeting({ channel_id: params.channelId }, (err, res) => {
          if (err) return;
          if (res) {
            console.log(res.data);
            dispatch(
              generateZoomSignature({ meetingNumber: res.data.zoom_data.data.id, role: 1 }, (error, result) => {
                if (error) return;
                if (result) {
                  const newMeetConfig = {
                    ...meetConfig,
                    meetingNumber: res.data.zoom_data.data.id,
                    role: 1,
                    passWord: res.data.zoom_data.data.password,
                  };
                  joinMeeting(result.data.signature, newMeetConfig);
                }
              })
            );
          }
        })
      );
    } else if (params.channelId && $_GET("join") && $_GET("join") === "0") {
      if (zoomData) {
        dispatch(
          generateZoomSignature({ meetingNumber: zoomData.id, role: 0 }, (error, result) => {
            if (error) return;
            if (result) {
              const newMeetConfig = {
                ...meetConfig,
                meetingNumber: zoomData.id,
                role: 0,
                passWord: zoomData.password,
              };
              joinMeeting(result.data.signature, newMeetConfig);
            }
          })
        );
      }
    }
  }, []);

  return (
    <Wrapper>
      <div className="row no-gutters chat-block"></div>
    </Wrapper>
  );
};

export default ZoomPanel;
