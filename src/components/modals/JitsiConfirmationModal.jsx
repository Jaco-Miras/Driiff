import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { clearModal, addToModals, postToDo } from "../../redux/actions/globalActions";
import { ModalHeaderSection } from "./index";
import { useTranslationActions, useToaster } from "../hooks";
import { createJitsiMeet } from "../../redux/actions/chatActions";
import { browserName, deviceType } from "react-device-detect";
import { getDriffName } from "../hooks/useDriff";

const ModalWrapper = styled(Modal)`
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
  button.btn.btn-secondary {
    background-color: ${(props) => props.theme.colors.third}!important;
    background: ${(props) => props.theme.colors.third}!important;
    color: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary} !important;
  }
  button.btn.btn-secondary:not(:disabled):not(.disabled):focus {
    box-shadow: none !important;
  }
`;

const JitsiConfirmationModal = (props) => {
  const { type, size = "m", params = {} } = props.data;

  const dispatch = useDispatch();
  const toaster = useToaster();
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const user = useSelector((state) => state.session.user);

  const [startingMeet, setStartingMeet] = useState(false);

  const { _t } = useTranslationActions();

  const dictionary = {
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    yes: _t("YES", "Yes"),
    no: _t("NO", "No"),
    meetingConfirmation: _t("CONFIRMATION.DRIFF_TALKS_MEETING_BODY", "This channel contains ::number:: members and ::online:: are online. Do you want to start this video meeting?", {
      number: selectedChannel ? selectedChannel.members.length : "",
      online: selectedChannel ? selectedChannel.members.filter((m) => user.id !== m.id && onlineUsers.some((o) => o.user_id === m.id)).length + 1 : 1,
    }),
    meetingConfirmationHundred: _t(
      "CONFIRMATION.DRIFF_TALKS_MEETING_BODY_HUNDRED",
      "This channel contains ::number:: members and ::online:: are online. Driff Talks has a 100 participants limitation. Do you want to start this video meeting?",
      {
        number: selectedChannel ? selectedChannel.members.length : "",
        online: selectedChannel ? selectedChannel.members.filter((m) => user.id !== m.id && onlineUsers.some((o) => o.user_id === m.id)).length + 1 : 1,
      }
    ),
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    startingMeeting: _t("CONFIRMATION.ZOOM_STARTING_MEETING", "Starting meeting, please hold"),
    jitsiMeet: _t("CONFIRMATION.JITSI_MEET", "Driff talk"),
    jitsiMeetConfirmation: _t("CONFIRMATION.JITSI_MEET_BODY", "Are you sure you want to start a meeting in this channel?"),
    toasterCreateTodo: _t("TOASTER.VIDEO_MEETING_CREATE_SUCCESS", "You will be reminded about this meeting under <b>Meetings</b>."),
  };

  const [modal, setModal] = useState(true);
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

  const handleConfirm = () => {
    let stripTitle = selectedChannel.title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_");
    let parseChannel = selectedChannel.type === "DIRECT" ? "Meeting_Room" : stripTitle;
    setStartingMeet(true);
    let slug = selectedChannel.slug ? selectedChannel.slug : getSlug();
    let payload = {
      channel_id: selectedChannel.id,
      host: true,
      room_name: getSlug() + "~" + parseChannel + "~" + selectedChannel.id,
    };

    if (deviceType === "mobile" && browserName === "WebKit") {
      dispatch(
        createJitsiMeet(payload, (err, res) => {
          if (err) {
            toggle();
            return;
          }
          window.webkit.messageHandlers.startDriffTalk.postMessage({ slug: slug, status: "OK", token: res.data._token, room: res.data.room_name });
          toggle();
        })
      );
    } else {
      if (selectedChannel.slug && sharedWs[slug]) {
        const sharedPayload = { slug: slug, token: sharedWs[slug].access_token, is_shared: true };
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
      dispatch(createJitsiMeet(payload, () => toggle()));
    }
  };

  const handleScheduleCall = () => {
    const create = (payload, callback) => {
      dispatch(postToDo(payload, callback));
    };
    const createFromModal = (callback = () => {}) => {
      const onConfirm = (payload, modalCallback = () => {}) => {
        create(payload, (err, res) => {
          if (err) {
            toaster.error(dictionary.toasterGeneraError);
          }
          if (res) {
            toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterCreateTodo }} />);
          }
          // if (params.workspaceId) {
          //   fetchWsCount({ topic_id: params.workspaceId });
          // } else {
          //   fetchDetail();
          // }
          modalCallback(err, res);
          callback(err, res);
        });
      };

      let payload = {
        type: "video_reminder",
        actions: {
          onSubmit: onConfirm,
        },
        videoMeeting: true,
        channel: selectedChannel,
        params: params,
      };

      dispatch(addToModals(payload));
    };
    createFromModal();
    toggle();
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={size} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.jitsiMeet}</ModalHeaderSection>
      <ModalBody>
        <span dangerouslySetInnerHTML={{ __html: startingMeet ? dictionary.startingMeeting : selectedChannel && selectedChannel.members.length >= 100 ? dictionary.meetingConfirmationHundred : dictionary.meetingConfirmation }} />
      </ModalBody>
      <ModalFooter>
        <Button className="btn btn-outline-secondary" outline color="secondary" onClick={toggle} disabled={startingMeet}>
          {dictionary.no}
        </Button>
        {(selectedChannel.type === "DIRECT" || selectedChannel.type === "TOPIC" || selectedChannel.type === "GROUP" || selectedChannel.type === "COMPANY") && (
          <Button className="btn btn-secondary" onClick={handleScheduleCall}>
            Schedule a call
          </Button>
        )}
        <Button className="btn btn-primary" color="primary" onClick={handleConfirm} disabled={startingMeet}>
          Start now
        </Button>{" "}
      </ModalFooter>
    </ModalWrapper>
  );
};

export default React.memo(JitsiConfirmationModal);
