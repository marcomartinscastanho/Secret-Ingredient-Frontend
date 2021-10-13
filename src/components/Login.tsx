import React, { Component, Fragment } from "react";
import TextInput from "./form-components/TextInput";
import Alert from "./ui-components/alert";

type AlertState = {
  type: "alert-success" | "alert-danger" | "d-none";
  message: string;
};

interface State {
  username: string;
  password: string;
  error?: string;
  errors: string[];
  alert: AlertState;
}

export class Login extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      username: "",
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

  isInputValid = () => {
    // client side validation
    const errors = [];
    if (this.state.username === "") {
      errors.push("username");
    }
    if (this.state.password === "") {
      errors.push("password");
    }

    this.setState({ errors });

    return errors.length === 0;
  };

  handleSubmit = (event: any) => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return false;
    }

    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());
    const requestOptions = { method: "POST", body: JSON.stringify(payload) };

    fetch("http://localhost:19061/v1/auth/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
          console.log(data);

          // this.props.history.push({ pathname: "/admin" });
        }
      });
  };

  hasError(key: string) {
    return this.state.errors.indexOf(key) !== -1;
  }

  render() {
    const { alert } = this.state;

    return (
      <Fragment>
        <h2>Login</h2>
        <hr />
        <Alert type={alert.type} message={alert.message} />

        <form className="pt-3" onSubmit={this.handleSubmit}>
          <TextInput
            type="text"
            title="Nome de Utilizador"
            name="username"
            onChange={this.handleChange}
            hasError={this.hasError("username")}
            errorMessage="Por favor insira um nome de utilizador"
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
