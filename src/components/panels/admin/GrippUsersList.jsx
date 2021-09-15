import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import GrippUser from "./GrippUser";
import { useTranslationActions, useToaster } from "../../hooks";
import { SearchForm } from "../../forms";
import { CustomInput } from "reactstrap";
import { getArchivedUsers, activateUser, deactivateUser } from "../../../redux/actions/userAction";
import { addToModals } from "../../../redux/actions/globalActions";

const Search = styled(SearchForm)`
  width: 50%;
  margin-bottom: 1rem;
  min-width: 250px;
`;

const GrippUsersList = (props) => {
  const toaster = useToaster();
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const dictionary = {
    showInactiveMembers: _t("PEOPLE.SHOW_INACTIVE_MEMBERS", "Show inactive members"),
    activateUser: _t("PEOPLE.ACTIVATE_USER", "Activate user"),
    deactivateUser: _t("PEOPLE.DEACTIVATE_USER", "Deactivate user"),
    deactivateConfirmationText: _t(
      "PEOPLE.DEACTIVATE_CONFIRMATION_TEXT",
      "Are you sure you want to deactivate this user? This means this user can't log in anymore. If you want to remove him also from all chats and workspaces please use archive this user."
    ),
    activateConfirmationText: _t("PEOPLE.ACTIVATE_CONFIRMATION_TEXT", "Are you sure you want to activate this user? This means this user can log in again and see chats and workspaces."),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
  };
  const users = useSelector((state) => state.users.users);
  const archivedUsers = useSelector((state) => state.users.archivedUsers);

  const searchRef = useRef(null);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const handleShowInactiveToggle = () => {
    setShowInactive(!showInactive);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleEmptySearch = () => {
    setSearch("");
  };

  useEffect(() => {
    if (archivedUsers.length === 0) {
      dispatch(getArchivedUsers());
    }
  }, []);

  const grippUsers = Object.values(users)
    .filter((u) => {
      if (u.import_from === "gripp" && u.active === 1) {
        if (search !== "") {
          if (u.name.toLowerCase().search(search.toLowerCase()) !== -1 || u.email.toLowerCase().search(search.toLowerCase()) !== -1 || (u.role && u.role.name.toLowerCase().search(search.toLowerCase()) !== -1)) return true;
          else return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  const inactiveGrippUsers = archivedUsers
    .filter((u) => {
      if (u.import_from === "gripp" && u.active === 0) {
        if (search !== "") {
          if (u.name.toLowerCase().search(search.toLowerCase()) !== -1 || u.email.toLowerCase().search(search.toLowerCase()) !== -1 || (u.role && u.role.name.toLowerCase().search(search.toLowerCase()) !== -1)) return true;
          else return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  const handleActivateUser = (user) => {
    const handleSubmit = () => {
      if (user.active) {
        dispatch(
          deactivateUser({ user_id: user.id }, (err, res) => {
            if (err) return;
            toaster.success(`${user.name} deactivated.`);
          })
        );
      } else if (user.active === 0) {
        dispatch(
          activateUser({ user_id: user.id }, (err, res) => {
            if (err) return;
            toaster.success(`${user.name} activated.`);
          })
        );
      }
    };

    let confirmModal = {
      type: "confirmation",
      headerText: user.active ? dictionary.deactivateUser : dictionary.activateUser,
      submitText: user.active ? dictionary.deactivateUser : dictionary.activateUser,
      cancelText: dictionary.cancel,
      bodyText: user.active ? dictionary.deactivateConfirmationText : dictionary.activateConfirmationText,
      actions: {
        onSubmit: handleSubmit,
      },
    };
    dispatch(addToModals(confirmModal));
  };

  return (
    <>
      <div className="people-header">
        <div className="d-flex align-items-center people-search">
          <Search ref={searchRef} value={search} closeButton="true" onClickEmpty={handleEmptySearch} placeholder={dictionary.searchPeoplePlaceholder} onChange={handleSearchChange} autoFocus />
          <CustomInput
            className="ml-2 mb-3 cursor-pointer text-muted cursor-pointer"
            checked={showInactive}
            id="show_inactive"
            name="show_inactive"
            type="switch"
            onChange={handleShowInactiveToggle}
            data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
            label={<span>{dictionary.showInactiveMembers}</span>}
          />
        </div>
      </div>

      <div className="row">
        {grippUsers.length > 0 &&
          showInactive === false &&
          grippUsers.map((user) => {
            return <GrippUser user={user} key={user.id} dictionary={dictionary} onActivateDeactivateUser={handleActivateUser} />;
          })}
        {inactiveGrippUsers.length > 0 &&
          showInactive === true &&
          inactiveGrippUsers.map((user) => {
            return <GrippUser user={user} key={user.id} dictionary={dictionary} onActivateDeactivateUser={handleActivateUser} />;
          })}
      </div>
    </>
  );
};

export default GrippUsersList;
