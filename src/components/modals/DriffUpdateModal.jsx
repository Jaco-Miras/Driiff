import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
// import { ModalHeaderSection } from "./index";
import styled from "styled-components";
import { useTranslationActions, useUserActions } from "../hooks";
// import { getDriffName } from "../hooks/useDriff";
import { SvgIconFeather } from "../common";

// const Wrapper = styled(Modal)`
//   position: fixed;
//   right: 20px;
//   display: block;
//   top: 1px;

//   .modal-content {
//     border: 1px solid #ffffff14 !important;
//   }
// `;

const NotificationBar = styled.div`
  padding: 10px;
  width: 100%;
  background: #000;
  color: #fff;
  height: 40px;
  display: flex;
  place-content: center;
  .feather {
    cursor: pointer;
  }
  position: fixed;
  top: 0;
  z-index: 1000;

  .button-notification {
    background: #8c48ae;
    border: none;
    padding: 0 1rem;
    margin: 0 6px;
  }
`;

// const AudioStyle = styled.audio`
//   display: none;
//   opacity: 0;
//   visibility: hidden;
// `;

const DriffUpdateModal = (props) => {
  const { type, requirement, handleReminder } = props.data;

  const { logout, processBackendLogout } = useUserActions();
  const dispatch = useDispatch();
  const { _t } = useTranslationActions();

  // const refs = {
  //   audio: useRef(null),
  // };

  const dictionary = {
    update: _t("DRIFF.DRIFF_VERSION_UPDATE", "Go!"),
    remindMeAboutThis: _t("DRIFF.REMIND_ME_ABOUT_THIS", "Not right now"),
    updateReload: _t("DRIFF.UPDATE_BODY_RELOAD", "🎉  Driff is updated. Reload now?"),
    updateLogout: _t("DRIFF.UPDATE_BODY_LOGOUT", "🎉 Driff is updated. Logout now?"),
  };

  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleConfirm = () => {
    toggle();
    switch (requirement) {
      case "logout":
        logout(processBackendLogout()());
        break;
      default:
        window.location.reload();
        break;
    }
  };

  const handleRemind = () => {
    toggle();
    handleReminder();
  };

  const getContent = () => {
    switch (requirement) {
      case "logout":
        return dictionary.updateLogout;
      default:
        return dictionary.updateReload;
    }
  };

  // const handleSoundPlay = () => {
  //   if (refs.audio.current) {
  //     const promiseAudioPlay = refs.audio.current.play();

  //     if (promiseAudioPlay !== undefined) {
  //       promiseAudioPlay
  //         .then(() => {
  //           // Start whatever you need to do only after playback
  //           // has begun.
  //         })
  //         .catch((error) => {
  //           /**
  //            * @todo need a fallback in case autoplay is not allowed
  //            **/
  //           if (error.name === "NotAllowedError") {
  //           } else {
  //           }
  //         });
  //     }
  //   }
  // };

  useEffect(() => {
    //handleSoundPlay();
    const id = setInterval(() => {
      const el = document.querySelector(".modal-backdrop");
      if (el && el.classList.contains("show")) {
        el.classList.remove("show");
        clearInterval(id);
      }
    }, 100);
  }, []);

  return (
    <NotificationBar isOpen={modal} toggle={toggle} size={"m"} centered>
      {/* <AudioStyle ref={refs.audio} controls>
        <source src={require(`../../assets/audio/hohoho.ogg`)} type="audio/ogg"/>
        <source src={require(`../../assets/audio/hohoho.mp3`)} type="audio/mpeg"/>
        <source src={require(`../../assets/audio/hohoho.m4r`)} type="audio/m4r"/>
        Your browser does not support the audio element.
      </AudioStyle> */}
      <div dangerouslySetInnerHTML={{ __html: getContent() }} />
      <Button className="button-notification" onClick={handleConfirm}>
        {dictionary.update}
      </Button>{" "}
      {/* <Button className="button-notification" onClick={handleRemind}>
          {dictionary.remindMeAboutThis}
        </Button> */}
      <SvgIconFeather className="ml-3 align-self-center" icon="x" onClick={handleRemind} />
    </NotificationBar>
  );
};

export default React.memo(DriffUpdateModal);
