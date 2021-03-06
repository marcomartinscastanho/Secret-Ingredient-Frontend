import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { TagOutputDto } from "../types/dtos.type";

interface State {
  tags: TagOutputDto[];
  isLoaded: boolean;
  error: string;
}

export class TagsPage extends Component<{}, State> {
  state: State = { tags: [], isLoaded: false, error: "" };

  componentDidMount() {
    fetch("http://localhost:19061/v1/tags")
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: { data: TagOutputDto[] }) => {
        this.setState({
          tags: jsonRes.data,
          isLoaded: true,
        });
      });
  }

  render() {
    const { tags, isLoaded, error } = this.state;
    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    } else {
      return (
        <Fragment>
          <h2>Etiquetas</h2>

          <div className="list-group">
            {tags
              .filter((tag) => tag.popularity && tag.popularity > 0)
              .map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.id}`}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  {tag.name}
                  <span className="badge bg-secondary rounded-pill">
                    {tag.popularity} receita{tag.popularity === 1 ? "" : "s"}
                  </span>
                </Link>
              ))}
          </div>
        </Fragment>
      );
    }
  }
}

export default TagsPage;
