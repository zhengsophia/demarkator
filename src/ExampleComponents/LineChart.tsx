import type { Component } from "solid-js";
import { Show, createSignal } from "solid-js";
import embed from "vega-embed";
import { onMount } from "solid-js";
import styles from "../App.module.css";
import { stratify } from "d3-hierarchy";
import spec from "./LineChart.json";
import TreeDiagram from "./TreeDiagram";

function processLineChartDataMarks(data: any) {
  const internalDataModel = [];
  const topLevelID = "topLevel";

  internalDataModel.push({ id: topLevelID });

  // process mark data into a tree model

  for (let i = 0; i < data.length; i++) {
    let datum = data[i].datum;
    let price = datum.price;

    const node = {
      name: "Datum " + i + ": " + price.toString(),
      id: price.toString(),
      parentId: topLevelID,
    };

    internalDataModel.push(node);
  }

  return stratify()(internalDataModel);
}

const LineChart: Component = () => {
  let vis: any;

  const [hierarchy, setHierarchy] = createSignal(false);

  onMount(async () => {
    //@ts-ignore
    const result = embed(vis, spec, { actions: false });

    // console.log('Component mounted. Sleeping for 5 seconds...');

    // // Sleep for 5 seconds
    // await new Promise(resolve => setTimeout(resolve, 2000));

    // console.log('5 seconds passed. Continuing with component logic...');


    result.then(function (embedResult: any) {
      //
      let rectx = 0;
      let recty = 0;

      const data = embedResult.view.data("marks");

      console.log("vega view", embedResult.view);

      //@ts-ignore
      setHierarchy(processLineChartDataMarks(data));
    });
  });

  return (
    <div class={styles.App}>
      <div class={styles.container}>
      <div class={styles.scrollContainerChild}>
        <Show when={!!hierarchy()} fallback={<div>calculating hierarchy</div>}>
          <TreeDiagram hierarchy={hierarchy}></TreeDiagram>
        </Show>
      </div>
      <div class={styles.fixedContainerChild}
        ref={vis}
        onClick={() => {
          console.log("clicked vis div");
        }}
      ></div>
    </div>
    </div>
  );
};


// const LineChart: Component = () => {
//   let vis: any;
//   onMount(() => {
//     //@ts-ignore
//     const result = embed(vis, spec);

//     // line graph
//     result.then((embedResult) => {
//       var rectx = 0;
//       var recty = 0;

//       const data = embedResult.view.data("marks");
//       console.log('mark data',data);
//       var svgRect = document.getElementById("rects");
//       const svgNamespace = "http://www.w3.org/2000/svg";
//       let rectElement = document.createElementNS(svgNamespace, "rect");
//       let textElement = document.createElementNS(svgNamespace, "text");

//       // one loop because all datapoints are at the same level inside of the tree
//       for (var i = 0; i < data.length; i++) {
//         console.log(rectElement, recty + i);
//         rectElement.setAttribute("x", rectx.toString());
//         rectElement.setAttribute("y", (recty + 6 * i).toString());
//         rectElement.setAttribute("width", "50");
//         rectElement.setAttribute("height", "5");
//         rectElement.setAttribute("fill", "#D9D9D9");

//         textElement.setAttribute("x", (rectx + 10).toString());
//         textElement.setAttribute("y", (recty + 6 * i + 3).toString());
//         textElement.setAttribute("font-size", "2");
//         textElement.setAttribute("fill", "black");

//         textElement.textContent =
//           "Datum " +
//           i.toString() +
//           ": " +
//           embedResult.view.data("marks")[i].datum.price.toString();

//         svgRect?.appendChild(rectElement);
//         svgRect?.appendChild(textElement);
//         rectElement = document.createElementNS(svgNamespace, "rect");
//         textElement = document.createElementNS(svgNamespace, "text");
//       }

//       // console.log(embedResult.view.data('marks')[0].datum.price);
//       console.log(embedResult.view.data("marks")[0]);

//       // stacked bar graph
//       // result.then((embedResult) => {

//       //   console.log(embedResult.view.data('marks'));

