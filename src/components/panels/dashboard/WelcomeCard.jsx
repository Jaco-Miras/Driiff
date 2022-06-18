import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { SvgIconFeather, ToolTip } from "../../common";
import { useWorkspace } from "../../hooks";

const Wrapper = styled.div`
  display: block;
  span {
    display: block;
  }
  span:first-child {
    font-weight: bold;
  }
  span:last-child {
    font-weight: 500;
  }
`;

const WelcomeCard = (props) => {
  const { dictionary, isWorkspace } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const handleWebhookClick = (e) => {
    e.preventDefault();
    const payload = {
      type: "chat_webhook",
      dictionary,
    };
    dispatch(addToModals(payload));
  };

  return (
    <Wrapper>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>{dictionary.hiUser}</strong> 👋
        </div>
        {isWorkspace && user.type === "internal" && (
          <ToolTip content={dictionary.webhookTooltip}>
            <a href="#" onClick={handleWebhookClick}>
              <SvgIconFeather icon="command" width={20} height={20} />
            </a>
          </ToolTip>
        )}
      </div>
      <span>{isWorkspace ? dictionary.dailyWsDigest : dictionary.dailyDigest}</span>
    </Wrapper>
  );
};

export default WelcomeCard;
