import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Admin } from "./components/Admin";
import { EditRecipe } from "./components/EditRecipe";
import { Home } from "./components/Home";
import { Ingredient } from "./components/Ingredient";
import { IngredientsPage } from "./components/IngredientsPage";
import { Recipe } from "./components/Recipe";
import { RecipesPage } from "./components/RecipesPage";
import { Tag } from "./components/Tag";
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
                  <Link to="/recipes/new">Nova Receita</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/admin">Admin Area</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-md-10">
            <Switch>
              <Route path="/recipes/new" component={EditRecipe} />
              <Route path="/recipes/:id" component={Recipe} />
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

export default App;
