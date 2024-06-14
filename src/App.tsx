import type { Component } from 'solid-js';
import styles from './App.module.css';
import StackedBar from './ExampleComponents/StackedBar';
import StackedBar2 from './ExampleComponents/StackedBar2';
import LineChart from './ExampleComponents/LineChart';
import Scatterplot from './ExampleComponents/Scatterplot';

const App: Component = () => {

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <StackedBar></StackedBar>
        {/* <LineChart></LineChart> */}
        {/* <Scatterplot></Scatterplot> */}
      </header>
    </div>
  );
};

export default App;
