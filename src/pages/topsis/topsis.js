import React, { useState } from "react";
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
  const [sMatrix, setsMatrix] = useState([]);
  const [resultMatrix, setResultMatrix] = useState([]);

  const [current, setCurrent] = useState(0);
  const [criteria, setCriteria] = useState([]);

  const [normalization, setNormalization] = useState(null);
  const [alternatives, setAlternatives] = useState(null);
  const [distance, setDistance] = useState(0);

  //Tables Columns
  const [tableColumns, setTableColumns] = useState([
    {
      title: "Alternativa",
      dataIndex: "name",
      key: "name",
    },
  ]);
  //S Table Columns
  const sTableColumns = [
    {
      title: "Alternativa",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "S+",
      dataIndex: "splus",
      key: "splus",
    },
    {
      title: "S-",
      dataIndex: "sminus",
      key: "sminus",
    },
  ];

  //Result Table Column
  const resultTableColumn = [
    {
      title: "Alternativa",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "C*",
      dataIndex: "value",
      key: "value",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.value - b.value,
    },
  ];

  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const goTo = (page) => {
    setCurrent(page);
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

  //Create Ideal Matrix
  const createIdealMatrix = (matrix) => {
    let idealMatrix = [null, null];
    //Buscar Maximo y Minimo de Cada Fila
    for (let i = 0; i < matrix.length; i++) {
      let maxV = max(matrix[i]);
      let minV = min(matrix[i]);

      if (criteria[i].kind === "max") {
        maxV = max(matrix[i]);
        minV = min(matrix[i]);
      } else {
        maxV = min(matrix[i]);
        minV = max(matrix[i]);
      }
      idealMatrix[i] = [maxV, minV];
    }
    return idealMatrix;
  };

  //Create ToIdealMatrix
  const createToIdealMatrix = (matrix, idealMatrix, distance) => {
    let toIdealMatrix = cloneDeep(matrix);
    //Valor Absoluto al cuadrado del (valor de alternativa - ideal)
    for (let i = 0; i < idealMatrix.length; i++) {
      for (let j = 0; j < toIdealMatrix[i].length; j++) {
        toIdealMatrix[i][j] = Math.pow(
          Math.abs(toIdealMatrix[i][j] - idealMatrix[i][0]),
          distance
        );
      }
    }
    return toIdealMatrix;
  };

  //Create ToAntiIdealMatrix
  const createToAntiIdealMatrix = (matrix, idealMatrix, distance) => {
    let toAntiIdealMatrix = cloneDeep(matrix);
    //Valor Absoluto al cuadrado del (valor de alternativa - ideal)
    for (let i = 0; i < idealMatrix.length; i++) {
      for (let j = 0; j < toAntiIdealMatrix[i].length; j++) {
        toAntiIdealMatrix[i][j] = Math.pow(
          Math.abs(toAntiIdealMatrix[i][j] - idealMatrix[i][1]),
          distance
        );
      }
    }
    return toAntiIdealMatrix;
  };

  //Create S+ Array
  const createSPlusArray = (matrix, distance) => {
    let length = matrix[0].length;
    let sPlusArray = [];
    for (let i = 0; i < length; i++) {
      let sum = 0;
      //Sumo todos los valores
      for (let j = 0; j < matrix.length; j++) {
        sum = sum + matrix[j][i];
      }
      //Calculo el valor de S+ y lo pusheo
      sum = Math.pow(sum, 1 / distance);
      sPlusArray.push(sum);
    }
    return sPlusArray;
  };

  //Create S- Array
  const createSMinusArray = (matrix, distance) => {
    let length = matrix[0].length;
    let sMinusArray = [];
    for (let i = 0; i < length; i++) {
      let sum = 0;
      //Sumo todos los valores
      for (let j = 0; j < matrix.length; j++) {
        sum = sum + matrix[j][i];
      }
      //Calculo el valor de S+ y lo pusheo
      sum = Math.pow(sum, 1 / distance);
      sMinusArray.push(sum);
    }
    return sMinusArray;
  };

  //Create C* Array
  const createCArray = (sPlusArray, sMinusArray) => {
    console.log(sMinusArray);
    console.log(sPlusArray);
    let cArray = [];
    let length = sPlusArray.length;
    for (let i = 0; i < length; i++) {
      let ci = sMinusArray[i] / (sPlusArray[i] + sMinusArray[i]);
      cArray.push(ci);
    }
    return cArray;
  };

  //Creats the Matrix between S+ and S-
  const createSMatrix = (sPlusArray, sMinusArray, alternatives) => {
    let sMatrix = [];
    for (let i = 0; i < sPlusArray.length; i++) {
      sMatrix.push({
        name: alternatives[i].name,
        splus: sPlusArray[i],
        sminus: sMinusArray[i],
      });
    }
    setsMatrix(sMatrix);
  };

  //Create Final Matrix - Joins C* array with Alternatives for a final show
  const createFinalMatrix = (cArray, alternatives) => {
    let finalMatrix = [];
    for (let i = 0; i < alternatives.length; i++) {
      finalMatrix.push({ name: alternatives[i].name, value: cArray[i] });
    }
    return finalMatrix;
  };

  const normalizeMatrix = (matrix, alternatives, criteria) => {
    //First Step - Normalice Matrix
    switch (normalization) {
      case "maximum":
        matrix = normalizeByMax(matrix, criteria);
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
      }
    }
    return matrix;
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
          //Trabajo con matriz ideal - Le paso la copia de la matriz original y la matriz ideal (a+;a-)
          var toIdealMatrix = createToIdealMatrix(
            matrix,
            idealMatrix,
            distance
          );
          //Matriz Distancia al Anti Ideal
          //Trabajo con matriz ideal - Le paso la copia de la matriz original y la matriz ideal (a+;a-)
          var toAntiIdealMatrix = createToAntiIdealMatrix(
            matrix,
            idealMatrix,
            distance
          );
          //Calculamos los Array de S+ y S-
          //Calculamos Array S+
          var sPlusArray = createSPlusArray(toIdealMatrix, distance);
          //Calculamos Array S-
          var sMinusArray = createSMinusArray(toAntiIdealMatrix, distance);
          //Seteamos para mostrar S
          console.log(sPlusArray);
          console.log(sMinusArray);
          createSMatrix(sPlusArray, sMinusArray, alternatives);
          //Calculamos C*
          var cArray = createCArray(sPlusArray, sMinusArray);
          //Creamos Matriz Final
          setResultMatrix(createFinalMatrix(cArray, alternatives));
          callback(null, "Fin");
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
          <NormalizationForm
            distance={true}
            setNormalization={setNormalization}
            next={next}
            calculate={calculate}
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
              <h3>Matriz S</h3>
              <Table
                columns={sTableColumns}
                dataSource={sMatrix}
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
        <a href="/home">
          <Button shape="round" style={{ marginTop: 15 }}>
            Menú Principal
          </Button>
        </a>
        <a href="/home/lineal">
          <Button shape="round" type="primary" style={{ marginLeft: 15 }}>
            Calcular de Nuevo
          </Button>
        </a>
      </div>
    </div>
  );
}
