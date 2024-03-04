export function flattenHierarchy(root:any) {
  const nodes = [];

  // Recursive function to traverse the hierarchy
  function recurse(node:any) {
    if (node.children) {
      node.children.forEach((child:any) => {
        // For each child, add an entry with id, parentId, and other data as needed
        nodes.push({
          id: child.data.id, // Assuming each node in your original data has a unique `id`
          parentId: node.data.id, // Use the parent node's `id`
          // Include other properties from the node's data as needed
          ...child.data,
        });
        recurse(child); // Recursively process children
      });
    }
  }

  // Initialize the process with the root node, assuming the root's parent is null
  nodes.push({ id: root.data.id, parentId: null, ...root.data });
  recurse(root);

  return nodes;
}
