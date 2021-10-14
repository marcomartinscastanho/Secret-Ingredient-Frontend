import React, { Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteComponentProps,
} from "react-router-dom";
import { Admin, RouteProps as AdminRouteProps } from "./components/Admin";
import { EditRecipe, RouteProps as EditRecipeRouteProps } from "./components/EditRecipe";
import { Home } from "./components/Home";
import { Ingredient, RouteProps as IngredientRouteProps } from "./components/Ingredient";
import { IngredientsPage } from "./components/IngredientsPage";
import { Login } from "./components/Login";
import { Recipe, RouteProps as RecipeRouteProps } from "./components/Recipe";
import { RecipesPage } from "./components/RecipesPage";
import { Register } from "./components/Register";
import { Tag, RouteProps as TagRouteProps } from "./components/Tag";
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
    const loginButton = this.state.jwt ? (
      <Link to="/logout" className="btn btn-danger ms-2" onClick={this.logout}>
        Sair
      </Link>
    ) : (
      <Link to="/login" className="btn btn-primary ms-2">
        Entrar
      </Link>
    );

    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col mt-3">
              <h1 className="mt-3">Ingrediente Secreto</h1>
            </div>
            <div className="col-md-5 row mt-3 text-end">
              <div className="col mt-3">
                {/** TODO: when a user is logged in, replace this button with "Olá <name>" */}
                {!this.state.jwt && (
                  <Link to="/register" className="btn btn-primary">
                    Registar
                  </Link>
                )}
                {loginButton}
              </div>
            </div>
            <hr className="mb-3" />
          </div>
          <div className="row">
            <div className="col-md-2">
              <nav>
                <div className="list-group">
                  <Link className="list-group-item list-group-item-action" to="/">
                    Início
                  </Link>
                  <Link className="list-group-item list-group-item-action" to="/ingredients">
                    Ingredientes
                  </Link>
                  <Link className="list-group-item list-group-item-action" to="/tags">
                    Etiquetas
                  </Link>
                  {this.state.jwt && (
                    <Fragment>
                      <Link className="list-group-item list-group-item-action" to="/recipes">
                        Minhas Receitas
                      </Link>
                      <Link className="list-group-item list-group-item-action" to="/recipe/edit/0">
                        Nova Receita
                      </Link>
                      <Link className="list-group-item list-group-item-action" to="/admin">
                        Editar Receitas
                      </Link>
                    </Fragment>
                  )}
                </div>
              </nav>
            </div>
            <div className="col-md-10">
              <Switch>
                <Route
                  exact
                  path="/register"
                  component={(props: RouteComponentProps) => (
                    <Register {...props} handleJwtChange={this.handleJwtChange} />
                  )}
                />
                <Route
                  exact
                  path="/login"
                  component={(props: RouteComponentProps) => (
                    <Login {...props} handleJwtChange={this.handleJwtChange} />
                  )}
                />

                <Route
                  path="/recipe/edit/:id"
                  component={(props: EditRecipeRouteProps) => (
                    <EditRecipe {...props} jwt={this.state.jwt} />
                  )}
                />
                <Route
                  path="/recipe/:id"
                  component={(props: RecipeRouteProps) => (
                    <Recipe {...props} jwt={this.state.jwt} />
                  )}
                />
                <Route
                  path="/recipes"
                  component={(props: {}) => <RecipesPage {...props} jwt={this.state.jwt} />}
                />

                <Route
                  path="/ingredients/:id"
                  component={(props: IngredientRouteProps) => (
                    <Ingredient {...props} jwt={this.state.jwt} />
                  )}
                />
                <Route exact path="/ingredients">
                  <IngredientsPage />
                </Route>

                <Route
                  path="/tags/:id"
                  component={(props: TagRouteProps) => <Tag {...props} jwt={this.state.jwt} />}
                />
                <Route path="/tags">
                  <TagsPage />
                </Route>

                <Route
                  path="/admin"
                  component={(props: AdminRouteProps) => <Admin {...props} jwt={this.state.jwt} />}
                />
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
