<script lang="ts">
    import { get } from "svelte/store";
    import TreeNode from "./TreeNode.svelte";

    interface Node {
        id: number;
        val: number;
        x: number;
        y: number;
        parentid: number | null;
        lchildid: number | null;
        rchildid: number | null;
    }
    let i = $state([500, 150]);

    let nodeinputvalue: number = $state(-1);

    let allnodes = $state([
        {
            id: 0,
            val: 1,
            x: i[0],
            y: i[1],
            parentid: null,
            lchildid: null,
            rchildid: null
        },

    ]);

    for (let node of allnodes) {
        if (node.parentid != null && node != null) {
            let parentnode = allnodes[node.parentid];
            if (node.val < parentnode.val) {
                node.x = parentnode.x - 100;
                node.y = parentnode.y + 100;
            } else {
                node.x = parentnode.x + 100;
                node.y = parentnode.y + 100;
            }
        }
    }

    function findid(node: Node) {
        return node.id;
    }


    function getroot() {
        let root = allnodes.find((node) => node.parentid === null) || -1;
        return root;
    }

    function comparenodes(node1: Node, node2: Node) {
        if (node1.val < node2.val) return -1;
        if (node1.val > node2.val) return 1;
        return 0;
    }

    function placenode(node1: Node, node2: Node) {
        if (comparenodes(node1, node2) <= 0) {
                if (node2.lchildid == null) {
                    node2.lchildid = node1.id;
                    node1.parentid = node2.id;
                    node1.x = node2.x - 150;
                    node1.y = node2.y + 100;
                    //console.log(node1, node2);
                } else{
                    console.log(allnodes.find((node) => node.id === node2.lchildid) as Node);
                    placenode(node1, allnodes.find((node) => node.id === node2.lchildid) as Node);
                }
            }
                else if (comparenodes(node1, node2) > 0) {
                    if (node2.rchildid == null) {
                        node2.rchildid = node1.id;
                        node1.parentid = node2.id;
                        node1.x = node2.x + 150;
                        node1.y = node2.y + 100;
                        //console.log(node1, node2);
                    } else {
                        placenode(node1, allnodes.find((node) => node.id === node2.rchildid) as Node);
                    }
                }
                else {

                    return;
                }
                }
                
    
    

    function push() {
        if (nodeinputvalue == -1) return;
        let node = {
            id: allnodes.length,
            val: nodeinputvalue,
            x: 500,
            y: 500,
            parentid: null,
            lchildid: null,
            rchildid: null,
        };

        placenode(node, getroot() as Node);
        console.log($state.snapshot(node));

        console.log($state.snapshot(allnodes));
        allnodes.push(node);


        //get the node where there is no parent

        //start comparing to left or right child until there is no child, then add the node there

        nodeinputvalue = -1;
    }
</script>

<h1>Binary tree page!</h1>
<input bind:value={nodeinputvalue} placeholder=-1 type="number" />
<button onclick={push}>Add node</button>

{#each allnodes as node}
    <TreeNode id = {node.id} value={node.val} x={node.x} y={node.y} />
{/each}
