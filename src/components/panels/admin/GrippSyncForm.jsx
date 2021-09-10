import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "reactstrap";
import { CheckBox } from "../../forms";

const SyncFormContainer = styled.div``;

const GrippSyncForm = (props) => {
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
  return (
    <SyncFormContainer>
      <div className="mb-3">
        <label>Gripp token</label>
        <Input value={tokenValue} onChange={handleInputChange} />
      </div>
      <div className="mb-3">
        <label>
          The default attribute to import <strong>EMAIL</strong>, <strong>FIRST NAME</strong>, <strong>LAST NAME</strong>
        </label>
      </div>
      <div className="mb-3">
        <h3>Additional attributes</h3>
      </div>
      <div className="mb-3">
        <CheckBox name="check_all" checked={checkAll} onClick={toggleCheckAll}>
          Check all
        </CheckBox>
      </div>
      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <CheckBox name="designation" checked={form.designation} onClick={toggleCheck}>
            Function (Designation)
          </CheckBox>
          <CheckBox name="contact" checked={form.contact} onClick={toggleCheck}>
            Phone / Mobile number (Contact)
          </CheckBox>
          <CheckBox name="address" checked={form.address} onClick={toggleCheck}>
            Street (Address)
          </CheckBox>
          <CheckBox name="house_number" checked={form.house_number} onClick={toggleCheck}>
            Street Number (House number)
          </CheckBox>
          <CheckBox name="zip_code" checked={form.zip_code} onClick={toggleCheck}>
            Zip code (Zip code)
          </CheckBox>
        </div>
        <div className="col-12 col-md-6">
          <CheckBox name="city" checked={form.city} onClick={toggleCheck}>
            Place (City)
          </CheckBox>
          <CheckBox name="country" checked={form.country} onClick={toggleCheck}>
            Country (Country)
          </CheckBox>
          <CheckBox name="birth_date" checked={form.birth_date} onClick={toggleCheck}>
            Date of birth (Birth date)
          </CheckBox>
          <CheckBox name="profile_image" checked={form.profile_image} onClick={toggleCheck}>
            User Photo (Profile image)
          </CheckBox>
        </div>
      </div>
      <div>
        <button className="btn btn-primary">Start sync user</button>
      </div>
    </SyncFormContainer>
  );
};

export default GrippSyncForm;
