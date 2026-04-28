<script lang="ts">
    import TreeNode from "../TreeNode.svelte";
    import { deletenode, getbutton, getNodes, push, getlog, searchfor } from "./BinaryTree.svelte.ts";
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

    let node_to_find: number = $state(0);
</script>

<canvas id="canvas" height={size[1]} width={size[0]} {@attach makecanvas}>
</canvas>
<h1>Binary tree page!</h1>



Value: <input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={() => push(nodeinputvalue)} disabled={getbutton()} >Add node with value: {nodeinputvalue}</button>

<br />
ID: <input bind:value={node_to_delete} placeholder="0" type="number" />
<button onclick={() => deletenode(node_to_delete)} disabled={getbutton()} >Delete node with id: {node_to_delete}</button>

<br />
Value: <input bind:value={node_to_find} placeholder="0" type="number" />
<button onclick={() => searchfor(node_to_find)} disabled={getbutton()} >Search for node with value: {node_to_find}</button>

{#each getNodes() as node (node.id)}
    <TreeNode id={node.id} value={node.val} x={node.x} y={node.y} />
{/each}

<div id="log">
    {@html getlog()}
</div>

<div id="explanation">
    Binary trees are a type of data structure that consists of nodes and pointers to other nodes. Each node can have at most two children, with the left child having a value less than the parent and the right child having a value greater than the parent. Binary trees are commonly used in computer science for various applications such as searching, sorting, and representing hierarchical data.
    <br/>
    <br/>Searching for a node in a binary tree involves traversing the tree, starting at the root, and comparing the target value to the value of the current node. If the value is less than the current node, the search continues to the left subtree, otherwise it continues to the right subtree. If it reaches a leaf node without finding the target value, the search is unsuccessful.
    <br/>
    <br/>Adding a node to a binary tree involves traversal of the tree similar to the search operation to find the correct position. After a leaf node is reached, the new node is added as a child of that leaf node, being either the left or right child depending on the value of the new node compared to the leaf node.
    <br/>
    <br/>Deleting a node from a binary tree involves three cases, depending on how many children the binary tree has. If the node to delete has no children, it can simply be removed. If it has one child, the child can be promoted to take the place of the node that is to be deleted, and then the node can be removed. If the node to delete has two children, the most similar node to the one being deleted is found, which is either the largest node in the left subtree (called the in-order predecessor), or the smallest node in the right subtree(called the in-order successor). This visualiser uses the in-order predecessor.This node then swaps places with the node to be deleted, which produces either one of the first two cases.
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