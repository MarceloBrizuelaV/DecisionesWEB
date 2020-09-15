import React from "react";
//Components
import { Button } from "antd";
import { Link } from "react-router-dom";

import "./method.scss";

export default function Method() {
  return (
    <div className="method">
      <h2>Elige el modo de operacion</h2>
      <div className="method-buttons">
        <Link to="/home/basic">
          <Button shape="round">Basico</Button>
        </Link>
        <Link to="/home/expert">
          <Button shape="round" style={{ marginLeft: 30 }}>
            Experto
          </Button>
        </Link>
      </div>
    </div>
  );
}
