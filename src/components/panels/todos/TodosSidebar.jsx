import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
`;

const TodosSidebar = (props) => {
  const {
    className = ""
  } = props;

  return (
    <Wrapper className={`todo-sidebar bottom-modal-mobile ${className}`}>
      <div className="card">
        <div className="card-body">
          Todo Sidebar
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(TodosSidebar);
