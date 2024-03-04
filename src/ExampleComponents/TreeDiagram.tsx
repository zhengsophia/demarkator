import { HierarchyNode } from "d3-hierarchy";
import { For, Show, createSignal, createEffect } from "solid-js";
import { flattenHierarchy } from "./utils";

let counter = 0;

const TreeDiagram = (props: any) => {
  const { hierarchy } = props;

  // for each node have a state for "collapsed/not"
  // mutate that state for the on click
  // if node is collapsed, do not render any children elements
  // when click is first made, also set counter to 0

  if (!hierarchy) {
    return <div></div>;
  }

  const [collapsedStore, setCollapsedStore] = createSignal({});
  const [nodeHeight, setNodeHeight] = createSignal(50);
  const [yPositions, setYPositions] = createSignal(null);

  createEffect(() => {
    const newYPositions = calculateYHeightForHierarchy(
      hierarchy(),
      nodeHeight()
    );
    console.log("new ypositions", newYPositions);

    setYPositions(newYPositions);
  });

  return (
    <div>
      {/*
      code for demonstration of nodeHeight changes
      <select
        value={20}
        onChange={(event) => {
          let selectElement = event.target;

          let value = selectElement.value;

          console.log("on change", event,value);
          console.log("running callback for select");
          //@ts-ignore
          setNodeHeight(parseInt(value));
        }}
      >
        <option value={40} label="40"></option>
        <option value={60} label="60"></option>
        <option value={80} label="80"></option>
        <option value={100} label="100"></option>
      </select>*/}

      <Show when={yPositions()} fallback={<div></div>}>
        <svg width={1000} height={8000}>
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
                />
              );
            }}
          </For>
        </svg>
      </Show>
    </div>
  );
};

function calculateYHeightForHierarchy(hierarchy: any, nodeHeight: number) {
  const yPositions: any = {};

  const flatTree = flattenHierarchy(hierarchy);
  let currentNodePosition = 30;

  flatTree.forEach((node) => {
    currentNodePosition += nodeHeight;
    yPositions[node.id] = currentNodePosition;
  });

  return yPositions;
}

// functional component -> recurse through every child of the current node
const NodeElementRecursive = (props: any) => {
  const nodeId = props.node.data.id;
  const yPositions = props.yPositions;

  let { node, i, level, collapsedStore, setCollapsedStore } = props;
  // Function to toggle collapsed state and reset counter
  const toggleCollapse = () => {
    counter = 1;
    // copies the collapsedStore
    const clone = Object.assign({}, collapsedStore());
    clone[nodeId] = !clone[nodeId];

    setCollapsedStore(clone);
  };

  return (
    <g>
      <g onClick={() => toggleCollapse()}>
        <NodeElement {...props} counter={counter++} />
      </g>

      <Show
        when={node.children && !collapsedStore()?.[nodeId]}
        fallback={<g></g>}
      >
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
  const { node, level, counter, yPositions } = props;

  const levelOffset = level * 30;
  const xPosition = 20 + levelOffset;
  const xTextOffset = 5;
  const rectWidth = 300 - levelOffset;
  const yIncrement = 80;
  const yTextOffset = yIncrement / 3;

  return (
    <g>
      <rect
        x={xPosition}
        y={yPositions()[node.data.id]}
        width={rectWidth}
        height={40}
        fill="orange"
      ></rect>
      <text
        x={xPosition + xTextOffset}
        y={yPositions()[node.data.id] + yTextOffset}
        text-anchor="start"
        alignment-baseline={"bottom"}
        color="black"
      >
        {node.data.name}
      </text>
    </g>
  );
};

export default TreeDiagram;
