import React, { useState, useEffect } from "react";
import base64url from "base64url";
import "../../App.css";
import axios from "axios";
const Search = () => {
  const [url, setUrl] = useState("");
  const [b64url, setB64Url] = useState("");
  const [result, setResult] = useState("");
  const [resultML, setResultML] = useState("");
  const getStatus = async () => {
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
          URL is Safe by running ML{String(result)}{" "}
        </h1>
      );
    } else if (result === true) {
      return <h1 className="header-search">URL is Malicious </h1>;
    }
  };

  const renderComponent = (result) => {
    if (result === false) {
      return <h1 className="header-search">URL is Safe {String(result)} </h1>;
    } else if (result === true) {
      return <h1 className="header-search">URL is Malicious </h1>;
    }
  };

  useEffect(() => {
    console.log(String(result));
  }, [result]);

  return (
    <div className="search-page">
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
      {renderComponent(result)}
      {renderComponentML(resultML)}
      {/* {result != "" ?  <h1 className="header-search">URL is Safe </h1> : <h1 className="header-search">URL is Malicious</h1>} */}
    </div>
  );
};

export default Search;
