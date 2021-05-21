import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { sessionService } from "redux-react-session";
import { $_GET, getUrlParams } from "../../helpers/commonFunctions";
import { authenticateGoogleLogin } from "../../redux/actions/userAction";
import { useUserActions } from "./index";
import { replaceChar } from "../../helpers/stringFormatter";

export const useUserLogin = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const authMatch = useRouteMatch("/authenticate/:token/:returnUrl?");
  const magicLinkMatch = useRouteMatch("/magic-link/:token");

  const userActions = useUserActions();

  const checkingRef = useRef(null);

  useEffect(() => {
    if (history.location.pathname === "/logged-out") {
      userActions.logout();
      history.push("/login");
    }

    //authenticate user login from magic link
    if (magicLinkMatch !== null && !checkingRef.current) {
      checkingRef.current = true;
      userActions.checkMagicLink(magicLinkMatch.params.token, (err, res) => {
        checkingRef.current = null;
        if (res) {
          if (res.data.additional_data) {
            if (res.data.additional_data.type === "POST") {
              if (res.data.additional_data.data.workspace) {
                let ws = res.data.additional_data.data.workspace[0];
                let postId = res.data.additional_data.data.id;
                let postName = res.data.additional_data.data.code;
                if (ws.workspace_id) {
                  let link = `/workspace/posts/${ws.topic_id}/${replaceChar(ws.topic_name)}/post/${postId}/${replaceChar(postName)}`;
                  userActions.login(res.data, link);
                } else {
                  let link = `/workspace/posts/${ws.workspace_id}/${replaceChar(ws.workspace_name)}/${ws.topic_id}/${replaceChar(ws.topic_name)}/post/${postId}/${replaceChar(postName)}`;
                  userActions.login(res.data, link);
                }
              }
            } else if (res.data.additional_data.type === "CHANNEL") {
              if (res.data.additional_data.topic) {
                let topic = res.data.additional_data.topic;
                let wsFolder = res.data.additional_data.workspace;
                if (wsFolder) {
                  let link = `/workspace/chat/${wsFolder.id}/${replaceChar(wsFolder.name)}/${topic.id}/${replaceChar(topic.name)}`;
                  userActions.login(res.data, link);
                } else {
                  let link = `/workspace/chat/${topic.id}/${replaceChar(topic.name)}`;
                  userActions.login(res.data, link);
                }
              } else if (res.data.additional_data.data) {
                let link = `/chat/${res.data.additional_data.data.code}`;
                userActions.login(res.data, link);
              } else {
                userActions.login(res.data, "/chat");
              }
            }
          } else {
            userActions.login(res.data, "/chat");
          }
        }
      });
    }

    //authenticate user login from backend
    if (authMatch !== null) {
      let userAuthToken = localStorage.getItem("userAuthToken");
      let goTo = authMatch.params.returnUrl ? atob(authMatch.params.returnUrl) : "";

      if (!props.authenticated && userAuthToken) {
        let dataSet = JSON.parse(userAuthToken);

        if (dataSet.access_token !== authMatch.params.token) {
          localStorage.removeItem("userAuthToken");
        }

        //LogRocket.identify(dataSet.user_auth.id, dataSet.user_auth);
        sessionService
          .saveSession({
            token: `${dataSet.token_type} ${dataSet.access_token}`,
            xsrf_token: `XSRF-TOKEN=${dataSet.access_token}`,
            access_broadcast_token: `${dataSet.access_broadcast_token}`,
            download_token: `${dataSet.download_token}`,
          })
          .then(() => {
            sessionService.saveUser({
              ...dataSet.user_auth,
            });

            if (localStorage.getItem("promptTrustDevice") === "1") {
              localStorage.removeItem("promptTrustDevice");
              let cb = {
                id: new Date().getTime(),
                type: "modal",
                modal: "modal_dialog_yes_no",
                title: "Trust this device?",
                children: "",
                callback: {
                  handleYes: this.handleConfirmationDialogYes,
                },
              };

              /**
               * @todo Add modal
               */
              console.log(cb);
              //this.props.redux.action.openModal(cb);
            }

            if (authMatch.params.returnUrl) {
              history.push(goTo);
            }
          });
      }
    }

    //process google login
    if ($_GET("code") && $_GET("state")) {
      const payload = getUrlParams(window.location.href);
      dispatch(
        authenticateGoogleLogin(payload, (err, res) => {
          if (res) {
            userActions.login(res.data, "/chat");
          }
        })
      );
    }
  }, [authMatch, dispatch, history, props]);
};
