import React from "react";
import { Avatar } from "./index";

const PostVisibility = (props) => {
  const { dictionary, formRef, selectedAddressTo, workspaceIds, userOptions } = props;

  const handlePostVisibilityRef = (e) => {
    const handleUserPopUpMouseEnter = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".user-list").classList.add("active");
      }
    };

    const handleUserPopUpMouseOut = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".user-list").classList.remove("active");
      }
    };

    const handleWorkspacePopUpMouseEnter = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".workspace-list").classList.add("active");
      }
    };

    const handleWorkspacePopUpMouseOut = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".workspace-list").classList.remove("active");
      }
    };

    if (e) {
      formRef.visibilityInfo.current = e;
      let el = e.querySelector(".user-popup:not([data-event='1'])");
      if (el) {
        el.addEventListener("mouseenter", handleUserPopUpMouseEnter);
        el.addEventListener("mouseout", handleUserPopUpMouseOut);
        el.dataset.event = "1";
      }
      el = e.querySelector(".workspace-popup:not([data-event='1'])");
      if (el) {
        el.addEventListener("mouseenter", handleWorkspacePopUpMouseEnter);
        el.addEventListener("mouseout", handleWorkspacePopUpMouseOut);
        el.dataset.event = "1";
      }
    }
  };
  return (
    <div className="post-visibility-container" ref={handlePostVisibilityRef}>
      <span className="user-list">
        {userOptions.map((u) => {
          return (
            <span key={u.id}>
              <span title={u.email} className="user-list-item d-flex justify-content-start align-items-center pt-2 pb-2">
                <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_thumbnail_link ? u.profile_image_thumbnail_link : u.profile_image_link} id={u.id} />
                <span className="item-user-name">{u.name}</span>
              </span>
            </span>
          );
        })}
      </span>
      <span className="workspace-list">
        {selectedAddressTo
          .filter((w) => workspaceIds.includes(w.type_id))
          .map((w) => {
            return (
              <span className="d-flex justify-content-start align-items-center pt-2 pb-2" key={w.id}>
                <span className="item-workspace-name">{w.name}</span>
              </span>
            );
          })}
      </span>
      <span className="d-flex justify-content-end align-items-center post-info" dangerouslySetInnerHTML={{ __html: dictionary.postVisibilityInfo }} />
    </div>
  );
};

export default PostVisibility;
