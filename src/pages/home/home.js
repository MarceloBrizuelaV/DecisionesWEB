import React from "react";
//Components
import { Button } from "antd";
import { Link } from "react-router-dom";

import "./home.scss";

export default function Home() {
  
  return (
    <div className="home">
      <h1>¡Bienvenido!</h1>
      <Link to="/home/method">
        <Button shape="round" size="large">
          Comenzar
        </Button>   
      </Link>
    </div>
  );
}
