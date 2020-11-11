import React, { useState } from "react";
//Components
import { Steps, Button, Table } from "antd";
import CriteriaForm from "../../forms/CriteriaForm";
import AlternativesForm from "../../forms/AlternativesForm";
import MatrixTable from "../../components/MatrixTable";
import MooraMethod from "../../forms/MooraMethod";
import { normalizeByRootSum } from "../../utils/Normalization";
import { toMatrix } from "../../utils/MatrixFunctions";
import { cloneDeep, max, min } from "lodash";
import { series } from "async";

import "./moora.scss";

export default function Moora() {
  //Loading State
  const [isLoading, setIsLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [criteria, setCriteria] = useState([]);
  const [mooraMethod, setMooraMethod] = useState(null);
  const [alternatives, setAlternatives] = useState(null);
  //Matrix
  const [normalizedMatrix, setNormalizedMatrix] = useState([]);
  const [ponderatedMatrix, setPonderatedMatrix] = useState([]);
  const [resultMatrix, setResultMatrix] = useState([]);
  const [resultTableColumn, setResultTableColumn] = useState([
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
  ]);
  //Table Column
  const [tableColumns, setTableColumns] = useState([
    {
      title: "Alternativa",
      dataIndex: "name",
      key: "name",
    },
  ]);

  //Matrix to JSON
  const matrixToJson = (alternatives, matrix, criteria) => {
    var resultJson = cloneDeep(alternatives);
    for (var i = 0; i < alternatives.length; i++) {
      for (var j = 0; j < criteria.length; j++) {
        resultJson[i][criteria[j].name] = matrix[j][i];
      }
    }
    return resultJson;
  };

  //Steps
  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const goTo = (page) => {
    setCurrent(page);
  };

  //Esta funcion cambia el ordenamiento de la tabla
  const changeResultTableColumn = () => {
    setResultTableColumn([
      {
        title: "Alternativa",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Valor",
        dataIndex: "value",
        key: "value",
        defaultSortOrder: "ascend",
        sorter: (a, b) => a.value - b.value,
      },
    ]);
  };

  //Esta funcion pondera la matriz
  const ponderateMatrix = (matrix, criteria) => {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = matrix[i][j] * criteria[i].weight;
      }
    }
    return matrix;
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

  //Metodo de Moora Base
  const mooraBase = (matrix, criteria) => {
    let vArray = [];
    for (let j = 0; j < matrix.length; j++) {
      let vx = 0;
      for (let i = 0; i < criteria.length; i++) {
        if (criteria[i].kind === "max") {
          vx = vx + matrix[i][j];
        } else {
          vx = vx - matrix[i][j];
        }
      }
      vArray.push(vx);
    }
    return vArray;
  };

  //Metodo
  const mooraReferencePoint = (matrix, criteria) => {
    //Obtener Alternativa Ideal
    let ideal = [];
    for (let i = 0; i < criteria.length; i++) {
      if (criteria[i].kind === "max") {
        ideal.push(max(matrix[i]));
      } else {
        ideal.push(min(matrix[i]));
      }
    }
    console.log(ideal);
    //Comparacion de matrix con alternativa ideal
    let comparedMatrix = [];
    for (let j = 0; j < matrix.length; j++) {
      let comparedAlternativeArray = [];
      for (let i = 0; i < criteria.length; i++) {
        let result = Math.abs(matrix[i][j] - ideal[i]);
        comparedAlternativeArray.push(result);
      }
      comparedMatrix.push(comparedAlternativeArray);
    }
    //Obtengo el valor maximo de cada alternativa
    let maxValues = [];
    for (let i = 0; i < comparedMatrix.length; i++) {
      let value = max(comparedMatrix[i]);
      maxValues.push(value);
    }
    return maxValues;
  };

  //Transforma la matriz resultado
  const toResultMatrix = (matrix, alternatives) => {
    let resultMatrix = [];
    for (let i = 0; i < alternatives.length; i++) {
      resultMatrix.push({
        name: alternatives[i].name,
        value: matrix[i],
      });
    }
    return resultMatrix;
  };

  //Funcion de Calculo
  const calculate = () => {
    setIsLoading(true);
    //Matriz Global
    var matrix = [];
    var result = null;
    series(
      [
        function (callback) {
          //Configuracion Inicial
          //Seteo Columnas de Tabla
          criteriaToColumn(criteria);
          //Paso los valores de cada criterio a una matriz para poder trabajarla
          matrix = toMatrix(criteria, alternatives);
          //Normalizar Matriz
          matrix = normalizeByRootSum(matrix);
          setNormalizedMatrix(matrixToJson(alternatives, matrix, criteria));
          //Ponderar Matrix
          matrix = ponderateMatrix(matrix, criteria);
          setPonderatedMatrix(matrixToJson(alternatives, matrix, criteria));
          //Moora Base
          if (mooraMethod === "referencePoint") {
            result = mooraReferencePoint(matrix, criteria);
            changeResultTableColumn();
          } else {
            //Moora con Punto de referencia
            result = mooraBase(matrix, criteria);
          }
          callback(null, "Moora");
        },
        function (callback) {
          setResultMatrix(toResultMatrix(result, alternatives));
          callback(null, "Resultado");
        },
      ],
      // optional callback
      function (err, results) {
        //Terminar Carga
        setIsLoading(false);
      }
    );
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
          <MooraMethod
            setMooraMethod={setMooraMethod}
            next={next}
            calculate={calculate}
          />
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
              <h3>Matriz Normalizada</h3>
              <Table
                columns={tableColumns}
                dataSource={normalizedMatrix}
                pagination={false}
              />
              <h3>Matriz Ponderada</h3>
              <Table
                columns={tableColumns}
                dataSource={ponderatedMatrix}
                pagination={false}
              />
              <h3>Resultado</h3>
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
    <div className="moora">
      <h2>MOORA</h2>
      <div className="moora-content">
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <a href="/home">
          <Button shape="round" style={{ marginTop: 15 }}>
            Menú Principal
          </Button>
        </a>
        <a href="/home/moora">
          <Button
            shape="round"
            type="primary"
            style={{ marginLeft: 15 }}
            onClick={() => goTo(0)}
          >
            Calcular de Nuevo
          </Button>
        </a>
      </div>
    </div>
  );
}
