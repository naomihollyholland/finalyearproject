<script>
    import TreeNode from "./TreeNode.svelte";
    
    function random(){
        y = Math.random() * 300 
        y += 100
        x = Math.random() * 300 
        x += 100
        
    }
    let y = $state(150)
    let x = $state(250)
    let i = $state(250)


    let allnodes = $state([
         {val:1, x: 150, y:150},
         {val:2, x: 250, y:250},
         {val:3, x: 350, y:350}
     ]);
</script>

<h1>Binary tree page!</h1>

<button onclick={random}>
    Randomise me
</button>

{#each allnodes as node}
    {node.val} <br>
    <TreeNode i={node.val}  x={node.x} y={node.y}/>
{/each}
<TreeNode {i}{x}{y}/>