import type { Component } from 'solid-js';
import embed from 'vega-embed';
import { onMount } from 'solid-js';
import styles from './App.module.css';
import LineChart from './ExampleComponents/LineChart';
import StackedBar from './ExampleComponents/StackedBar';
//@ts-ignore
import StackedBar2 from './ExampleComponents/StackedBar2';

// @ts-ignore
// import TreeDiagram from "./TreeComponent/TreeDiagram.jsx";
import TreeDiagram from "./ExampleComponents/TreeDiagram.tsx";

const App: Component = () => {

  return (
    <div class={styles.App}>
      <header class={styles.header}>
      
      <div class={styles.box}>
          <StackedBar2></StackedBar2>
          {/* <LineChart></LineChart> */}
          {/* <TreeDiagram></TreeDiagram> */}
      </div>
      </header>
    </div>
  );
};

export default App;
