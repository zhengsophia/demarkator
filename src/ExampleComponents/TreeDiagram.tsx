import { HierarchyNode } from "d3-hierarchy";
import { For, Show, createSignal, createEffect } from "solid-js";
import { flattenHierarchy } from "./utils";
import styles from "./App.module.css";

let counter = 0;

const TreeDiagram = (props: any) => {
  // TODO:
  // -- refactor hoveredId to collapseHoverId
  // -- pass in setHighlightBounds as a prop
  // -- onHover for nodeElement to some function that gets the corresponding markData in that element
  // optional: (recursive to get multiple bounds for a stack)
  // -- in this function, setHighlightBounds
  // then draw a rect over that in StackedBar when rendering the vis

  const { hierarchy, collapseHoverId, setHighlightBounds } = props;

  // -- for each node have a state for "collapsed/not"
  // -- mutate that state for the on click
  // -- if node is collapsed, do not render any children elements
  // -- when click is first made, also set counter to 0
  if (!hierarchy) {
    return <div></div>;
  }

  function createDefaultStore(hierarchy: any) {
    const flatTree = flattenHierarchy(hierarchy);

    const defaultCollapsedStore: any = {};

    flatTree.forEach((node) => {
      defaultCollapsedStore[node.id] = false;
    });

    return defaultCollapsedStore;
  }

  const defaultCollapsedStore = createDefaultStore(hierarchy());

  // potentially change this to store
  const [collapsedStore, setCollapsedStore] = createSignal(
    defaultCollapsedStore
  );
  const [hoveredStore, setHoveredStore] = createSignal(
    defaultCollapsedStore
  );
  const [nodeHeight, setNodeHeight] = createSignal(15);
  const [yPositions, setYPositions] = createSignal(null);

  function isObjectEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);

    for (let key of keys1) {
      if (obj1[key] != obj2[key]) return false;
    }

    const keys2 = Object.keys(obj2);
    for (let key of keys2) {
      if (obj1[key] != obj2[key]) return false;
    }
    return true;
  }

  createEffect(() => {

    if(collapseHoverId()=='0') {
      setHoveredStore(defaultCollapsedStore);
      return;
    }

    setCollapsedStore(defaultCollapsedStore);

    const newHoveredStore = {};
    const previousHoveredStore = hoveredStore();
    
    for (const key in previousHoveredStore) {
      // TODO: update this hacky fix to rely less on the string value itself
      // if (collapseHoverId().includes(key)) {
      if (collapseHoverId() == key) {
        newHoveredStore[key] = true;
      } else {
        newHoveredStore[key] = false;
      }
    }

    // do a deep equality check between hoveredCollapsedStore,collapsedStore()
    if (!isObjectEqual(previousHoveredStore, newHoveredStore)) {
      setHoveredStore(newHoveredStore);
    }

    // if (node.data.allMarkData) {
    //   const bounds = node.data.allMarkData.bounds;
    //   console.log('bounds', bounds);
    //   setHighlightBounds(bounds);
    // }

  });

  createEffect(() => {
    const newYPositions = calculateYHeightForHierarchy(
      hierarchy(),
      collapsedStore(),
      nodeHeight()
    );
    // console.log("new ypositions", newYPositions);

    setYPositions(newYPositions);
  });

  return (
    <Show when={yPositions()} fallback={<div></div>}>
      <svg width={300} height={1400}>
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
                collapseHoverId={collapseHoverId}
                setHighlightBounds={setHighlightBounds}
                hoveredStore={hoveredStore}
              />
            );
          }}
        </For>
      </svg>
    </Show>
  );
};

