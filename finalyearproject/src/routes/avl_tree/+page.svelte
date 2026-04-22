<script lang="ts">
    import TreeNode from "../TreeNode.svelte";
    import { deletenode, getNodes, push, getbutton, getlog, searchfor} from "./AVLTree.svelte.ts";
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

    let node_to_find: number = $state(0)
</script>

<canvas id="canvas" height={size[1]} width={size[0]} {@attach makecanvas}>
</canvas>
<h1>AVL tree page!</h1>

<input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={() => push(nodeinputvalue)} disabled={getbutton()}>Add node with value: {nodeinputvalue}</button>

<br />
<input bind:value={node_to_delete} placeholder="0" type="number" />
<button onclick={() => deletenode(node_to_delete)} disabled={getbutton()}>Delete node with id: {node_to_delete}</button>

<br />
<input bind:value={node_to_find} placeholder="0" type="number" />
<button onclick={() => searchfor(node_to_find)} disabled={getbutton()} >Search for node with value: {node_to_find}</button>


{#each getNodes() as node (node.id)}
    <TreeNode id={node.id} value={node.val} x={node.x} y={node.y} />
{/each}

<div id="log">
    {@html getlog()}
</div>

<div id="explanation">
    AVL trees are a type of self-balancing binary search tree that maintains a balance attribute for each node, which is the difference in height between its left and right subtrees. if the height difference becomes greater than 1 or less than -1, the tree will perform rotations to restore the balance and keep the tree height as small as possible relevant to the size of the tree.
    <br/>Adding an element involves inserting the new node in the correct position according to the binary search tree property, and then checking the balance of the tree and performing rotations if necessary to restore the balance.
    <br/> Deleting a node involves first finding the node to delete, then if the node has two children, replacing it with its in-order successor or predecessor, and then checking the balance of the tree and performing rotations if necessary to restore the balance.
    <br/>Searching for a node involves traversing the tree according to the binary search tree property, comparing the value of the current node with the target value and moving to the left or right child accordingly until the target node is found or a leaf node is reached.
    <br/>Rotations are used to restore the balance of the tree after adding or deleting a node. There are four types of rotations: left rotation, right rotation, left-right rotation, and right-left rotation. A left rotation is performed when a node becomes right-heavy, while a right rotation is performed when a node becomes left-heavy. Left-right and right-left rotations are performed when a node becomes unbalanced due to an insertion or deletion in the opposite subtree.
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
