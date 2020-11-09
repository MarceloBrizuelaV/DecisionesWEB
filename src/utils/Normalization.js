import { cloneDeep, min, max } from "lodash";

//This doc contains normalization methods

//This function normalices by the Max and Min difference
//Input: Matrix; Output: Normalized Matrix
export const normalizeByMaxMinDiff = (matrix) => {
  var normalizedMatrix = cloneDeep(matrix);
  //This for runs through every criteria
  for (var i = 0; i < normalizedMatrix.length; i++) {
    //This for runs through every alternative under a certain criteria and finds the maximum and minimum
    var maxValue = max(normalizedMatrix[i]);
    var minValue = min(normalizedMatrix[i]);
    var maxMinDiff = maxValue - minValue;
    for (var z = 0; z < normalizedMatrix[i].length; z++) {
      normalizedMatrix[i][z] = (normalizedMatrix[i][z] - minValue) / maxMinDiff;
    }
  }
  return normalizedMatrix;
};

//This function normalizes by the root square sum
export const normalizeByRootSum = (matrix) => {
  var normalizedMatrix = cloneDeep(matrix);
  //This for runs through every criteria
  for (var i = 0; i < normalizedMatrix.length; i++) {
    //This for runs through every alternative under a certain criteria and sums the square powers
    var criteriaSum = 0;
    for (var y = 0; y < normalizedMatrix[i].length; y++) {
      criteriaSum += Math.pow(normalizedMatrix[i][y], 2);
    }
    var criteriaSumSqrt = Math.pow(criteriaSum, 0.5);
    //We divide each value by the sum of every square power
    for (var z = 0; z < normalizedMatrix[i].length; z++) {
      normalizedMatrix[i][z] = normalizedMatrix[i][z] / criteriaSumSqrt;
    }
  }
  return normalizedMatrix;
};

//This function normalizes by the maximum
export const normalizeByMax = (matrix, criteria) => {
  var normalizedMatrix = cloneDeep(matrix);
  //This for runs through every criteria
  for (var i = 0; i < normalizedMatrix.length; i++) {
    //This for runs through every alternative under a certain criteria and finds the maximum
    var maxValue = null;
    if (criteria[i].kind === "max") {
      maxValue = max(normalizedMatrix[i]);
      for (let z = 0; z < normalizedMatrix[i].length; z++) {
        normalizedMatrix[i][z] = normalizedMatrix[i][z] / maxValue;
      }
    } else {
      maxValue = min(normalizedMatrix[i]);
      for (let z = 0; z < normalizedMatrix[i].length; z++) {
        normalizedMatrix[i][z] = maxValue / normalizedMatrix[i][z];
      }
    }
  }
  return normalizedMatrix;
};

//Esta funcion normaliza la Matriz por Suma
export const normalizeBySum = (matrix) => {
  var normalizedMatrix = cloneDeep(matrix);
  //Runs through every criteria
  for (var i = 0; i < normalizedMatrix.length; i++) {
    //Runs through each alternative in a criteria and sums them.
    var criteriaSum = 0;
    for (var y = 0; y < normalizedMatrix[i].length; y++) {
      criteriaSum += normalizedMatrix[i][y];
    }
    //Divides each alternative value by the sum
    for (var z = 0; z < normalizedMatrix[i].length; z++) {
      normalizedMatrix[i][z] = normalizedMatrix[i][z] / criteriaSum;
    }
  }
  return normalizedMatrix;
};
