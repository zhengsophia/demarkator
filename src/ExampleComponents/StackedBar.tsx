import type { Component } from "solid-js";
import { Show, createSignal } from "solid-js";
import embed from "vega-embed";
import { onMount } from "solid-js";
import styles from "../App.module.css";
import spec from "./StackedBar.json";
import { stratify } from "d3-hierarchy";
import TreeDiagram from "./TreeDiagram";
import Datatable from "./Datatable";

function processStackedBarDataMarks(data: any) {
    const internalDataModel = [];
    const topLevelID = "topLevel";

    internalDataModel.push({ id: topLevelID });

    // process mark data into a tree model
    // TODO: make not reliant on the string spec itself
    let question = data[0].datum.question;
    let type = data[0].datum.type;

    console.log("mark data", data);

    for (let i = 0; i < data.length; i++) {
        let datum = data[i].datum;

        if (question != datum.question || i == 0) {
            question = datum.question;

            const node = {
                name: "Stack: " + question.toString(),
                id: question.toString(),
                parentId: topLevelID,
            };

            internalDataModel.push(node);
        }

        if (type != datum.type || i == 0) {
            type = datum.type;

            const node = {
                name: "Bar: " + type.toString(),
                id: question.toString() + "-" + type.toString(),
                parentId: question.toString(),
            };

            internalDataModel.push(node);
        }

        const datumName =
            "Datum " + (i + 1).toString() + ": " + datum.percentage.toString();
        const parentName = question.toString() + "-" + type.toString();

        const node = {
            name: datumName,
            id: parentName + "-datum",
            parentId: parentName,
            nodeData: datum,
            allMarkData: data[i],
        };

        internalDataModel.push(node);
    }

    console.log("internal data model", internalDataModel);
    const internalData = stratify()(internalDataModel);
    console.log("processed data", internalData);
    return internalData;
}

const StackedBar: Component = () => {
    let vis: any;

    const [hierarchy, setHierarchy] = createSignal(false);
    const [originalData, setOriginalData] = createSignal(false);
    const [collapseHoverId, setCollapseHoverId] = createSignal("0");
    const [highlightedRow, setHighlightedRow] = createSignal(null);
    const [highlightBounds, setHighlightBounds] = createSignal({
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
    });

    onMount(async () => {
        //@ts-ignore
        const result = embed(vis, spec, { actions: false, renderer: "svg" });

        result.then(function (embedResult: any) {
            const data = embedResult.view.data("marks");

            console.log("mark data", data);
            setOriginalData(data);

            function onItemDataChange(name: any, item: any) {
                console.log("in item data change");
                console.log("Item change changed. name:", name, "item:", item);

                if (item != "0") {
                    let question = item.datum.question;
                    let type = item.datum.type;
                    let itemId =
                        question.toString() + "-" + type.toString() + "-datum";
                    setCollapseHoverId(itemId);
                    setHighlightBounds(item.bounds); 
                    setHighlightedRow(item.datum); 
                } 
                
                else {
                    setCollapseHoverId("0");
                    setHighlightBounds({
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 0,
                    });
                    setHighlightedRow(null); 
                }
                console.log(collapseHoverId());
            }

            const newResult = embedResult.view.addSignalListener(
                "cell",
                onItemDataChange
            );

            console.log("signal listener", newResult);

            embedResult.view.runAsync();
            console.log("init cell", embedResult.view.signal("cell"));

            // @ts-ignore
            setHierarchy(processStackedBarDataMarks(data));
            
        });
    });

    return (
        <div class={styles.App}>
            <div class={styles.container}>
                <div class={styles.scrollContainerChild}>
                    <Show
                        when={!!hierarchy()}
                        fallback={<div>calculating hierarchy</div>}
                    >
                    <Datatable
                        originalData={originalData}
                        hierarchy={hierarchy}
                        setHighlightBounds={setHighlightBounds}
                        highlightedRow={highlightedRow}></Datatable>
                    </Show>
                </div>


                <div class={styles.fixedContainerChild}>
                    <svg class={styles.svgVis} ref={vis}></svg>
                    <svg class={styles.svgOverlay}>
                          <rect
                                  x={highlightBounds().x1}
                                  y={highlightBounds().y1}
                                  height={highlightBounds().y2 - highlightBounds().y1}
                                  width={highlightBounds().x2 - highlightBounds().x1}
                                  fill="none"
                                  stroke="black" 
                                  stroke-width="1"
                              ></rect>
                        </svg>
                </div>
                

            </div>
        </div>
    );
};

export default StackedBar;
