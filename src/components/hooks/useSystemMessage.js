import React from "react";
import { SvgIconFeather } from "../common";
import { renderToString } from "react-dom/server";
import { useParams } from "react-router-dom";
import quillHelper from "../../helpers/quillHelper";

const useSystemMessage = ({ dictionary, reply, recipients, selectedChannel, user }) => {

  const params = useParams();
  let parseBody = "";
  if (reply.body.includes("POST_CREATE::")) {
    let item = JSON.parse(reply.body.replace("POST_CREATE::", ""));
    let link = "";
    if (params && params.workspaceId) {
      if (params.folderId) {
        link = `/workspace/posts/${params.folderId}/${params.folderName}/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${item.post.title}`;
      } else {
        link = `/workspace/posts/${params.workspaceId}/${params.workspaceName}/post/${item.post.id}/${item.post.title}`
      }
    } else {
      link = `/posts/${item.post.id}/${item.post.title}`;
    }

    let description = quillHelper.parseToText(item.post.description);
    parseBody = renderToString(<a href={link} className="push-link" data-href={link} data-has-link="0" data-ctrl="0">
      <b>{item.author.first_name}</b> {dictionary.createdThePost} <b>"{item.post.title}"</b>
      {
        item.post.description.includes("<img src") ? <span className="card card-body">
            <SvgIconFeather icon="image"/>
            </span> :
          description.trim() !== "" &&
          <span className="card card-body"
                dangerouslySetInnerHTML={{ __html: description }}/>
      }
      <span className="open-post">{dictionary.openPost} <SvgIconFeather icon="arrow-right"/></span>
    </a>);
  } else if (reply.body.includes("JOIN_CHANNEL")) {
    let ids = /\d+/g;
    let extractedIds = reply.body.match(ids);
    let newMembers = recipients
      .filter((r) => {
        let userFound = false;
        extractedIds.forEach((id) => {
          if (parseInt(id) === r.type_id) {
            userFound = true;
          }
        });
        return userFound;
      })
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
  } else if (reply.body.includes("CHANNEL_UPDATE::")) {
    const data = JSON.parse(reply.body.replace("CHANNEL_UPDATE::", ""));
    let author = recipients.find((r) => data.author && r.type_id === data.author.id && r.type === "USER");
    if (author) {
      if (data.author && data.author.id === user.id) {
        author.name = <b>{dictionary.you}</b>;
      }
    } else {
      author = {
        name: dictionary.someone
      };
    }

    let newBody = "";
    if (data.title !== "") {
      newBody = (
        <>
          <SvgIconFeather width={16} icon="edit-3"/> {author.name} {selectedChannel.type === "TOPIC" ? dictionary.renameThisWorkspace : dictionary.renameThisChat} <b>#{data.title}</b>
          <br/>
        </>
      );
    }

    if (data.added_members.length === 1 && data.removed_members.length === 0 && data.title === "") {
      //for adding one member without changes in title and for user who join the channel / workspace
      const am = recipients.find((r) => { return data.added_members.includes(r.type_id) && r.type === "USER" })
      if (am && author.id === am.id) {
        newBody = <>{user.id === author.id ? <b>{dictionary.you}</b> : <b>{author.name}</b>} {dictionary.joined} <b>#{selectedChannel.title}</b></>;
      } else if (am) {
        newBody = <><b>{author.name}</b> {dictionary.added} <b>{am.name}</b></>;
      }
    } else if (data.added_members.length >= 1) {
      let am = recipients.filter((r) => { return data.added_members.includes(r.type_id) && r.type === "USER" });
      if (newBody === "") {
        newBody = <><b>{author.name}</b> {dictionary.added} </>;
      } else {
        newBody = <>{newBody} {dictionary.andAdded}</>;
      }

      if (data.added_members.includes(user.id)) {
        am = am.filter(m => m.type_id !== user.id)
        if (am.length !== 0) {
          newBody = (
            <>
              {newBody} <b>{dictionary.youAnd} </b>
            </>
          );
        } else {
          newBody = (
            <>
              {newBody} <b>{dictionary.you}</b>
            </>
          );
        }
      }

      if (am.length !== 0) {
        newBody = (
          <>
            {newBody} <b>{am.map(m => m.name).join(", ")}</b>
            <br/>
          </>
        );
      }
    }

    if (data.removed_members.length === 1) {
      if (data.author && data.author.id === data.removed_members[0]) {
        if (newBody === "") {
          if (data.author.id === user.id && data.removed_members[0] === user.id) {
            newBody = (
              <>
                <b>{dictionary.you}</b>{" "}{selectedChannel.type === "TOPIC" ? dictionary.leftTheWorkspace : dictionary.leftTheChat}{" "}
              </>
            );
          } else {
            newBody = (
              <>
                <b>{data.author.name}</b> {selectedChannel.type === "TOPIC" ? dictionary.hasLeftWorkspace : dictionary.hasLeftChat}{" "}
              </>
            );
          }
        } else {
          newBody = <>{newBody} {selectedChannel.type === "TOPIC" ? dictionary.andHasLeftWorkspace : dictionary.andHasLeftChat}</>;
        }
      } else {
        const userLeft = recipients.filter((r) => { return data.removed_members[0] === r.type_id && r.type === "USER"});
        if (newBody === "") {
          newBody = (
            <>
              {author.name} {dictionary.removed} <b>{userLeft.length ? userLeft[0].name : null}</b>
            </>
          );
        } else {
          newBody = <>{newBody} {dictionary.andRemoved} <b>{userLeft.length ? userLeft[0].name : null}</b></>;
        }
      }
    } else if (data.removed_members.length > 1) {
      const rm = recipients.filter((r) => data.removed_members.includes(r.type_id) && r.type_id !== user.id).map((r) => r.name);

      if (data.removed_members.includes(user.id) && data.author && data.author.id === user.id) {
        if (newBody === "") {
          newBody = (
            <>
              <b>{author.name}</b> {dictionary.left}{" "}
            </>
          );
        } else {
          newBody = <>{newBody} {dictionary.andLeft}</>;
        }

        if (rm.length !== 0) {
          newBody = (
            <>
              {newBody} {dictionary.andRemoved} <b>{rm.join(", ")}</b>
              <br/>
            </>
          );
        }
      } else {
        if (newBody === "") {
          newBody = <>{author.name} {dictionary.removed} </>;
        } else {
          newBody = <>{newBody} {dictionary.andRemoved}</>;
        }

        if (data.removed_members.includes(user.id)) {
          if (rm.length !== 0) {
            newBody = (
              <>
                {newBody} <b>{dictionary.youAnd} </b>
              </>
            );
          } else {
            newBody = (
              <>
                {newBody} <b>{dictionary.you}</b>
              </>
            );
          }
        }

        if (rm.length !== 0) {
          newBody = (
            <>
              {newBody} <b>{rm.join(", ")}</b>
              <br/>
            </>
          );
        }
      }
    }
    parseBody =  renderToString(newBody);
  }

  return {
    parseBody
  }
};
  
  export default useSystemMessage;
