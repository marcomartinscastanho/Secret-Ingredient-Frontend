import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { TextInput } from "./form-components/TextInput";
import { Alert, Props as AlertProps } from "./ui-components/alert";

interface ComponentProps {
  handleJwtChange: (jwt: string) => void;
}

interface Props extends RouteComponentProps, ComponentProps {}

interface State {
  name: string;
  username: string;
  useDefaultUsername: boolean;
  password: string;
  passwordConfirmation: string;
  error?: string;
  errors: string[];
  alert: AlertProps;
}

export class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: "",
      username: "",
      useDefaultUsername: true,
      password: "",
      passwordConfirmation: "",
      errors: [],
      alert: { type: "d-none", message: "" },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  generateUsername = (name: string) => {
    const names: string[] = name.split(" ");
    return names
      .map((n: string, i: number) => {
        if (i < names.length - 1) {
          return n[0];
        } else {
          return n;
        }
      })
      .join()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w]/g, "");
  };

  handleChange = (event: any) => {
    const { name, value } = event.target;

    this.setState((prevState) => ({ ...prevState, [name]: value }));

    if (name === "username") {
      if (value === "") {
        this.setState({ useDefaultUsername: true });
      } else {
        this.setState({ useDefaultUsername: false });
      }
    }

    if (name === "name" && this.state.useDefaultUsername) {
      this.setState({ username: this.generateUsername(value) });
    }
  };

  isInputValid = () => {
    // client side validation
    const errors = [];
    if (this.state.name === "") {
      errors.push("name");
    }
    if (this.state.username === "") {
      errors.push("username");
    }
    if (this.state.password === "") {
      errors.push("password");
    }
    if (this.state.passwordConfirmation === "") {
      errors.push("password-confirmation");
    }
    if (this.state.password !== this.state.passwordConfirmation) {
      errors.push("password-confirmation");
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

    fetch("http://localhost:19061/v1/auth/register", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
          this.handleJwtChange(data.accessToken);
          this.props.history.push({ pathname: "/recipes" });
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
    const { name, username, password, passwordConfirmation, alert } = this.state;

    return (
      <Fragment>
        <h2>Registar</h2>
        <hr />
        <Alert type={alert.type} message={alert.message} />

        <form className="pt-3" onSubmit={this.handleSubmit}>
          <TextInput
            type="text"
            title="Nome"
            name="name"
            value={name}
            onChange={this.handleChange}
            hasError={this.hasError("name")}
            errorMessage="Por favor insira um nome"
          />
          <TextInput
            type="text"
            title="Nome de Utilizador"
            name="username"
            value={username}
            onChange={this.handleChange}
            hasError={this.hasError("username")}
            errorMessage="Por favor insira um nome de utilizador"
          />
          <TextInput
            type="password"
            title="Password"
            name="password"
            value={password}
            onChange={this.handleChange}
            hasError={this.hasError("password")}
            errorMessage="Por favor insira uma password"
          />
          <TextInput
            type="password"
            title="Confirme a password"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={this.handleChange}
            hasError={this.hasError("password-confirmation")}
            errorMessage="As passwords não coincidem"
          />

          <hr />

          <button className="btn btn-primary">Registar</button>
        </form>

        {/* <div className="mt-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </div> */}
      </Fragment>
    );
  }
}

export default Register;
