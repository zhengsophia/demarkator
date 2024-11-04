import { For, createSignal, createEffect } from "solid-js";
import styles from "../App.module.css";

const Datatable = (props: any) => {
  const { originalData, hierarchy, setHighlightBounds, highlightedRow } = props;

  const [highlightDatum, setHighlightDatum] = createSignal(null);

  console.log('testing data', originalData())

  if (!hierarchy) {
    return <div></div>;
  }

  let fields: string[] = ["question", "type", "value", "percentage"];
  // let fields: string[] = ["Species", "Flipper Length (mm)", "Body Mass (g)"];

  console.log('testing hie', hierarchy())

  function capitalize(str: string): string {
    if (str.length === 0) return str; 
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function handleMouseEnter(event: MouseEvent, item: any, index: number) {
    setHighlightDatum(index);
    console.log('hover bounds', item.bounds);
    setHighlightBounds(item.bounds);
  }

  function handleMouseLeave() {
    setHighlightDatum(null);
    setHighlightBounds(setHighlightBounds({
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
  }));
  }

  function renderTable(data: any, fields: any) {
    return (
      <table class={styles.datatable}>
        <thead>
          <tr>
            <For each={fields}>{field => (
              <th scope="col">{capitalize(field)}</th>
            )}</For>
          </tr>
        </thead>
        <tbody>
          <For each={data}>{(item, index) => (
            <tr class={
                  highlightDatum() === index() ||
                  (highlightedRow() && highlightedRow().question === item.datum.question &&
                      highlightedRow().type === item.datum.type) ? styles.highlight : ""}
              onMouseEnter={(event) => handleMouseEnter(event, item, index())}
              onMouseLeave={handleMouseLeave}>
              <For each={fields}>{field => (
                <td>{item.datum[field]}</td>
              )}</For>
            </tr>
          )}</For>
        </tbody>
      </table>
    );
  }

  return (
    <div>
      {renderTable(originalData(), fields)}
    </div>
  );
};


export default Datatable;
