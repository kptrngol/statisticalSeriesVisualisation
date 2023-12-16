"use strict"
// bar with second view for creating second histogram 
// possibility to compare multiple of them

//global functions
const xRanges = {};
let k = undefined;
let n = undefined;
let example = undefined;
let row = undefined;
let average = undefined;
let D = undefined;

// INPUT 
// CSV UPLOAD
// GENERATING ARRAY / THROWING ERRORS

// k - number of classes, range of variation class, exact classes, number of statistical units for each class
function calculateRow () {

  example = [2500,1533,1222,1231,4534,3432,1211,1211,3232,1111,233,3434,333,111,222,434, 1500, 1600, 1400, 1566,1455, 123,11,1142,333, 910,890,400,500];
  row = [...example].sort((a,b)=>a-b);

  n = row.length;

  k = Math.round(Math.sqrt(n));

  const varRange = (row[row.length-1]-row[0])/k;

  const classValues = [row[0]];

  for (let i = 0; i < k; i++) {
    let classCurrentValue = classValues[classValues.length-1];

    classCurrentValue+=varRange;
    classValues.push(classCurrentValue);
  }
  
  // creating object that stores all variation classes
    
  for (let i = 0; i < k; i++){
    xRanges[`x${i} to x${i+1}`] = [classValues[i],classValues[i+1],[]];
  }

  // counting number of units for each variation range
  for (const el of row) {
    for (let i = 0; i < k; i++) {
      const x0 = xRanges[`x${i} to x${i+1}`];

      if (el > x0[0] && el <= x0[1]){
        x0[2].push(el);
      }
    }
  }

  // storing number of units in xRanges object
  for (let i = 0; i < k; i++){
    const x0 = xRanges[`x${i} to x${i+1}`]
    const unitsNumber = x0[2].length;
    x0[3] = unitsNumber;
  }  

  // Arithmetic_average
  let sumForAverage = 0;
  [...example].forEach((val)=>{
    sumForAverage+=val;
  })
  average = sumForAverage/n

  // Mode

  function modeSearch() {
    // creating an array of unit numbers
    const classesQuantity = [];
    for (let i = 0; i < k; i++){
      const x0 = xRanges[`x${i} to x${i+1}`]
      classesQuantity.push(x0[3]);
    }  
  
    // finding the highest number
    let highestClassQuantity = classesQuantity[0];
  
    for (const el of classesQuantity) {
      if (el > highestClassQuantity) {
        highestClassQuantity = el;
      }
    }

    // calculating mode
    if ((hasDuplicates(highestClassQuantity,classesQuantity) === false) && (isMarginal(highestClassQuantity,classesQuantity) === false)) {
      const nIposition = classesQuantity.indexOf(highestClassQuantity);
      const modePositionValue = classesQuantity[nIposition];
      const prevPositionValue = classesQuantity[nIposition-1];
      const nextPositionValue = classesQuantity[nIposition+1];
      const x0 = xRanges[`x${nIposition} to x${nIposition+1}`][0];
      const x1 = xRanges[`x${nIposition} to x${nIposition+1}`][1];
      
      //calculating

      D = (modePositionValue - prevPositionValue) / ((modePositionValue - prevPositionValue + modePositionValue + nextPositionValue) * (x1 - x0))
      D += x0;
      console.log(D);
    } else {
      D = "Mode interpolation is not found"
    }

  }
  modeSearch()

  
}

// creating text interface with upper values 
function visualiseData() {
  //intro
  let exampleVis = document.createElement("p")
  exampleVis.className = "h4";
  exampleVis.innerHTML = `Next, you can find an example data sample for which this app will create statistical classes and match them with sample units.\n${example}`;
  document.querySelector("#hook").append(exampleVis);

  // table with main metrics
  let tblMetrics = document.createElement("div");
  tblMetrics.className = "h5 table flex";
  tblMetrics.style.flexDirection ="column"
  tblMetrics.id = "main-metrics-data"
  document.querySelector("#metrics-table-hook").append(tblMetrics);

  // populating the table with data
  
  let tableData = [["Number_of_units",n],["Number_of_classes",k],["Arithmetic_average",average],["Mode_interpolation",D]];

  for (const el of tableData){
    const tblMetricsCell = document.createElement("div");
    tblMetricsCell.className = "table-cell";
    tblMetricsCell.id = `${el[0]}`
    document.querySelector("#main-metrics-data").append(tblMetricsCell);
  }

  for (const el of tableData){
    const tblMetricsCellData = document.createElement("p");
    tblMetricsCellData.innerText = `${el[0]}: ${el[1]}`;
    document.querySelector(`#${el[0]}`).append(tblMetricsCellData);
  }


}

//visualisation with chart.js
function draw () {
  const classes = [];
  const number = [];

  for (let i = 0; i < k; i++) {
      let variationClass = `${xRanges[`x${i} to x${i+1}`][0]} - ${xRanges[`x${i} to x${i+1}`][1]}`;
      classes.push(`${variationClass}`);
      let unitsNumber = xRanges[`x${i} to x${i+1}`][3];
      number.push(`${unitsNumber}`);
  }

  const ctx = document.getElementById('myChart').getContext('2d');
  
  const chart = new Chart(
    ctx, 
    {
    type: 'bar',
    data: {
      labels: classes,
      datasets: [{
        label: 'Number of statistical units',
        data: number,
        backgroundColor: 'purple',
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage:1
    }]
  },
    options: {
      scales: {
        xAxes: [{
          display: false,
          barPercentage: 3,
          ticks: {
            max: 3,
          }
        }, {
          display: true,
          ticks: {
            autoSkip: false,
            max: 4,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

//extra functions 
const hasDuplicates = function (val, arr) {

  let count = 0;

  arr.forEach((el)=>{
    if (el === val){
      count++;
    };
  })
  
  if (count >= 2) {
    return true;
  } else {
    return false;
  }
}

const isMarginal = function (val, arr) {
  if ((arr.indexOf(val) !== 0) && (arr.indexOf(val) !== (arr.length-1))) {
    return false;
  } else {
    return true;
  }
}
//init
async function init() {
  await calculateRow()
  console.log(xRanges)
  await visualiseData();
  draw();

}

init()

