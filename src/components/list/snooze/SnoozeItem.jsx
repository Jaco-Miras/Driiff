import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import NotificationBadge from "../../list/notification/item/NotificationBadge";
import { stripHtml } from "../../../helpers/stringFormatter";
import { toast } from "react-toastify";

// const Icon = styled(SvgIconFeather)`
//   width: 12px;
//   height: 12px;
// `;

// const IconSnooze = styled(SvgIconFeather)`
//   width: 16px;
//   height: 16px;
// `;

const OpenIcon = styled(SvgIconFeather)`
  min-width: 1rem;
  min-height: 1rem;
  width: 1rem;
  height: 1rem;
  margin-left: 5px;
  :hover {
    color: #505050;
  }
`;

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
  .chat-header-icon {
    padding: 0px !important;
  }
  .badge-grey-ghost {
    background-color: white !important ;
    color: grey !important;
    border: 1px solid grey !important;
  }
`;

const SnoozeHeader = styled.div`
  display: inline-block;
  width: 180px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  line-height: 1 !important;
  .feather-x, .snooze-me {
    :hover {
      color: #505050;
    }
  }
`;

const SnoozeBody = styled.p`
  display: inline-block;
  width: 180px;
  overflow: hidden !important;
  text-overflow: ellipsis;
  line-height: 1 !important;
  font-size: 14px;
  white-space: nowrap;
