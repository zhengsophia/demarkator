//@ts-nocheck
import embed from "vega-embed";
import { onMount } from "solid-js";
import spec from "./StackedBar.json";

const StackedBar2 = () => {
  let vis;


  onMount(() => {
    //@ts-ignore
    const result = embed(vis, spec, { actions: false });


    result.then(function(embedResult) {
      //
      let rectx = 0;
      let recty = 0;

      const data = embedResult.view.data("marks");

      console.log("vega view", embedResult.view);

      function onItemDataChange(name, item) {
        console.log("in item data change");
        console.log("Item change changed. name:", name, "item:", item);
      }

      function onItemDataChangeOne(name) {
        console.log("name", name, "item not ");
      }

      // Assuming your Vega view instance is stored in a variable named `view`
      const newResult = embedResult.view.addSignalListener(
        "cell",
        onItemDataChange,
      );
      console.log("signal listener", newResult);

      embedResult.view.runAsync();
      // embedResult.view.runAsync();

      // embedResult.view.signal('cell', '7');
      // embedResult.view.runAsync();

      //embedResult.view.runAsync();
      console.log("init cell", embedResult.view.signal("cell"));

      //@ts-ignore
      //setHierarchy(processStackedBarDataMarks(data));
    });
  });

  return (
    <div>
      <div
        ref={vis}
        onClick={() => {
          console.log("clicked vis div");
        }}
      ></div>

      {/*<Show when={!!hierarchy()} fallback={<div>calculating hierarchy</div>}>
        <TreeDiagram hierarchy={hierarchy}></TreeDiagram>
  </Show>*/}
    </div>
  );
};

export default StackedBar2;
