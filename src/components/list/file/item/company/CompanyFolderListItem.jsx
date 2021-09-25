import React, { useState, useRef, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { replaceChar } from "../../../../../helpers/stringFormatter";
import { SvgIconFeather, ToolTip } from "../../../../common";
import { CompanyFolderOptions } from "../../../../panels/files/company";
import { BlockPicker } from "react-color";
import { useOutsideClick } from "../../../../hooks";
import colorWheel from "../../../../../assets/img/svgs/RGB_color_wheel_12.svg";

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
  .app-file-list .app-file-icon {
    background-color: ${(props) => (props.color !== "" ? props.color : "#f5f5f5")};
    .dark & {
      background-color: ${(props) => (props.color !== "" ? props.color : "#ffffff14")};
    }
  }
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

const CompanyFolderListItem = (props) => {
  const { className = "", folder, actions, history, params, handleAddEditFolder, disableOptions } = props;
  const { path, url } = useRouteMatch();
  const pickerRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(folder.bg_color ? folder.bg_color : "");

  const handleRedirect = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (folder.hasOwnProperty("payload")) {
      window.open(folder.payload.url, "_blank");
    } else {
      if (path === "/files/folder/:folderId/:folderName") {
        let pathname = url.split("/folder/")[0];
        history.push(pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
      } else {
        history.push(history.location.pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
      }
    }
  };

  const handleShowColorPicker = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowColorPicker(!showColorPicker);
  };

  const handleChange = (color, e) => {
    e.stopPropagation();
    setColor(color.hex);
  };

  useEffect(() => {
    if (color !== "" && !showColorPicker) {
      //update color
      const payload = {
        id: folder.id,
        name: folder.search,
        bg_color: color,
      };
      actions.updateCompanyFolders(payload);
    }
  }, [showColorPicker, color]);

  useOutsideClick(pickerRef, () => setShowColorPicker(!showColorPicker), showColorPicker);

  return (
    <Wrapper className={`file-list-item ${className}`} color={color}>
      <div className="card  app-file-list">
        <div className="app-file-icon cursor-pointer">
          <div onClick={handleRedirect}>
            {folder.hasOwnProperty("payload") && <Drive icon="gdrive" viewBox="0 0 512 512" height="20" width="15" fill="#000" opacity=".8" />}
            <i className="fa fa-folder-o text-instagram" />
            {!disableOptions && <CompanyFolderOptions folder={folder} actions={actions} history={history} params={params} handleAddEditFolder={handleAddEditFolder} />}
            <ColorWheelIcon className="color-picker" src={colorWheel} alt="color picker" disableOptions={disableOptions} onClick={handleShowColorPicker} />
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

export default React.memo(CompanyFolderListItem);
