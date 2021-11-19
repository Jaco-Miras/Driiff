import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import useChannelActions from "../../hooks/useChannelActions";
import { ChatContactIListItem } from "./item";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
  .channel-number-new-group-wrapper {
    padding-right: 24px;
  }
`;

const Contacts = styled.ul`
  padding-right: 24px;
  li {
    cursor: pointer;
  }
`;

const ChatContactsList = (props) => {
  const { className = "", channels, userChannels, search } = props;

  const history = useHistory();

  const channelAction = useChannelActions();

  const user = useSelector((state) => state.session.user);
  //const { virtualization } = useSelector((state) => state.settings.user.CHAT_SETTINGS);

  const handleChannelClick = (channel) => {
    channelAction.select(channel, (channel) => {
      document.body.classList.add("m-chat-channel-closed");
      history.push(`/chat/${channel.code}`);
      const snoozeContainer = document.getElementById("toastS");
      if (snoozeContainer && isMobile) snoozeContainer.classList.add("d-none");
    });
  };

  let recipients = [];
  const sortedChannels = Object.values(channels)
    .sort((a, b) => {
      return a.created_at > b.created_at;
    })
    .filter((channel) => {
      if (["TOPIC", "POST", "GROUP", "COMPANY", "PERSONAL_BOT"].includes(channel.type)) {
        return false;
      }

      if (channel.members.length === 1 && channel.add_user !== true) {
        return false;
      }

      /**
       * c.members for add_user IS NOT THE USER ID
       */
      const recipient = channel.members.find((m) => m.id !== user.id);
      if (typeof recipient !== "undefined") {
        if (recipients.includes(recipient.id)) {
          return false;
        } else {
          recipients.push(recipient.id);
        }
      } else {
        return false;
      }

      if (!Object.values(userChannels).includes(channel.id)) {
        return false;
      }

      if (search !== "") {
        if (channel.title.toLowerCase().indexOf(search.toLowerCase()) !== -1) return true;

        return channel.members
          .filter((m) => m.id !== user.id)
          .some((m) => {
            if (m.email.toLowerCase().search(search.toLowerCase()) !== -1) return true;

            if (m.name.toLowerCase().search(search.toLowerCase()) !== -1) return true;

            return false;
          });
      }

      return true;
    })
    .sort((a, b) => {
      return a.title.localeCompare(b.title);
    });

  return (
    <Wrapper className={`chat-lists ${className}`}>
      <div className="d-flex align-items-center channel-number-new-group-wrapper"></div>
      <Contacts className={"list-group list-group-flush"}>
        {sortedChannels.map((channel) => {
          return <ChatContactIListItem key={channel.id} onChannelClick={handleChannelClick} channel={channel} />;
        })}
      </Contacts>
    </Wrapper>
  );
};

export default React.memo(ChatContactsList);
