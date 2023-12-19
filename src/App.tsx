import type { Component } from 'solid-js';
import embed from 'vega-embed';
import compile from 'vega-lite';
import { Scene, Spec, parse, View, SceneItem, SceneGroup } from 'vega';
import { onMount } from 'solid-js';
import styles from './App.module.css';

const App: Component = () => {

  
  let vis: any;
  const spec : any = 
  {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "A diverging stacked bar chart for sentiments towards a set of eight questions, displayed as percentages with neutral responses straddling the 0% mark",
  "data": {
    "values": [
      {"question": "Question 1", "type": "Strongly disagree", "value": 24, "percentage": 0.7},
      {"question": "Question 1", "type": "Disagree", "value": 294, "percentage": 9.1},
      {"question": "Question 1", "type": "Neither agree nor disagree", "value": 594, "percentage": 18.5},
      {"question": "Question 1", "type": "Agree", "value": 1927, "percentage": 59.9},
      {"question": "Question 1", "type": "Strongly agree", "value": 376, "percentage": 11.7},
      {"question": "Question 2", "type": "Strongly disagree", "value": 2, "percentage": 18.2},
      {"question": "Question 2", "type": "Disagree", "value": 2, "percentage": 18.2},
      {"question": "Question 2", "type": "Neither agree nor disagree", "value": 0, "percentage": 0},
      {"question": "Question 2", "type": "Agree", "value": 7, "percentage": 63.6},
      {"question": "Question 2", "type": "Strongly agree", "value": 11, "percentage": 0},
      {"question": "Question 3", "type": "Strongly disagree", "value": 2, "percentage": 20},
      {"question": "Question 3", "type": "Disagree", "value": 0, "percentage": 0},
      {"question": "Question 3", "type": "Neither agree nor disagree", "value": 2, "percentage": 20},
      {"question": "Question 3", "type": "Agree", "value": 4, "percentage": 40},
      {"question": "Question 3", "type": "Strongly agree", "value": 2, "percentage": 20},
      {"question": "Question 4", "type": "Strongly disagree", "value": 0, "percentage": 0},
      {"question": "Question 4", "type": "Disagree", "value": 2, "percentage": 12.5},
      {"question": "Question 4", "type": "Neither agree nor disagree", "value": 1, "percentage": 6.3},
      {"question": "Question 4", "type": "Agree", "value": 7, "percentage": 43.8},
      {"question": "Question 4", "type": "Strongly agree", "value": 6, "percentage": 37.5},
      {"question": "Question 5", "type": "Strongly disagree", "value": 0, "percentage": 0},
      {"question": "Question 5", "type": "Disagree", "value": 1, "percentage": 4.2},
      {"question": "Question 5", "type": "Neither agree nor disagree", "value": 3, "percentage": 12.5},
      {"question": "Question 5", "type": "Agree", "value": 16, "percentage": 66.7},
      {"question": "Question 5", "type": "Strongly agree", "value": 4, "percentage": 16.7},
      {"question": "Question 6", "type": "Strongly disagree", "value": 1, "percentage": 6.3},
      {"question": "Question 6", "type": "Disagree", "value": 1, "percentage": 6.3},
      {"question": "Question 6", "type": "Neither agree nor disagree", "value": 2, "percentage": 12.5},
      {"question": "Question 6", "type": "Agree", "value": 9, "percentage": 56.3},
      {"question": "Question 6", "type": "Strongly agree", "value": 3, "percentage": 18.8},
      {"question": "Question 7", "type": "Strongly disagree", "value": 0, "percentage": 0},
      {"question": "Question 7", "type": "Disagree", "value": 0, "percentage": 0},
      {"question": "Question 7", "type": "Neither agree nor disagree", "value": 1, "percentage": 20},
      {"question": "Question 7", "type": "Agree", "value": 4, "percentage": 80},
      {"question": "Question 7", "type": "Strongly agree", "value": 0, "percentage": 0},
      {"question": "Question 8", "type": "Strongly disagree", "value": 0, "percentage": 0},
      {"question": "Question 8", "type": "Disagree", "value": 0, "percentage": 0},
      {"question": "Question 8", "type": "Neither agree nor disagree", "value": 0, "percentage": 0},
      {"question": "Question 8", "type": "Agree", "value": 0, "percentage": 0},
      {"question": "Question 8", "type": "Strongly agree", "value": 2, "percentage": 100}
    ]
  },
  "transform": [
    {
      "calculate": "if(datum.type === 'Strongly disagree',-2,0) + if(datum.type==='Disagree',-1,0) + if(datum.type =='Neither agree nor disagree',0,0) + if(datum.type ==='Agree',1,0) + if(datum.type ==='Strongly agree',2,0)",
      "as": "q_order"
    },
    {
      "calculate": "if(datum.type === 'Disagree' || datum.type === 'Strongly disagree', datum.percentage,0) + if(datum.type === 'Neither agree nor disagree', datum.percentage / 2,0)",
      "as": "signed_percentage"
    },
    {"stack": "percentage", "as": ["v1", "v2"], "groupby": ["question"]},
    {
      "joinaggregate": [
        {
          "field": "signed_percentage",
          "op": "sum",
          "as": "offset"
        }
      ],
      "groupby": ["question"]
    },
    {"calculate": "datum.v1 - datum.offset", "as": "nx"},
    {"calculate": "datum.v2 - datum.offset", "as": "nx2"}
  ],
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "nx",
      "type": "quantitative",
      "title": "Percentage"
    },
    "x2": {"field": "nx2"},
    "y": {
      "field": "question",
      "type": "nominal",
      "title": "Question",
      "axis": {
        "offset": 5,
        "ticks": false,
        "minExtent": 60,
        "domain": false
      }
    },
    "color": {
      "field": "type",
      "type": "nominal",
      "title": "Response",
      "scale": {
        "domain": ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"],
        "range": ["#C30D24", "#F3A583", "#CCCCCC", "#94C6DA", "#1770AB"],
        "type": "ordinal"
      }
    }
  }
}

