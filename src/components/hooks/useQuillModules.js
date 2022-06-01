import React, { useEffect, useRef, useState } from "react";
import { osName } from "react-device-detect";
import { useSelector, useDispatch } from "react-redux";
import { Quill } from "react-quill";
import defaultIcon from "../../assets/icon/user/avatar/l/white_bg.png";
import workspaceIcon from "../../assets/icon/people_group/l/active.svg";
import { replaceChar } from "../../helpers/stringFormatter";
import { uploadDocument } from "../../redux/services/global";
import { usePreviousValue } from "./index";
import { SvgIconFeather } from "../common";
import { renderToString } from "react-dom/server";
import { getAllRecipients, getDrafts } from "../../redux/actions/globalActions";
import { getArchivedUsers } from "../../redux/actions/userAction";

const useQuillModules = ({
  mode,
  callback = null,
  removeMention = null,
  mentionOrientation = "top",
  quillRef,
  members = [],
  workspaces = [],
  disableMention = false,
  setInlineImages = null,
  prioMentionIds = [],
  post = null,
  setImageLoading = null,
  inlineImageType = "private",
  sharedSlug = null,
}) => {
  const dispatch = useDispatch();
  const [modules, setModules] = useState({});
  const [mentionValues, setMentionValues] = useState([]);
  // const [mentionOpen, setMentionOpen] = useState(false)
  const recipients = useSelector((state) => state.global.recipients);
  const recipientsLoaded = useSelector((state) => state.global.recipientsLoaded);
  const draftsLoaded = useSelector((state) => state.global.draftsLoaded);
  const userMentions = useSelector((state) => state.users.users);
  const archivedUsersLoaded = useSelector((state) => state.users.archivedUsersLoaded);
  const user = useSelector((state) => state.session.user);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const previousChannel = usePreviousValue(selectedChannel);
  const previousPost = usePreviousValue(post);
  const savedCallback = useRef(callback);
  const removeCallback = useRef(removeMention);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

  useEffect(() => {
    savedCallback.current = callback;
    removeCallback.current = removeMention;
  });

  const handleSubmit = () => {
    savedCallback.current();
  };

  const handleRemoveMention = () => {
    removeCallback.current();
  };

  const { REACT_APP_apiProtocol, REACT_APP_localDNSName } = process.env;
  const handleSetModule = () => {
    if (Object.keys(userMentions).length === 0) return;
    const all = {
      id: require("shortid").generate(),
      profile_image_link: require("../../assets/img/svgs/workspace.svg"),
      value: "All",
      name: "All users in this channel",
      class: "all-pic",
      show_line: false,
    };

    let newAtValues = [];
    let newWorkSpaceValues = [];
    let prioIds = prioMentionIds.filter((id) => id !== user.id);
    if (members.length) {
      newAtValues = [
        ...members
          .sort((a, b) => {
            if (prioMentionIds.length) {
              if (prioIds.some((id) => id === a.id) && prioIds.some((id) => id === b.id)) {
                return 0;
              } else if (prioIds.some((id) => id === a.id)) {
                return -1;
              } else {
                return 1;
              }
            } else {
              return 0;
            }
          })
          .map((user, k) => {
            const r = recipients.find((r) => r.type === "USER" && user.id === r.type_id);
            return Object.assign({}, user, {
              value: user.first_name.trim() !== "" ? user.first_name : user.email,
              id: r ? r.id : user.id,
              name: user.name.trim() !== "" ? user.name : user.email,
              //id: user.id,
              type: user.type,
              type_id: user.id,
              user_id: user.id,
              class: "user-pic",
              profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link ? user.profile_image_link : defaultIcon,
              link: `${REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${REACT_APP_localDNSName}/profile/${user.id}/${replaceChar(user.name)}`,
              show_line: prioMentionIds.length === k + 1,
            });
          }),
        all,
      ];
    } else {
      newAtValues = [
        ...Object.values(userMentions)
          .sort((a, b) => {
            if (prioMentionIds.length) {
              if (prioIds.some((id) => id === a.id) && prioIds.some((id) => id === b.id)) {
                return 0;
              } else if (prioIds.some((id) => id === a.id)) {
                return -1;
              } else {
                return 1;
              }
            } else {
              return 0;
            }
          })
          .map((user, k) => {
            const r = recipients.find((r) => r.type === "USER" && user.id === r.type_id);
            return Object.assign({}, user, {
              value: user.first_name.trim() !== "" ? user.first_name : user.email,
              id: r ? r.id : user.id,
              name: user.name.trim() !== "" ? user.name : user.email,
              //id: user.id,
              type: user.type,
              type_id: user.id,
              user_id: user.id,
              class: "user-pic all-users",
              profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link ? user.profile_image_link : defaultIcon,
              link: `${REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${REACT_APP_localDNSName}/profile/${user.id}/${replaceChar(user.name)}`,
              show_line: prioMentionIds.length === k + 1,
            });
          }),
        all,
      ];
    }

    if (Object.keys(workspaces).length && !sharedSlug) {
      newWorkSpaceValues = [
        ...Object.entries(workspaces).map(([id, workspace], index) => {
          let ws_type = workspace.sharedSlug ? "shared-workspace" : "workspace";
          return Object.assign({}, workspace, {
            ...workspace,
            value: workspace.name,
            name: workspace.name,
            id: workspace.id,
            type: "TOPIC",
            type_id: workspace.id,
            icon: "compass",
            profile_image_link: workspaceIcon,
            link: `${REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${REACT_APP_localDNSName}/${ws_type}/chat/${workspace.id}/${replaceChar(workspace.name)}`,
          });
        }),
      ];
    }

    if (!disableMention) {
      setMentionValues(newAtValues);
      setMentionValues(newWorkSpaceValues);
    } else {
      newAtValues = [];
      newWorkSpaceValues = [];
    }

    let modules = {
      magicUrl: true,
      clipboard: {
        allowed: {
          tags: ["a", "b", "strong", "u", "s", "i", "p", "br", "ul", "ol", "li", "div", "span"],
          attributes: ["href", "rel", "target", "class"],
        },
        //keepSelection: true,
      },
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäöë]*$/,
        defaultMenuOrientation: mentionOrientation,
        spaceAfterInsert: true,
        fixMentionsToQuill: false,
        mentionDenotationChars: ["@", "/"],
        minChars: 0,
        //linkTarget: "_blank",
        dataAttributes: ["id", "value", "denotationChar", "link", "target", "disabled", "type_id", "type", "show_line", "user_id"],
        source: function (searchTerm, renderList, mentionChar) {
          let values;

          if (mentionChar === "@") {
            values = newAtValues;
          }

          if (mentionChar === "/") {
            values = newWorkSpaceValues;
          }

          if (searchTerm.length === 0) {
            renderList(values, searchTerm);
          } else {
            let matches = [];
            let i;
            for (i = 0; i < values.length; i++) if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
            renderList(matches, searchTerm);
          }
        },
        renderItem: function (item, searchTerm) {
          let avatarStyling = {
            position: "relative",
            width: "30px",
            height: "30px",
            minWidth: "30px",
            minHeight: "30px",
            borderRadius: "50%",
            marginRight: "10px",
            zIndex: "1",
            pointerEvents: "auto",
            border: "none",
            overflow: "hidden",
            cursor: "pointer",
          };
          let avatarImgStyling = { width: "100%", height: "100%", position: "absolute", left: 0, top: 0 };
          if (typeof item.id === "string") {
            avatarStyling = {
              position: "relative",
              width: "24px",
              height: "24px",
              minWidth: "24px",
              minHeight: "24px",
              borderRadius: "50%",
              marginRight: "10px",
              zIndex: 1,
              pointerEvents: "auto",
              border: "none",
              overflow: "hidden",
              cursor: "pointer",
            };
          }

          return renderToString(
            <>
              <span className={item.class} style={avatarStyling}>
                {item.type === "WORKSPACE" || item.type === "TOPIC" ? (
                  <SvgIconFeather icon={"compass"} width={24} height={24} strokeWidth="3" />
                ) : (
                  <img src={item.profile_image_thumbnail_link ? item.profile_image_thumbnail_link : item.profile_image_link} style={avatarImgStyling} alt={item.value} />
                )}
              </span>
              &nbsp;{" "}
              <span style={{ width: "auto", lineHeight: 1.35 }}>
                {item.name} {item.type === "external" && user.type === "internal" && <SvgIconFeather icon={"share"} width={14} height={14} strokeWidth="3" />}
              </span>
            </>
          );
        },
      },
      toolbar: ["bold", "italic", "image", "link"],
      keyboard: {
        bindings: {
          tab: false,
          handleBackspace: {
            key: 8,
            metaKey: osName.includes("Mac") && mode !== "chat" ? true : false,
            handler: function (range, context) {
              if (range.index === 0 && range.length === 0) return;
              if (range.length === 0) {
                this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
              } else {
                this.quill.deleteText(range, Quill.sources.USER);
              }
              if (mode === "post_comment") {
                handleRemoveMention(range, context);
              }
            },
          },
          handleEnter: {
            key: 13,
            metaKey: osName.includes("Mac") && mode !== "chat" ? true : false,
            ctrlKey: (osName.includes("Windows") || osName.includes("Linux") || osName.includes("Chromium OS")) && mode !== "chat" ? true : false,
            handler: () => {
              handleSubmit();
            },
          },
          linebreak: {
            key: 13,
            metaKey: true,
            handler: function (range, context) {
              if (osName.includes("Mac") && mode === "chat") {
                // this.quill.insertEmbed(range.index + 1, "block", true, Quill.sources.USER);
                // this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
                // return false;
                const currentLeaf = this.quill.getLeaf(range.index)[0];
                const nextLeaf = this.quill.getLeaf(range.index + 1)[0];

                // At the end of the editor, OR next leaf has a different parent (<p>)
                if (nextLeaf === null || currentLeaf.parent !== nextLeaf.parent) {
                  //use block if end of editor
                  this.quill.insertEmbed(range.index + 1, "block", true, "user");
                } else {
                  //use break line if in between text
                  this.quill.insertEmbed(range.index, "breaker", true, "user");
                }
                // Now that we've inserted a line break, move the cursor forward
                this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
              }
            },
          },
          disableUnderline: {
            key: 85,
            ctrlKey: true,
            handler: () => {
              console.warn("copy paste pressed");
              //do nothing
            },
          },
        },
      },
    };
    if (mode === "chat") {
      setModules(modules);
    } else {
      modules = {
        ...modules,
        imageUploader: {
          upload: (file) => {
            if (!setInlineImages) return;
            if (setImageLoading) setImageLoading(true);
            return new Promise((resolve, reject) => {
              var formData = new FormData();
              formData.append("file", file);
              let filePayload = {
                user_id: user.id,
                file: formData,
                file_type: inlineImageType,
                folder_id: null,
              };
              if (sharedSlug) {
                const sharedPayload = { slug: sharedSlug, token: sharedWs[sharedSlug].access_token, is_shared: true };
                filePayload = {
                  ...filePayload,
                  sharedPayload: sharedPayload,
                  user_id: sharedWs[sharedSlug].user_auth.id,
                };
              }
              uploadDocument(filePayload)
                .then((result) => {
                  if (setInlineImages) setInlineImages((prevState) => [...prevState, result.data]);
                  if (setImageLoading) setImageLoading(false);
                  resolve(result.data.thumbnail_link);
                })
                .catch((error) => {
                  reject("Upload failed");
                  if (setImageLoading) setImageLoading(false);
                  console.error("Error:", error);
                });
            });
          },
        },
      };
      setModules(modules);
    }
  };

  useEffect(() => {
    handleSetModule();
    if (!recipientsLoaded) {
      dispatch(getAllRecipients());
    }
    if (!archivedUsersLoaded) {
      dispatch(getArchivedUsers());
    }
    if (!draftsLoaded) {
      dispatch(getDrafts());
    }
  }, []);

  useEffect(() => {
    if (Object.keys(userMentions).length && Object.keys(userMentions).length + 1 !== mentionValues.length) {
      handleSetModule();
    }
  }, [Object.keys(userMentions).length, mentionValues.length]);

  useEffect(() => {
    if (mode === "chat" && selectedChannel && previousChannel && previousChannel.id !== selectedChannel.id) {
      handleSetModule();
    }
  }, [mode, selectedChannel, previousChannel]);

  useEffect(() => {
    if (mode === "post_comment" && post && typeof previousPost === "undefined") {
      handleSetModule();
    }
  }, [mode, post, previousPost]);

  useEffect(() => {
    handleSetModule();
  }, [recipients.length, members.length, prioMentionIds.length]);

  const formats = ["background", "bold", "color", "font", "code", "italic", "link", "size", "strike", "script", "blockquote", "header", "indent", "list", "align", "direction", "image", "video"];

  return {
    modules,
    formats,
  };
};

export default useQuillModules;
