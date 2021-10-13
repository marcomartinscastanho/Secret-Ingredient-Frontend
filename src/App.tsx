import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Admin } from "./components/Admin";
import { EditRecipe } from "./components/EditRecipe";
import { Home } from "./components/Home";
import { Ingredient } from "./components/Ingredient";
import { IngredientsPage } from "./components/IngredientsPage";
import { Login } from "./components/Login";
import { Recipe } from "./components/Recipe";
import { RecipesPage } from "./components/RecipesPage";
import { Register } from "./components/Register";
import { Tag } from "./components/Tag";
import { TagsPage } from "./components/TagsPage";

interface State {
  jwt?: string;
}

export class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = { jwt: undefined };

    this.handleJwtChange = this.handleJwtChange.bind(this);
  }

  handleJwtChange = (jwt: string) => {
    this.setState({ jwt });
  };

  logout = () => {
    this.setState({ jwt: undefined });
  };

  render() {
    const loginLink = this.state.jwt ? (
      <Link to="/logout" onClick={this.logout}>
        Logout
      </Link>
    ) : (
      <Link to="/login">Login</Link>
    );

    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col-md-10 mt-3">
              <h1 className="mt-3">Ingrediente Secreto</h1>
            </div>
            {!this.state.jwt && (
              <div className="col mt-3 text-end">
                <Link to="/register">Registar</Link>
              </div>
            )}
            {/** TODO: when a user is logged in, replace this button with "Olá <name>" */}
            <div className="col mt-3 text-end">{loginLink}</div>
            <hr className="mb-3"></hr>
          </div>
          <div className="row">
            <div className="col-md-2">
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/">Início</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/recipes">Receitas</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/ingredients">Ingredientes</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/tags">Etiquetas</Link>
                  </li>
                  {this.state.jwt && (
                    <Fragment>
                      <li className="list-group-item">
                        <Link to="/recipe/edit/0">Nova Receita</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/admin">Admin Area</Link>
                      </li>
                    </Fragment>
                  )}
                </ul>
                <div className="mt-3">
                  <pre>{JSON.stringify(this.state, null, 3)}</pre>
                </div>
              </nav>
            </div>
            <div className="col-md-10">
              <Switch>
                <Route
                  exact
                  path="/register"
                  component={(props: any) => (
                    <Register {...props} handleJwtChange={this.handleJwtChange} />
                  )}
                />
                <Route
                  exact
                  path="/login"
                  component={(props: any) => (
                    <Login {...props} handleJwtChange={this.handleJwtChange} />
                  )}
                />

                <Route path="/recipe/edit/:id" component={EditRecipe} />
                <Route path="/recipe/:id" component={Recipe} />
                <Route path="/recipes">
                  <RecipesPage />
                </Route>

                <Route path="/ingredients/:id" component={Ingredient} />
                <Route exact path="/ingredients">
                  <IngredientsPage />
                </Route>

                <Route path="/tags/:id" component={Tag} />
                <Route path="/tags">
                  <TagsPage />
                </Route>

                <Route path="/admin">
                  <Admin />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
