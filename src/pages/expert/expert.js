import React from "react";
//Components
import { Button } from "antd";
import { Link } from "react-router-dom";

import "./expert.scss";

export default function Expert() {
  return (
    <div className="expert">
      <h2>Elige un Método de Apoyo Multicriterio</h2>
      <div className="expert-buttons">
        <Link to="/home/lineal">
          <Button shape="round">Ponderación Lineal</Button>
        </Link>
        <Link to="/home/topsis">
          <Button shape="round">TOPSIS</Button>
        </Link>
        <Link to="/home/moora">
          <Button shape="round">MOORA</Button>
        </Link>
      </div>
    </div>
  );
}
