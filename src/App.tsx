import React, { Fragment } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

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
                  <Link to="/admin">Gerir Catálogo</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-md-10">
            <Switch>
              <Route path="/recipes">
                <Recipes />
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

function Home() {
  return <h2>Início</h2>;
}

function Recipes() {
  return <h2>Receitas</h2>;
}

function Admin() {
  return <h2>Gerir Catálogo</h2>;
}

export default App;
