import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  a {
    cursor: pointer;
  }
  .list-group-item:last-child {
    border-bottom-width: thin !important;
  }
`;

const StyledIcon = styled(SvgIconFeather)`
  width: 1em;
  vertical-align: bottom;
  margin-right: 40px;

  &:hover {
    color: #000000;
  }
`;

const WorkInProgressSidbarSubjects = (props) => {
  const { className = "" } = props;

  const params = useParams();
  const allSubjects = useSelector((state) => state.wip.subjects);
  const activeSubject = useSelector((state) => state.wip.activeSubject);

  const handleClickFilter = (e) => {
    e.persist();

    // let payload = {
    //   tag: e.target.dataset.value,
    //   filter: null,
    // };
    // if (tag === e.target.dataset.value) {
    //   payload = {
    //     ...payload,
    //     tag: null,
    //     filter: "all",
    //   };
    // }
    // setCompanyFilterPosts(payload);
    // onGoBack();
    document.body.classList.remove("mobile-modal-open");
  };

  const subjects = allSubjects.filter((s) => s.topic_id === parseInt(params.workspaceId));

  return (
    <>
      <div className="post-filter-item list-group list-group-flush">
        <span className={"list-group-item d-flex align-items-center pr-3"} data-value="inbox">
          Filter
          <span className="ml-auto">
            <StyledIcon className="mr-0" icon="plus" />
          </span>
        </span>
      </div>
      {subjects.length > 0 && (
        <Wrapper className={`list-group list-group-flush ${className}`}>
          {subjects.map((subject) => {
            return (
              <a key={subject.id} className={`list-group-item d-flex align-items-center ${activeSubject && activeSubject.name === subject.name ? "active" : ""}`} data-value={subject.id} onClick={handleClickFilter}>
                <span className="text-primary fa fa-circle mr-2" />
                {subject.name}
                {/* <span className="small ml-auto">{count && count.is_must_reply > 0 && count.is_must_reply}</span> */}
              </a>
            );
          })}
        </Wrapper>
      )}
    </>
  );
};

export default React.memo(WorkInProgressSidbarSubjects);