//       //   let rectx = 0;
//       //   let recty = 0;

//       //   const data = embedResult.view.data('marks')
//       //   var svgRect = document.getElementById("rects");
//       //   const svgNamespace = 'http://www.w3.org/2000/svg';
//       //   let barElement = document.createElementNS(svgNamespace, 'rect');
//       //   let stackElement = document.createElementNS(svgNamespace, 'rect');
//       //   let dataElement = document.createElementNS(svgNamespace, 'rect');
//       //   let textElement = document.createElementNS(svgNamespace, 'text');

//       //   let question = data[0].datum.question;
//       //   let type = data[0].datum.type;

//       //   for (let i = 0; i < data.length; i++) {

//       //     console.log(dataElement, (recty + i));
//       //     let datum = data[i].datum;

//       //     if(question != datum.question || i == 0) {
//       //       console.log(question, datum.question)
//       //       question = datum.question

//       //       stackElement.setAttribute('x', (rectx + 20).toString());
//       //       stackElement.setAttribute('y', (recty + 6).toString());
//       //       stackElement.setAttribute('width', '60');
//       //       stackElement.setAttribute('height', '5');
//       //       stackElement.setAttribute('fill', '#D9D9D9');

//       //       textElement.setAttribute('x', (rectx + 40).toString());
//       //       textElement.setAttribute('y', (recty + 9).toString());
//       //       textElement.setAttribute('font-size', '3');

//       //       recty += 8;

//       //       textElement.textContent = 'Stack: ' + question.toString();

//       //       svgRect?.appendChild(stackElement);
//       //       svgRect?.appendChild(textElement);

//       //       stackElement = document.createElementNS(svgNamespace, 'rect');
//       //       textElement = document.createElementNS(svgNamespace, 'text');
//       //     }

//       //     if(type != datum.type || i == 0) {
//       //       type = datum.type

//       //       barElement.setAttribute('x', (rectx + 30).toString());
//       //       barElement.setAttribute('y', (recty + 6).toString());
//       //       barElement.setAttribute('width', '50');
//       //       barElement.setAttribute('height', '5');
//       //       barElement.setAttribute('fill', '#D9D9D9');

//       //       textElement.setAttribute('x', (rectx + 30).toString());
//       //       textElement.setAttribute('y', (recty + 9).toString());
//       //       textElement.setAttribute('font-size', '3');

//       //       recty += 8;

//       //       textElement.textContent = 'Bar: ' + type.toString();

//       //       svgRect?.appendChild(barElement);
//       //       svgRect?.appendChild(textElement);

//       //       barElement = document.createElementNS(svgNamespace, 'rect');
//       //       textElement = document.createElementNS(svgNamespace, 'text');
//       //     }

//       //     dataElement.setAttribute('x', (rectx + 40).toString());
//       //     dataElement.setAttribute('y', (recty + 8).toString());
//       //     dataElement.setAttribute('width', '40');
//       //     dataElement.setAttribute('height', '5');
//       //     dataElement.setAttribute('fill', '#D9D9D9');

//       //     textElement.setAttribute('x', (rectx + 45).toString());
//       //     textElement.setAttribute('y', (recty + 11).toString());
//       //     textElement.setAttribute('font-size', '3');
//       //     textElement.setAttribute('fill', 'black');

//       //     recty += 10;

//       //     textElement.textContent = 'Datum ' + (i+1).toString() + ': ' + data[i].datum.percentage.toString();

//       //     svgRect?.appendChild(dataElement);
//       //     svgRect?.appendChild(textElement);

//       //     dataElement = document.createElementNS(svgNamespace, 'rect');
//       //     textElement = document.createElementNS(svgNamespace, 'text');
//       //   };
//     });
//   });

//   return (
//     <div>
//       <svg width="500" height="8000">
//         <svg
//           id="rects"
//           viewBox="0 0 100 100"
//           xmlns="http://www.w3.org/2000/svg"
//         ></svg>
//       </svg>

//       <div ref={vis}></div>
//     </div>
//   );
// };

export default LineChart;
