import React, { Component, Fragment } from "react";
import TextInput from "./form-components/TextInput";
import Alert from "./ui-components/alert";

type AlertState = {
  type: "alert-success" | "alert-danger" | "d-none";
  message: string;
};

interface State {
  email: string;
  password: string;
  error?: string;
  errors: string[];
  alert: AlertState;
}

export class Login extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: [],
      alert: { type: "d-none", message: "" },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event: any) => {
    const { name, value } = event.target;

    this.setState((prevState) => ({ ...prevState, [name]: value }));
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
  };

  hasError(key: string) {
    return this.state.errors.indexOf(key) !== -1;
  }

  render() {
    const { email, password, alert } = this.state;

    return (
      <Fragment>
        <h2>Login</h2>
        <hr />
        <Alert type={alert.type} message={alert.message} />

        <form className="pt-3" onSubmit={this.handleSubmit}>
          <TextInput
            type="email"
            title="Email"
            name="email"
            onChange={this.handleChange}
            hasError={this.hasError("email")}
            errorMessage="Por favor insira um email"
          />
          <TextInput
            type="password"
            title="Password"
            name="password"
            onChange={this.handleChange}
            hasError={this.hasError("password")}
            errorMessage="Por favor insira uma password"
          />

          <hr />

          <button className="btn btn-primary">Login</button>
        </form>
      </Fragment>
    );
  }
}

export default Login;
