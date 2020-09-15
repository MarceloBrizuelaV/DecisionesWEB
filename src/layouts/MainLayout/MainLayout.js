import React from "react";
//Routes
import MainRoutes from "../../routes/MainRoutes";
//Components
import TopBar from "../../components/TopBar";

import "./MainLayout.scss";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <TopBar />
      <MainRoutes />
    </div>
  );
}
