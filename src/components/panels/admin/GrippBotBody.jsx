import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";
import { SvgIconFeather } from "../../common";
import GrippSyncForm from "./GrippSyncForm";
import GrippBots from "./GrippBots";
import GrippUsersList from "./GrippUsersList";
import { addToModals } from "../../../redux/actions/globalActions";
import Tooltip from "react-tooltip-lite";

const Wrapper = styled.div`
  .gripp-card-body {
    padding: 0.8rem;
    height: 120px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    cursor: pointer;
    background-color: #fafafa;
    .dark & {
      background-color: #25282c;
    }
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h3,
  h5 {
    margin: 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  h3,
  h5 {
    margin: 0;
  }
  .feather {
    width: 2rem;
    height: 2rem;
    stroke-width: 3;
  }
  .feather-info {
    width: 1rem;
    height: 1rem;
  }
  > div {
    display: flex;
    flex-flow: column;
    align-items: flex-end;
    text-align: right;
    height: 100%;
    justify-content: flex-end;
  }
  &.reset-card-header {
    justify-content: flex-start;
    div {
      display: flex;
      margin-left: 5px;
    }
  }
`;
const LabelBackButton = styled.div`
  display: flex;
  align-items: center;
  h5 {
    margin: 0;
  }
  .back-button {
    cursor: pointer;
  }
`;

const GrippBotBody = () => {
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();

  const { setAdminFilter, fetchGrippBot, resetGrippProfileImages, fetchGrippDetails, fetchGrippUsers } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    grippLabel: _t("ADMIN.GRIPP_LABEL", "Gripp"),
    resetProfileImages: _t("LABEL.RESET_PROFILE_IMAGES", "Reset profile images"),
    cancel: _t("CANCEL", "Cancel"),
    reset: _t("RESET", "Reset"),
    confirmationText: _t("GRIPP_MODAL_CONFIRMATION", "Are you sure you want to reset all gripp users profile image?"),
    adminBotLabel: _t("ADMIN.AUTOMATION_LABEL_ADMIN_BOT", "Admin bot"),
    deleteBotBody: _t("MODAL.DELETE_BOT_CONFIRMATION", "Are you sure you want to delete this bot?"),
    buttonCancel: _t("BUTTON.CANCEL", "Cancel"),
    buttonRemove: _t("BUTTON.REMOVE", "Remove"),
    uploadSuccess: _t("TOAST.UPLOAD_ICON_SUCCESS", "Uploaded icon success!"),
    channelsConnected: _t("LABEL.CHANNELS_CONNECTED", "Channels connected"),
    fileTypeError: _t("TOAST.FILE_TYPE_ERROR", "File type not allowed. Please use an image file."),
    multipleFileError: _t("TOAST.MULTIPLE_FILE_ERROR", "Multiple files detected. First selected image will be used."),
    detail: _t("DETAIL", "Detail"),
    back: _t("BACK", "Back"),
    syncGrippUsers: _t("LABEL.SYNC_GRIPP_USERS", "Sync gripp users"),
    grippBots: _t("LABEL.GRIPP_BOTS", "Gripp bots"),
    resetImageInfo: _t("TOOLTIP.GRIPP_RESET_IMAGE", "Reset users profile image"),
  };

  //["main", "sync-form", "sync-lists", "gripp-bots"]
  const [activePage, setActivePage] = useState("main");
  const filters = useSelector((state) => state.admin.filters);
  const automation = useSelector((state) => state.admin.automation);
  const { grippBots, grippUsers, grippDetails } = automation;

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, automation: true } });
    fetchGrippDetails({}, (err, res) => {
      if (err) return;
      if (res.data.grippBotCount > 0) {
        fetchGrippBot({});
      }
    });
    fetchGrippUsers();
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const resetProfileImages = () => {
    let confirmModal = {
      type: "confirmation",
      headerText: dictionary.resetProfileImages,
      submitText: dictionary.reset,
      cancelText: dictionary.cancel,
      bodyText: dictionary.confirmationText,
      actions: {
        onSubmit: () => resetGrippProfileImages(),
      },
    };

    dispatch(addToModals(confirmModal));
  };

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  return (
    <Wrapper>
      <LabelBackButton className="mb-3">
        <h5 className="mr-3">{dictionary.grippLabel}</h5>
        {activePage !== "main" && (
          <span className="back-button" onClick={() => setActivePage("main")}>
            <SvgIconFeather icon="arrow-left" /> {dictionary.back}
          </span>
        )}
      </LabelBackButton>
      {grippDetails && grippDetails.has_gripp_token && activePage === "main" && (
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="card border">
              <div className="gripp-card-body" onClick={() => setActivePage("sync-lists")}>
                <CardHeader>
                  <SvgIconFeather icon="refresh-ccw" />
                  <div>
                    <h3>{grippUsers.length}</h3>
                    <h5>{dictionary.syncGrippUsers}</h5>
                  </div>
                </CardHeader>
                <CardFooter>
                  <h5>{dictionary.detail}</h5>
                  <SvgIconFeather icon="arrow-right-circle" />
                </CardFooter>
              </div>
            </div>
          </div>
          {/* <div className="col-12 col-md-3">
            <div className="card border">
              <div className="gripp-card-body">
                <CardHeader>
                  <SvgIconFeather icon="download" />
                  <div>
                    <h5>Import gripp user</h5>
                  </div>
                </CardHeader>
                <CardFooter>
                  <h5>Detail</h5>
                  <SvgIconFeather icon="arrow-right-circle" />
                </CardFooter>
              </div>
            </div>
          </div> */}
          <div className="col-12 col-md-4">
            <div className="card border">
              <div className="gripp-card-body" onClick={() => setActivePage("gripp-bots")}>
                <CardHeader>
                  <SvgIconFeather icon="admin-bot" viewBox="0 0 54 54" />
                  <div>
                    <h3>{grippBots.length}</h3>
                    <h5>{dictionary.grippBots}</h5>
                  </div>
                </CardHeader>
                <CardFooter>
                  <h5>{dictionary.detail}</h5>
                  <SvgIconFeather icon="arrow-right-circle" />
                </CardFooter>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border">
              <div className="gripp-card-body">
                <CardHeader className="reset-card-header">
                  <h5>{dictionary.resetProfileImages} </h5>
                  <Tooltip onToggle={toggleTooltip} content={dictionary.resetImageInfo}>
                    <SvgIconFeather icon="info" height="16" width="16" />
                  </Tooltip>
                </CardHeader>
                <CardFooter>
                  <button className="btn btn-primary" onClick={resetProfileImages}>
                    {dictionary.reset}
                  </button>
                </CardFooter>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {grippDetails && !grippDetails.has_gripp_token && activePage === "main" && (
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="card border">
              <div className="gripp-card-body" onClick={() => setActivePage("sync-form")}>
                <CardHeader>
                  <SvgIconFeather icon="refresh-ccw" />
                  <div>
                    <h3>0</h3>
                    <h5>{dictionary.syncGrippUsers}</h5>
                  </div>
                </CardHeader>
                <CardFooter>
                  <h5>{dictionary.detail}</h5>
                  <SvgIconFeather icon="arrow-right-circle" />
                </CardFooter>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {grippDetails && !grippDetails.has_gripp_token && <GrippSyncForm />}
      {grippDetails && grippDetails.has_gripp_token && activePage === "gripp-bots" && <GrippBots bots={grippBots} />}
      {grippDetails && grippDetails.has_gripp_token && activePage === "sync-lists" && <GrippUsersList />}
    </Wrapper>
  );
};

export default GrippBotBody;
