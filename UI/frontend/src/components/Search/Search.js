import React, { useState, useEffect } from "react";
import base64url from "base64url";
import "../../App.css";
import axios from "axios";
const Search = () => {
  const [url, setUrl] = useState("");
  const [b64url, setB64Url] = useState("");
  const [result, setResult] = useState("");
  const getStatus = () => {
    console.log(url);
    const safe = base64url(url);
    setB64Url(safe);
     getAPI(b64url);
    console.log( {result})
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios.defaults.headers.common = {
    "x-api-key": "ZJLagjCjLC8jSOCRKP2OS5Nm7bSiMeYc1Lw1bl4o",
  };

  const getAPI = (b64url) => {
    axios
      .get(
        `https://q7zcjspceh.execute-api.us-west-1.amazonaws.com/api/v1/detect/${b64url}`,
        config
      )
      .then((res) => {
        console.log(res.data);
        setResult(res.data.malicious)
        return res.data;
      });
  };  

  useEffect(() => {
    getAPI()
  },[result])

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
      {result != "" ?  <h1 className="header-search">URL is Safe </h1> : <h1 className="header-search">URL is Malicious</h1>}
    </div>
  );
};

export default Search;
