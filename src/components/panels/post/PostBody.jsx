import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../../common";
import { useFiles, useGoogleApis, useTimeFormat, useWindowSize, useRedirect } from "../../hooks";
import { PostBadge, PostVideos, PostChangeAccept, PostBodyButtons } from "./index";
import quillHelper from "../../../helpers/quillHelper";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setViewFiles } from "../../../redux/actions/fileActions";
import { replaceChar } from "../../../helpers/stringFormatter";
import { renderToString } from "react-dom/server";
import { sessionService } from "redux-react-session";

const Wrapper = styled.div`
  position: relative;
  flex: unset;
  svg {
    cursor: pointer;
    margin-right: 5px;
  }
  .recipients svg {
    margin: 0;
  }

  .author-avatar {
    width: 40px;
    height: 40px;
  }

  .avatar.post-author {
    min-width: 45px;
  }

  .author-name {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: rgb(80, 80, 80);
    .dark & {
      color: #c7c7c7;
    }
  }

  .recipients {
    color: #8b8b8b;
    font-size: 10px;
  }

  .ellipsis-hover {
    position: relative;
    cursor: pointer;

    &:hover {
      .recipient-names {
        opacity: 1;
        max-height: 300px;
      }
    }
  }

  .recipient-names {
    transition: all 0.5s ease;
    position: absolute;
    top: 20px;
    left: -2px;
    width: 200px;
    border-radius: 8px;
    overflow-y: auto;
    border: 1px solid #fff;
    box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
    background: #fff;
    max-height: 0;
    opacity: 0;

    &:hover {
      max-height: 300px;
      opacity: 1;
    }

    .dark & {
      border: 1px solid #25282c;
      background: #25282c;
    }

    > span {
      display: block;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0.25rem 0.5rem;
    }
  }
`;

const LockIcon = styled(SvgIconFeather)`
  width: 12px;
  vertical-align: top;
  margin-right: 0;
`;

const AuthorRecipients = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  padding-bottom: 3px;

  .recipients {
    color: #8b8b8b;
    font-size: 10px;
  }

  .ellipsis-hover {
    position: relative;

    &:hover {
      .recipient-names {
        opacity: 1;
        max-height: 300px;
      }
    }
  }
  .recipient-names {
    transition: all 0.5s ease;
    position: absolute;
    top: 20px;
    left: -2px;
    width: 200px;
    border-radius: 8px;
    overflow-y: auto;
    border: 1px solid #fff;
    box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
    background: #fff;
    max-height: 0;
    opacity: 0;
    z-index: 1;

    &:hover {
      max-height: 300px;
      opacity: 1;
    }

    .dark & {
      border: 1px solid #25282c;
      background: #25282c;
    }

    > span {
      display: block;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0.25rem 0.5rem;
      border-radius: unset;
    }
  }
  .receiver {
    align-items: center;
    display: inline-flex;
    > svg {
      margin-left: 5px;
    }
  }
`;

const PostBadgeWrapper = styled.div`
  //min-width: 150px;
  margin-left: auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  @media (max-width: 414px) {
    .post-badge {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      .mr-3 {
        margin-left: 1rem;
        margin-right: 0 !important;
      }
    }
  }
`;

const SharedBadge = styled.span`
  border-radius: 6px;
  font-size: 11px;
  display: inline-flex;
  margin-bottom: 5px;
  margin-left: -30px;
  padding: 2px 5px;
  align-items: center;
  > svg {
    width: 12px;
    height: 12px;
  }
  &.client-shared {
    background: ${(props) => props.theme.colors.fourth};
    color: #212529;
    margin-right: 5px;
    .feather {
      margin-right: 5px;
    }
  }
  &.client-not-shared {
    background: #d6edff;
    color: #212529;
    margin-right: 5px;
    .feather {
      margin-right: 5px;
    }
  }
