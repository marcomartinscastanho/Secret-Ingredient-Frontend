import jwtDecode from "jwt-decode";
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { RecipeOutputDto } from "../types/dtos.type";

interface Jwt {
  username: string;
  sub: string;
  role: "User" | "Admin";
}

interface ComponentProps {
  jwt?: string;
}

interface State {
  recipes: RecipeOutputDto[];
  isLoaded: boolean;
  error: string;
}

export class RecipesPage extends Component<ComponentProps, State> {
  state: State = { recipes: [], isLoaded: false, error: "" };

  componentDidMount() {
    if (!this.props.jwt) {
      this.setState({ error: "Missing jwt" });
      return;
    }

    const jwt = jwtDecode<Jwt>(this.props.jwt);
    const userId = jwt.sub;

    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch("http://localhost:19061/v1/recipes?userId=" + userId, { headers })
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: { data: RecipeOutputDto[] }) => {
        if (jsonRes.data) {
          this.setState({
            recipes: jsonRes.data,
            isLoaded: true,
          });
        }
      });
  }

  render() {
    const { recipes, isLoaded, error } = this.state;
    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    } else {
      return (
        <Fragment>
          <h2>Receitas</h2>
          <div className="list-group">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="list-group-item list-group-item-action"
              >
                {recipe.title}
              </Link>
            ))}
          </div>
        </Fragment>
      );
    }
  }
}

export default RecipesPage;
