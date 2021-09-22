import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Admin } from "./components/Admin";
import { Home } from "./components/Home";
import { Ingredient } from "./components/Ingredient";
import { IngredientsPage } from "./components/IngredientsPage";
import { RecipesPage } from "./components/RecipesPage";
import { TagsPage } from "./components/TagsPage";

export function App() {
  return (
    <Router>
      <div className="container">
        <div className="row">
          <h1 className="mt-3">Ingrediente Secreto</h1>
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
                <li className="list-group-item">
                  <Link to="/admin">Admin Area</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-md-10">
            <Switch>
              <Route path="/recipes/:id">
                <Recipe />
              </Route>
              <Route path="/recipes">
                <RecipesPage />
              </Route>
              <Route exact path="/ingredients">
                <IngredientsPage />
              </Route>
              <Route
                exact
                path="/ingredients/:id"
                render={(props) => <Ingredient {...props} />}
              />
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

function Recipe() {
  let { id } = useParams<{ id: string }>();

  return <h2>Receita {id}</h2>;
}

export default App;
