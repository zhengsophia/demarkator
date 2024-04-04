import { HierarchyNode } from "d3-hierarchy";
import { For, Show, createSignal, createEffect } from "solid-js";
import { flattenHierarchy } from "./utils";
import styles from './App.module.css';

let counter = 0;

const TreeDiagram = (props: any) => {
  const { hierarchy, hoveredId } = props;

  // for each node have a state for "collapsed/not"
  // mutate that state for the on click
  // if node is collapsed, do not render any children elements
  // when click is first made, also set counter to 0
  if (!hierarchy) {
    return <div></div>;
  }

  function createDefaultStore(hierarchy:any) {
    const flatTree = flattenHierarchy(hierarchy);

    const defaultCollapsedStore:any = {}

    flatTree.forEach((node) => {
      defaultCollapsedStore[node.id] = false
      })

    return defaultCollapsedStore;
  }

  const defaultCollapsedStore = createDefaultStore(hierarchy());


  const [collapsedStore, setCollapsedStore] = createSignal(defaultCollapsedStore);
  const [nodeHeight, setNodeHeight] = createSignal(50);
  const [yPositions, setYPositions] = createSignal(null);

  // createEffect(() => {
  //   const hoveredCollapsedStore = {};
  //   if (hoveredId != 0) {
  //     for (const key in collapsedStore()) {
  //       if (key == hoveredId) {
  //         hoveredCollapsedStore[hoveredId] = false;
  //       }
  //       else {
  //         hoveredCollapsedStore[key] = true;
  //       }
  //     }
  //   }
  //   setCollapsedStore(hoveredCollapsedStore);
  // });

  createEffect(() => {
    const newYPositions = calculateYHeightForHierarchy(
      hierarchy(),
      collapsedStore(),
      nodeHeight()
    );
    console.log("new ypositions", newYPositions);

    setYPositions(newYPositions);
  });

  return (
    <Show when={yPositions()} fallback={<div></div>}>
        <svg width={500} height={8000}>
          <For each={hierarchy()?.children}>
            {(node, i) => {
              return (
                // begin recursion to display elements
                <NodeElementRecursive
                  node={node}
                  yPositions={yPositions}
                  collapsedStore={collapsedStore}
                  setCollapsedStore={setCollapsedStore}
                  i={i}
                  level={0}
                  counter={counter}
                  hoveredId={hoveredId}
                />
              );
            }}
          </For>
        </svg>
      </Show>
  );
};

function calculateYHeightForHierarchy(hierarchy: any, collapsedStore:Record<string,boolean>, nodeHeight: number) {
  const yPositions: any = {};

  const flatTree = flattenHierarchy(hierarchy);
  let currentNodePosition = 0;

  const allCollapsedNodes:any = {}

  flatTree.forEach((node) => {
    if(collapsedStore[node.id] || allCollapsedNodes[node.id]){
      const children = flatTree.filter(currentNode=>currentNode.parentId == node.id)
      children.forEach(child=>{
        allCollapsedNodes[child.id] = true;
      })
    }
    
    if(!allCollapsedNodes[node.id]){ // based on parent
      currentNodePosition += nodeHeight;
    }
    
    yPositions[node.id] = currentNodePosition;
  });

  return yPositions;
}

// functional component -> recurse through every child of the current node
const NodeElementRecursive = (props: any) => {
  const nodeId = props.node.data.id;
  const yPositions = props.yPositions;
  
  let { node, i, level, collapsedStore, setCollapsedStore, hoveredId } = props; // include toggleCollapse from props
  // Function to toggle collapsed state and reset counter
  const toggleCollapse = () => {
    // copies the collapsedStore
    const clone = Object.assign({}, collapsedStore());
    // console.log('clone', clone)
    clone[nodeId] = !clone[nodeId];
    setCollapsedStore(clone);
    console.log('collapsed store', collapsedStore()) 
  };

  return (
    <g>
      <g onClick={() => toggleCollapse()}>
        <NodeElement {...props}   />
      </g>

      <Show
        when={node.children && !collapsedStore()?.[nodeId]}
        fallback={<g></g>} >
        <For each={node.children}>
          {(childNode, i) => {
            return (
              <NodeElementRecursive
                node={childNode}
                i={i()}
                level={level + 1}
                counter={counter}
                collapsedStore={collapsedStore}
                setCollapsedStore={setCollapsedStore}
                yPositions={yPositions}
                hoveredId={hoveredId}
              />
            );
          }}
        </For>
      </Show>
    </g>
  );
};

// presentational component -> generate the rectangles based on its properties
const NodeElement = (props: any) => {
  const { node, level, yPositions, collapsedStore, hoveredId } = props;
  const nodeId = props.node.data.id;

  // console.log(hoveredId);

  const levelOffset = level * 30;
  const xPosition = 20 + levelOffset;
  const xTextOffset = 5;
  const rectWidth = 300 - levelOffset;
  const yIncrement = 80;
  const yTextOffset = yIncrement / 3;

  return (
    <g id={nodeId}>
      <rect
        x={xPosition}
        y={yPositions()[node.data.id]}
        width={rectWidth}
        height={40}
        fill="rgba(0, 0, 0, 0)"
      ></rect>
        <text
        x={xPosition + xTextOffset}
        y={yPositions()[node.data.id] + yTextOffset}
        text-anchor="start"
        alignment-baseline={"bottom"}
        fill="black"
        font-family="Inter Tight Light"
      >
        { !node.data.name.includes("Datum") ? (collapsedStore()?.[nodeId]  ? '▶ ' : '▼ ') : <g></g> } 
        { node.data.name }
      </text>
    </g>
  );
};

export default TreeDiagram;
