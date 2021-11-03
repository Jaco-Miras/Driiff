import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions, useToaster } from "../../hooks";
import { Input } from "reactstrap";
import { validURL } from "../../../helpers/urlContentHelper";

const Wrapper = styled.div`
  padding: 1rem;
  > div {
    margin-bottom: 1rem;
  }
  table {
    width: 100%;
    border-spacing: 1rem;
    th,
    td {
      padding: 5px 15px;
    }
  }
  col.col1 {
    width: 20%;
  }
  col.col2 {
    width: 50%;
  }
`;

const LoginSettingsBody = () => {
  const { _t } = useTranslationActions();
  const toast = useToaster();

  const dictionary = {
    quickLinks: _t("ADMIN.QUICK_LINKS_SETTINGS", "Quick links settings"),
    saveQuickLinks: _t("ADMIN.SAVE_QUICK_LINKS", "Save quick links"),
    quickLinksUpdated: _t("ADMIN.QUICK_LINKS_UPDATED", "Quick links updated"),
    menuName: _t("ADMIN.MENU_NAME", "Menu name"),
    link: _t("ADMIN.LINK", "Link"),
  };

  const componentIsMounted = useRef(true);

  const links = useSelector((state) => state.global.links);
  const linksFetched = useSelector((state) => state.global.linksFetched);
  const filters = useSelector((state) => state.admin.filters);

  const { setAdminFilter, updateQuickLinks, createQuickLinks } = useAdminActions();

  const [inputs, setInputs] = useState(
    linksFetched && links.length
      ? Array.from(links)
      : Array.from(Array(10), () => {
          return { id: null, menu_name: "", link: "" };
        })
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, quick_links: true } });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setInputs([...links, ...inputs].slice(0, 10));
  }, [links]);

  const handleSubmit = () => {
    setSaving(true);
    let payload = {
      quick_links: inputs
        .filter((l) => l.id !== null)
        .map((l) => {
          if (l.menu_name.trim() !== "" && l.link.trim() !== "") {
            return l;
          } else {
            return { ...l, menu_name: "", link: "" };
          }
        }),
    };
    updateQuickLinks(payload, (err, res) => {
      if (componentIsMounted.current) setSaving(false);
      if (err) return;
      toast.success(dictionary.quickLinksUpdated);
    });
    const newQuickLinks = inputs.filter((i) => i.id === null);
    if (newQuickLinks.length) {
      const newPayload = {
        quick_links: inputs
          .filter((i) => i.id === null)
          .map((i) => {
            return {
              menu_name: i.menu_name,
              link: i.link,
            };
          }),
      };
      createQuickLinks(newPayload);
    }
  };

  const handleNameChange = (e, i) => {
    const newInputs = [...inputs];
    newInputs[i].menu_name = e.target.value;
    setInputs(newInputs);
  };

  const handleLinkChange = (e, i) => {
    const newInputs = [...inputs];
    newInputs[i].link = e.target.value;
    setInputs(newInputs);
  };

  const haveInvalidUrl = () => {
    return inputs.filter((i) => i.link.trim() !== "").some((i) => validURL(i.link) === false);
  };

  const haveEmptyName = () => {
    return inputs.some((i) => i.menu_name.trim() === "" && i.link.trim() !== "");
  };

  const haveEmptyLink = () => {
    return inputs.some((i) => i.menu_name.trim() !== "" && i.link.trim() === "");
  };

  const disableSave = () => {
    if (saving) {
      return true;
    } else if (!linksFetched) {
      return true;
    } else if (haveInvalidUrl()) {
      return true;
    } else if (haveEmptyName()) {
      return true;
    } else if (haveEmptyLink()) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Wrapper>
      <h4 className="mb-3">{dictionary.quickLinks}</h4>
      <div>
        <table>
          <colgroup>
            <col className="col1" />
            <col className="col2" />
          </colgroup>
          <thead>
            <tr>
              <th>{dictionary.menuName}</th>
              <th>{dictionary.link}</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input, i) => {
              return (
                <tr key={i}>
                  <td>
                    <Input className="w-100" value={input.menu_name} onChange={(e) => handleNameChange(e, i)} disabled={saving || !linksFetched} type="url" />
                  </td>
                  <td>
                    <Input className="w-100" value={input.link} onChange={(e) => handleLinkChange(e, i)} disabled={saving || !linksFetched} type="url" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={disableSave()}>
          {dictionary.saveQuickLinks}
        </button>
      </div>
    </Wrapper>
  );
};

export default LoginSettingsBody;