`;

const PostBody = (props) => {
  const { post, user, postActions, dictionary, disableOptions, workspaceId, disableMarkAsRead } = props;

  const isExternalUser = user.type === "external";
  const dispatch = useDispatch();

  const refs = {
    container: useRef(null),
    body: useRef(null),
  };

  const {
    fileBlobs,
    actions: { setFileSrc },
  } = useFiles();
  const redirect = useRedirect();
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const [approving, setApproving] = useState({ approve: false, change: false });
  const { fromNow } = useTimeFormat();
  const googleApis = useGoogleApis();
  const winSize = useWindowSize();
  const history = useHistory();

  const handleInlineImageClick = (e) => {
    let id = null;
    if (e.srcElement.currentSrc.startsWith("blob")) {
      if (e.target.dataset.id) id = e.target.dataset.id;
    } else {
      let file = post.files.find((f) => f.thumbnail_link === e.srcElement.currentSrc);
      if (file) id = file.id;
    }

    if (id) {
      dispatch(
        setViewFiles({
          file_id: parseInt(id),
          files: post.files,
        })
      );
    }
  };

  useEffect(() => {
    if (refs.body.current) {
      const googleLinks = refs.body.current.querySelectorAll('[data-google-link-retrieve="0"]');
      googleLinks.forEach((gl) => {
        googleApis.init(gl);
      });
      const images = refs.body.current.querySelectorAll("img");
      images.forEach((img) => {
        const imgSrc = img.getAttribute("src");
        if (!img.classList.contains("has-listener")) {
          img.addEventListener("click", handleInlineImageClick, false);
          img.classList.add("has-listener");
          const imgFile = post.files.find((f) => imgSrc.includes(f.code));
          if (imgFile && fileBlobs[imgFile.id]) {
            img.setAttribute("src", fileBlobs[imgFile.id]);
            img.setAttribute("data-id", imgFile.id);
          }
        } else {
          const imgFile = post.files.find((f) => imgSrc.includes(f.code));
          if (imgFile && fileBlobs[imgFile.id]) {
            img.setAttribute("src", fileBlobs[imgFile.id]);
            img.setAttribute("data-id", imgFile.id);
          }
        }
      });
    }
    const imageFiles = post.files.filter((f) => f.type.toLowerCase().includes("image"));

    if (imageFiles.length && workspaceId) {
      imageFiles.forEach((file) => {
        if (!fileBlobs[file.id] && post.body.includes(file.code)) {
          //setIsLoaded(false);
          sessionService.loadSession().then((current) => {
            let myToken = current.token;
            fetch(file.view_link, {
              method: "GET",
              keepalive: true,
              headers: {
                Authorization: myToken,
                "Access-Control-Allow-Origin": "*",
                Connection: "keep-alive",
                crossorigin: true,
              },
            })
              .then(function (response) {
                return response.blob();
              })
              .then(function (data) {
                const imgObj = URL.createObjectURL(data);
                setFileSrc({
                  id: file.id,
                  src: imgObj,
                });
                postActions.updatePostImages({
                  post_id: post.id,
                  topic_id: workspaceId,
                  file: {
                    ...file,
                    blobUrl: imgObj,
                  },
                });
              })
              .catch((error) => {
                console.log(error, "error fetching image");
              });
          });
        }
      });
    }
  }, [post.body, refs.body, post.files, workspaceId]);

  const handleReceiverClick = (e) => {
    const { id, type } = e.target.dataset;
    switch (type) {
      case "DEPARTMENT": {
        history.push("/chat");
        break;
      }
      case "TOPIC": {
        let workspace = workspaces[id];
        if (workspace) redirect.toWorkspace(workspace);
        break;
      }
      case "USER": {
        history.push(`/profile/${id}/${replaceChar(e.target.innerHTML)}`);
        break;
      }
      case "TEAM": {
        history.push(`/system/people/teams/${id}/${replaceChar(e.target.innerHTML)}`);
        break;
      }
      default: {
        //console.log(id, type);
      }
    }
  };

  const renderUserResponsibleNames = () => {
    const hasMe = post.recipients.some((r) => r.type_id === user.id);
    const recipientSize = winSize.width > 576 ? (hasMe ? 4 : 5) : hasMe ? 0 : 1;
    let recipient_names = "";
    const otherPostRecipients = post.recipients.filter((r) => !(r.type === "USER" && r.type_id === user.id));
    // if (post.shared_with_client && hasExternalWorkspace && !isExternalUser) {
    //   recipient_names += `<span class="receiver client-shared mb-1">${renderToString(<LockIcon icon="eye" />)} The client can see this post</span>`;
    // } else if (!post.shared_with_client && hasExternalWorkspace && !isExternalUser) {
    //   recipient_names += `<span class="receiver client-not-shared mb-1">${renderToString(<LockIcon icon="eye-off" />)} This post is private to our team</span>`;
    // }
    if (otherPostRecipients.length) {
      recipient_names += otherPostRecipients
        .filter((r, i) => i < recipientSize)
        .map((r) => {
          if (["DEPARTMENT", "TOPIC"].includes(r.type))
            return `<span data-init="0" data-id="${r.type_id}" data-type="${r.type}" class="receiver mb-1">${r.name} ${r.type === "TOPIC" && r.private === 1 ? renderToString(<LockIcon icon="lock" />) : ""} ${
              r.type === "TOPIC" && r.is_shared ? renderToString(<LockIcon icon="eye" />) : ""
            }</span>`;
          else return `<span class="receiver mb-1" data-init="0" data-id="${r.type_id}" data-type="${r.type}">${r.type && r.type === "TEAM" ? `${dictionary.teamLabel} ${r.name}` : r.name}</span>`;
        })
        .join(", ");
    }

    if (hasMe) {
      if (otherPostRecipients.length >= 1) {
        recipient_names += `<span class="receiver mb-1">${dictionary.me}</span>`;
      } else {
        recipient_names += `<span class="receiver mb-1">${dictionary.me}</span>`;
      }
    }

    let otherRecipientNames = "";
    if (otherPostRecipients.length + (hasMe ? 1 : 0) > recipientSize) {
      otherRecipientNames += otherPostRecipients
        .filter((r, i) => i >= recipientSize)
        .map((r) => {
          if (["DEPARTMENT", "TOPIC"].includes(r.type))
            return `<span data-init="0" data-id="${r.type_id}" data-type="${r.type}" class="receiver mb-1">${r.name} ${r.type === "TOPIC" && r.private === 1 ? renderToString(<LockIcon icon="lock" />) : ""} ${
              r.type === "TOPIC" && r.is_shared ? renderToString(<LockIcon icon="eye" />) : ""
            }</span>`;
          else return `<span class="receiver" data-init="0" data-id="${r.type_id}" data-type="${r.type}">${r.type && r.type === "TEAM" ? `${dictionary.teamLabel} ${r.name}` : r.name}</span>`;
        })
        .join("");

      otherRecipientNames = `<span class="ellipsis-hover">... <span class="recipient-names">${otherRecipientNames}</span></span>`;
    }

    return `${recipient_names} ${otherRecipientNames}`;
  };

  useEffect(() => {
    if (refs.container.current) {
      refs.container.current.querySelectorAll('.receiver[data-init="0"]').forEach((e) => {
        e.dataset.init = 1;
        e.addEventListener("click", handleReceiverClick);
      });
    }
  });

  const hasPendingAproval = post.users_approval.length > 0 && post.users_approval.filter((u) => u.ip_address === null).length === post.users_approval.length;
  const isMultipleApprovers = post.users_approval.length > 1;
  const hasExternalWorkspace = post.recipients.some((r) => r.type === "TOPIC" && r.is_shared);

  return (
    <Wrapper ref={refs.container} className="card-body">
      {hasExternalWorkspace && !isExternalUser && (
        <SharedBadge className={post.shared_with_client ? "client-shared" : "client-not-shared"}>
          {post.shared_with_client && (
            <>
              <LockIcon icon="eye" />
              {dictionary.sharedClientBadge}
            </>
          )}
          {!post.shared_with_client && (
            <>
              <LockIcon icon="eye-off" />
              {dictionary.notSharedClientBadge}
            </>
          )}
        </SharedBadge>
      )}
      <div className="d-flex align-items-center p-l-r-0 m-b-20">
        <div className="d-flex justify-content-between align-items-center text-muted w-100">
          <div className="d-inline-flex align-items-start">
            <Avatar className="author-avatar mr-2 post-author" id={post.author.id} name={post.author.name} imageLink={post.author.profile_image_thumbnail_link ? post.author.profile_image_thumbnail_link : post.author.profile_image_link} />
            <div>
              <span className="author-name">{post.author.first_name}</span>
              <AuthorRecipients>{<span className="recipients" dangerouslySetInnerHTML={{ __html: renderUserResponsibleNames() }} />}</AuthorRecipients>
              {/* {postRecipients.length >= 1 && <span className="recipients" dangerouslySetInnerHTML={{ __html: renderUserResponsibleNames() }} />} */}
            </div>
          </div>
          <PostBadgeWrapper>
            <PostBadge post={post} isBadgePill={true} dictionary={dictionary} user={user} />
            <PostBodyButtons dictionary={dictionary} post={post} disableMarkAsRead={disableMarkAsRead} disableOptions={disableOptions} />
          </PostBadgeWrapper>
        </div>
      </div>
      {post.files.length > 0 && <PostVideos files={post.files} />}
      <div className="d-flex align-items-center">
        <div className="w-100 post-body-content ql-editor" ref={refs.body} dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(post.body) }} />
      </div>
      {(hasPendingAproval || isMultipleApprovers) && <PostChangeAccept postBody={true} approving={approving} fromNow={fromNow} usersApproval={post.users_approval} user={user} post={post} isMultipleApprovers={isMultipleApprovers} />}
    </Wrapper>
  );
};

export default React.memo(PostBody);
