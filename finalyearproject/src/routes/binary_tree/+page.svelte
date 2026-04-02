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
<input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={() => push(nodeinputvalue)} disabled={getbutton()} >Add node</button>

<br />
<input bind:value={node_to_delete} placeholder="0" type="number" />
<button onclick={() => deletenode(node_to_delete)} disabled={getbutton()} >delete node</button>

<br />
<input bind:value={node_to_find} placeholder="0" type="number" />
<button onclick={() => searchfor(node_to_find)} disabled={getbutton()} >Search for node with value:</button>

{#each getNodes() as node (node.id)}
    <TreeNode id={node.id} value={node.val} x={node.x} y={node.y} />
{/each}

<div id="log">
    {@html getlog()}
</div>
<style>
    #canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        background: linear-gradient(#d896ff, #800080, #660066);
        z-index: -1;
    }

    #log{
        width: 300px;
        height: 100px;
        background-color: black;
        font: arial;
        color: blanchedalmond;
        overflow-y: auto;
    }

</style>