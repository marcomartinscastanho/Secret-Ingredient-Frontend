import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { Home } from "./components/Home";
import { Ingredients } from "./components/Ingredients";
import { Recipes } from "./components/Recipes";
import { Tags } from "./components/Tags";

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
              </ul>
            </nav>
          </div>
          <div className="col-md-10">
            <Switch>
              <Route path="/recipes/:id">
                <Recipe />
              </Route>
              <Route path="/recipes">
                <Recipes />
              </Route>
              <Route path="/ingredients">
                <Ingredients />
              </Route>
              <Route path="/tags">
                <Tags />
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
