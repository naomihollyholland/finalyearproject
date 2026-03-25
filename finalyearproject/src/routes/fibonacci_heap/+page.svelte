<script lang="ts">
    import TreeNode from "../TreeNode.svelte";
    import { deletemin, getNodes, push } from "./FibonacciHeap.svelte.ts";
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
<h1>Fibonacci heap page!</h1>
<input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={() => push(nodeinputvalue)}>Add node</button>

<br />
<button onclick={() => deletemin()}>delete node</button>

{#each getNodes() as node (node.id)}
    <TreeNode id={node.id} value={node.val} x={node.x} y={node.y}/>
{/each}

<style>
    #canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        background: linear-gradient(#d896ff, #800080, #660066);
        z-index: -1;
    }
</style>
