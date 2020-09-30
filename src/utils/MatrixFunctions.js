//This function gets the criteria and alternatives and return them as a simplified matrix
export const toMatrix = (criteria, alternatives) => {
  var matrix = [];
  for (var i = 0; i < criteria.length; i++) {
    let criteriaData = [];
    for (var y = 0; y < alternatives.length; y++) {
      criteriaData.push(parseFloat(alternatives[y][criteria[i].name]));
    }
    matrix.push(criteriaData);
  }
  return matrix;
};
