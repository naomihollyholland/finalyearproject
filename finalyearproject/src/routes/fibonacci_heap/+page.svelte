<script lang="ts">
    import TreeNode from "../TreeNode.svelte";
    import { deletemin, getNodes, push, getbutton, getlog } from "./FibonacciHeap.svelte.ts";
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

        setTimeout(function () {
            drawlines();
        }, 1000);
        return [xmax + 150, ymax + 150];
    });
    let nodeinputvalue: number = $state(0);
</script>

<canvas id="canvas" height={size[1]} width={size[0]} {@attach makecanvas}>
</canvas>
<h1>Fibonacci heap page!</h1>

<input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={() => push(nodeinputvalue)} disabled={getbutton()}>Add node with value: {nodeinputvalue}</button>

<br />
<button onclick={() => deletemin()} disabled={getbutton()}>Delete minimum node</button>

{#each getNodes() as node (node.id)}
    <TreeNode id={node.id} value={node.val} x={node.x} y={node.y}/>
{/each}

<div id="log">
    {@html getlog()}
</div>

<div id="explanation">
    Fibonacci heaps are a type of data structure that consists of a collection of trees, where each tree is a minimum heap. The trees in a Fibonacci heap can have any number of children, and the heap property is maintained across the entire collection.
    <br/>Adding an element is a very simple operation, and involves adding a new tree, with the new element as its only node, to the collection of trees.
    <br/>Deleting the minimum element involves finding the tree with the minimum root, adding its subtrees to the collection of trees, and then removing the minimum tree from the collection. After this, the trees are consolidated using a union function. An array is created to keep track of the "degree" of each subtree (the amount of subtrees it has). Then, when a tree has the same degree as another, they are unionised into a single tree, with one tree becoming the child of the other.
</div>

<style>
    #canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        background:  #708090;
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