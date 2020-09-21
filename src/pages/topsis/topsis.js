import React, { useState } from "react";
//Components
import { Steps } from "antd";
import CriteriaForm from "../../forms/CriteriaForm";
import AlternativesForm from "../../forms/AlternativesForm";
import MatrixTable from "../../components/MatrixTable";
import NormalizationForm from "../../forms/NormalizationForm";

import "./topsis.scss";

export default function Topsis() {
  const [current, setCurrent] = useState(0);
  const [criteria, setCriteria] = useState([]);
  const [normalization, setNormalization] = useState(null);
  const [alternatives, setAlternatives] = useState(null);
  const [distance, setDistance] = useState(0);

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

          <NormalizationForm
            distance={true}
            setNormalization={setNormalization}
            next={next}
            buttonTitle={"Calcular"}
            setDistance={setDistance}
          />
        </>
      ),
    },
    {
      title: "Resultado",
      content: <h3>Resultado del Calculo</h3>,
    },
  ];

  return (
    <div className="topsis">
      <h2>TOPSIS</h2>
      <div className="topsis-content">
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
