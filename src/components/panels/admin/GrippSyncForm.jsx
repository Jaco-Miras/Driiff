import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Input } from "reactstrap";
import { CheckBox } from "../../forms";
import { useAdminActions, useTranslationActions, useToaster } from "../../hooks";
import { getUsers } from "../../../redux/actions/userAction";
import { TooltipInfo } from "../../common";

const SyncFormContainer = styled.div``;

const LabelInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  label {
    margin: 0 !important;
  }
`;

const GrippSyncForm = (props) => {
  const dispatch = useDispatch();
  const toaster = useToaster();
  const { _t } = useTranslationActions();
  const dictionary = {
    grippToken: _t("GRIPP.TOKEN", "Gripp token"),
    additionalAttributes: _t("GRIPP.ADDITIONAL_ATTRIBUTES", "Additional attributes"),
    checkAll: _t("GRIPP.CHECK_ALL", "Check all"),
    functionDesignation: _t("GRIPP.DESIGNATION", "Function (Designation)"),
    contact: _t("GRIPP.CONTACT", " Phone / Mobile number (Contact)"),
    address: _t("GRIPP.ADDRESS", "Street (Address)"),
    streetNumber: _t("GRIPP.STREET_NUMBER", "Street number (House number)"),
    zipCode: _t("GRIPP.ZIP_CODE", "Zip code (Zip code)"),
    city: _t("GRIPP.CITY", "Place (City)"),
    country: _t("GRIPP.COUNTRY", "Country (Country)"),
    birthDate: _t("GRIPP.BIRTH_DATE", "Date of birth (Birth date)"),
    profileImage: _t("GRIPP.PROFILE_IMAGE", "User Photo (Profile image)"),
    startSyncUsers: _t("GRIPP.START_SYNC_USERS", "Start sync users"),
    successSyc: _t("GRIPP.SYNC_SUCCESS", "Successfully sync gripp users!"),
    defaultImport: _t("GRIPP.DEFAULT_IMPORT", "The default attribute to import"),
    email: _t("EMAIL", "Email"),
    firstName: _t("FIRST_NAME", "First name"),
    lastName: _t("LAST_NAME", "Last name"),
    grippTokenPlaceholder: _t("PLACEHOLDER.GRIPP_TOKEN", "Paste gripp token here"),
    grippTokenInfo: _t("GRIPP.TOKEN_INFO", "Token from gripp"),
  };
  const { syncGrippUsers, fetchGrippBot } = useAdminActions();
  const [loading, setLoading] = useState(false);
  const [tokenValue, setTokenValue] = useState("");
  const [checkAll, setCheckAll] = useState(false);
  const [form, setForm] = useState({
    designation: false,
    contact: false,
    address: false,
    house_number: false,
    zip_code: false,
    city: false,
    country: false,
    birth_date: false,
    profile_image: false,
  });

  const handleInputChange = (e) => {
    setTokenValue(e.target.value);
  };

  const toggleCheckAll = () => {
    if (!checkAll) {
      setForm(
        Object.keys(form).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
    setCheckAll((prevState) => !prevState);
  };

  const toggleCheck = (e) => {
    const name = e.target.dataset.name;
    setForm((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handleSyncUser = () => {
    const payload = {
      ...form,
      sync_should_run: "everyday",
      gripp_token: tokenValue,
    };
    setLoading(true);
    syncGrippUsers(payload, (err, res) => {
      setLoading(false);
      if (err) return;
      toaster.success(dictionary.successSyc);
      dispatch(getUsers());
      fetchGrippBot({});
    });
  };

  return (
    <SyncFormContainer>
      <div className="mb-3">
        <LabelInfoWrapper>
          <label>{dictionary.grippToken}</label> <TooltipInfo content={dictionary.grippTokenInfo} />
        </LabelInfoWrapper>

        <Input value={tokenValue} onChange={handleInputChange} placeholder={dictionary.grippTokenPlaceholder} />
      </div>
      <div className="mb-3">
        <label>
          {dictionary.defaultImport} <strong>{dictionary.email}</strong>, <strong>{dictionary.firstName}</strong>, <strong>{dictionary.lastName}</strong>
        </label>
      </div>
      <div className="mb-3">
        <h3>{dictionary.additionalAttributes}</h3>
      </div>
      <div className="mb-3">
        <CheckBox name="check_all" checked={checkAll} onClick={toggleCheckAll}>
          {dictionary.checkAll}
        </CheckBox>
      </div>
      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <CheckBox name="designation" checked={form.designation} onClick={toggleCheck}>
            {dictionary.functionDesignation}
          </CheckBox>
          <CheckBox name="contact" checked={form.contact} onClick={toggleCheck}>
            {dictionary.contact}
          </CheckBox>
          <CheckBox name="address" checked={form.address} onClick={toggleCheck}>
            {dictionary.address}
          </CheckBox>
          <CheckBox name="house_number" checked={form.house_number} onClick={toggleCheck}>
            {dictionary.streetNumber}
          </CheckBox>
          <CheckBox name="zip_code" checked={form.zip_code} onClick={toggleCheck}>
            {dictionary.zipCode}
          </CheckBox>
        </div>
        <div className="col-12 col-md-6">
          <CheckBox name="city" checked={form.city} onClick={toggleCheck}>
            {dictionary.city}
          </CheckBox>
          <CheckBox name="country" checked={form.country} onClick={toggleCheck}>
            {dictionary.country}
          </CheckBox>
          <CheckBox name="birth_date" checked={form.birth_date} onClick={toggleCheck}>
            {dictionary.birthDate}
          </CheckBox>
          <CheckBox name="profile_image" checked={form.profile_image} onClick={toggleCheck}>
            {dictionary.profileImage}
          </CheckBox>
        </div>
      </div>
      <div>
        <button className="btn btn-primary" onClick={handleSyncUser} disabled={tokenValue.trim() === "" || loading}>
          {dictionary.startSyncUsers}
        </button>
      </div>
    </SyncFormContainer>
  );
};

export default GrippSyncForm;
