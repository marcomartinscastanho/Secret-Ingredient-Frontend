import React, { Component } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";

export const IngredientsPage = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Ingredientes</h2>
      <ul>
        <li>
          <Link to={`${path}/1`}>Sal</Link>
        </li>
        <li>
          <Link to={`${path}/2`}>Carne de Vaca</Link>
        </li>
      </ul>
    </div>
  );
};

export default IngredientsPage;
