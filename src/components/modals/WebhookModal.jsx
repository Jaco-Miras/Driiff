import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { useToaster, useWorkspace } from "../hooks";
import { ModalHeaderSection } from "./index";

const ModalWrapper = styled(Modal)`
  .explainer-text {
    font-size: 0.8rem;
    display: block;
  }
  .link {
    transition: 0.3s ease;
    &:hover {
      cursor: pointer;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 500;
    }
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
const WebhookModal = (props) => {
  const { dictionary, type, size = "m" } = props.data;

  const dispatch = useDispatch();
  const [modal, setModal] = useState(true);

  const toast = useToaster();

  const { workspace } = useWorkspace();
  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleTeamCopy = () => {
    navigator.clipboard.writeText(workspace.topic_detail.team_channel_bot.url_webhook).then(() => {
      toast.info(dictionary.chatWebhooksClipboardCopy);
      toggle();
    });
  };
  const handleGuestCopy = () => {
    navigator.clipboard.writeText(workspace.topic_detail.channel_bot.url_webhook).then(() => {
      toast.info(dictionary.chatWebhooksClipboardCopy);
      toggle();
    });
  };

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={size} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.chatWebhooksTitle}</ModalHeaderSection>
      <div className="p-3 rounded-bottom">
        <span className="explainer-text text-center text-muted">{dictionary.webhookExplainerText1}</span>
        <span className="explainer-text text-center text-muted">{dictionary.webhookExplainerText2}</span>
        <hr />
        <ul className="list-group list-group-flush">
          <li className="list-group-item px-1 d-flex justify-content-between align-items-center">
            <span>
              <span className="d-inline-block ml-3">{dictionary.chatWebhooksTeams}</span>
            </span>
            {
              <span className="link" role="button" onClick={handleTeamCopy}>
                {dictionary.chatWebhooksCopy}
              </span>
            }
          </li>
          {workspace.is_shared && (
            <li className="list-group-item px-1 d-flex justify-content-between align-items-center">
              <span>
                <span className="d-inline-block ml-3"> {dictionary.chatWebhooksGuest}</span>
              </span>
              <span className="link" role="button" onClick={handleGuestCopy}>
                {dictionary.chatWebhooksCopy}
              </span>
            </li>
          )}
        </ul>
      </div>
    </ModalWrapper>
  );
};

export default React.memo(WebhookModal);
