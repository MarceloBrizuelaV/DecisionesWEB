import React, { useState } from "react";
//Components
import { Steps } from "antd";
import CriteriaForm from "../../forms/CriteriaForm";
import AlternativesForm from "../../forms/AlternativesForm";
import MatrixTable from "../../components/MatrixTable";
import MooraMethod from "../../forms/MooraMethod";

import "./moora.scss";

export default function Moora() {
  const [current, setCurrent] = useState(0);
  const [criteria, setCriteria] = useState([]);
  const [mooraMethod, setMooraMethod] = useState(null);
  const [alternatives, setAlternatives] = useState(null);

  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Criterios",
      content: <CriteriaForm next={next} setCriteria={setCriteria} />,
    },
    {
      title: "Alternativas",
      content: (
        <AlternativesForm
          next={next}
          prev={prev}
          criteria={criteria}
          setAlternatives={setAlternatives}
        />
      ),
    },
    {
      title: "Matriz",
      content: (
        <>
          <MatrixTable data={alternatives} criteria={criteria} />
          <MooraMethod setMooraMethod={setMooraMethod} next={next} />
        </>
      ),
    },
    {
      title: "Resultado",
      content: "Datos del Resultado",
    },
  ];

  return (
    <div className="moora">
      <h2>Moora</h2>
      <div className="moora-content">
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
      </div>
    </div>
  );
}
