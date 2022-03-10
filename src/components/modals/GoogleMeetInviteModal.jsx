import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody } from "reactstrap";
import { clearModal } from "../../redux/actions/globalActions";
import { useTranslationActions } from "../hooks";

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

const AudioStyle = styled.audio`
  display: none;
  opacity: 0;
  visibility: hidden;
`;

const GoogleMeetInviteModal = (props) => {
  const { type, hideJoin, data } = props.data;
  const dispatch = useDispatch();
  const isIdle = useSelector((state) => state.global.isIdle);
  const isBrowserActive = useSelector((state) => state.global.isBrowserActive);
  const { _t } = useTranslationActions();
  const audioRef = useRef(null);
  const dictionary = {
    //zoomInvite: _t("ZOOM.INVITE_POP_UP", "::host:: has started a new Zoom Meeting for ::title::", { host: host.name, title: title }),
    reject: _t("REJECT", "Reject"),
    join: _t("JOIN", "Join"),
    googleMeet: _t("CONFIRMATION.GOOGLE_MEET_INVITE_POP_UP", "::host:: has started a new Google meeting for ::title::", { host: data.author.name, title: data.google_meet_event?.summary }),
  };
  const [modal, setModal] = useState(true);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleJoin = () => {
    toggle();
  };

  const handleSoundPlay = () => {
    if (audioRef.current && !isIdle && isBrowserActive && !hideJoin) {
      const promiseAudioPlay = audioRef.current.play();
      if (promiseAudioPlay !== undefined) {
        promiseAudioPlay
          .then(() => {
            // Start whatever you need to do only after playback
            // has begun.
          })
          .catch((error) => {
            /**
             * @todo need a fallback in case autoplay is not allowed
             **/
          });
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleSoundPlay();
    }, 800);
    return () => {
      if (audioRef.current) {
        const promiseAudioPause = audioRef.current.pause();

        if (promiseAudioPause !== undefined) {
          promiseAudioPause
            .then(() => {
              // Start whatever you need to do only after playback
              // has begun.
            })
            .catch((error) => {
              /**
               * @todo need a fallback in case autoplay is not allowed
               **/
            });
        }
      }
    };
  }, []);

  return (
    <Modal isOpen={modal} toggle={toggle} centered>
      <ModalBody>
        <AudioStyle ref={audioRef} controls loop>
          <source src={require("../../assets/audio/zoomcall.mp3")} type="audio/mp3" />
          Your browser does not support the audio element.
        </AudioStyle>
        <h3>{dictionary.googleMeet}</h3>
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
      </ModalBody>
    </Modal>
  );
};

export default React.memo(GoogleMeetInviteModal);
