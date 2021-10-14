import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { TextInput } from "./form-components/TextInput";
import { Alert, Props as AlertProps } from "./ui-components/alert";

interface ComponentProps {
  handleJwtChange: (jwt: string) => void;
}

interface Props extends RouteComponentProps, ComponentProps {}

interface State {
  username: string;
  password: string;
  error?: string;
  errors: string[];
  alert: AlertProps;
}

export class Login extends Component<Props, State> {
  constructor(props: Props) {
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
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    fetch("http://localhost:19061/v1/auth/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
          this.handleJwtChange(data.accessToken);
          this.props.history.push({ pathname: "/admin" });
        }
      });
  };

  handleJwtChange = (jwt: string) => {
    this.props.handleJwtChange(jwt);
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

        <div className="mt-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </div>
      </Fragment>
    );
  }
}

export default Login;
