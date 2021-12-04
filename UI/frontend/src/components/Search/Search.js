import React, { useState, useEffect } from "react";
import base64url from "base64url";
import "../../App.css";
import axios from "axios";
import Extension from "./Extension";
import Navbar from "../NavBar/Navbar";
import Heuristics from "./heuristics";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const Search = () => {
  const [url, setUrl] = useState("");
  const [b64url, setB64Url] = useState("");
  const [result, setResult] = useState(undefined);
  const [resultML, setResultML] = useState(undefined);
  const [resultBA, setResultBA] = useState(undefined);
  const getStatus = async () => {
    if (url == "") {
      emptyURL()
    }
    else{
    console.log(url);
    const safe = base64url(url);
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

    setResultBA(!!Heuristics.checkForBasicAuth(url)["basicAuth"]);
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
        <li className="header-search">
          URL deemed safe by AI
        </li>
      );
    } else if (result === true) {
      return (
          <li className="header-search">
            <span class="text-danger">URL classified as phishing by AI</span>
          </li>
      );
    }
  };

  const renderComponent = (result) => {
    if (result === false) {
      return <li className="header-search">URL is not a known phishing site</li>;
    } else if (result === true) {
      return (
            <li className="header-search">
                <span class="text-danger">URL is a known phishing site</span>
            </li>
        );
    }
  };

  const renderComponentBA = (result) => {
      if (result === false) {
          return <li className="header-search">URL does not use basic authentication</li>;
      } else if (result === true) {
          return (
              <li className="header-search">
                <span class="text-warning">URL uses basic authentication</span>
              </li>
          );
      }
  }

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
      <h1 className="header-search">Phisherman</h1>
      <div>Check a URL for phishing</div>
      <div className="search-box">
        <input
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          className="search-input"
          type="text"
          placeholder="Enter a URL…"
        />
        <button className="search-btn" onClick={getStatus}>
          <i className="fas fa-search"></i>
        </button>
      </div>
      <h2 class={result||resultML ? "text-danger" : "text-success"}>
        {
            () => {
                if (result===undefined || resultML===undefined) {
                    return;
                }
                return result||resultML ?
                    "Phishing detected" :
                    "No phishing detected"
            }
        }
      </h2>
      <div class="text-center">
          <ul>
              {renderComponent(result)}
              {renderComponentML(resultML)}
              {renderComponentBA(resultBA)}
          </ul>
      </div>
      <Extension />
    </div>
  );
};

export default Search;
