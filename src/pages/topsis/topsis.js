import React, { useState, useEffect } from "react";
//Components
import { Steps, Button, Table } from "antd";
import CriteriaForm from "../../forms/CriteriaForm";
import AlternativesForm from "../../forms/AlternativesForm";
import MatrixTable from "../../components/MatrixTable";
import {
  normalizeByMax,
  normalizeByRootSum,
  normalizeByMaxMinDiff,
  normalizeBySum,
} from "../../utils/Normalization";
import { toMatrix } from "../../utils/MatrixFunctions";
import NormalizationForm from "../../forms/NormalizationForm";
import { cloneDeep, max, min } from "lodash";
import { series } from "async";

import "./topsis.scss";

export default function Topsis() {
  //Loading State
  const [isLoading, setIsLoading] = useState(true);

  //Matrix
  const [normalizedMatrix, setNormalizedMatrix] = useState([]);
  const [ponderatedMatrix, setPonderatedMatrix] = useState([]);
  const [resultMatrix, setResultMatrix] = useState([]);

  const [current, setCurrent] = useState(0);
  const [criteria, setCriteria] = useState([]);

  const [normalization, setNormalization] = useState(null);
  const [alternatives, setAlternatives] = useState(null);
  const [distance, setDistance] = useState(0);

  //Table Column
  const [tableColumns, setTableColumns] = useState([
    {
      title: "Alternativa",
      dataIndex: "name",
      key: "name",
    },
  ]);

  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

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

  //TESTING ZONE
  useEffect(() => {
    let testMatrix = [
      [0.125, 0.5],
      [0.05, 0.2],
    ];
    let testCriteria = [
      { name: "crit1", weight: 0.5, kind: "max" },
      { name: "crit2", weight: 0.2, kind: "min" },
    ];
    createIdealMatrix(testMatrix, testCriteria);
  }, []);

  //Create Ideal Matrix
  const createIdealMatrix = (matrix, criteria) => {
    console.log(matrix, criteria);
    let idealMatrix = [null, null];
    //Buscar Maximo y Minimo de Cada Fila
    for (let i = 0; i < matrix.length; i++) {
      let maxV = max(matrix[i]);
      let minV = min(matrix[i]);
      if (criteria[i].kind === "max") {
        idealMatrix[i] = [maxV, minV];
      } else {
        idealMatrix[i] = [minV, maxV];
      }
    }
    return idealMatrix;
  };

  const createToIdealMatrix = (matrix, idealMatrix) => {};

  const normalizeMatrix = (matrix, alternatives, criteria) => {
    //First Step - Normalice Matrix
    switch (normalization) {
      case "maximum":
        matrix = normalizeByMax(matrix);
        break;
      case "sum":
        matrix = normalizeBySum(matrix);
        break;
      case "root":
        matrix = normalizeByRootSum(matrix);
        break;
      case "difference":
        matrix = normalizeByMaxMinDiff(matrix);
        break;
      default:
        break;
    }
    //Unify normalized matrix with Alternatives
    //UTILIZAR FUNCION MATRIX TO JSON
    setNormalizedMatrix(matrixToJson(alternatives, matrix, criteria));
    //Returns normalized matrix without indexes to keep working
    return matrix;
  };

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

  //Esta funcion pondera la matriz
  const ponderateMatrix = (matrix, criteria) => {
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = matrix[i][j] * criteria[i].weight;
        console.log(matrix);
      }
    }
    return matrix;
  };

  //Esta funcion sumariza y retorna el resultado final
  const sumarize = (matrix, alternatives) => {
    var results = [];
    for (var j = 0; j < matrix[0].length; j++) {
      var sum = 0;
      for (var i = 0; i < matrix.length; i++) {
        sum += matrix[i][j];
      }
      results.push({
        name: alternatives[j].name,
        value: sum,
      });
    }
    return results;
  };

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
          callback(null, "Configuracion Inicial");
        },
        function (callback) {
          //Normalizacion - Se modifica la matriz global y tambien se guarda la normalizada para mostrar
          //dentro de la funcion normalize
          matrix = normalizeMatrix(matrix, alternatives, criteria);
          callback(null, "Normalizada");
        },
        function (callback) {
          //Ponderamos la matriz
          matrix = ponderateMatrix(matrix, criteria);
          //Mostramos la matriz ponderada
          var pondMatrix = cloneDeep(matrix);
          setPonderatedMatrix(matrixToJson(alternatives, pondMatrix, criteria));
          callback(null, "Ponderada");
        },
        function (callback) {
          //Distancia al Ideal
          var idealMatrix = createIdealMatrix(matrix, criteria);
          //Matriz Distancia al Ideal
          var toIdealMatrix = cloneDeep(matrix);
          //Trabajo con matriz ideal

          //Matriz Distancia al Anti Ideal
          var toAntiIdealMatrix = cloneDeep(matrix);
        },
        function (callback) {
          //DE LA MATRIZ PONDERADA LE RESTAMOS LOS VALORES AL MAXIMO O AL MINIMO

          //Sumarizamos los pesos y obtenemos el resultado final
          setResultMatrix(sumarize(matrix, alternatives));
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
      content: (
        <>
          <Button onClick={calculate}>Calcular</Button>
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