`;

const SnoozeContainer = styled.div`
display: inline-block;
vertical-align: middle;
line-height: 1.1;
.badge {
  margin-top: 3px;
}
.post-mention-body {
  width: 200px;
  padding-top: 5px;
  p {
    width: auto;
  }
}
.badge-light {
  color: #fff;
  border: 1px solid grey;
}
`;

const SnoozeContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  .snooze-x {
    position: absolute;
    right: 5px;
    top: 5px;
  }
  // ::before {
  //   content: '';
  //   display: inline-block;
  //   height: 100%; 
  //   vertical-align: middle;
  //   margin-right: -0.25em; /* Adjusts for spacing */
  // }
`;
const RobotAvatar = styled.div`

span {
  line-height: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin: auto;
  font-size: 22px;
  text-align: center;
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;}
`;
const SnoozeItem = (props) => {
  const { type, item, user, dictionary, users, handleRedirect, darkMode, snoozeData, actions } = props;
  // const { _t } = useTranslationActions();


  const handleSkip = (type, n, e) => {
    e.stopPropagation();
    const huddleAnswered = localStorage.getItem("huddle");
    const currentDate = new Date();
    if (huddleAnswered) {
      const { channels } = JSON.parse(huddleAnswered);
      localStorage.setItem("huddle", JSON.stringify({ channels: [...channels, n.channel.id], day: currentDate.getDay() }));
    } else {
      localStorage.setItem("huddle", JSON.stringify({ channels: [n.channel.id], day: currentDate.getDay() }));
    }
    // For v2 huddle
    // actions.skipHuddle({
    //   channel_id: n.channel.id,
    //   huddle_id: n.id,
    //   body: `HUDDLE_SKIP::${JSON.stringify({
    //     huddle_id: n.id,
    //     author: {
    //       name: user.name,
    //       first_name: user.first_name,
    //       id: user.id,
    //       profile_image_link: user.profile_image_link,
    //     },
    //     user_bot: n.user_bot,
    //   })}`,
    // });
    toast.dismiss(type + "__" + n.id);
    toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.huddleSkip }} />, { containerId: "toastA", toastId: "btnSnoozeMe" });
  };

  const handleSnooze = (e) => {
    e.stopPropagation();
    actions.snooze(snoozeData);
    toast.success(<span dangerouslySetInnerHTML={{ __html: dictionary.snoozeMe }} />, { containerId: "toastA", toastId: "btnSnoozeMe" });
    toast.dismiss(type + "__" + item.id);
  }

  const handleDeleteNotification = (e) => {
    e.stopPropagation();
    if (type === "notification") {
      actions.remove({id: item.id})
    } else if (type === "todo") {
      actions.removeReminderNotif({id: item.id})
      const huddleNotif = localStorage.getItem("reminderNotif");
      const currentDate = new Date();
      if (huddleNotif) {
        const { reminders } = JSON.parse(huddleNotif);
        localStorage.setItem("reminderNotif", JSON.stringify({ reminders: [...reminders, item.id], day: currentDate.getDay() }));
      } else {
        localStorage.setItem("reminderNotif", JSON.stringify({ reminders: [item.id], day: currentDate.getDay() }));
      }
    } else if (type === "huddle") {
      actions.removeHuddleNotif({id: item.id});
      const huddleNotif = localStorage.getItem("huddleNotif");
      const currentDate = new Date();
      if (huddleNotif) {
        const { channels } = JSON.parse(huddleNotif);
        localStorage.setItem("huddleNotif", JSON.stringify({ channels: [...channels, item.channel.id], day: currentDate.getDay() }));
      } else {
        localStorage.setItem("huddleNotif", JSON.stringify({ channels: [item.channel.id], day: currentDate.getDay() }));
      }
    }
    toast.dismiss(type + "__" + item.id);
  }
  const renderContent = (type, n) => {
    let header = "",
      body = "";
    if (type === "notification") {
      var firstName = users[n.author.id] ? users[n.author.id].first_name : "";
      if (n.type === "POST_MENTION") {
        header = `${firstName} ${dictionary.notificationMention} ${n.data.title}`;
        //n.data.workspaces && n.data.workspaces.length > 0 && n.data.workspaces[0].workspace_name && (header += <Icon icon="folder" />);
        body = <span className="d-flex align-items-center post-mention-body"><SnoozeBody className={"snooze-body"}>{n.data.comment_body && stripHtml(n.data.comment_body)}</SnoozeBody><OpenIcon icon="external-link" onClick={(e) => {handleRedirect(type, item, e)}}/></span>;
      } else if (n.type === "POST_CREATE") {
        header = `${firstName} ${dictionary.notificationNewPost}`;
        //n.data.workspaces && n.data.workspaces.length > 0 && n.data.workspaces[0].workspace_name && (header += <Icon icon="folder" />);
        body = <span className="d-flex align-items-center"><NotificationBadge notification={n} dictionary={dictionary} user={user} fromSnooze={true} /><OpenIcon icon="external-link" onClick={(e) => {handleRedirect(type, item, e)}}/></span>;
      } else if (n.type === "POST_REQST_APPROVAL") {
        header = `${firstName} ${dictionary.sentProposal}`;
        body = <><NotificationBadge notification={n} dictionary={dictionary} user={user} fromSnooze={true} /><OpenIcon icon="external-link" onClick={(e) => {handleRedirect(type, item, e)}}/></>;
      } else if (n.type === "POST_REJECT_APPROVAL") {
        header = `${firstName} ${dictionary.hasRequestedChange}`;
        body = <><NotificationBadge notification={n} dictionary={dictionary} user={user} fromSnooze={true} /><OpenIcon icon="external-link" onClick={(e) => {handleRedirect(type, item, e)}}/></>;
      }
      else if (n.type === "PST_CMT_REJCT_APPRVL") {
        header = `${firstName} ${dictionary.changeRequested}`;
        body = <><NotificationBadge notification={n} dictionary={dictionary} user={user} fromSnooze={true} /><OpenIcon icon="external-link" onClick={(e) => {handleRedirect(type, item, e)}}/></>;
      }
      else if (n.type === "POST_COMMENT") {
        header = `${firstName} ${dictionary.actionNeeded}`;
        body = <><NotificationBadge notification={n} dictionary={dictionary} user={user} fromSnooze={true} /><OpenIcon icon="external-link" onClick={(e) => {handleRedirect(type, item, e)}}/></>;
      }
    } else if (type === "todo") {
      header = dictionary.todoReminder;
      body = <span className="d-flex align-items-center post-mention-body"><SnoozeBody className={"snooze-body"}>{stripHtml(n.title)}</SnoozeBody><OpenIcon icon="external-link" onClick={(e) => {handleRedirect(type, item, e)}}/></span>;
    } else if (type === "huddle") {
      header = `${dictionary.timeTOHuddle} ${user.first_name}`;
      body = (
        <>
        <span
          className={"badge badge-light mr-2"}
          onClick={(e) => {
            handleRedirect(type, item, e)
          }}
        >
          {dictionary.open}
        </span>
        <span
          className={"badge badge-info badge-grey-ghost"}
          onClick={(e) => {
            handleSkip(type, n, e);
          }}
        >
          {dictionary.skip}
        </span>
        </>
      );
    }
    return (
      <>
        <SnoozeHeader>
          {header}
          <span className="snooze-x">
            <span
              className="snooze-me mr-1"
              onClick={handleSnooze}
            >
              {dictionary.snooze}
            </span>
            <SvgIconFeather icon="x" width="18" height="18" strokeWidth="2" onClick={handleDeleteNotification}/>
          </span>
        </SnoozeHeader> {body}
      </>
    );
  };

  return (
    <NotifWrapper className="timeline-item timeline-item-no-line d-flex" 
      darkMode={darkMode} 
      //onClick={(e) => handleRedirect(type, item, e)}
    >
      <div className="d-flex">
        {type === "notification" ? (
          item.author ? (
            <Avatar id={item.author.id} name={item.author.name} showSlider={false} imageLink={item.author.profile_image_thumbnail_link ? item.author.profile_image_thumbnail_link : item.author.profile_image_link} />
          ) : (
            <Avatar id={user.id} name={user.name} imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link} showSlider={false} />
          )
        ) : type === "todo" ? (
          <RobotAvatar className="robotAvatar">
            <div><span>🤖</span></div>
          </RobotAvatar>
        ) : (
          <Avatar id={item.channel.id} name={item.channel.name} showSlider={false} imageLink={null} showSlider={false} noDefaultClick={true}/>
          // <ChannelIcon className="chat-header-icon" channel={channels[item.channel.id]} />
        )}
      </div>
      <SnoozeContainerWrapper >
        <SnoozeContainer>{renderContent(type, item)}</SnoozeContainer>
      </SnoozeContainerWrapper>
    </NotifWrapper>
  );
};

export default SnoozeItem;
