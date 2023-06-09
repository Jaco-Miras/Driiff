import React, { useRef, useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { replaceChar } from "../../../../helpers/stringFormatter";
import { SvgIconFeather, ToolTip } from "../../../common";
import { FolderOptions } from "../../../panels/files";
import { BlockPicker } from "react-color";
import { useOutsideClick } from "../../../hooks";
//import colorWheel from "../../../../assets/img/svgs/RGB_color_wheel_12.svg";

const Wrapper = styled.div`
  .card {
    overflow: unset;

    .file-options {
      position: absolute;
      top: 10px;
      right: 5px;
      width: 16px;
    }

    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  ${(props) =>
    props.color !== "" &&
    `
      .app-file-list .app-file-icon {
      background-color: ${props.color}!important;
    }
    `}

  .app-file-icon:hover {
    .color-picker {
      display: block;
    }
  }
`;

const Drive = styled(SvgIconFeather)`
  position: absolute;
  top: 10px;
  left: 8px;
`;

const ColorWheelIcon = styled.img`
  height: 1rem;
  width: 1rem;
  display: none;
  ${(props) =>
    props.disableOptions &&
    `
  position: absolute;
    top: 10px;
    right: 12px;`}
  ${(props) =>
    !props.disableOptions &&
    `
    position: absolute;
      top: 35px;
      right: 12px;`}
`;

const PickerWrapper = styled.div`
  position: absolute;
  z-index: 2;
  left: -10px;
`;

const FolderListItem = (props) => {
  const { className = "", folder, actions, isMember, history, handleAddEditFolder, disableOptions } = props;

  const { path, url, params } = useRouteMatch();
  const pickerRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(folder.bg_color ? folder.bg_color : "");

  const handleRedirect = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (folder.hasOwnProperty("payload")) {
      window.open(folder.payload.url, "_blank");
    } else {
      if (path.startsWith("/hub/dashboard")) {
        history.push(url.replace("/dashboard", "/files") + `/folder/${folder.id}/${replaceChar(folder.search)}`);
      } else {
        if (path === "/hub/files/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName" || path === "/hub/files/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName") {
          let pathname = url.split("/folder/")[0];
          history.push(pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
        } else {
          history.push(history.location.pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
        }
      }
    }
  };

  // const handleShowColorPicker = (e) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   setShowColorPicker(!showColorPicker);
  // };

  const handleChange = (color, e) => {
    e.stopPropagation();
    setColor(color.hex);
  };

  useEffect(() => {
    if (color !== "" && color !== folder.bg_color && !showColorPicker) {
      //update color
      let payload = {
        id: folder.id,
        name: folder.search,
        bg_color: color,
        topic_id: params.workspaceId,
      };
      if (folder.parent_folder) {
        payload = {
          ...payload,
          folder_id: folder.parent_folder.id,
        };
      }
      actions.updateFolder(payload);
    }
  }, [showColorPicker, color]);

  useEffect(() => {
    setColor(folder.bg_color);
  }, [folder.bg_color]);

  useOutsideClick(pickerRef, () => setShowColorPicker(!showColorPicker), showColorPicker);

  const isChannelFolder = folder.channel_folder;

  return (
    <Wrapper className={`file-list-item ${className}`} color={color}>
      <div className="card  app-file-list">
        <div className="app-file-icon cursor-pointer" onClick={handleRedirect}>
          <div onClick={handleRedirect}>
            {folder.hasOwnProperty("payload") && <Drive icon="gdrive" viewBox="0 0 512 512" height="20" width="15" fill="#000" opacity=".8" />}
            <i className="fa fa-folder-o text-instagram" />
            {!disableOptions && !isChannelFolder && <FolderOptions folder={folder} actions={actions} isMember={isMember} history={history} params={params} handleAddEditFolder={handleAddEditFolder} />}
            {/* <ColorWheelIcon className="color-picker" src={colorWheel} alt="color picker" disableOptions={disableOptions} onClick={handleShowColorPicker} /> */}
          </div>
          {showColorPicker && (
            <PickerWrapper ref={pickerRef}>
              <BlockPicker color={color} onChange={handleChange} />
            </PickerWrapper>
          )}
        </div>
        <div className="p-2 small cursor-pointer" onClick={handleRedirect}>
          <ToolTip content={folder.search}>
            <div className="file-name">{folder.search}</div>
          </ToolTip>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(FolderListItem);
