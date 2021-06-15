import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CheckBox } from "../../forms";
import { SvgIconFeather } from "../../common";
import { useTranslation } from "../../hooks";

const Wrapper = styled.div`
  .input-group {
    width: 100%;
    display: flex;
    justify-content: center;
    .input-wrap {
      width: 90%;
      position: relative;
      input {
        ${"" /* border-top-right-radius: 0;
        border-bottom-right-radius: 0; */}
      }
      .btn-cross {
        position: absolute;
        top: 0;
        right: 0;
        border: 0;
        background: transparent;
        padding: 0;
        height: 100%;
        width: 36px;
        border-radius: 4px;
        z-index: 9;
        svg {
          width: 16px;
          color: #495057;
        }
      }
    }
  }
`;

const CloseIcon = styled(SvgIconFeather)`
  stroke-width: 2px;
`;

const InputWrapper = styled.div``;

const MoreOption = styled.div`
  margin-bottom: 5px;
  @media all and (max-width: 480px) {
    margin-top: 40px;
  }
`;

const FilterLists = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  label {
    margin: 0;
  }
  .custom-control {
    min-height: 1rem;
  }
`;

const CheckBoxGroup = styled.div`
  overflow: hidden;
  transition: all 0.3s ease !important;
  width: 100%;

  &.enter-active {
    max-height: ${(props) => props.maxHeight}px;
    overflow: visible;
  }

  &.leave-active {
    max-height: 0;
  }

  label {
    min-width: auto;
    font-size: 12.6px;

    &:hover {
      color: #972c86;
    }
  }
`;

const WorkspaceSearch = (props) => {
  const { actions, search } = props;
  const { value, searching, filterBy, filters } = search;
  const [inputValue, setInputValue] = useState(value);
  const [filter_by, setFilterBy] = useState(filterBy);
  const [filter, setFilter] = useState(filters);

  const handleEnter = (e) => {
    if (e.key === "Enter" && !searching) {
      handleSearch();
    }
  };

  const handleSearch = () => {
    actions.search(
      {
        search: inputValue,
        skip: 0,
        limit: 25,
        filter_by: filter_by,
      },
      (err, res) => {
        if (err) {
          actions.updateSearch({
            ...search,
            searching: false,
          });
        } else {
          actions.updateSearch({
            ...search,
            value: inputValue,
            filter_by: filter_by,
            searching: false,
            count: res.data.total_count,
            results: res.data.workspaces,
            maxPage: Math.ceil(res.data.total_count / 25),
            page: 1,
          });
        }
      }
    );
    actions.updateSearch({
      // ...search,
      results: [],
      value: inputValue,
      filter_by: filter_by,
      searching: true,
    });
  };

  const handleClearSearch = () => {
    actions.updateSearch({
      results: [],
      searching: true,
      value: "",
      filter_by: "",
      page: 1,
      maxPage: 1,
      count: 0,
    });
    actions.search(
      {
        search: "",
        skip: 0,
        limit: 25,
        filter_by: "",
      },
      (err, res) => {
        if (err) {
          actions.updateSearch({
            ...search,
            searching: false,
            value: "",
            filter_by: "",
          });
        } else {
          actions.updateSearch({
            ...search,
            value: "",
            filter_by: "",
            searching: false,
            count: res.data.total_count,
            results: res.data.workspaces,
            maxPage: Math.ceil(res.data.total_count / 25),
          });
        }
      }
    );
    setInputValue("");
  };

  const handleSearchChange = (e) => {
    if (e.target.value.trim() === "" && value !== "") {
      handleClearSearch();
    } else {
      setInputValue(e.target.value);
    }
  };

  const handleFilter = (filtersPrevState, name) => {
    setFilterBy((prevState) => (!filtersPrevState[name].checked ? name : ""));
    filtersPrevState[name].checked = !filtersPrevState[name].checked;
    const filterState = Object.values(filtersPrevState).reduce((accumulator, current) => {
      if (name !== current.key) {
        current.checked = false;
        accumulator[current.key] = { ...current };
      }
      return accumulator;
    }, {});

    return {
      ...filtersPrevState,
      ...filterState,
    };
  };

  const toggleCheckFilter = (e) => {
    const name = e.target.dataset.name;
    setFilter((prevState) => handleFilter(prevState, name));
  };

  useEffect(() => {
    if (
      (Object.values(filter)
        .map((sf) => sf.checked)
        .includes(true) &&
        !searching) ||
      !!value
    ) {
      actions.updateSearch(
        {
          results: [],
          value: inputValue,
          filter_by: filter_by,
          searching: true,
        },
        () => {
          handleSearch();
        }
      );
    } else {
      handleClearSearch();
    }
  }, [filter_by]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const { _t } = useTranslation();

  const dictionary = {
    searchWorkspaceSearchPlaceholder: _t("PLACEHOLDER.SEARCH_WORKSPACE", "Search by workspace name or description"),
    searchWorkspaceSearchTitle: _t("PLACEHOLDER.SEARCH_WORKSPACE_TITLE", "Search workspace"),
    filters: _t("PLACEHOLDER.SEARCH_WORKSPACE_FILTER", "Filters", "Filters"),
    private: _t("WORKSPACE.PRIVATE", "Private"),
    archived: _t("WORKSPACE.ARCHIVED", "Archived"),
    nonMember: _t("WORKSPACE.NON_MEMBER", "Non Member"),
    new: _t("WORKSPACE.NEW", "New"),
    external: _t("WORKSPACE.EXTERNAL", "External"),
  };

  return (
    <Wrapper className="card p-t-b-40" data-backround-image="assets/media/image/image1.jpg">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <h2 className="mb-4 text-center">{dictionary.searchWorkspaceSearchTitle}</h2>
          <div className="input-group">
            <InputWrapper className="input-wrap">
              <input onChange={handleSearchChange} onKeyDown={handleEnter} type="text" className="form-control" placeholder={dictionary.searchWorkspaceSearchPlaceholder} aria-describedby="button-addon1" autoFocus value={inputValue} />
              {inputValue.trim() !== "" && (
                <button className="btn-cross" type="button" onClick={handleClearSearch}>
                  <CloseIcon icon="x" />
                </button>
              )}
            </InputWrapper>
            <div className="input-group-append">
              <button className="btn btn-outline-light" type="button" onClick={handleSearch}>
                <SvgIconFeather icon="search" />
              </button>
            </div>
          </div>

          <CheckBoxGroup className={"enter-active"}>
            <div className="row d-flex justify-content-center my-3">
              <MoreOption className="px-3">
                <SvgIconFeather icon="sliders" />
              </MoreOption>
              <FilterLists className="d-flex">
                {Object.values(filter).map((sf) => {
                  return (
                    <li className="d-flex align-items-center mr-2" key={sf.key}>
                      <span className="custom-control custom-checkbox custom-checkbox-success">
                        <CheckBox name={sf.key} checked={sf.checked} type="danger" onClick={toggleCheckFilter} />
                      </span>
                      <span>{dictionary[sf.key]}</span>
                    </li>
                  );
                })}
              </FilterLists>
            </div>
          </CheckBoxGroup>
        </div>
      </div>
    </Wrapper>
  );
};

export default WorkspaceSearch;
