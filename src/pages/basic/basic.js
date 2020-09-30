import React, { useState } from "react";
//Components
import { Button, Steps, Modal } from "antd";
import AlternativesForm from "../../forms/AlternativesForm";
import MatrixTable from "../../components/MatrixTable";
import BasicCriteriaForm from "../../forms/BasicCriteriaForm";

import "./basic.scss";

export default function Basic() {
  const [current, setCurrent] = useState(0);
  const [criteria, setCriteria] = useState([]);
  const [alternatives, setAlternatives] = useState(null);
  const [showModal, setshowModal] = useState(false);

  const handleOk = () => setshowModal(false);

  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Inicio",
      content: (
        <div className="begin">
          <h2>Es tu primera vez?</h2>
          <p>Te recomendamos ver el tutorial antes de comenzar</p>
          <Button shape="round" onClick={() => setshowModal(true)}>
            Tutorial
          </Button>
          <Button shape="round" type="primary" onClick={() => next()}>
            Comenzar
          </Button>
          <Modal
            cancelText={"Cancelar"}
            closable={false}
            onCancel={handleOk}
            title="Tutorial de Uso"
            visible={showModal}
            onOk={handleOk}
          >
            <p>Tutorial </p>
            <p>Tutorial</p>
            <p>Tutorial</p>
          </Modal>
        </div>
      ),
    },
    {
      title: "Criterios",
      content: <BasicCriteriaForm next={next} setCriteria={setCriteria} />,
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
        </>
      ),
    },
    {
      title: "Resultado",
      content: <h3>Resultado del Calculo</h3>,
    },
  ];

  return (
    <div className="basic">
      <h2>Básico</h2>
      <div className="basic-content">
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
