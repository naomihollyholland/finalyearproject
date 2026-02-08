<script>
    import TreeNode from "./TreeNode.svelte";
    
    function random(){
        y = Math.random() * 300 
        y += 100
    }
    let y = $state(150)
    let x = $state(25)


    const allnodes = $state([
        {value:1, x: 150, y:150},
        {value:2, x: 250, y:250},
        {value:3, x: 350, y:350}
    ]);


</script>

<h1>Binary tree page!</h1>

<button onclick={random}>
    Randomise me
</button>

<input bind:value={x} />
<input bind:value={y} />


<TreeNode {x}{y}/>