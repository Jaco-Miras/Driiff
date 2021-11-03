import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { replaceChar } from "../../../helpers/stringFormatter";
import { ButtonDropdown, SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";

const Wrapper = styled.div`
  overflow: inherit !important;
  .action-left {
    ul {
      margin-bottom: 0;
      display: inherit;

      li {
        position: relative;

        .button-dropdown {
        }
      }
    }
    .app-sidebar-menu-button {
      margin-left: 8px;
    }
  }
  .btn-cross {
    position: absolute;
    top: 0;
    right: 45px;
    border: 0;
    background: transparent;
    padding: 0;
    height: 100%;
    width: 36px;
    border-radius: 4px;
    z-index: 9;
    svg {
      width: 16px;
      color: #495057;
    }
  }
`;

const FilesHeader = (props) => {
  const { className = "", isMember, dropZoneRef, onSearchChange, onSearch, onEnter, wsFiles, handleAddEditFolder, folders, history, params, clearFilter, dictionary, disableOptions, onClickEmpty, value } = props;

  const dispatch = useDispatch();

  const workspaceId = useSelector((state) => state.workspaces.selectedWorkspaceId);
  const handleClickAdd = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.open();
    }
  };

  const handleClickFolder = (e) => {
    clearFilter();
    if (wsFiles.folders.hasOwnProperty(e.target.dataset.value)) {
      let f = wsFiles.folders[e.target.dataset.value];
      if (f.hasOwnProperty("payload")) {
        window.open(f.payload.url, "_blank");
      } else {
        if (params.hasOwnProperty("fileFolderId")) {
          history.push(history.location.pathname.split("/folder/")[0] + `/folder/${f.id}/${replaceChar(f.search)}`);
        } else {
          history.push(history.location.pathname + `/folder/${f.id}/${replaceChar(f.search)}`);
        }
      }
    }
  };

  const addDropDown = {
    label: (
      <>
        <SvgIconFeather className="mr-1" icon="plus" /> {dictionary.add}
      </>
    ),
    items: [
      {
        value: "folder",
        label: dictionary.folder,
        onClick: () => handleAddEditFolder(null, "create"),
      },
      {
        value: "file",
        label: dictionary.file,
        onClick: handleClickAdd,
      },
    ],
  };

  const folderDropDown = {
    label: dictionary.folders,
    items:
      wsFiles && Object.values(folders).length
        ? Object.values(folders)
            .filter((f) => !f.is_archived)
            .map((f) => {
              return {
                value: f.id,
                label: f.search,
                //label: <>Video <span className="text-muted">21</span></>,
                onClick: handleClickFolder,
              };
            })
        : [],
  };

  const openMobileModal = () => {
    document.body.classList.toggle("mobile-modal-open");
  };

  const showExternalFileFolderModal = () => {
    const modal = {
      type: "external_file_folder",
      mode: "create",
      topic_id: workspaceId,
    };
    dispatch(addToModals(modal));
  };

  return (
    <Wrapper className={`files-header app-action ${className}`}>
      <div className="action-left">
        <ul className="list-inline">
          {isMember === true && !disableOptions && (
            <li className="list-inline-item mb-0">
              <ButtonDropdown dropdown={addDropDown} />
            </li>
          )}
          {isMember === true && Object.values(folders).filter((f) => !f.is_archived).length >= 1 && (
            <li className="list-inline-item mb-0">
              <ButtonDropdown dropdown={folderDropDown} />
            </li>
          )}
          {isMember === true && (
            <li className="list-inline-item mb-0">
              <button className="btn btn-outline-light" onClick={showExternalFileFolderModal}>
                {dictionary.driveLink}
              </button>
            </li>
          )}
        </ul>
        <span className="app-sidebar-menu-button btn btn-outline-light" onClick={openMobileModal}>
          <SvgIconFeather icon="menu" />
        </span>
      </div>
      <div className="action-right">
        <div className="input-group">
          <input type="text" onChange={onSearchChange} onKeyDown={onEnter} value={value} className="form-control" placeholder={dictionary.searchInputPlaceholder} aria-describedby="button-addon1" />
          {value.trim() !== "" && (
            <button onClick={onClickEmpty} className="btn-cross" type="button">
              <SvgIconFeather icon="x" />
            </button>
          )}
          <div className="input-group-append">
            <button className="btn btn-outline-light" type="button" id="button-addon1" onClick={onSearch}>
              <SvgIconFeather icon="search" />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(FilesHeader);
