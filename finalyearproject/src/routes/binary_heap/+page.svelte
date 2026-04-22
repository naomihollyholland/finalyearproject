<script lang="ts">
    import TreeNode from "../TreeNode.svelte";
    import { deleteMin, getNodes, push, getbutton, getlog, decreasekey} from "./BinaryHeap.svelte.ts";
    import { clearlines, drawlines, makecanvas } from "./canvas.ts";

    let size = $derived.by(() => {
        let xmax = window.innerWidth;
        let ymax = window.innerHeight;

        for (let node of getNodes()) {
            if (node.x > xmax) {
                xmax = node.x;
            } else if (node.y > ymax) {
                ymax = node.y;
            }
        }
        return [xmax + 150, ymax + 150];
    });


    let nodeinputvalue: number = $state(0);

    let decreaseto: number = $state(0);
    
    let nodetodecrease: number = $state(0)

</script>

<canvas id="canvas" height={size[1]} width={size[0]} {@attach makecanvas}>
</canvas>
<h1>Binary heap page!</h1>


<input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={() => push(nodeinputvalue)} disabled={getbutton()}>Add node with value: {nodeinputvalue}</button>

<br />
<button onclick={() => deleteMin()} disabled={getbutton()}>Delete minimum node</button>


<br />
<input bind:value={nodetodecrease} placeholder="0" type="number" />
<input bind:value={decreaseto} placeholder="0" type="number" />
<button onclick={() => decreasekey(nodetodecrease, decreaseto)} disabled={getbutton()}>Decrease key of node with id: {nodetodecrease} to: {decreaseto}</button>

{#each getNodes() as node (node.id)}
    <TreeNode id={node.id} value={node.val} x={node.x} y={node.y} />
{/each}

<div id="log">
    {@html getlog()}
</div>

<div id="explanation">
    Binary heaps are a type of binary tree that maintains the heap property, which states that for a min heap, each parent node must be less than or equal to its children. This property allows binary heaps to efficiently support operations such as insertion, deletion of the minimum element, and decrease key operations. Binary heaps are commonly used in priority queues and algorithms like Dijkstra's shortest path algorithm and heapsort.
    <br/>Adding an element places it in the next available space in the tree to maintain its binary heap structure, and then the heap property is restored by swapping the new element with its parent 
    <br/>Deleting the minimum element involves swapping the root element with the last node in the tree, removing the last node, and then swapping the last node down the tree until the heap property is restored.
    <br/>Decreasing a key involves the same process as adding an element, where the decreased key is swapped up the tree until the heap property is restored.
</div>


<style>
    #canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        background: #708090;
        z-index: -1;
    }

    #log{
        width: 300px;
        height: 300px;
        background-color: #908070;
        font: arial;
        color: black;
        overflow-y: auto;
        border: 2px solid black;
    }

    #explanation{
        width: 300px;
        background-color: #908070;
        font: arial;
        color: black;
        padding: 10px;
        border: 2px solid black;
    }

</style>