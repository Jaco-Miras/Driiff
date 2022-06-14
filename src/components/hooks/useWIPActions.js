import React from "react";
import { useDispatch } from "react-redux";
import { addToModals } from "../../redux/actions/globalActions";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";
import { getBaseUrl } from "../../helpers/slugHelper";
import { copyTextToClipboard } from "../../helpers/commonFunctions";
import { postSubject, getWIPs, getWIPDetail, addWIPs, saveAnnotation, postWIPClap, addWIPReact, removeWIPReact, postWIPFavorite, favoriteWIP, deleteWIP } from "../../redux/actions/wipActions";
import { useToaster, useTranslationActions } from ".";

const useWIPActions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const toaster = useToaster();
  const { _t } = useTranslationActions();

  const dictionary = {
    notificationActionFailed: _t("NOTIFICATION.ACTION_FAILED", "Action failed"),
    notificationStar: _t("NOTIFICATION.STAR", "as starred"),
    notificationNotStar: _t("NOTIFICATION.NOT_STAR", "as not starred"),
    headerRemoveWIPHeader: _t("MODAL.REMOVE_WIP_HEADER", "Remove WIP?"),
    buttonRemove: _t("BUTTON.REMOVE", "Remove"),
    buttonCancel: _t("BUTTON.CANCEL", "Cancel"),
    removeThisWIP: _t("MODAL.REMOVE_THIS_WIP", "Are you sure you want to remove this WIP?"),
    toasterDeletedWIP: _t("TOASTER.DELETED_WIP", "Succesfully deleted the WIP"),
  };

  const showModal = (mode = "create", wip = null) => {
    let modal = {
      type: "wip",
      mode: mode,
      wip: wip,
      params: params,
    };
    dispatch(addToModals(modal));
  };

  const openWIP = (wip, path = null) => {
    if (wip.type === "draft_wip") {
      let payload = {
        type: "post_modal",
        mode: "create",
        item: {
          draft: wip,
        },
        params: params,
      };

      dispatch(addToModals(payload));
    } else {
      history.push(location.pathname + `/wip/${wip.id}/${replaceChar(wip.title)}`);
    }
  };

  const goBack = () => {
    if (params.hasOwnProperty("wipFileId")) {
      if (params.hasOwnProperty("folderId")) {
        history.push(`/hub/wip/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}/wip/${params.wipId}/${replaceChar(params.wipTitle)}`);
      } else {
        history.push(`/hub/wip/${params.workspaceId}/${replaceChar(params.workspaceName)}/wip/${params.wipId}/${replaceChar(params.wipTitle)}`);
      }
    } else if (params.hasOwnProperty("wipId")) {
      if (params.hasOwnProperty("folderId")) {
        history.push(`/hub/wip/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
      } else {
        history.push(`/hub/wip/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
      }
    }
  };

  const createSubject = (payload, callback = () => {}) => {
    dispatch(postSubject(payload, callback));
  };

  const fetchWIPs = (payload, callback = () => {}) => {
    dispatch(getWIPs(payload, callback));
  };

  const fetchWIPDetail = (payload, callback = () => {}) => {
    dispatch(getWIPDetail(payload, callback));
  };

  const storeWIPs = (payload, callback = () => {}) => {
    dispatch(addWIPs(payload, callback));
  };

  const annotate = (payload, callback = () => {}) => {
    dispatch(saveAnnotation(payload, callback));
  };

  const like = (payload = {}, callback) => {
    dispatch(addWIPReact(payload, callback));
  };

  const unlike = (payload = {}, callback) => {
    dispatch(removeWIPReact(payload, callback));
  };

  const react = (payload) => {
    dispatch(
      postWIPClap(payload, (err, res) => {
        if (err) {
          if (payload.counter === 1) unlike(payload);
          else like(payload);
        }
      })
    );
  };

  const share = (wip) => {
    let link = "";
    if (params.folderId) {
      link = `${getBaseUrl()}/hub/wip/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}/wip/${wip.id}/${replaceChar(wip.title)}`;
    } else if (params.workspaceId) {
      link = `${getBaseUrl()}/hub/wip/${params.workspaceId}/${replaceChar(params.workspaceName)}/wip/${wip.id}/${replaceChar(wip.title)}`;
    }
    copyTextToClipboard(toaster, link);
  };

  const favorite = (item, callback = () => {}) => {
    //if (item.type === "draft_post") return;
    dispatch(
      postWIPFavorite({ type: "wip", type_id: item.id }, (err, res) => {
        callback(err, res);
        //@todo reverse the action/data in the reducer
        if (err) {
          toaster.error(dictionary.notificationActionFailed);
        }

        if (res) {
          toaster.success(
            <>
              {dictionary.notificationYouMarked} {item.title} {item.is_favourite ? dictionary.notificationNotStar : dictionary.notificationStar}.
            </>
          );
        }
      })
    );
    dispatch(favoriteWIP({ proposal_id: item.id }));
  };

  const trashWIP = (wip) => {
    const onConfirm = () => {
      dispatch(
        deleteWIP(
          {
            id: wip.id,
          },
          (err, res) => {
            if (err) return;
            toaster.success(
              <>
                {dictionary.toasterDeletedWIP} - {wip.title}
              </>
            );
            // dispatch(
            //   removePost({
            //     post_id: post.id,
            //     topic_id: parseInt(params.workspaceId),
            //     recipients: post.recipients,
            //     id: post.id,
            //   })
            // );
          }
        )
      );
      if (params.folderId) {
        history.push(`${getBaseUrl()}/hub/wip/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}/wip/${wip.id}/${replaceChar(wip.title)}`);
      } else if (params.workspaceId) {
        history.push(`${getBaseUrl()}/hub/wip/${params.workspaceId}/${replaceChar(params.workspaceName)}/wip/${wip.id}/${replaceChar(wip.title)}`);
      }
    };

    let payload = {
      type: "confirmation",
      headerText: dictionary.headerRemoveWIPHeader,
      submitText: dictionary.buttonRemove,
      cancelText: dictionary.buttonCancel,
      bodyText: dictionary.removeThisWIP,
      actions: {
        onSubmit: onConfirm,
      },
    };
    dispatch(addToModals(payload));
  };

  return {
    fetchWIPs,
    fetchWIPDetail,
    createSubject,
    openWIP,
    showModal,
    goBack,
    storeWIPs,
    annotate,
    react,
    like,
    unlike,
    share,
    favorite,
    trashWIP,
  };
};

export default useWIPActions;
