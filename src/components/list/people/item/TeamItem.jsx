import React, { useRef } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Avatar, SvgIconFeather, ToolTip } from "../../../common";
import { MoreOptions } from "../../../panels/common";
import { addToModals } from "../../../../redux/actions/globalActions";
import { deleteTeam } from "../../../../redux/actions/userAction";
import { useToaster } from "../../../hooks";

const Wrapper = styled.div`
  .avatar {
    cursor: pointer;
    min-height: 2.7rem;
    min-width: 2.7rem;
  }
  .user-name {
    display: flex;
    cursor: pointer;
    flex-flow: row wrap;
  }
  .feather-message-circle {
    cursor: pointer;
    &:hover {
      color: #7a1b8b;
    }
  }
  > .col-12 {
    padding: 0;
  }
  .card.border {
    overflow: visible;
  }
  .people-text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    //max-width: ${(props) => props.userNameMaxWidth}px;
  }
  .button-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`;

const TeamItem = (props) => {
  const { className = "", loggedUser, team, dictionary } = props;

  const dispatch = useDispatch();
  const toaster = useToaster();
  const refs = {
    cardBody: useRef(null),
    content: useRef(null),
  };

  const handleOnChatClick = () => {};

  const handleEditTeam = () => {
    const modal = {
      mode: "edit",
      type: "team",
      team: team,
    };
    dispatch(addToModals(modal));
  };

  const handleRemoveTeam = () => {
    const callback = (err, res) => {
      if (err) return;
      toaster.success("Successfully deleted team");
    };
    const handleRemove = () => {
      dispatch(deleteTeam({ id: team.id }, callback));
    };
    let confirmModal = {
      type: "confirmation",
      headerText: dictionary.removeTeamHeader,
      submitText: dictionary.removeTeamBtn,
      cancelText: dictionary.cancel,
      bodyText: dictionary.removeTeamConfirmation,
      actions: {
        onSubmit: handleRemove,
      },
    };

    dispatch(addToModals(confirmModal));
  };

  return (
    <Wrapper className={`workspace-user-item-list col-12 col-md-6 ${className}`}>
      <div className="col-12">
        <div className="card border" key={team.id}>
          <div className="card-body" ref={refs.cardBody}>
            <div ref={refs.content} className="d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-start align-items-center">
                <Avatar
                  id={team.id}
                  name={team.name}
                  // onClick={handleOnNameClick}
                  noDefaultClick={true}
                  imageLink={null}
                  showSlider={false}
                  type={"TEAM"}
                />
                <div className="user-info-wrapper ml-3">
                  <h6 className="user-name mb-0">
                    <ToolTip content={team.name}>
                      <div className="mr-2 people-text-truncate">{team.name}</div>
                    </ToolTip>
                  </h6>
                </div>
              </div>
              {loggedUser.type !== "external" && (
                <div className="button-wrapper">
                  <SvgIconFeather onClick={handleOnChatClick} icon="message-circle" />
                  <MoreOptions className="ml-2" width={240} moreButton={"more-horizontal"} scrollRef={refs.cardBody.current}>
                    <div onClick={handleEditTeam}>{dictionary.editTeam}</div>
                    <div onClick={handleRemoveTeam}>{dictionary.removeTeam}</div>
                  </MoreOptions>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(TeamItem);
