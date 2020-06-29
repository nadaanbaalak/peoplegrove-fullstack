import React, { Component } from "react";
import _ from "lodash";
import axios from "axios";
import "./styles/Reservation.css";

class Reservation extends Component {
  constructor() {
    super();
    this.state = {
      appointment: {
        appointment_date: "",
        appointment_time: "",
      },
      isUser: true,
      timezone: "",
      errors: {},
    };
  }
  async componentDidMount() {
    const username = this.props.match.params.username;
    const user = await axios.get(`/api/users/${username}`);
    if (user.data.length === 0) this.setState({ isUser: false });
    else this.setState({ timezone: user.data[0].timezone });
  }
  validate = () => {
    const errors = {};

    const { appointment } = this.state;

    if (appointment.appointment_date === "")
      errors.appointment_date = "Date is required";
    if (appointment.appointment_time === "")
      errors.appointment_time = "Please select a Time slot";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { appointment } = this.state;

    const post_body = {
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
    };

    try {
      await axios.post(
        `/api/appointments/${this.props.match.params.username}`,
        post_body,
        {
          headers: {
            auth_token: localStorage.getItem("auth_token") || "",
          },
        }
      );

      this.props.history.push("/");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = err.response.data;
        this.setState({ errors });
      }
      console.log(this.state.errors);
    }
  };

  handleChange = (e) => {
    const { appointment } = this.state;
    appointment[e.target.name] = e.target.value;
    console.log(appointment);
    this.setState({ appointment });
  };

  render() {
    const { appointment_date } = this.state.appointment;
    const { errors, isUser } = this.state;

    return (
      <div>
        {!isUser ? (
          <h1>No Such User</h1>
        ) : (
          <>
            <h1>{`Reservation @${this.props.match.params.username}`}</h1>
            <p>{`Timezone: ${this.state.timezone}`}</p>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="appointment_date">Reservation Date</label>
                <input
                  value={appointment_date}
                  onChange={this.handleChange}
                  name="appointment_date"
                  id="appointment_date"
                  type="date"
                  className="form-control"
                  min={new Date()}
                />
                {errors.appointment_date && (
                  <div className="alert alert-danger">
                    {errors.appointment_date}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="appointment_time">Time Slot</label>
                <div className="timeslots">
                  {_.range(0, 24).map((ele) => {
                    return (
                      <label className="timeslot" key={ele}>
                        <input
                          type="radio"
                          name="appointment_time"
                          id={ele}
                          autoComplete="off"
                          value={ele}
                          onClick={(e) => this.handleChange(e)}
                          className="slot-radiobutton"
                        />
                        {` ${ele}:00 hrs `}
                      </label>
                    );
                  })}
                </div>

                <div className="form-group">
                  {errors.appointment_time && (
                    <div className="alert alert-danger">
                      {errors.appointment_time}
                    </div>
                  )}
                </div>
              </div>

              <button disabled={this.validate()} className="btn btn-primary">
                Confirm
              </button>
            </form>
          </>
        )}
      </div>
    );
  }
}

export default Reservation;
