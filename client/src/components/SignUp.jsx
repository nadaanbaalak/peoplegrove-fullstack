import React, { Component } from "react";
import axios from "axios";

class Signup extends Component {
  state = {
    account: {
      userEmail: "",
      name: "",
      password: "",
      username: "",
      password2: "",
    },
    errors: {},
  };

  validate = () => {
    const errors = {};

    const { account } = this.state;
    if (account.username.trim() === "")
      errors.username = "Username is required";
    if (account.name.trim() === "") errors.name = "Name is required";
    if (account.userEmail.trim() === "") errors.userEmail = "Email is required";
    if (account.password.trim() === "")
      errors.password = "Password is required";
    if (account.password !== account.password2)
      errors.arePasswordEqual = "Passwords do not match";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { account } = this.state;

    const post_body = {
      email: account.userEmail,
      username: account.username,
      name: account.name,
      password: account.password,
    };

    try {
      await axios.post("/api/users", post_body);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = err.response.data;
        this.setState({ errors });
      }
      console.log(err);
    }
    //console.log("submitted");
  };

  handleChange = (e) => {
    const { account } = this.state;
    account[e.target.name] = e.target.value;
    this.setState({ account });
  };

  render() {
    const {
      userEmail,
      password,
      username,
      password2,
      name,
    } = this.state.account;
    const { errors } = this.state;

    return (
      <div>
        <h1>SignUp</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              autoFocus
              value={username}
              onChange={this.handleChange}
              name="username"
              id="username"
              type="text"
              className="form-control"
            />
            {errors.username && (
              <div className="alert alert-danger">{errors.username}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              autoFocus
              value={name}
              onChange={this.handleChange}
              name="name"
              id="name"
              type="text"
              className="form-control"
            />
            {errors.name && (
              <div className="alert alert-danger">{errors.name}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              autoFocus
              value={userEmail}
              onChange={this.handleChange}
              name="userEmail"
              id="email"
              type="text"
              className="form-control"
            />
            {errors.userEmail && (
              <div className="alert alert-danger">{errors.userEmail}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={this.handleChange}
              name="password"
              id="password"
              type="password"
              className="form-control"
            />
            {errors.password && (
              <div className="alert alert-danger">{errors.password}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password2">Re-Enter Password</label>
            <input
              value={password2}
              onChange={this.handleChange}
              name="password2"
              id="password2"
              type="password"
              className="form-control"
            />
          </div>
          <div className="form-group">
            {errors.arePasswordEqual && (
              <div className="alert alert-danger">
                {errors.arePasswordEqual}
              </div>
            )}
          </div>

          <button disabled={this.validate()} className="btn btn-primary">
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}

export default Signup;
