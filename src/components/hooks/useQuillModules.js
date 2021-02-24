import React, { useEffect, useRef, useState } from "react";
import { osName } from "react-device-detect";
import { useSelector } from "react-redux";
import { Quill } from "react-quill";
import defaultIcon from "../../assets/icon/user/avatar/l/white_bg.png";
import workspaceIcon from "../../assets/icon/people_group/l/active.svg";
import { replaceChar } from "../../helpers/stringFormatter";
import { uploadDocument } from "../../redux/services/global";
import { usePreviousValue } from "./index";
import { SvgIconFeather } from "../common";
import { renderToString } from "react-dom/server";

const useQuillModules = ({ mode, callback = null, mentionOrientation = "top", quillRef, members = [], workspaces = [], disableMention = false, setInlineImages = null, prioMentionIds = [], post = null, setImageLoading = null }) => {
  const [modules, setModules] = useState({});
  const [mentionValues, setMentionValues] = useState([]);
  // const [mentionOpen, setMentionOpen] = useState(false)
  const userMentions = useSelector((state) => state.users.mentions);
  const user = useSelector((state) => state.session.user);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const previousChannel = usePreviousValue(selectedChannel);
  const previousPost = usePreviousValue(post);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const handleSubmit = () => {
    savedCallback.current();
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
    };

    let newAtValues = [];
    let newWorkSpaceValues = [];

    if (members.length) {
      newAtValues = [
        ...members.map((user) => {
          return Object.assign({}, user, {
            value: user.first_name,
            id: user.id,
            type_id: user.id,
            class: "user-pic",
            link: `${REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${REACT_APP_localDNSName}/profile/${user.id}/${replaceChar(user.name)}`,
          });
        }),
        all,
      ];
    } else {
      newAtValues = [
        ...Object.entries(userMentions).map(([id, user], index) => {
          return Object.assign({}, user, {
            value: user.first_name,
            id: user.id,
            type_id: user.id,
            class: "user-pic all-users",
            profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link ? user.profile_image_link : defaultIcon,
            link: `${REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${REACT_APP_localDNSName}/profile/${user.id}/${replaceChar(user.name)}`,
          });
        }),
        all,
      ];
    }

    if (Object.keys(workspaces).length) {
      newWorkSpaceValues = [
        ...Object.entries(workspaces).map(([id, workspace], index) => {
          return Object.assign({}, workspace, {
            ...workspace,
            value: workspace.name,
            id: workspace.id,
            type_id: workspace.id,
            icon: "compass",
            profile_image_link: workspaceIcon,
            link: `${REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${REACT_APP_localDNSName}/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`,
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

    if (prioMentionIds.length) {
      let prioIds = prioMentionIds.filter((id) => id !== user.id);
      newAtValues.sort((a, b) => {
        if (prioIds.some((id) => id === a.id) && prioIds.some((id) => id === b.id)) {
          return 0;
        } else if (prioIds.some((id) => id === a.id)) {
          return -1;
        } else {
          return 1;
        }
      });
    }

    const modules = {
      magicUrl: true,
      // clipboard: {
      //   allowed: {
      //     tags: ["a", "b", "strong", "u", "s", "i", "p", "br", "ul", "ol", "li", "div", "span"],
      //     attributes: ["href", "rel", "target", "class"],
      //   },
      //   keepSelection: true,
      // },
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäöë]*$/,
        defaultMenuOrientation: mentionOrientation,
        spaceAfterInsert: true,
        fixMentionsToQuill: false,
        mentionDenotationChars: ["@", "/"],
        minChars: 0,
        //linkTarget: "_blank",
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
          // let avatarStyling = "position: relative; width: 30px; height: 30px; min-width: 30px; min-height: 30px; border-radius: 50%; margin-right: 10px; z-index: 1; pointer-events: auto; border: none; overflow: hidden; cursor: pointer;";
          // let avatarImgStyling = "width: 100%; height: 100%; position: absolute; left: 0; top: 0;";
          // if (typeof item.id === "string") {
          //   avatarStyling = "position: relative; width: 24px; height: 24px; min-width: 24px; min-height: 24px; border-radius: 50%; margin-right: 10px; z-index: 1; pointer-events: auto; border: none; overflow: hidden; cursor: pointer;";
          // }

          // let listDisplay =
          //   "<span class=\"" +
          //   item.class +
          //   "\" style=\"" +
          //   avatarStyling +
          //   "\"><img src=\"" +
          //   (item.profile_image_thumbnail_link ? item.profile_image_thumbnail_link : item.profile_image_link) +
          //   "\" draggable=\"false\" style=\"" +
          //   avatarImgStyling +
          //   "\" alt=\"" +
          //   item.value +
          //   "\"></span>&nbsp; <span style=\"width: auto; line-height: 1.35;\">" +
          //   item.name +
          //   "</span>";
          // return listDisplay;

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
      imageUploader: {
        upload: (file) => {
          console.log(setImageLoading);
          if (setImageLoading) setImageLoading(true);
          return new Promise((resolve, reject) => {
            var formData = new FormData();
            formData.append("file", file);
            uploadDocument({
              user_id: user.id,
              file: formData,
              file_type: "private",
              folder_id: null,
            })
              .then((result) => {
                console.log(result);
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
      keyboard: {
        bindings: {
          tab: false,
          handleEnter: {
            key: 13,
            metaKey: osName.includes("Mac") && mode !== "chat" ? true : false,
            ctrlKey: (osName.includes("Windows") || osName.includes("Linux")) && mode !== "chat" ? true : false,
            handler: () => {
              handleSubmit();
            },
          },
          linebreak: {
            key: 13,
            metaKey: true,
            handler: function (range, context) {
              if (osName.includes("Mac") && mode === "chat") {
                quillRef.current.getEditor().insertEmbed(range.index + 1, "block", true, "user");
                quillRef.current.getEditor().setSelection(range.index + 1, Quill.sources.SILENT);
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
    setModules(modules);
  };

  useEffect(() => {
    handleSetModule();
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

  const formats = ["background", "bold", "color", "font", "code", "italic", "link", "size", "strike", "script", "blockquote", "header", "indent", "list", "align", "direction", "image", "video"];

  return {
    modules,
    formats,
  };
};

export default useQuillModules;