// const spec : any =  {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "description": "Google's stock price over time.",
//   "data": {"url": "https://raw.githubusercontent.com/vega/vega/main/docs/data/stocks.csv"},
//   "transform": [{"filter": "datum.symbol==='GOOG'"}],
//   "mark": "line",
//   "encoding": {
//     "x": {"field": "date", "type": "temporal"},
//     "y": {"field": "price", "type": "quantitative"} }
// }

  onMount(() => {

    const result = embed(vis, spec);

    // line graph
    // result.then((embedResult) => {

    //   var rectx = 0;
    //   var recty = 0;
    
    //   const data = embedResult.view.data('marks')
    //   var svgRect = document.getElementById("rects");
    //   const svgNamespace = 'http://www.w3.org/2000/svg';
    //   let rectElement = document.createElementNS(svgNamespace, 'rect');
    //   let textElement = document.createElementNS(svgNamespace, 'text');

    //   for (var i = 0; i < data.length; i++) {
    //     console.log(rectElement, (recty + i));
    //     rectElement.setAttribute('x', (rectx).toString());
    //     rectElement.setAttribute('y', (recty + 6*i).toString());
    //     rectElement.setAttribute('width', '50');
    //     rectElement.setAttribute('height', '5');
    //     rectElement.setAttribute('fill', '#D9D9D9');

    //     textElement.setAttribute('x', (rectx + 10).toString());
    //     textElement.setAttribute('y', (recty + 6*i + 3).toString());
    //     textElement.setAttribute('font-size', '2');
    //     textElement.setAttribute('fill', 'black');
        
    //     textElement.textContent = 'Datum ' + i.toString() + ': ' + embedResult.view.data('marks')[i].datum.price.toString();

    //     svgRect?.appendChild(rectElement);
    //     svgRect?.appendChild(textElement);
    //     rectElement = document.createElementNS(svgNamespace, 'rect');
    //     textElement = document.createElementNS(svgNamespace, 'text');
    //   };

    //   // console.log(embedResult.view.data('marks')[0].datum.price);
    //   console.log(embedResult.view.data('marks')[0]);

      // stacked bar graph
      result.then((embedResult) => {

        console.log(embedResult.view.data('marks'));

        let rectx = 0;
        let recty = 0;
      
        const data = embedResult.view.data('marks')
        var svgRect = document.getElementById("rects");
        const svgNamespace = 'http://www.w3.org/2000/svg';
        let barElement = document.createElementNS(svgNamespace, 'rect');
        let stackElement = document.createElementNS(svgNamespace, 'rect');
        let dataElement = document.createElementNS(svgNamespace, 'rect');
        let textElement = document.createElementNS(svgNamespace, 'text');

        let question = data[0].datum.question;
        let type = data[0].datum.type;
  
        for (let i = 0; i < data.length; i++) {

          console.log(dataElement, (recty + i));
          let datum = data[i].datum;

          if(question != datum.question || i == 0) {
            console.log(question, datum.question)
            question = datum.question

            stackElement.setAttribute('x', (rectx + 20).toString());
            stackElement.setAttribute('y', (recty + 6).toString());
            stackElement.setAttribute('width', '60');
            stackElement.setAttribute('height', '5');
            stackElement.setAttribute('fill', '#D9D9D9');

            textElement.setAttribute('x', (rectx + 40).toString());
            textElement.setAttribute('y', (recty + 9).toString());
            textElement.setAttribute('font-size', '3');

            recty += 8;

            textElement.textContent = 'Stack: ' + question.toString();

            svgRect?.appendChild(stackElement);
            svgRect?.appendChild(textElement);

            stackElement = document.createElementNS(svgNamespace, 'rect');
            textElement = document.createElementNS(svgNamespace, 'text');
          }

          if(type != datum.type || i == 0) {
            type = datum.type

            barElement.setAttribute('x', (rectx + 30).toString());
            barElement.setAttribute('y', (recty + 6).toString());
            barElement.setAttribute('width', '50');
            barElement.setAttribute('height', '5');
            barElement.setAttribute('fill', '#D9D9D9');

            textElement.setAttribute('x', (rectx + 30).toString());
            textElement.setAttribute('y', (recty + 9).toString());
            textElement.setAttribute('font-size', '3');

            recty += 8;

            textElement.textContent = 'Bar: ' + type.toString();

            svgRect?.appendChild(barElement);
            svgRect?.appendChild(textElement);

            barElement = document.createElementNS(svgNamespace, 'rect');
            textElement = document.createElementNS(svgNamespace, 'text');
          }
          
          dataElement.setAttribute('x', (rectx + 40).toString());
          dataElement.setAttribute('y', (recty + 8).toString());
          dataElement.setAttribute('width', '40');
          dataElement.setAttribute('height', '5');
          dataElement.setAttribute('fill', '#D9D9D9');
  
          textElement.setAttribute('x', (rectx + 45).toString());
          textElement.setAttribute('y', (recty + 11).toString());
          textElement.setAttribute('font-size', '3');
          textElement.setAttribute('fill', 'black');

          recty += 10;

          textElement.textContent = 'Datum ' + (i+1).toString() + ': ' + data[i].datum.percentage.toString();
  
          svgRect?.appendChild(dataElement);
          svgRect?.appendChild(textElement);

          dataElement = document.createElementNS(svgNamespace, 'rect');
          textElement = document.createElementNS(svgNamespace, 'text');
        };
    });

  });

  return (
    <div class={styles.App}>
      <header class={styles.header}>
      
      <div class={styles.box}>
          <svg width="500" height="8000">
            <svg id="rects" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
          </svg>

          <div ref={vis}></div>
      </div>
      </header>
    </div>
  );
};

export default App;
