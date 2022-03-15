import React from "react";
import { SvgIconFeather } from "../common";
import { renderToString } from "react-dom/server";
import quillHelper from "../../helpers/quillHelper";
import { useSelector } from "react-redux";
import { useTranslationActions } from "./index";
import useChannelUpdateMessage from "./useChannelUpdateMessage";

const useSystemMessage = ({ dictionary, reply, selectedChannel, user }) => {
  const users = useSelector((state) => state.users.users);
  const inactiveUsers = useSelector((state) => state.users.archivedUsers);
  const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];
  const allUsers = [...Object.values(users), ...inactiveUsers].filter((u) => {
    if (u.email && botCodes.includes(u.email)) {
      return false;
    } else {
      return true;
    }
  });

  const { _t } = useTranslationActions();
  const channelUpdateMessage = useChannelUpdateMessage({ reply, dictionary, allUsers, user, selectedChannel });
  const parseMessage = () => {
    let parseBody = "";
    if (reply.body.includes("POST_CREATE::")) {
      let parsedData = reply.body.replace("POST_CREATE::", "");
      if (parsedData.trim() !== "") {
        let item = JSON.parse(reply.body.replace("POST_CREATE::", ""));
        let description = quillHelper.parseToText(item.post.description);
        parseBody = renderToString(
          <span className="push-link">
            {/* <a href={link} className="push-link" data-href={link} data-has-link="0" data-ctrl="0"> */}
            <b>{item.author.first_name}</b> {dictionary.createdThePost} <b>"{item.post.title}"</b>
            {item.post.description.includes("<img src") ? (
              <span className="card card-body">
                <SvgIconFeather icon="image" />
              </span>
            ) : (
              description.trim() !== "" && <span className="card card-body" dangerouslySetInnerHTML={{ __html: description }} />
            )}
            <span className="open-post">
              {dictionary.openPost} <SvgIconFeather icon="arrow-right" />
            </span>
          </span>
        );
      } else {
        parseBody = "System message...";
      }
    } else if (reply.body.includes("CREATE_WORKSPACE::")) {
      let parsedData = JSON.parse(reply.body.replace("CREATE_WORKSPACE::", ""));
      parseBody = `<span>${_t("SYSTEM_MESSAGE.CREATE_WORKSPACE", "::author:: created ::workspaceName:: workspace", { author: parsedData.author.name, workspaceName: parsedData.workspace.title })}</span>`;
    } else if (reply.body.includes("JOIN_CHANNEL")) {
      let ids = /\d+/g;
      let extractedIds = reply.body.match(ids);
      let newMembers = Object.values(allUsers)
        .filter((u) => extractedIds.some((id) => parseInt(id) === u.id))
        .map((user) => user.name);
      if (selectedChannel.type === "DIRECT") {
        parseBody = `<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      } else {
        parseBody = `<p><span class='channel-new-members'>${newMembers.join(", ")}</span><br> ${dictionary.joined} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      }
    } else if (reply.body.includes("MEMBER_REMOVE_CHANNEL")) {
      if (selectedChannel.type === "DIRECT") {
        parseBody = `<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      } else {
        parseBody = `<p><span class='channel-new-members'>${reply.body.substr(reply.body.indexOf(" "))}</span><br> ${dictionary.left} <span class='channel-title'>#${selectedChannel.title}</span></p>`;
      }
    } else if (reply.body.includes("ACCOUNT_DEACTIVATED")) {
      let newBody = reply.body.replace("ACCOUNT_DEACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        parseBody = `${dictionary.update}: ${newBody}' ${dictionary.accountDeactivated}.`;
      } else {
        parseBody = `${dictionary.update}: ${newBody}'s ${dictionary.accountDeactivated}.`;
      }
    } else if (reply.body.includes("NEW_ACCOUNT_ACTIVATED")) {
      let newBody = reply.body.replace("NEW_ACCOUNT_ACTIVATED ", "");
      if (newBody[newBody.length - 1] === "s") {
        parseBody = `${dictionary.update}: ${newBody}' ${dictionary.accountActivated}.`;
      } else {
        parseBody = `${dictionary.update}: ${newBody}'s ${dictionary.accountActivated}.`;
      }
    } else if (reply.body.startsWith("UPLOAD_BULK::")) {
      const data = JSON.parse(reply.body.replace("UPLOAD_BULK::", ""));
      if (data.files && data.files.length === 1) {
        // eslint-disable-next-line quotes
        parseBody = _t("SYSTEM.USER_UPLOADED_FILE", '<span class="chat-file-notification">::name:: uploaded <b>::filename::</b></span>', { name: data.author.first_name, filename: data.files[0].search });
      } else {
        // eslint-disable-next-line quotes
        parseBody = _t("SYSTEM.USER_UPLOADED_FILES", '<span class="chat-file-notification">::name:: uploaded ::count::  <b>files</b></span>', { name: data.author.first_name, count: data.files.length });
      }
    } else if (reply.body.startsWith("DRIFF_TALK::")) {
      const data = JSON.parse(reply.body.replace("DRIFF_TALK::", ""));
      parseBody = `<div><b>${data.author.name}</b> started a Meeting: <strong>Click here to join</strong></div>`;
    } else if (reply.body.startsWith("ZOOM_MEETING::")) {
      const data = JSON.parse(reply.body.replace("ZOOM_MEETING::", ""));
      parseBody = `<div><b>${data.author.name}</b> started a ZOOM Meeting: <strong>Click here to join</strong></div>`;
    } else if (reply.body.startsWith("LEFT_MEETING::")) {
      const data = JSON.parse(reply.body.replace("LEFT_MEETING::", ""));
      parseBody = `<div><b>${data.participant.name}</b> has left the meeting</div>`;
    } else if (reply.body.startsWith("MEETING_ENDED::")) {
      const data = JSON.parse(reply.body.replace("MEETING_ENDED::", ""));
      parseBody = `<div><b>${data.host.name}</b> has ended the meeting</div>`;
    } else if (reply.body.includes("CHANNEL_UPDATE::")) {
      parseBody = renderToString(channelUpdateMessage);
    }
    return parseBody;
  };

  return {
    parseBody: parseMessage(),
  };
};

export default useSystemMessage;
