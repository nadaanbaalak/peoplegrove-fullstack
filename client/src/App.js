import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Reservation from "./components/Reservation";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  state = {};

  async componentDidMount() {
    try {
      const jwt = localStorage.getItem("auth_token");
      const user = jwtDecode(jwt);
      this.setState({ user });
    } catch (err) {}
  }

  render() {
    return (
      <div>
        <Navbar user={this.state.user} />
        <div className="container">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/signup" component={SignUp} />
            <Route
              path="/profile"
              exact
              render={(props) => {
                if (!this.state.user) return <Redirect to="/login" />;
                return <Profile {...props} user={this.state} />;
              }}
            />
            <Route path="/users/:username" exact component={Reservation} />
            <Route path="/not-found" component={NotFound} />
            <Route
              path="/"
              exact
              render={(props) => <Home {...props} loggedIn={this.state} />}
            />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
