import React, { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { replaceChar } from "../../../helpers/stringFormatter";
import { SvgIconFeather } from "../../common";
import SubFolderList from "./SubFolderList";

const Wrapper = styled.li`
  cursor: pointer;
  cursor: hand;
  position: relative;
  width: 100%;

  > a {
    position: relative;
    font-weight: ${(props) => (props.selected ? "bold" : "normal")};
    color: ${(props) => (props.selected ? "#7a1b8b !important" : "#64625C")};
    :hover {
      color: #7a1b8b;
    }
  }

  .sub-menu-arrow {
    display: inline-block;
    transition: all 0.3s;
    width: 15px;
    font-size: 8.8px;
    transform: rotate(0deg);
    margin-right: 2px;
    margin-left: 10px;

    &.ti-minus {
      margin-left: 6px;
    }

    &.rotate-in {
      transform: rotate(-540deg);
    }
  }

  > ul {
    padding: 0;
    margin-left: 5px;
  }
`;

const FolderNav = styled.ul`
  display: block !important;
  overflow: hidden;
  transition: all 0.3s ease;
  list-style: none;

  &.enter-active {
    max-height: 1000px;
    //max-height: ${(props) => props.maxHeight}px;
  }
  &.leave-active {
    max-height: 0px;
  }
`;

// const Icon = styled(SvgIconFeather)`
//   margin-right: 10px;
//   width: 10px;
// `;

const FolderList = (props) => {
  const { className = "", folder, folders, activeFolder, clearFilter } = props;

  const history = useHistory();
  const { params, path, url } = useRouteMatch();
  const ref = {
    container: useRef(null),
    arrow: useRef(null),
    nav: useRef(null),
  };

  const [showFolders, setShowFolders] = useState(false);
  const [maxHeight, setMaxHeight] = useState(null);
  //const [active, setActive] = useState(false);

  const handleSelectFolder = () => {
    if (folder.hasOwnProperty("payload")) {
      window.open(folder.payload.url, "_blank");
    } else {
      clearFilter();
      if (path === "/workspace/files/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName" || path === "/workspace/files/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName") {
        let pathname = url.split("/folder/")[0];
        history.push(pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
      } else {
        history.push(history.location.pathname + `/folder/${folder.id}/${replaceChar(folder.search)}`);
      }
      setShowFolders((prevState) => !prevState);
    }
  };

  // const handleSelectSubFolder = (f) => {
  //   clearFilter();
  //   if (path === "/workspace/files/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName" || path === "/workspace/files/:folderId/:folderName/:workspaceId/:workspaceName/folder/:fileFolderId/:fileFolderName") {
  //     let pathname = url.split("/folder/")[0];
  //     history.push(pathname + `/folder/${f.id}/${replaceChar(f.search)}`);
  //   } else {
  //     history.push(history.location.pathname + `/folder/${f.id}/${replaceChar(f.search)}`);
  //   }
  // };

  useEffect(() => {
    if (ref.nav.current !== null) {
      setMaxHeight(ref.nav.current.scrollHeight);
    }
  }, [ref.nav.current, maxHeight]);

  useEffect(() => {
    // if (activeFolder) {
    //     if (activeFolder.id === folder.id) {
    //         setActive(true);
    //     } else {
    //         if (activeFolder.parent_folder && activeFolder.parent_folder.id === folder.id) {
    //             setActive(true);
    //             setShowFolders(true);
    //         } else {
    //             setActive(false);
    //         }
    //     }
    // } else {
    //     setActive(false);
    // }
    if (activeFolder) {
      if (activeFolder.parent_folder && activeFolder.parent_folder.id === folder.id) {
        setShowFolders(true);
      }
    }
  }, [params, activeFolder]);

  return (
    <Wrapper ref={ref.container} className={`folder-list fadeIn ${className}`} selected={activeFolder ? activeFolder.id == folder.id : false}>
      <a onClick={handleSelectFolder}>
        {folder.search}
        {folder.hasOwnProperty("payload") && <SvgIconFeather className={"ml-2"} icon="gdrive" viewBox="0 0 512 512" height="20" width="15" fill="#000" opacity=".8" />}
        {Object.values(folders).filter((f) => {
          return !f.is_archived && f.parent_folder && f.parent_folder.id === folder.id;
        }).length > 0 && <i className={`sub-menu-arrow ti-angle-up ${showFolders ? "ti-minus rotate-in" : "ti-plus"}`} />}
      </a>
      {Object.values(folders).filter((f) => {
        return !f.is_archived && f.parent_folder && f.parent_folder.id === folder.id;
      }).length > 0 && (
        <FolderNav ref={ref.nav} maxHeight={maxHeight} className={showFolders ? "enter-active" : "leave-active"}>
          {showFolders &&
            Object.values(folders)
              .filter((f) => {
                return !f.is_archived && f.parent_folder && f.parent_folder.id === folder.id;
              })
              .map((f) => {
                return <SubFolderList key={f.id} clearFilter={clearFilter} params={params} folderHeight={maxHeight} activeFolder={activeFolder} folders={folders} folder={f} />;
              })}
        </FolderNav>
      )}
    </Wrapper>
  );
};

export default FolderList;
