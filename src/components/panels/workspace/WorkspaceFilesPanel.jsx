import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { replaceChar } from "../../../helpers/stringFormatter";
import { addToModals } from "../../../redux/actions/globalActions";
import { useFiles, useTranslation } from "../../hooks";
import { FilesBody, FilesHeader, FilesSidebar } from "../files";
import { useEffect } from "react";

const Wrapper = styled.div`
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }
`;

const WorkspaceFilesPanel = (props) => {
  const { className = "", isMember } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const { _t } = useTranslation();
  const { params, wsFiles, actions, topic, fileIds, folders, folder, subFolders } = useFiles();

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const refs = {
    dropZone: useRef(null),
  };

  const handleFilterFile = (e) => {
    if (params.hasOwnProperty("fileFolderId")) {
      let pathname = history.location.pathname.split("/folder/")[0];
      history.push(pathname);
    }
    setFilter(e.target.dataset.filter);
  };

  const handleSearchChange = useCallback(
    (e) => {
      if (e.target.value === "") clearSearch();
      setSearch(e.target.value);
    },
    [setSearch]
  );

  const handleSearch = () => {
    actions.search(search);
  };

  const clearSearch = () => {
    setSearch("");
    actions.clearSearch();
  };

  const handleEnter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const dictionary = {
    createFolder: _t("CREATE_FOLDER", "Create folder"),
    create: _t("CREATE", "Create"),
    updateFolder: _t("UPDATE_FOLDER", "Update folder"),
    update: _t("UPDATE", "Update"),
  };

  const folderName = useRef("");

  const handleFolderClose = () => {
    folderName.current = "";
  };

  const handleFolderNameChange = (e) => {
    folderName.current = e.target.value.trim();
  };

  const handleAddEditFolder = (f, mode = "add") => {
    const handleCreateFolder = () => {
      if (topic) {
        let cb = (err, res) => {
          if (err) return;
          if (params.hasOwnProperty("fileFolderId")) {
            let pathname = history.location.pathname.split("/folder/")[0];
            history.push(pathname + `/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
          } else {
            history.push(history.location.pathname + `/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
          }
        };
        let payload = {
          topic_id: topic.id,
          name: folderName.current,
        };
        if (params.hasOwnProperty("fileFolderId")) {
          payload = {
            ...payload,
            folder_id: params.fileFolderId,
          };
        }
        actions.createFolder(payload, cb);
      }
    };

    const handleUpdateFolder = () => {
      if (topic) {
        let cb = (err, res) => {
          if (err) return;
          if (params.hasOwnProperty("fileFolderId")) {
            let pathname = history.location.pathname.split("/folder/")[0];
            history.push(pathname + `/folder/${res.data.folder.id}/${replaceChar(res.data.folder.search)}`);
          }
        };
        actions.updateFolder(
          {
            id: f.id,
            topic_id: topic.id,
            name: folderName.current,
          },
          cb
        );
      }
    };

    let payload = {
      type: "single_input",
      defaultValue: "",
      onChange: handleFolderNameChange,
      onClose: handleFolderClose,
    };
    if (mode === "add") {
      payload = {
        ...payload,
        title: dictionary.createFolder,
        labelPrimaryAction: dictionary.create,
        onPrimaryAction: handleCreateFolder,
      };
    } else {
      folderName.current = f.search;
      payload = {
        ...payload,
        defaultValue: f.search,
        title: dictionary.updateFolder,
        labelPrimaryAction: dictionary.update,
        onPrimaryAction: handleUpdateFolder,
      };
    }

    dispatch(addToModals(payload));
  };

  const clearFilter = useCallback(() => {
    setFilter("");
  }, [setFilter]);

  useEffect(() => {
    if (folder && folder.is_archived && filter !== "removed") {
      setFilter("removed");
    }
  }, [folder, filter, setFilter]);

  if (!wsFiles) return <></>;

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      <div className="row app-block">
        <FilesSidebar
          actions={actions}
          isMember={isMember}
          clearFilter={clearFilter}
          params={params}
          dropZoneRef={refs.dropZone}
          className="col-md-3"
          filterFile={handleFilterFile}
          filter={filter}
          wsFiles={wsFiles}
          folders={folders}
          activeFolder={folder}
        />
        <div className="col-md-9 app-content mb-4">
          <div className="app-content-overlay" />
          <FilesHeader
            isMember={isMember}
            clearFilter={clearFilter}
            dropZoneRef={refs.dropZone}
            history={history}
            params={params}
            onSearch={handleSearch}
            onSearchChange={handleSearchChange}
            onEnter={handleEnter}
            wsFiles={wsFiles}
            handleAddEditFolder={handleAddEditFolder}
            folders={folders}
          />
          <FilesBody
            dropZoneRef={refs.dropZone}
            filter={filter}
            search={search}
            folders={folders}
            folder={folder}
            fileIds={fileIds}
            isMember={isMember}
            subFolders={subFolders}
            history={history}
            actions={actions}
            params={params}
            wsFiles={wsFiles}
            handleAddEditFolder={handleAddEditFolder}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspaceFilesPanel);
