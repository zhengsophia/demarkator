import type { Component } from 'solid-js';
import embed from 'vega-embed';
import { onMount } from 'solid-js';
import styles from './App.module.css';
import LineChart from './ExampleComponents/LineChart';
import StackedBar from './ExampleComponents/StackedBar';

const App: Component = () => {

  return (
    <div class={styles.App}>
      <header class={styles.header}>
      
      <div class={styles.box}>
          <StackedBar></StackedBar>
          {/* <LineChart></LineChart> */}
      </div>
      </header>
    </div>
  );
};

export default App;
