import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import NotificationBadge from "../../list/notification/item/NotificationBadge";
import ChannelIcon from "../../list/chat/ChannelIcon";
import { stripHtml } from "../../../helpers/stringFormatter";
import { toast } from "react-toastify";
import { useTranslationActions, useSettings } from "../../hooks";

const Icon = styled(SvgIconFeather)`width: 12px;height:12px;`;

const IconSnooze = styled(SvgIconFeather)`
width: 16px;  height:16px;`;

const NotifWrapper = styled.div`
  cursor: pointer;
  display: flex;
  font-family: Inter;
  letter-spacing: 0;
  font-size: 12px;
  color: ${(props) => (props.darkMode === "1" ? "#afb8bd" : "#aaa")};
  .avatar {
    margin-right: 1rem;
    height: 2.7rem;
    width: 2.7rem;
  }
  p {
    margin: 0;
  }
  .chat-header-icon {padding:0px !important;}
  .badge-grey-ghost { background-color: white !important ; color: grey !important; border: 1px solid grey !important;}
`;

const SnoozeHeader = styled.div`display: inline-block;
width: 180px;
white-space: nowrap;
overflow: hidden !important;
text-overflow: ellipsis;
line-height: 1 !important;`;

const SnoozeBody = styled.p`display: inline-block;
width: 180px;
overflow: hidden !important;
text-overflow: ellipsis;
line-height: 1 !important;
font-size: 14px;
white-space: nowrap;`;

const SnoozeContainer= styled.div`display: inline-block;margin-top:3px`;

const SnoozeItem = (props) => {
  const { className = "", type, item, user, actions, users, channels, handleRedirect, darkMode } = props;

  console.log({ darkMode });

  const { _t } = useTranslationActions();

  const dictionary = {
    notificationMention: _t("SNOOZE.MENTION", "mentioned you in ::title::", { title: "" }), todoReminder: _t("SNOOZE.REMINDER", `A friendly automated reminder`),
    sentProposal: _t("SNOOZE.SENT_PROPOSAL", "sent a proposal."), notificationNewPost: _t("SNOOZE.NEW_POST", `shared a post`),
    mustRead: _t("SNOOZE.MUST_READ", "Must read"), needsReply: _t("SNOOZE.NEEDS_REPLY", "Needs reply"),
    timeTOHuddle: _t("SNOOZE.TIME_TO_HUDDLE", "Time to huddle, "), hasRequestedChange: _t("SNOOZE.HAS_REQUESTED_CHANGE", "has requested a change."),
    snoozeAll: _t("SNOOZE.SNOOZE_ALL", "Snoozed for 60 mins"), snoozeMe: _t("SNOOZE.SNOOZE_ME", "Snoozed for 60 mins"),
    actionNeeded: _t("SNOOZE.ACTION_NEEDED", "Action needed"), changeRequested: _t("SNOOZE.CHANGE_REQUESTED", "Change requested"),
    huddleSkip: _t("SNOOZE.HUDDLE_SKIP", "Huddle is Skipped"), snoozeMe: _t("SNOOZE.HUDDLE_SKIP", "Snoozed for 60 mins"),
  };

  const handleSkip = (type, n, e) => {
    e.stopPropagation();
    actions.skipHuddle({
      channel_id: n.channel.id,
      huddle_id: n.id,
      body: `HUDDLE_SKIP::${JSON.stringify({
        huddle_id: n.id,
        author: {
          name: user.name, first_name: user.first_name, id: user.id, profile_image_link: user.profile_image_link,
        },
        user_bot: n.user_bot,
      })}`,
    });
    toast.dismiss(type + '__' + n.id);
    toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.huddleSkip }} />, { containerId: "toastA", toastId: 'btnSnoozeMe' });
  };


  const renderContent = (type, n) => {

    let header = '', body = '';
    if (type === 'notification') {
      var firstName = (users.users[n.author.id]) ? users.users[n.author.id].first_name : null;
      if (n.type === "POST_MENTION") {
        header = `${firstName}" "${dictionary.notificationMention}" "${n.data.title}" "`;
        n.data.workspaces && n.data.workspaces.length > 0 && n.data.workspaces[0].workspace_name && (
          header += <><Icon icon="folder" /> {" "}{n.data.workspaces[0].workspace_name}</>
        );
        body = <SnoozeBody className={'snooze-body'} >{stripHtml(n.data.title)}</SnoozeBody>;
      } else if (n.type === "POST_CREATE") {
        header = `${firstName}" "${dictionary.notificationNewPost}" "`;
        n.data.workspaces && n.data.workspaces.length > 0 && n.data.workspaces[0].workspace_name && (
          header += <><Icon icon="folder" /> {" "}{n.data.workspaces[0].workspace_name}</>
        );
        body = <NotificationBadge notification={n} dictionary={dictionary} user={user} fromSnooze={true} />
      }
      else if (n.type === "POST_REQST_APPROVAL") {
        header = `${firstName}" "${dictionary.sentProposal}`;
        body = <SnoozeBody className={'snooze-body'} >{stripHtml(n.data.title)}</SnoozeBody>;
      }
      else if (n.type === "POST_REJECT_APPROVAL") {
        header = `${firstName}" "${dictionary.hasRequestedChange}`;
        body = <NotificationBadge notification={n} dictionary={dictionary} user={user} fromSnooze={true} />
      }
    } else if (type === 'todo') {
      header = dictionary.todoReminder;
      body = <SnoozeBody className={'snooze-body'} >{stripHtml(n.title)}</SnoozeBody>;
    } else if (type === 'huddle') {
      header = `${dictionary.timeTOHuddle}" "${user.first_name}`;
      body = <span className={"badge badge-info badge-grey-ghost"} onClick={(e) => { handleSkip(type, n, e); }}>Skip</span>;
    }
    return (<> <SnoozeHeader>{header}</SnoozeHeader> {body}</>);
  };

  return (
    <NotifWrapper className="timeline-item timeline-item-no-line d-flex" darkMode={darkMode} onClick={(e) => handleRedirect(type, item, e)}>
      <div>
        {type === 'notification' ? item.author ? (
          <Avatar id={item.author.id} name={item.author.name} showSlider={false} imageLink={item.author.profile_image_thumbnail_link ? item.author.profile_image_thumbnail_link : item.author.profile_image_link}
          />
        ) : (<Avatar id={user.id} name={user.name} imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link} showSlider={false} />) : type === 'todo' ? (<div className="robotAvatar" ><div>🤖</div></div>) : (
          <ChannelIcon className="chat-header-icon" channel={channels[item.channel.id]} />
        )}
      </div>
      <SnoozeContainer>{renderContent(type, item)}</SnoozeContainer>
    </NotifWrapper>
  );
};

export default SnoozeItem;