function calculateYHeightForHierarchy(
  hierarchy: any,
  collapsedStore: Record<string, boolean>,
  nodeHeight: number
) {
  const yPositions: any = {};

  const flatTree = flattenHierarchy(hierarchy);
  let currentNodePosition = 0;

  const allCollapsedNodes: any = {};
  // console.log('all collapsed nodes', allCollapsedNodes)
  
  // console.log("y calc store", collapsedStore)

  function collapseChildren(nodeId) {
    const children = flatTree.filter((currentNode) => currentNode.parentId == nodeId);
    
    if (!children) {
      return
    }

    children.forEach((child) => {
      allCollapsedNodes[child.id] = true;
      collapseChildren(child.id); 
    });
  }

  flatTree.forEach((node) => {
    
    // to potentially clean up and move this "propogate collapse" logic to setting toggles
    // if node is collapsed, set all children to be collapsed. 
    // if (collapsedStore[node.id] || allCollapsedNodes[node.id]) {
    if (collapsedStore[node.id]) {
      if (node.id !== 'topLevel') {
        collapseChildren(node.id);
      }
    }
    

    // Issue: skipping over if a particular node is collapse, but some collapsed nodes are still visible
    // ie the collapsed children of an uncollapsed node (ie "Question 8")
    function findParentNode(parentId){
      // console.log('nodeid to find',parentId,flatTree,flatTree.find(node=>node.id == parentId))
      return flatTree.find(node=>node.id == parentId);
    }

    // console.log('parent node', findParentNode(node.parentId), node.id, node.children);
    let parentNode: any = findParentNode(node.parentId)
    if (parentNode) {
      if (!allCollapsedNodes[node.id]) {
        // console.log('all collapsed nodes', allCollapsedNodes)
        // console.log('collapsed store', collapsedStore)
        // based on parent
        // console.log('debug', parentNode, allCollapsedNodes[parentNode.id])
        // console.log('click debug', collapsedStore[node.id], parentNode.id)
        currentNodePosition += nodeHeight;
      }
    }
    yPositions[node.id] = currentNodePosition;
    console.log('hierarchy', hierarchy)
  });

  return yPositions;

}

// functional component -> recurse through every child of the current node
const NodeElementRecursive = (props: any) => {
  const nodeId = props.node.data.id;
  const yPositions = props.yPositions;

  let { node, i, level, collapsedStore, setCollapsedStore, collapseHoverId, setHighlightBounds, hoveredStore } = props; // include toggleCollapse from props
  
  // if a rect on the svg is currently being hovered over, highlight the bounds
  createEffect(() => {
    if (nodeId == collapseHoverId()) {
      console.log('bidirection', nodeId, collapseHoverId())
      if (node.data.allMarkData) {
        const bounds = node.data.allMarkData.bounds;
        console.log('hover bounds', bounds);
        setHighlightBounds(bounds);
      }
    }
  });

  // Function to toggle collapsed state
  const toggleCollapse = () => {
    // copies the collapsedStore
    const clone = Object.assign({}, collapsedStore());
    // console.log('clone', clone)
    if (!nodeId.includes("datum")) {
      clone[nodeId] = !clone[nodeId];
    }
    setCollapsedStore(clone);
    // console.log("toggle collapsed store", collapsedStore());
  };

  // Function to set highlight bounds
  const updateHighlightBounds = () => {
    // console.log('highlight data', node.data.allMarkData);
    if (node.data.allMarkData) {
      const bounds = node.data.allMarkData.bounds;
      console.log('bounds', bounds);
      setHighlightBounds(bounds);
    }
  };


  return (
    <g>
      <g onClick={() => toggleCollapse()} onMouseOver={() => updateHighlightBounds()} onMouseOut={() => setHighlightBounds({
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
    })}>
        <NodeElement {...props} />
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
                collapseHoverId={collapseHoverId}
                setHighlightBounds={setHighlightBounds}
                hoveredStore={hoveredStore}
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
  const { node, level, yPositions, collapsedStore, hoveredStore } = props;
  const nodeId = props.node.data.id;
  const [isHovered, setIsHovered] = createSignal(false);

  // console.log(collapseHoverId);

  const levelOffset = level * 20;
  const xPosition = 20 + levelOffset;
  const xTextOffset = 5;
  const rectWidth = 200 - levelOffset;
  const yIncrement = 80;
  const yTextOffset = yIncrement / 3;

  return (
    <g id={nodeId}>
      <rect
        x={xPosition}
        y={yPositions()[node.data.id] + 15}
        width={rectWidth}
        height={15}
        fill="rgba(0, 0, 0, 0)"
        stroke={(hoveredStore()?.[nodeId] || isHovered()) ? "#000000" : "none"} 
        stroke-width={(hoveredStore()?.[nodeId] || isHovered()) ? "1" : "0"} 
        onmouseover={() => setIsHovered(true)}
        onmouseout={() => setIsHovered(false)}
      ></rect>
      <text
        x={xPosition + xTextOffset}
        y={yPositions()[node.data.id] + yTextOffset}
        text-anchor="start"
        alignment-baseline={"bottom"}
        font-size="11px"
        fill={collapsedStore()?.[nodeId] ? "#D3D3D3" : "black"}
        font-family="Inter Tight Light"
        onmouseover={() => setIsHovered(true)}
        onmouseout={() => setIsHovered(false)}
      >
        {!node.data.name.includes("Datum") ? (
          collapsedStore()?.[nodeId] ? (
            "▶ "
          ) : (
            "▼ "
          )
        ) : (
          <g></g>
        )}
        {node.data.name}
      </text>
    </g>
  );
};

export default TreeDiagram;
