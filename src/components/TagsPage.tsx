import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { TagDto } from "../types/dtos.type";

interface State {
  tags: TagDto[];
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
      .then((jsonRes: { data: TagDto[] }) => {
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

          <ul>
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link to={`/tags/${tag.id}`}>{tag.name}</Link>
              </li>
            ))}
          </ul>
        </Fragment>
      );
    }
  }
}

export default TagsPage;
