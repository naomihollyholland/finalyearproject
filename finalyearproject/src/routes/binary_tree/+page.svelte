<script>
    import TreeNode from "./TreeNode.svelte";

    let i= $state([150,150]);

    let allnodes = $state([
         {id:0, val:1, x: i[0], y:i[1], parentid: null},
         {id:1, val:2, x: 250, y:250, parentid: 0},
         {id:2, val:3, x: 350, y:350, parentid: 1}
     ]);

    for(let node of allnodes){
            {allnodes[node.id].x = (allnodes.find(n => n.id === node.parentid)?.x || i[0] - 100) + 100}
            {allnodes[node.id].y = (allnodes.find(n => n.id === node.parentid)?.y || i[1] - 100) + 100}
        
    }
</script>

<h1>Binary tree page!</h1>



{#each allnodes as node}
    {node.id} <br>
        <TreeNode i={node.val}  x={node.x} y={node.y}/>  
{/each}
