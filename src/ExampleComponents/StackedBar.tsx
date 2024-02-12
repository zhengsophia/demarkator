import type { Component } from 'solid-js';
import embed from 'vega-embed';
import { onMount } from 'solid-js';
import styles from './App.module.css';
import spec from './StackedBar.json'

const StackedBar: Component = () => {
    let vis: any; 
    onMount(() => {

        //@ts-ignore
        const result = embed(vis, spec);
    
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
        
        <div>
          <svg width="500" height="8000">
            <svg
              id="rects"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </svg>
    
          <div ref={vis}></div>
        </div>
      );

}


export default StackedBar; 