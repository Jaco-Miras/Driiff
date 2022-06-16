import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalBody } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions } from "../hooks";
import { createJitsiMeet, createJitsiMeetMobile } from "../../redux/actions/chatActions";
import { browserName, deviceType } from "react-device-detect";
import { getDriffName } from "../hooks/useDriff";

const ButtonsContainer = styled.div`
  margin-top: 1.5rem;
  button:first-child {
    margin-right: 1rem;
  }
  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
  }
  .btn.btn-outline-secondary {
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

// const AudioStyle = styled.audio`
//   display: none;
//   opacity: 0;
//   visibility: hidden;
// `;

const JitsiInviteModal = (props) => {
  const { type, title, host, hideJoin, channel_id, channelType } = props.data;
  const dispatch = useDispatch();
  //   const isIdle = useSelector((state) => state.global.isIdle);
  //   const isBrowserActive = useSelector((state) => state.global.isBrowserActive);
  const { _t } = useTranslationActions();
  //   const audioRef = useRef(null);
  const dictionary = {
    jitsiInvite: _t("JITSI.INVITE_POP_UP", "::host:: has started a new Meeting for ::title::", { host: host.name, title: title }),
    reject: _t("REJECT", "Reject"),
    join: _t("JOIN", "Join"),
    startingMeeting: _t("CONFIRMATION.ZOOM_STARTING_MEETING", "Starting meeting, please hold"),
  };
  const [modal, setModal] = useState(true);
  const [startingMeet, setStartingMeet] = useState(false);

  const slugName = getDriffName();
  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const getSlug = () => {
    let driff = localStorage.getItem("slug");
    if (driff) {
      return driff;
    } else {
      const host = window.location.host.split(".");
      if (host.length === 3) {
        localStorage.setItem("slug", host[0]);
        return host[0];
      } else {
        return null;
      }
    }
  };
  let stripTitle = title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_");
  let parseChannel = channelType === "DIRECT" ? "Meeting_Room" : stripTitle;
  const payload = {
    channel_id: channel_id,
    host: false,
    room_name: getSlug() + "-" + parseChannel + "-" + channel_id,
  };

  const handleJoin = () => {
    setStartingMeet(true);
    if (deviceType === "mobile" && browserName === "WebKit") {
      dispatch(
        createJitsiMeetMobile(payload, (err, res) => {
          if (err) {
            toggle();
            return;
          }
          window.webkit.messageHandlers.startDriffTalk.postMessage({ slug: slugName, status: "OK", token: res.data._token, room: res.data.room_name });
          toggle();
        })
      );
    } else {
      dispatch(createJitsiMeet(payload, () => toggle()));
    }
  };

  //   const handleSoundPlay = () => {
  //     if (audioRef.current && !isIdle && isBrowserActive && !hideJoin) {
  //       const promiseAudioPlay = audioRef.current.play();
  //       if (promiseAudioPlay !== undefined) {
  //         promiseAudioPlay
  //           .then(() => {
  //             // Start whatever you need to do only after playback
  //             // has begun.
  //           })
  //           .catch((error) => {
  //             /**
  //              * @todo need a fallback in case autoplay is not allowed
  //              **/
  //           });
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     setTimeout(() => {
  //       handleSoundPlay();
  //     }, 800);
  //     return () => {
  //       if (audioRef.current) {
  //         const promiseAudioPause = audioRef.current.pause();

  //         if (promiseAudioPause !== undefined) {
  //           promiseAudioPause
  //             .then(() => {
  //               // Start whatever you need to do only after playback
  //               // has begun.
  //             })
  //             .catch((error) => {
  //               /**
  //                * @todo need a fallback in case autoplay is not allowed
  //                **/
  //             });
  //         }
  //       }
  //     };
  //   }, []);

  return (
    <Modal isOpen={modal} toggle={toggle} centered>
      <ModalBody>
        {/* <AudioStyle ref={audioRef} controls loop>
          <source src={require("../../assets/audio/zoomcall.mp3")} type="audio/mp3" />
          Your browser does not support the audio element.
        </AudioStyle> */}
        <h3>{startingMeet ? dictionary.startingMeeting : dictionary.jitsiInvite}</h3>
        {!startingMeet && (
          <ButtonsContainer>
            <Button className="btn btn-outline-secondary" outline color="secondary" onClick={toggle}>
              {dictionary.reject}
            </Button>
            {!hideJoin && (
              <Button color="primary" onClick={handleJoin}>
                {dictionary.join}
              </Button>
            )}
          </ButtonsContainer>
        )}
      </ModalBody>
    </Modal>
  );
};

export default React.memo(JitsiInviteModal);
