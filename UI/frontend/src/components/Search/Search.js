import React, { useState, useEffect } from "react";
import base64url from "base64url";
import "../../App.css";
import axios from "axios";
import Extension from "./Extension";
import Navbar from "../NavBar/Navbar";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const Search = () => {
  const [url, setUrl] = useState("");
  const [b64url, setB64Url] = useState("");
  const [result, setResult] = useState("");
  const [resultML, setResultML] = useState("");
  const getStatus = async () => {
    if (url == "") {
      emptyURL()
    }
    else{
    console.log(url);
    const safe =  base64url(url);
     //setB64Url(safe);
    await axios
      .get(
        `https://q7zcjspceh.execute-api.us-west-1.amazonaws.com/api/v1/detect/${safe}=`,
        config
      )
      .then((res) => {
        console.log(res.data);
        setResult(res.data.malicious);
      });

    console.log({ result });

    await axios
      .get(
        `https://q7zcjspceh.execute-api.us-west-1.amazonaws.com/api/v2/detect/url/ml/${safe}`,
        config
      )
      .then((res) => {
        console.log(res.data);
        setResultML(res.data.malicious);
      });
    }
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios.defaults.headers.common = {
    "x-api-key": "ZJLagjCjLC8jSOCRKP2OS5Nm7bSiMeYc1Lw1bl4o",
  };

  // const getAPI = (b64url) => {
  //   axios
  //     .get(
  //       `https://q7zcjspceh.execute-api.us-west-1.amazonaws.com/api/v1/detect/${b64url}`,
  //       config
  //     )
  //     .then((res) => {
  //       console.log(res.data, " For ML");
  //       setResult(res.data.malicious);
  //       return res.data;
  //     });
  // };

  const renderComponentML = (result) => {
    if (result === false) {
      return (
        <h1 className="header-search">
          URL is Safe by running ML{" "}
        </h1>
      );
    } else if (result === true) {
      return <h1 className="header-search">URL is Malicious by running ML </h1>;
    }
  };

  const renderComponent = (result) => {
    if (result === false) {
      return <h1 className="header-search">URL is Safe </h1>;
    } else if (result === true) {
      return <h1 className="header-search">URL is Malicious </h1>;
    }
  };

  const emptyURL = () => {
    if (url == "") {
    return <h1 className="header-search">Please add URL in the text box </h1>;
  }
}

  useEffect(() => {
    console.log(String(result));
  }, [result]);

  return (
    <div className="search-page">
      <Navbar />
      <h1 className="header-search">Check URL</h1>
      <div className="search-box">
        <input
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          className="search-input"
          type="text"
          placeholder="Search something.."
        />
        <button className="search-btn" onClick={getStatus}>
          <i className="fas fa-search"></i>
        </button>
      </div>
      {emptyURL()}
      {renderComponent(result)}
      {renderComponentML(resultML)}
      <Extension />
    </div>
  );
};

export default Search;
