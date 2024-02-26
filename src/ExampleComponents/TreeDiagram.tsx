import { HierarchyNode } from "d3-hierarchy";
import { For, Show } from "solid-js";

// counter to keep track of each rectangle rendered
let counter = 0;

const TreeDiagram = (props: any) => {
  console.log("props", props);

  const { hierarchy } = props;
  
  if (!hierarchy) {
    return <div></div>;
  }

  console.log(hierarchy);

  console.log("hie", hierarchy());
  
  return (
    <svg width={1000} height={8000}>
      <For each={hierarchy()?.children}>
        {(node, i) => {
          return (
            // begin recursion to display elements
            <NodeElementRecursive
              node={node}
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
  let { node, i, level } = props;

  return (
    <g>
      <NodeElement {...props} counter={counter++}/>
      <Show when={node.children} fallback={<g></g>}>
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
