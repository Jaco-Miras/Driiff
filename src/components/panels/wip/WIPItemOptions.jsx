import React from "react";
import { useSelector } from "react-redux";
import { MoreOptions } from "../common";
import { useWIPActions, useTranslationActions } from "../../hooks";

const WIPItemOptions = (props) => {
  const { wip } = props;

  const actions = useWIPActions();
  const { _t } = useTranslationActions();
  const dictionary = {
    star: _t("POST.STAR", "Mark with star"),
    unStar: _t("POST.UNSTAR", "Unmark star"),
    closeThisPost: _t("POST.CLOSE_THIS_POST", "Close this post"),
    openThisPost: _t("POST.OPEN_THIS_POST", "Open this post"),
  };
  const user = useSelector((state) => state.session.user);
  const handleEdit = () => {
    actions.showModal("edit", wip);
  };
  const handleShare = () => {
    actions.share(wip);
  };
  const handleFavorite = () => {
    actions.favorite(wip);
  };
  const handleClose = () => {};
  return (
    <MoreOptions className={"d-flex ml-2"} width={220} moreButton={"more-horizontal"}>
      {/* {wip.todo_reminder === null && <div onClick={() => remind(post)}>{dictionary.remindMeAboutThis}</div>} */}
      {wip.author && wip.author.id === user.id && <div onClick={handleEdit}>Edit wip</div>}
      <div onClick={handleShare}>Share wip</div>
      {/* {wip.author && wip.author.id !== user.id && <div onClick={() => followPost(post)}>{wip.is_followed ? dictionary.unFollow : dictionary.follow}</div>} */}
      <div onClick={handleFavorite}>{wip.is_pinned ? dictionary.unStar : dictionary.star}</div>
      <div onClick={handleClose}>{wip.is_close ? dictionary.openThisPost : dictionary.closeThisPost}</div>
    </MoreOptions>
  );
};

export default WIPItemOptions;
