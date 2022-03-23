import React, { useEffect } from "react";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useUserActions, useChannelActions, useTranslationActions } from "../../hooks";
import { replaceChar } from "../../../helpers/stringFormatter";

const Wrapper = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .card {
    height: 95%;
    text-align: center;
    justify-content: center;
  }
`;

const RedirectPanel = (props) => {
  const { _t } = useTranslationActions();
  const dictionary = {
    redirecting: _t("REDIRECT.REDIRECTING", "Redirecting..."),
  };
  const userActions = useUserActions();
  const channelActions = useChannelActions();
  const history = useHistory();
  const magicLinkMatch = useRouteMatch("/magic-link/:token");
  useEffect(() => {
    if (magicLinkMatch !== null) {
      userActions.checkMagicLink(magicLinkMatch.params.token, (err, res) => {
        if (res) {
          if (res.data.additional_data) {
            if (res.data.additional_data.type === "POST") {
              if (res.data.additional_data.data.workspace) {
                let ws = res.data.additional_data.data.workspace[0];
                let postId = res.data.additional_data.data.id;
                let postName = res.data.additional_data.data.code;

                const isExternal = res.data.user_auth.type === "external";
                if (isExternal) {
                  if (ws.workspace_id) {
                    let link = `/workspace/posts/${ws.workspace_id}/${replaceChar(ws.workspace_name)}/${ws.topic_id}/${replaceChar(ws.topic_name)}/post/${postId}/${replaceChar(postName)}`;
                    history.push(link);
                  } else {
                    let link = `/workspace/posts/${ws.topic_id}/${replaceChar(ws.topic_name)}/post/${postId}/${replaceChar(postName)}`;
                    history.push(link);
                  }
                } else {
                  history.push(`/posts/${postId}/${replaceChar(postName)}`);
                }
              }
            } else if (res.data.additional_data.type === "CHANNEL") {
              if (res.data.additional_data.topic) {
                let topic = res.data.additional_data.topic;
                let wsFolder = res.data.additional_data.workspace;
                if (wsFolder) {
                  let link = `/workspace/chat/${wsFolder.id}/${replaceChar(wsFolder.name)}/${topic.id}/${replaceChar(topic.name)}`;
                  history.push(link);
                } else {
                  let link = `/workspace/chat/${topic.id}/${replaceChar(topic.name)}`;
                  history.push(link);
                }
              } else if (res.data.additional_data.data) {
                let link = `/chat/${res.data.additional_data.data.code}`;
                channelActions.fetchSelectChannel(res.data.additional_data.data.code, () => {
                  document.body.classList.add("m-chat-channel-closed");
                });
                history.push(link);
              } else {
                history.push("/workspace/chat");
              }
            }
          } else {
            history.push("/workspace/chat");
          }
        }
      });
    }
  }, []);
  return (
    <Wrapper className={"workspace-people container-fluid h-100"}>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-lg-5 col-xl-6 h-50">
          <div className="card">
            <h3>{dictionary.redirecting}</h3>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(RedirectPanel);
