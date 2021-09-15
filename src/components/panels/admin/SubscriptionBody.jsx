import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  padding: 1rem;
  > div {
    margin-bottom: 1rem;
  }
`;

const CardHeader = styled.div`
  padding: 1rem;
  text-align: center;
  background: #3f034a;
  color: #fff;
  border: 1px solid #3f034a;
  border-radius: 8px 8px 0 0;
  min-height: 120px;
`;

const CardPricing = styled.div`
  padding: 1rem;
  background: #f1f2f7;
  color: #3f034a;
  text-align: center;
  border: 1px solid #e6e6e6;
  border-radius: 0;
  min-height: 130px;
  &.enterprise-pricing {
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
      font-weight: 700;
    }
  }
  .euro {
    font-size: 2rem;
    font-weight: 700;
    vertical-align: top;
    line-height: 2.3;
  }
  .price {
    font-size: 4rem;
    font-weight: 700;
  }
  .per-month {
    display: inline-block;
    vertical-align: super;
    line-height: 1;
    span:first-child {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }
    span {
      display: block;
    }
  }
`;

const CardFeatures = styled.div`
  padding: 1rem;
  border: 1px solid #e6e6e6;
  border-top: none;
  border-bottom: none;
  min-height: 575px;
  label {
    text-align: center;
    font-style: italic;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    padding: 0.7rem 0;
    border-top: 1px solid #e6e6e6;
  }
  .feather-check {
    color: #00c851;
    margin-right: 12px;
    height: 18px;
    width: 18px;
  }
  &.basic-feat li,
  &.pro-feat li:nth-child(-n + 2),
  &.enterprise-feat li:nth-child(1) {
    font-weight: bold;
  }
`;

const CardFooter = styled.div`
  padding: 0 1rem 1rem 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 0 0 8px 8px;
  border-top: 0;
  button.btn-primary {
    width: 100%;
    text-align: center;
    justify-content: center;
    border-radius: 20px;
  }
`;

const SubscriptionBody = () => {
  const { _t } = useTranslationActions();

  const { setAdminFilter, stripeCheckout } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    subscriptionLabel: _t("ADMIN.SUBSCRIPTION_LABEL", "Subscription"),
  };

  const filters = useSelector((state) => state.admin.filters);

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, subscription: true } });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const [loading, setLoading] = useState(false);

  //   {
  //     "success_url": "https://getdriff.com/get-started/",
  //     "cancel_url": "https://getdriff.com/pricing/",
  //     "payment_method_types": ["card"],
  //     "mode": "subscription",
  //     "line_items": [
  //         {
  //             "price": "price_1JDRQXLoW9ieUi2mdBJP8Wkp",
  //             "quantity": 1
  //         }
  //     ]
  // }

  const handleSubscribe = (type) => {
    if (loading) return;
    const standardPriceId = process.env.REACT_APP_STANDARD_PRICE_ID;
    const proPriceId = process.env.REACT_APP_PRO_PRICE_ID;
    const payload = {
      success_url: "https://demo24.drevv.com/admin-settings/subscription",
      cancel_url: "https://demo24.drevv.com/admin-settings/subscription",
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: type === "standard" ? standardPriceId : type === "pro" ? proPriceId : null,
          quantity: 3,
        },
      ],
    };
    setLoading(true);
    stripeCheckout(payload, (err, res) => {
      setLoading(false);
      if (err) return;
      window.location = res.data.url;
    });
  };

  return (
    <Wrapper>
      <h4 className="mb-3">{dictionary.subscriptionLabel}</h4>
      <div className="row">
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-wrapper">
              <CardHeader>
                <h3>Standard</h3>
                <span>For professionals with basic needs</span>
              </CardHeader>
              <CardPricing>
                <span className="euro">€</span>
                <span className="price">49</span>
                <span className="per-month">
                  <span>,00</span>
                  <span>/MO</span>
                </span>
              </CardPricing>
              <CardFeatures className="basic-feat">
                <label>Collaborate effectively with anyone inside or outside your team or company</label>
                <ul>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Workspaces
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Realtime chat
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Message board
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    To-do lists
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    File storage
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Email notifications
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Unlimited projects
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Unlimited users
                  </li>
                </ul>
              </CardFeatures>
              <CardFooter>
                <button className="btn btn-primary" onClick={() => handleSubscribe("standard")}>
                  Select
                </button>
              </CardFooter>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-wrapper">
              <CardHeader>
                <h3>Professional</h3>
                <span>All the features of Standard, plus:</span>
              </CardHeader>
              <CardPricing>
                <span className="euro">€</span>
                <span className="price">99</span>
                <span className="per-month">
                  <span>,00</span>
                  <span>/MO</span>
                </span>
              </CardPricing>
              <CardFeatures className="pro-feat">
                <label>Gain access to additional useful features</label>
                <ul>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    ZOOM video meetings
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Automatic translations
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Workspaces
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Realtime chat
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Message board
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    To-do lists
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    File storage
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Email notifications
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Unlimited projects
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Unlimited users
                  </li>
                </ul>
              </CardFeatures>
              <CardFooter>
                <button className="btn btn-primary" onClick={() => handleSubscribe("pro")}>
                  Select
                </button>
              </CardFooter>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card">
            <div className="card-wrapper">
              <CardHeader>
                <h3>Enterprise</h3>
                <span>For your next-level business</span>
              </CardHeader>
              <CardPricing className="enterprise-pricing">
                <h1>Contact us</h1>
              </CardPricing>
              <CardFeatures className="enterprise-feat">
                <label>Spice up your Driff by integrating your favorite software tools.</label>
                <ul>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Custom software integration
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    ZOOM video meetings
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Automatic translations
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Workspaces
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Realtime chat
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Message board
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    To-do lists
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    File storage
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Email notifications
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Unlimited projects
                  </li>
                  <li>
                    <SvgIconFeather icon="check" strokeWidth="3" />
                    Unlimited users
                  </li>
                </ul>
              </CardFeatures>
              <CardFooter>
                <button className="btn btn-primary">Contact us</button>
              </CardFooter>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SubscriptionBody;
