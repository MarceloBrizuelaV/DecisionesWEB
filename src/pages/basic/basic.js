import React, { useState } from "react";
//Components
import { Button, Steps, Modal, Table } from "antd";
import AlternativesForm from "../../forms/AlternativesForm";
import MatrixTable from "../../components/MatrixTable";
import BasicCriteriaForm from "../../forms/BasicCriteriaForm";
import { normalizeBySum } from "../../utils/Normalization";
import { toMatrix } from "../../utils/MatrixFunctions";
import { series } from "async";
import CritIMG from "../../assets/tut-criteria.png";
import AltIMG from "../../assets/tut-alternativas.png";

import "./basic.scss";

export default function Basic() {
  //Loading State
  const [isLoading, setIsLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [criteria, setCriteria] = useState([]);
  const [alternatives, setAlternatives] = useState(null);
  const [showModal, setshowModal] = useState(false);
  //Matrix
  const [resultMatrix, setResultMatrix] = useState([]);
  //Result Table Column
  const resultTableColumn = [
    {
      title: "Alternativa",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.value - b.value,
    },
  ];
  //Table Column
  const [tableColumns, setTableColumns] = useState([
    {
      title: "Alternativa",
      dataIndex: "name",
      key: "name",
    },
  ]);

  const handleOk = () => setshowModal(false);

  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  //Criteria to Column - Creates columns based on the criterias
  const criteriaToColumn = (criteria) => {
    var criteriaNames = [];
    criteria.forEach((criteria) => {
      var column = {
        title: criteria.name,
        dataIndex: criteria.name,
        key: criteria.name,
      };
      criteriaNames.push(column);
    });
    tableColumns.push(...criteriaNames);
    setTableColumns(tableColumns);
  };

  //Función para maximizar los minimos
  const maximizarMinimo = (alternatives, matrix, criteria) => {
    for (let i = 0; i < criteria.length; i++) {  
      if (criteria[i].kind === "min") {
        for (let j = 0; j < alternatives.length; j++) {
          matrix[i][j] = 1/matrix[i][j];      
         }
          criteria[i].kind = "max"
        }
      }
  }


  //Esta funcion pondera la matriz
  const ponderateMatrix = (matrix, criteria) => {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = matrix[i][j] * criteria[i].weight;
      }
    }
    return matrix;
  };

  //Esta funcion sumariza y retorna el resultado final
  const sumarize = (matrix, alternatives, criteria) => {
    var results = [];
    for (var j = 0; j < matrix[0].length; j++) {
      var sum = 0;
      for (var i = 0; i < matrix.length; i++) {
        if (criteria[i].kind === "max") {
          sum += matrix[i][j];
        } else {
          sum -= matrix[i][j];
        }
      }
      results.push({
        name: alternatives[j].name,
        value: sum,
      });
    }
    return results;
  };

  //Funcion de Calculo
  //Funcion de Calculo
  const calculate = () => {
    setIsLoading(true);
    //Matriz Global
    var matrix = [];
    series(
      [
        function (callback) {
          //Configuracion Inicial
          //Seteo Columnas de Tabla

          criteriaToColumn(criteria);
          //Paso los valores de cada criterio a una matriz para poder trabajarla
          matrix = toMatrix(criteria, alternatives);
          maximizarMinimo(alternatives, matrix, criteria);
          callback(null, "Configuracion Inicial");
        },
        function (callback) {
          //Normalizacion - Se modifica la matriz global y tambien se guarda la normalizada para mostrar
          //dentro de la funcion normalize
          matrix = normalizeBySum(matrix, alternatives, criteria);
          callback(null, "Normalizada");
        },
        function (callback) {
          //Ponderamos la matriz
          matrix = ponderateMatrix(matrix, criteria);
          console.log(matrix);
          callback(null, "Ponderada");
        },
        function (callback) {
          //Sumarizamos los pesos y obtenemos el resultado final
          setResultMatrix(sumarize(matrix, alternatives, criteria));
          callback(null, "Resultado");
        },
      ],
      // optional callback
      function (err, results) {
        //Terminar Carga
        setIsLoading(false);
        setCurrent(current + 1);
      }
    );
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
            width={800}
            closable={false}
            onCancel={handleOk}
            title="Tutorial de Uso"
            visible={showModal}
            onOk={handleOk}
          >
            <h3>Criterios</h3>
            <p>
              Primero debes elegir los criterios para llevar que te mostremos
              cual es tu mejor alternativa. Los criterios son caracteristicas
              por las cuales quieres comparar tus alternativas, por ejemplo si
              estamos comparando celulares un criterio puede ser Memoria Ram.
              Una vez que seleccionemos debemos elegir un peso para nuestro
              criterio, este depende de cuantas estrellas le asignemos al
              criterio. Mientras mas estrellas le coloques mas importante es
              para tí el criterio. Por ejemplo si te importa mas la memoria RAM
              sobre el tamaño de la pantalla puedes colocar 4 estrellas en
              memoria RAM y 2 estrellas en pantalla. Ademas debes elegir si el
              criterio es de Máximo o Mínimo, por ejemplo si la mejor
              alternativa es la que tiene mayor memoria RAM, el criterio seria
              de Maximo ya que el que tenga mayor valor es el mejor.
            </p>
            <img src={CritIMG} alt="Tutorial" />
            <h3>Alternativas</h3>
            <p>
              Las alternativas son los distintos objetos que quieres comparar,
              si queremos comparar telefonos nuestras alternativas podrían ser
              Moto G, Iphone6, etc. A cada alternativa le debemos colocar un
              nombre, y el valor que tiene esta alternativa en cada criterio que
              definimos anteriormente. Por ejemplo si el telefono Moto G tiene
              6GB de ram, le colocamos un 6 en el criterio Memoria Ram.
            </p>
            <img src={AltIMG} alt="Tutorial" />
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
          criteria={criteria}
          setAlternatives={setAlternatives}
          isBasic={true}
          calculate={calculate}
        />
      ),
    },
    {
      title: "Matriz",
      content: (
        <>
          <MatrixTable data={alternatives} criteria={criteria} />
          <Button
            onClick={() => calculate()}
            type="primary"
            style={{ marginTop: 15, marginBottom: 15 }}
          >
            Calcular
          </Button>
        </>
      ),
    },
    {
      title: "Resultado",
      content: (
        <>
          {isLoading ? (
            <></>
          ) : (
            <>
              <h3>Resultado</h3>
              <h4>El orden de las alternativas es: </h4>
              <Table
                columns={resultTableColumn}
                dataSource={resultMatrix}
                pagination={false}
              />
            </>
          )}
        </>
      ),
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
        <a href="/home">
          <Button shape="round" style={{ marginTop: 15, marginBottom: 15 }}>
            Menú Principal
          </Button>
        </a>
        <a href="/home/basic">
          <Button shape="round" type="primary" style={{ marginLeft: 15 }}>
            Calcular de Nuevo
          </Button>
        </a>
      </div>
    </div>
  );
}
