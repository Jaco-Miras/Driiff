import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslationActions, useToaster } from "../../hooks";
import { useParams } from "react-router-dom";
import { postToDo, addToModals, setMeetingFilter } from "../../../redux/actions/globalActions";

const Wrapper = styled.div``;

const Filter = styled.span`
  cursor: pointer;
  font-size: 13px;
  .dark & {
    background: #191c20 !important;
    border-color: #ffffff14 !important;
  }

  ${(props) =>
    props.active &&
    `
        background: 0 0;
        color: ${props.theme.colors.secondary};
        &:after {
          content: "";
          width: 3px;
          height: 100%;
          background-color: ${props.theme.colors.secondary};
          display: block;
          position: absolute;
          top: 0;
          animation: fadeIn 0.15s linear;
          left: 0;
        }
        .dark & {
          color: ${props.theme.colors.third};
        }
    `}

  &.folder-list {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    > ul {
      list-style: none;
      padding: 0.75rem 1.5rem;
      width: 100%;
      margin: 0;

      li {
        margin-bottom: 5px;
      }
    }
  }
`;

const MeetingSidebar = (props) => {
  const { className } = props;
  const params = useParams();
  const { _t } = useTranslationActions();
  const toaster = useToaster();
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.global.meetings.filter);
  const dictionary = {
    statusToday: _t("REMINDER.STATUS_TODAY", "Today"),
    statusAll: _t("REMINDER.STATUS_ALL", "ALL"),
    statusExpired: _t("REMINDER.STATUS_EXPIRED", "Expired"),
    statusUpcoming: _t("REMINDER.STATUS_UPCOMING", "Upcoming"),
    statusOverdue: _t("REMINDER.STATUS_OVERDUE", "Overdue"),
    addedByMe: _t("REMINDER.ADDED_BY_ME", "Added by me"),
    addedByOthers: _t("REMINDER.ADDED_BY_OTHERS", "Added by others"),
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    toasterCreateMeeting: _t("TOASTER.MEETING_CREATE_SUCCESS", "You will be reminded about this comment under <b>Meetings</b>."),
    createMeeting: _t("BUTTON.CREATE_MEETING", "Create meeting"),
  };

  const handleSelectFilter = (e) => {
    document.body.classList.remove("mobile-modal-open");
    dispatch(setMeetingFilter(e.target.dataset.filter));
  };

  const handleCreateMeeting = () => {
    const create = (payload, callback) => {
      dispatch(postToDo(payload, callback));
    };
    const createFromModal = (callback = () => {}) => {
      const onConfirm = (payload, modalCallback = () => {}) => {
        create(payload, (err, res) => {
          if (err) {
            toaster.error(dictionary.toasterGeneraError);
          }
          if (res) {
            toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterCreateMeeting }} />);
          }
          modalCallback(err, res);
          callback(err, res);
        });
      };

      let payload = {
        type: "video_reminder",
        actions: {
          onSubmit: onConfirm,
        },
        videoMeeting: true,
        params: params,
      };

      dispatch(addToModals(payload));
    };
    createFromModal();
  };

  return (
    <Wrapper className={`todo-sidebar bottom-modal-mobile ${className}`}>
      <div className="card">
        <div className="card-body">
          <button className="btn btn-primary btn-block" onClick={handleCreateMeeting}>
            {dictionary.createMeeting}
          </button>
        </div>
        <div className="app-sidebar-menu" tabIndex="1">
          <div className="list-group list-group-flush">
            <Filter onClick={handleSelectFilter} data-filter="ALL" active={filter === "ALL"} className={"list-group-item d-flex align-items-center"}>
              <span className="text-primary fa fa-circle mr-2" />
              {dictionary.statusAll}
            </Filter>
            {/* <Filter onClick={handleSelectFilter} data-filter="OVERDUE" active={filter === "OVERDUE"} className={"list-group-item d-flex align-items-center"}>
              <span className="text-danger fa fa-circle mr-2" />
              {dictionary.statusExpired}
            </Filter> */}
            <Filter onClick={handleSelectFilter} data-filter="TODAY" active={filter === "TODAY"} className={"list-group-item d-flex align-items-center"}>
              <span data-filter="TODAY">
                <span className="text-success fa fa-circle mr-2" />
                {dictionary.statusToday}
              </span>
            </Filter>
            <Filter onClick={handleSelectFilter} data-filter="NEW" active={filter === "NEW"} className={"list-group-item d-flex align-items-center"}>
              <span data-filter="NEW">
                <span className="text-default fa fa-circle mr-2" />
                {dictionary.statusUpcoming}
              </span>
            </Filter>
            <Filter onClick={handleSelectFilter} data-filter="ASSIGNED_TO_OTHERS" active={filter === "ASSIGNED_TO_OTHERS"} className={"list-group-item d-flex align-items-center"}>
              <span data-filter="ASSIGNED_TO_OTHERS">
                <span className="text-info fa fa-circle mr-2" />
                {dictionary.addedByMe}
              </span>
            </Filter>
            <Filter onClick={handleSelectFilter} data-filter="ADDED_BY_OTHERS" active={filter === "ADDED_BY_OTHERS"} className={"list-group-item d-flex align-items-center"}>
              <span data-filter="ADDED_BY_OTHERS">
                <span className="text-info fa fa-circle mr-2" />
                {dictionary.addedByOthers}
              </span>
            </Filter>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default React.memo(MeetingSidebar);
