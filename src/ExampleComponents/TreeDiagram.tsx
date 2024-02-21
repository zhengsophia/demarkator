import {HierarchyNode} from 'd3-hierarchy';

const TreeDiagram = (props:any )=>{
    console.log('props',props)
   
    const {hierarchy} = props;
    if(!hierarchy){
        return <div></div>
    }
    
    console.log(hierarchy)
    const hiearchyData = hierarchy();

    console.log('hierarchy in tree diagram',hiearchyData)
    return <svg width={1000} height={1000}>
        <rect x={20} y={20} width={100} height={20}></rect>
        <text x={20} y={20}>highlevel</text>
    </svg>
}

const TreeNode = (props: any) =>{
    const {level,label}= props; 
    return <rect x={level*20}></rect>
}

export default TreeDiagram;