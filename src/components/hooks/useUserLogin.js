import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { sessionService } from "redux-react-session";
import { $_GET, getUrlParams } from "../../helpers/commonFunctions";
import { authenticateGoogleLogin, getUser } from "../../redux/actions/userAction";
import { useUserActions } from "./index";
import { replaceChar } from "../../helpers/stringFormatter";
import { getAPIUrl, getBaseUrl } from "../../helpers/slugHelper";
//import { sessionService } from "redux-react-session";

export const useUserLogin = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const authMatch = useRouteMatch("/authenticate/:token/:returnUrl?");
  const magicLinkMatch = useRouteMatch("/magic-link/:token");
  const params = useParams();

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
        setTimeout(() => {
          checkingRef.current = null;
        }, 3000);

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
                    let link = `/hub/posts/${ws.workspace_id}/${replaceChar(ws.workspace_name)}/${ws.topic_id}/${replaceChar(ws.topic_name)}/post/${postId}/${replaceChar(postName)}`;
                    userActions.login(res.data, link);
                  } else {
                    let link = `/hub/posts/${ws.topic_id}/${replaceChar(ws.topic_name)}/post/${postId}/${replaceChar(postName)}`;
                    userActions.login(res.data, link);
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
                  let link = `/hub/chat/${wsFolder.id}/${replaceChar(wsFolder.name)}/${topic.id}/${replaceChar(topic.name)}`;
                  userActions.login(res.data, link);
                } else {
                  let link = `/hub/chat/${topic.id}/${replaceChar(topic.name)}`;
                  userActions.login(res.data, link);
                }
              } else if (res.data.additional_data.data) {
                let link = `/chat/${res.data.additional_data.data.code}`;
                userActions.login(res.data, link);
              } else {
                userActions.login(res.data, "/dashboard");
              }
            }
          } else {
            userActions.login(res.data, "/dashboard");
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
              // let cb = {
              //   id: new Date().getTime(),
              //   type: "modal",
              //   modal: "modal_dialog_yes_no",
              //   title: "Trust this device?",
              //   children: "",
              //   callback: {
              //     handleYes: this.handleConfirmationDialogYes,
              //   },
              // };

              /**
               * @todo Add modal
               */

              //this.props.redux.action.openModal(cb);
            }

            if (authMatch.params.returnUrl) {
              history.push(goTo);
            }
          });
      }
    }
    if (history.location.pathname.startsWith("/authenticate-ios/") && !checkingRef.current) {
      const data = getUrlParams(`${getBaseUrl()}/authenticate-ios?auth_token=${params.tokens}`);

      checkingRef.current = true;
      if (data.id && data.auth_token && data.redirect_url) {
        fetch(`${getAPIUrl()}/users/${data.id}`, {
          method: "GET",
          keepalive: true,
          headers: {
            Authorization: `Bearer ${data.auth_token}`,
            "Access-Control-Allow-Origin": "*",
            Connection: "keep-alive",
            crossorigin: true,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            setTimeout(() => {
              checkingRef.current = null;
            }, 3000);
            sessionService
              .saveSession({
                token: `Bearer ${data.auth_token}`,
                xsrf_token: `XSRF-TOKEN=${data.auth_token}`,
                access_broadcast_token: `${data.access_broadcast_token}`,
                download_token: `${data.download_token}`,
              })
              .then(() => {
                sessionService.saveUser({
                  ...res,
                });
                window.location.href = data.redirect_url;
              });
          });
      }
    }
    //process google login
    if ($_GET("code") && $_GET("state")) {
      const payload = getUrlParams(window.location.href);
      dispatch(
        authenticateGoogleLogin(payload, (err, res) => {
          if (res) {
            userActions.login(res.data, "/dashboard");
          }
        })
      );
    }
  }, [authMatch, dispatch, history, props, params]);
};
