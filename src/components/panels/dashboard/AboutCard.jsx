import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";

const Wrapper = styled.div`
  .card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }
  }
`;

const DashboardDescriptionContainer = styled.div`
  &.hide {
    .btn-toggle-show {
      display: block;
      color: #828282;
    }
  }
  &.show {
    .btn-toggle-show {
      display: block;
      color: #828282;
    }
  }

  .btn-toggle-show {
    text-align: right;
    display: none;
  }
`;

const DashboardDescription = styled.div`
  transition: all 0.3s ease;
  max-width: 700px;
  min-height: 140px;

  &.hide {
    max-height: 140px;
  }

  &.show {
    max-height: ${(props) => props.height}px;
  }

  img {
    max-width: 100%;
    max-height: 250px;
  }
`;

const AboutCard = (props) => {
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(null);
  //const [descriptionHeight, setDescriptionHeight] = useState(140);

  const user = useSelector((state) => state.session.user);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const recipients = useSelector((state) => state.global.recipients);
  const companyRecipient = recipients.find((r) => r.type === "DEPARTMENT");
  const companyWs = Object.values(workspaces).find((ws) => companyRecipient && companyRecipient.id === ws.id);

  //const companyChannel = useSelector((state) => state.chat.companyChannel);
  const companyName = useSelector((state) => state.settings.driff.company_name);

  // const refs = {
  //   description: useRef(null),
  // };

  // const refDescription = (e) => {
  //   if (refs.description.current === null && e) {
  //     refs.description.current = e;

  //     if (e.clientHeight > 140) {
  //       setDescriptionHeight(e.clientHeight);
  //       setShowMore(false);
  //     } else {
  //       setShowMore(null);
  //     }
  //   }
  // };

  // const toggleShowMore = (e) => {
  //   e.preventDefault();
  //   setShowMore((state) => !state);
  // };

  // useEffect(() => {
  //   if (refs.description.current) {
  //     if (showMore === true) {
  //       setTimeout(() => {
  //         refs.description.current.style.overflow = "";
  //       }, [300]);
  //     } else if (showMore === false) {
  //       refs.description.current.style.overflow = "hidden";
  //     }
  //   }
  // }, [showMore, refs.description.current]);

  const handleEditClick = () => {
    let payload = {
      type: "company-workspace",
    };

    dispatch(addToModals(payload));
  };

  return (
    <Wrapper>
      <div className="card-title">
        <span>
          <strong>About this {companyName}</strong>
        </span>{" "}
        {companyWs && user.role.id <= 2 && <SvgIconFeather icon="edit" onClick={handleEditClick} />}
      </div>
      <DashboardDescriptionContainer className={showMore === null ? "" : showMore === true ? "show" : "hide"}>
        {companyWs && (
          <DashboardDescription
            //ref={refDescription}
            //height={descriptionHeight}
            className={`dashboard-description ${showMore === null ? "" : showMore === true ? "show" : "hide"}`}
            dangerouslySetInnerHTML={{ __html: companyWs.description }}
          />
        )}
        {/* {showMore !== null && (
          <div onClick={toggleShowMore} className="btn-toggle-show cursor-pointer mt-2">
            {showMore ? "show less" : "show more"}
          </div>
        )} */}
      </DashboardDescriptionContainer>
    </Wrapper>
  );
};

export default React.memo(AboutCard);
