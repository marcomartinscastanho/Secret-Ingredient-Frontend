import React, { Component, Fragment } from "react";
import { confirmAlert } from "react-confirm-alert";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { RecipeOutputDto } from "../types/dtos.type";
import { Alert, Props as AlertProps } from "./ui-components/alert";
import { PersonOutline, People, Timer, FormatListNumbered, FormatQuote } from "@mui/icons-material";
import { RecipeCard } from "./ui-components/recipe-card";

interface Params {
  id: string;
}

interface ComponentProps {
  jwt?: string;
}

export interface RouteProps extends RouteComponentProps<Params> {}

interface Props extends RouteProps, ComponentProps {}

interface State {
  recipe: RecipeOutputDto;
  isLoaded: boolean;
  error: string;
  alert: AlertProps;
}

export class Recipe extends Component<Props, State> {
  state: State = {
    recipe: {
      id: "",
      title: "",
      portions: 0,
      tags: [],
      description: "",
      cookingTime: 0,
      preparationTime: 0,
      ingredients: [],
      preparationSteps: [],
      user: "",
    },
    isLoaded: false,
    error: "",
    alert: {
      type: "d-none",
      message: "",
    },
  };

  componentDidMount() {
    // If the user is not logged in, can't access this page
    if (!this.props.jwt) {
      this.props.history.push({ pathname: "/login" });
      return;
    }

    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch("http://localhost:19061/v1/recipes/" + this.props.match.params.id, { headers })
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: RecipeOutputDto) => {
        this.setState({
          recipe: jsonRes,
          isLoaded: true,
        });
      });
  }

  deleteRecipe(id: string) {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch("http://localhost:19061/v1/recipes/" + id, {
      method: "DELETE",
      headers,
    }).then((response) => {
      if (response.status === 200) {
        this.props.history.push({ pathname: "/recipes" });
      } else {
        response.json().then((data) => {
          if (data.error) {
            this.setState({ alert: { type: "alert-danger", message: data.message } });
          }
        });
      }
    });
  }

  confirmDelete = () => {
    confirmAlert({
      title: "Eliminar Receita?",
      message: "Tem a certeza?",
      buttons: [
        {
          label: "Sim",
          onClick: () => {
            this.deleteRecipe(this.state.recipe.id);
          },
        },
        {
          label: "Não",
          onClick: () => {},
        },
      ],
    });
  };

  render() {
    const { recipe, isLoaded, error, alert } = this.state;

    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    } else {
      return (
        <Fragment>
          <div className="row mb-2">
            <h2 className="col">{recipe.title}</h2>

            <div className="col d-flex align-items-center justify-content-end">
              {recipe.tags.map((tag, index) => (
                <Link to={`/tags/${tag.id}`} className="btn badge bg-success me-1" key={index}>
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-muted d-flex align-items-center justify-content-around">
            <small>
              <FormatListNumbered className="me-2" />
              {recipe.preparationSteps.length} passos
            </small>
            <small>
              {/* FIXME: lacking good icons for preparation and cooking times, we merge them for now */}
              <Timer className="me-2" />
              {recipe.preparationTime + recipe.cookingTime} minutos
            </small>
            <small>
              <People className="me-2" />
              {recipe.portions} porções
            </small>
            <small>
              <PersonOutline className="me-2" />
              por <i>Marco Castanho</i> {/* FIXME: placeholder for the name of the author */}
            </small>
          </div>
          <hr className="mt-1 mb-4" />

          <Alert type={alert.type} message={alert.message} />

          <div className="row mb-4">
            <div className="col-md-1 px-0 d-flex justify-content-end">
              <FormatQuote className="text-muted" />
            </div>
            <p className="text-muted col-md-10 px-0 pt-2">{recipe.description}</p>
            <div className="col-md-1 px-0 d-flex align-items-end">
              <FormatQuote className="text-muted" />
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-md-5">
              <h3 className="mb-3">Ingredientes</h3>
              <table className="table table-compact">
                <thead></thead>
                <tbody>
                  {recipe.ingredients.map((recipeIngredient, index) => (
                    <tr key={index}>
                      <td>
                        {recipeIngredient.quantity} de <u>{recipeIngredient.ingredient.name}</u>{" "}
                        {recipeIngredient.specification}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-7">
              <h3 className="mb-3">Preparação</h3>
              <table className="table table-compact">
                <thead></thead>
                <tbody>
                  {recipe.preparationSteps.map((step, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{step}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TODO: similar recipes
            Implies creating a new GET /recipes/:id/similar
            That gets all public recipes + all user recipes
            then, for each
            calculates an index of similarity (#tags + #ingredients in common, e.g.)
            sorts them by that metric
            and returns the top x (like 4 is enough)
          */}
          {/* example */}
          <h3 className="mb-3">Receitas Semelhantes</h3>
          <div className="row">
            <RecipeCard
              id="6168c2e035b6fa79a7b52499"
              title="Rodízio de Pipi"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
              preparationSteps={2}
              preparationTime={20}
            />
          </div>
          <hr />

          <div className="d-flex justify-content-center">
            <button className="btn btn-primary">Imprimir</button>
            <Link to={`/recipe/edit/${recipe.id}`} className="btn btn-warning ms-2">
              Editar
            </Link>
            <a href="#!" onClick={() => this.confirmDelete()} className="btn btn-danger ms-2">
              Eliminar
            </a>
          </div>
        </Fragment>
      );
    }
  }
}

export default Recipe;
