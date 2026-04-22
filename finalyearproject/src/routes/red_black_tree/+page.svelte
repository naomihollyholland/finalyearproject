<script lang="ts">
    import RedBlackNode from "./RedBlackNode.svelte";
    import { deletenode, getNodes, push, getbutton, getlog} from "./RedBlackTree.svelte.ts";
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

        clearlines();
        setTimeout(function () {
            drawlines();
        }, 1000);
        return [xmax + 150, ymax + 150];
    });


    let nodeinputvalue: number = $state(0);

    let node_to_delete: number = $state(0);
</script>

<canvas id="canvas" height={size[1]} width={size[0]} {@attach makecanvas}>
</canvas>
<h1>Red-Black tree page!</h1>

<input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={() => push(nodeinputvalue)} disabled={getbutton()}>Add node with value: {nodeinputvalue}</button>

<br />
<input bind:value={node_to_delete} placeholder="0" type="number" />
<button onclick={() => deletenode(node_to_delete)} disabled={getbutton()}>Delete node with id: {node_to_delete}</button>

{#each getNodes() as node (node.id)}
    <RedBlackNode id={node.id} value={node.val} x={node.x} y={node.y} isred = {node.isred} />
{/each}

<div id="log">
    {@html getlog()}
</div>

<div id="explanation">
    Red-black trees are a type of self-balancing binary search tree with a lot of similarities to AVL trees. Each node in a red-black tree has an additional attrribute to store its colour. The tree maintains the following properties to ensure that the tree remains approximately balanced: 
    <br/>- every node is either red or black, 
    <br/>- the root is always black, 
    <br/>- all leaves (null nodes) are black, 
    <br/>- if a node is red then both its children are black, 
    <br/>- every path from a node to its descendant null nodes must have the same number of black nodes.
    <br/>Adding an element involves inserting the new node in the correct position according to how it would be added in a binary search tree, and then checking the colours of the nodes and performing rotations and recolouring if necessary to restore the predicates of a red black tree.
    <br/>Deleting a node involves first finding the node to delete, then if the node has two children, replacing it with its in-order successor or predecessor, and then checking the colours of the nodes and performing rotations and recolouring if necessary to restore the predicates of a red black tree.
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