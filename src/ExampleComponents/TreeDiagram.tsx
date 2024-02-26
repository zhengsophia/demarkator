import { HierarchyNode } from "d3-hierarchy";
import { For, Show, createSignal } from "solid-js";

// counter to keep track of each rectangle rendered
// 1. If you do counter + 1 instead of counter++;
// 2.

let counter = 0;

const TreeDiagram = (props: any) => {
  console.log("props", props);

  const { hierarchy } = props;

  // for each node have a state for "collapsed/not"
  // mutate that state for the on click
  // if node is collapsed, do not render any children elements
  // when click is first made, also set counter to 0

  if (!hierarchy) {
    return <div></div>;
  }

  console.log(hierarchy);

  const [collapsedStore, setCollapsedStore] = createSignal({});

  console.log("hie", hierarchy());

  return (
    <svg width={1000} height={8000}>
      <For each={hierarchy()?.children}>
        {(node, i) => {
          return (
            // begin recursion to display elements
            <NodeElementRecursive
              node={node}
              collapsedStore={collapsedStore()}
              setCollapsedStore={setCollapsedStore}
              i={i}
              level={0}
              counter={counter}
            />
          );
        }}
      </For>
    </svg>
  );
};

// functional component -> recurse through every child of the current node
const NodeElementRecursive = (props: any) => {
  const nodeId = props.node.data.id;

  let { node, i, level, collapsedStore, setCollapsedStore } = props;
  // Function to toggle collapsed state and reset counter
  const toggleCollapse = () => {
    console.log("clicked!", props);
    counter = 0; // Reset counter on first click
    // copies the collapsedStore
    const clone = Object.assign({}, collapsedStore());
    clone[nodeId] = !clone[nodeId];

    console.log("clone", clone);
    setCollapsedStore(clone);
  };

  console.log("collapsed", collapsedStore);
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
  const { node, i, level } = props;
  //   console.log('visitng node',node.data.name,'counter',counter,'i',i)

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
        y={yIncrement * counter}
        width={rectWidth}
        height={40}
        fill="orange"
      ></rect>
      <text
        x={xPosition + xTextOffset}
        y={yIncrement * counter + yTextOffset}
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
