import { For, Show, createSignal, createEffect } from "solid-js";
import styles from "../App.module.css";

const Datatable = (props: any) => {
  const { originalData, hierarchy, setHighlightBounds } = props;

  console.log('testing data', originalData())

  if (!hierarchy) {
    return <div></div>;
  }

  let fields: string[] = ["question", "type", "value", "percentage"];

  console.log('testing hie', hierarchy())

  function capitalize(str: string): string {
    if (str.length === 0) return str; 
    return str.charAt(0).toUpperCase() + str.slice(1);
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
          <For each={data}>{item => (
            <tr>
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
