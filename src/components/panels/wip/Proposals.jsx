import React from "react";
import styled from "styled-components";
import ProposalItem from "./ProposalItem";

const Wrapper = styled.div`
  padding: 20px;
  background: #f1f2f7;
  border-radius: 6px;
  width: 100%;
  max-height: 520px;
  overflow: auto;
`;

const Proposals = (props) => {
  const { items, fromModal = false } = props;
  return (
    <Wrapper>
      <div className="row">
        {items.map((item) => {
          return (
            <ProposalItem
              fromModal={fromModal}
              isLink={item.link_versions.length > 0}
              item={item.link_versions.length ? item.link_versions[item.link_versions.length - 1] : item.file_versions[item.file_versions.length - 1]}
              parentId={item.id}
              key={item.id}
              className="col-xl-3 col-lg-4 col-md-6 mb-2"
            />
          );
        })}
      </div>
    </Wrapper>
  );
};

export default Proposals;
