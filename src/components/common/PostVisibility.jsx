import React from "react";
import { Avatar } from "./index";

const PostVisibility = (props) => {
  const { dictionary, formRef, selectedAddressTo, workspaceIds, userOptions } = props;

  const handlePostVisibilityRef = (e) => {
    let userTimeout;
    let wsTimeout;
    const handleUserPopUpMouseEnter = () => {
      if (formRef.visibilityInfo.current) {
        const el = formRef.visibilityInfo.current.querySelector(".user-list");
        const elPopUp = formRef.visibilityInfo.current.querySelector(".user-popup");
        userTimeout = setTimeout(() => {
          if (elPopUp.matches(":hover")) {
            el.classList.add("active");
          }
        }, 1000);
      }
    };

    const handleUserPopUpMouseOut = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".user-list").classList.remove("active");
        clearTimeout(userTimeout);
      }
    };

    const handleWorkspacePopUpMouseEnter = () => {
      if (formRef.visibilityInfo.current) {
        const el = formRef.visibilityInfo.current.querySelector(".workspace-list");
        const elPopUp = formRef.visibilityInfo.current.querySelector(".workspace-popup");
        wsTimeout = setTimeout(() => {
          if (elPopUp.matches(":hover")) {
            el.classList.add("active");
          }
        }, 1000);
      }
    };

    const handleWorkspacePopUpMouseOut = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".workspace-list").classList.remove("active");
        clearTimeout(wsTimeout);
      }
    };

    if (e) {
      formRef.visibilityInfo.current = e;
      let el = e.querySelector(".user-popup:not([data-event='1'])");
      if (el) {
        el.addEventListener("mouseover", handleUserPopUpMouseEnter);
        el.addEventListener("mouseout", handleUserPopUpMouseOut);
        el.dataset.event = "1";
      }
      let wsel = e.querySelector(".workspace-popup:not([data-event='1'])");
      if (wsel) {
        wsel.addEventListener("mouseover", handleWorkspacePopUpMouseEnter);
        wsel.addEventListener("mouseout", handleWorkspacePopUpMouseOut);
        wsel.dataset.event = "1";
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
                <Avatar className="mr-2" key={u.id} name={u.name} imageLink={u.profile_image_link} id={u.id} />
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
      <span className="d-flex align-items-center post-info" dangerouslySetInnerHTML={{ __html: dictionary.postVisibilityInfo }} />
    </div>
  );
};

export default PostVisibility;
