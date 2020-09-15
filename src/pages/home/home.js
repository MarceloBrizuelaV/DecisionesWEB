import React from "react";
//Components
import { Button } from "antd";
import { Link } from "react-router-dom";

import "./home.scss";

export default function Home() {
  return (
    <div className="home">
      <Link to="/home/method">
        <Button shape="round" size="large">
          Comenzar
        </Button>
      </Link>
    </div>
  );
}
