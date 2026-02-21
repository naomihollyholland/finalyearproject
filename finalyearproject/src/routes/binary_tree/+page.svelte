<script lang="ts">
    import type { get } from "svelte/store";
    import TreeNode from "./TreeNode.svelte";
    import type { NODE } from "$env/static/private";

    interface Node {
        id: number;
        val: number;
        x: number;
        y: number;
        parentid: number | null;
        lchildid: number | null;
        rchildid: number | null;
        width: number;
    }
    let i = $state([500, 150]);

    let nodeinputvalue: number = $state(0);

    let node_to_delete: number = $state(0);

    let allnodes: Node[] = $state([
        {
            id: 0,
            val: 1,
            x: i[0],
            y: i[1],
            parentid: null,
            lchildid: null,
            rchildid: null,
            width: 100,
        },
    ]);

    function recalculate_positions() {
        let root = getroot();
        if (root != undefined) {
            calculate_widths(root);
        }

        for (let node of allnodes) {
            if (node.parentid == null) {
                console.log("recalc");
                node.x = i[0];
                node.y = i[1];
            }

            if (node.parentid != null) {
                let parentnode = getparent(node);
                if (parentnode != undefined) {
                    if (parentnode.lchildid == node.id) {
                        node.x = parentnode.x - ((parentnode.width / 6) + (node.width / 4));
                        node.y = parentnode.y + 125;
                        console.log("called on: node " + node.id);
                    } else {
                        node.x = parentnode.x + ((parentnode.width / 6) + (node.width / 4));
                        node.y = parentnode.y + 125;
                        console.log("called on: node " + node.id);
                    }
                }
            }
        }
        console.log($state.snapshot(allnodes));
    }

    function calculate_widths(node: Node) {
        let totalwidth = 0;

        let leftchild = getleftchild(node);
        let rightchild = getrightchild(node);
        if (leftchild == undefined && rightchild == undefined) {
            node.width = 100;
            return node.width;
        }
        if (leftchild != undefined) {
            totalwidth += calculate_widths(leftchild);
        }
        if (rightchild != undefined) {
            totalwidth += calculate_widths(rightchild);
        }
        let left = inorderpredecessor(node);
        let right = inordersuccessor(node);

        if (left != undefined && right != undefined) {
            if (left.x + 100 > right.x) {
                totalwidth += 100;
            }
        }
        node.width = totalwidth
        return node.width
    }

    function getnode(nodeid: Number) {
        return allnodes.find((node) => node.id === nodeid);
    }

    function getroot() {
        let root = allnodes.find((node) => node.parentid === null);
        return root;
    }

    function comparenodes(node1: Node, node2: Node) {
        if (node1.val < node2.val) return -1;
        if (node1.val > node2.val) return 1;
        return 0;
    }

    function getleftchild(node1: Node) {
        return allnodes.find((node) => node.id == node1.lchildid);
    }

    function getrightchild(node1: Node) {
        return allnodes.find((node) => node.id == node1.rchildid);
    }

    function getparent(node1: Node) {
        return allnodes.find((node) => node.id == node1.parentid);
    }

    function swapnodes(node1: Node, node2: Node) {
        if (node1 == undefined || node2 == undefined) {
            console.log("one or both of two nodes was undefined");
            return;
        }
        console.log("node1: " + node1.id);
        console.log("node2: " + node2.id);

        //get the temporary variables to store the information from the first node
        let tempx = node1.x;
        let tempy = node1.y;
        let templchild = node1.lchildid;
        let temprchild = node1.rchildid;
        let tempparentid = node1.parentid;
        let node1left = getleftchild(node1);
        let node1right = getrightchild(node1);
        let node1parent = getparent(node1);

        let node2rchild = node2.lchildid;
        let node2lchild = node2.lchildid;

        node1.x = node2.x;
        node1.y = node2.y;

        node1.lchildid = node2.lchildid;
        node1.rchildid = node2.rchildid;

        let left = getleftchild(node2);
        if (left != undefined) {
            left.parentid = node1.id;
        }

        let right = getrightchild(node2);
        if (right != undefined) {
            right.parentid = node1.id;
        }

        let parent = getparent(node2);
        if (parent != undefined) {
            if (parent.lchildid == node2.id) {
                parent.lchildid = node1.id;
            } else {
                parent.rchildid = node1.id;
            }
        }

        node1.parentid = node2.parentid;

        node2.x = tempx;
        node2.y = tempy;
        node2.lchildid = templchild;
        node2.rchildid = temprchild;
        node2.parentid = tempparentid;

        if (node2.lchildid == node2.id) {
            node2.lchildid = node2lchild;
            if (node2lchild != null) {
                let leftchild = getnode(node2lchild);
                if (leftchild != undefined) {
                    leftchild.parentid = node2.id;
                }
            }
        }

        if (node2.rchildid == node2.id) {
            node2.rchildid = node2rchild;
            if (node2rchild != null) {
                let rightchild = getnode(node2rchild);
                if (rightchild != undefined) {
                    rightchild.parentid = node2.id;
                }
            }
        }

        if (node1left != undefined) {
            node1left.parentid = node2.id;
        }

        if (node1right != undefined) {
            node1right.parentid = node2.id;
        }

        if (node1parent != undefined) {
            if (node1parent.lchildid == node1.id) {
                node1parent.lchildid = node2.id;
            } else {
                node1parent.rchildid = node2.id;
            }
        }

        console.log($state.snapshot(allnodes));
        node2.parentid = tempparentid;
    }

    function getswapcandidate(node1: Node) {
        let lchild = getleftchild(node1);

        let inorderpredecessor = lchild;
        if (inorderpredecessor != undefined) {
            console.log("looping to find in order predecessor");
            let rightchild = getrightchild(inorderpredecessor);
            while (rightchild != undefined) {
                rightchild = getrightchild(inorderpredecessor);
            }
            return inorderpredecessor;
        }

        return null;
    }

    function inorderpredecessor(node1: Node) {
        let lchild = getleftchild(node1);
        let inorderpredecessor = lchild;
        if (inorderpredecessor != undefined) {
            console.log("looping to find in order predecessor");
            let rightchild = getrightchild(inorderpredecessor);
            while (rightchild != undefined) {
                inorderpredecessor = rightchild;
                rightchild = getrightchild(rightchild);
            }
            return inorderpredecessor;
        }
        return undefined;
    }

    function inordersuccessor(node1: Node) {
        let rchild = getrightchild(node1);
        let inordersuccessor = rchild;
        if (inordersuccessor != undefined) {
            console.log("looping to find in order successor");
            let leftchild = getleftchild(inordersuccessor);
            while (leftchild != undefined) {
                inordersuccessor = leftchild;
                leftchild = getleftchild(leftchild);
            }
            return inordersuccessor;
        }
        return undefined;
    }

    function deletenode() {
        console.log("node being deleted");
        let node = allnodes.find((node) => node.id === node_to_delete);
        if (node == undefined) {
            return;
        }
        console.log("found node to be deleted");
        let swap = getswapcandidate(node);
        let parent = getparent(node);
        if (swap == null) {
            console.log("no left child");
            //if there is a right child
            let rightchild = getrightchild(node);
            parent = getparent(node);
            if (parent != undefined) {
                if (parent.lchildid == node.id) {
                    parent.lchildid = null;
                } else {
                    parent.rchildid = null;
                }
            }
            if (rightchild != undefined) {
                console.log("has a right child");
                if (parent != undefined) {
                    console.log("has a parent");
                    parent.rchildid = rightchild.id;
                    rightchild.parentid = parent.id;
                } else {
                    console.log("does not have a parent");
                    rightchild.parentid = null;
                }
            }
            let index = allnodes.findIndex(
                (node) => node.id === node_to_delete,
            );

            allnodes.splice(index, 1);
            console.log($state.snapshot(allnodes));
            recalculate_positions();
            return;
        }
        console.log("error here?");
        swapnodes(node, swap);
        console.log($state.snapshot(allnodes));
        parent = getparent(node);
        if (parent != undefined) {
            if (parent.lchildid == node.id) {
                parent.lchildid = null;
            } else {
                parent.rchildid = null;
            }
        }
        console.log("found node to be swapped");

        let index = allnodes.findIndex((node) => node.id === node_to_delete);
        allnodes.splice(index, 1);

        recalculate_positions();
        console.log($state.snapshot(allnodes));
    }

    function placenode(node1: Node, node2: Node) {
        console.log($state.snapshot(allnodes));
        if (comparenodes(node1, node2) <= 0) {
            if (node2.lchildid == null) {
                node2.lchildid = node1.id;
                node1.parentid = node2.id;
                //console.log(node1, node2);
                recalculate_positions();
            } else {
                console.log("finding left child:");
                console.log(
                    $state.snapshot(
                        allnodes.find(
                            (node) => node.id === node2.lchildid,
                        ) as Node,
                    ),
                );
                console.log("node1");
                console.log($state.snapshot(node1));
                placenode(
                    node1,
                    allnodes.find((node) => node.id === node2.lchildid) as Node,
                );
                recalculate_positions();
            }
        } else if (comparenodes(node1, node2) > 0) {
            if (node2.rchildid == null) {
                node2.rchildid = node1.id;
                node1.parentid = node2.id;
                //console.log(node1, node2);
                recalculate_positions();
            } else {
                placenode(
                    node1,
                    allnodes.find((node) => node.id === node2.rchildid) as Node,
                );
                recalculate_positions();
            }
        } else {
            recalculate_positions();
            return;
        }
    }

    function push() {
        let i = 0;
        while (allnodes.find((node) => node.id === i)) {
            i = i + 1;
        }
        let node = {
            id: i,
            val: nodeinputvalue,
            x: 500,
            y: 500,
            parentid: null,
            lchildid: null,
            rchildid: null,
            width: 100,
        };

        if (allnodes.length < 1) {
            allnodes.push(node);
        } else {
            placenode(node, getroot() as Node);
            allnodes.push(node);
        }
        console.log($state.snapshot(allnodes));
        recalculate_positions();
    }
</script>

<h1>Binary tree page!</h1>
<input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={push}>Add node</button>

<br />
<input bind:value={node_to_delete} placeholder="0" type="number" />
<button onclick={deletenode}>delete node</button>

{#each allnodes as node (node.id)}
    <TreeNode id={node.id} value={node.val} x={node.x} y={node.y} />
{/each}
