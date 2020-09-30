import React, { useState, useEffect } from "react";
//Components
import CriteriaForm from "../../forms/CriteriaForm";
import AlternativesForm from "../../forms/AlternativesForm";
import MatrixTable from "../../components/MatrixTable";
import NormalizationForm from "../../forms/NormalizationForm";
import { Steps, Button } from "antd";

import "./lineal.scss";

export default function Lineal() {
  const [current, setCurrent] = useState(3);
  const [criteria, setCriteria] = useState([]);
  const [normalization, setNormalization] = useState(null);
  const [alternatives, setAlternatives] = useState(null);

  //Criteria de Prueba
  var criteriaPrueba = [
    { name: "Crit1", weight: 0.34, kind: "max" },
    { name: "Crit2", weight: 0.24, kind: "min" },
  ];
  //Alternativas de Prueba
  var alternativaPrueba = [
    { name: "alt1", Crit1: "5", Crit2: "10" },
    { name: "alt2", Crit1: "10", Crit2: "8" },
    { name: "alt3", Crit1: "3", Crit2: "20" },
  ];

  useEffect(() => {
    setCriteria(criteriaPrueba);
    setAlternatives(alternativaPrueba);
  }, []);

  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const printData = () => {};

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
            setNormalization={setNormalization}
            next={next}
            buttonTitle={"Calcular"}
            distance={false}
          />
        </>
      ),
    },
    {
      title: "Resultado",
      content: (
        <>
          <Button onClick={printData}>Ver Datos</Button>
          <h3>Resultado del Calculo</h3>
        </>
      ),
    },
  ];

  return (
    <div className="lineal">
      <h2>Ponderación Lineal</h2>
      <div className="lineal-content">
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
