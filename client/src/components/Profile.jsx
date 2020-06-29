import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      appointments: [],
    };
  }

  async componentDidMount() {
    const resp = await axios.get(
      `/api/appointments/${this.props.user.user.username}`
    );
    this.setState({ appointments: resp.data });
  }

  handleDelete = async (appointment) => {
    try {
      console.log();
      const resp = await axios.delete(`/api/appointments/${appointment._id}`, {
        headers: {
          auth_token: localStorage.getItem("auth_token"),
        },
      });

      const remainingAppointments = this.state.appointments.filter(
        (appointment) => appointment._id !== resp.data._id
      );

      this.setState({ appointments: remainingAppointments });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div>
        {this.state.appointments.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <h3> My Reservations</h3>
            </div>
            Task
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Date</th>
                  <th scope="col">With</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {this.state.appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.appointment_time}:00 hrs`}</td>
                    <td>
                      {moment(appointment.appointment_date).format(
                        "DD-MM-YYYY"
                      )}
                    </td>
                    <td>{appointment.name}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => this.handleDelete(appointment)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }
}

export default Profile;
