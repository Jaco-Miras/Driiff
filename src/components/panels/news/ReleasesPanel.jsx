import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useTimeFormat } from "../../hooks";
import { getReleaseAnnouncements, addToModals } from "../../../redux/actions/globalActions";
import { ReleaseItem } from "./index";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  overflow: auto;
  .empty-notification {
    h4 {
      margin: 2rem auto;
      text-align: center;
      color: ${(props) => props.theme.colors.primary};
    }
  }
  .feather-edit {
    cursor: pointer;
  }
`;

const ReleasesPanel = (props) => {
  const dispatch = useDispatch();
  const { fromNow } = useTimeFormat();

  const { items } = useSelector((state) => state.global.releases);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(getReleaseAnnouncements());
  }, []);

  const openModal = (item = null) => {
    let payload = {
      type: "release",
      item: item,
    };

    dispatch(addToModals(payload));
  };

  const isAuthorizedUser = ["anthea@makedevelopment.com", "jessryll@makedevelopment.com", "nilo@makedevelopment.com", "sander@zuid.com", "johnpaul@makedevelopment.com"].includes(user.email);

  return (
    <Wrapper className={"container-fluid h-100"}>
      <div className="row row-user-profile-panel justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title d-flex justify-content-between align-items-center">
                <span>Announcements</span>
                {isAuthorizedUser && <SvgIconFeather icon="edit" height={16} width={16} onClick={() => openModal(null)} />}
              </h6>
              <div>
                {items.length > 0 &&
                  items.map((item) => {
                    return <ReleaseItem key={item.draft_id ? item.draft_id : item.id} item={item} fromNow={fromNow} openModal={openModal} isAuthorizedUser={isAuthorizedUser} />;
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(ReleasesPanel);
