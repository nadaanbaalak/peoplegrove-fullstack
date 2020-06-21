import React, { Component } from "react";

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("auth_token");
    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
