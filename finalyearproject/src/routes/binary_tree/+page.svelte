<script lang="ts">
    import TreeNode from "./TreeNode.svelte";
    import type { Attachment } from "svelte/attachments";

    let size = $derived.by(()=>{
        let xmax = window.innerWidth
        let ymax = window.innerHeight
        
        for(let node of allnodes){
            if(node.x > xmax){
                xmax = node.x
            } else if(node.y > ymax){
                ymax = node.y
                }
            }


        clearlines()
        drawlines()
        return[xmax + 150,ymax + 150]

    


    });

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    const makecanvas: Attachment<HTMLCanvasElement> = (element) => {
        canvas = element;
        ctx = canvas.getContext("2d");
        if (ctx != null) {
            ctx.fillStyle = "black";
        }
        console.log(canvas);
        console.log(ctx);
        console.log("made a canvas and a context element!");
    };

    function clearlines() {
        if (ctx != undefined) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    function drawlines() {
        console.log("canvas: " + canvas);
        console.log("ctx: " + ctx);
        if (ctx != undefined && canvas != undefined) {
            for (let node of allnodes) {
                ctx.beginPath();
                //for left child
                ctx.lineWidth = 10;
                let leftchild = getleftchild(node);
                if (leftchild != undefined) {
                    ctx.moveTo(node.x + 42, node.y + 20);
                    ctx.lineTo(leftchild.x + 42, leftchild.y + 20);
                    ctx.stroke();
                }

                //for right child
                let rightchild = getrightchild(node);
                if (rightchild != undefined) {
                    ctx.moveTo(node.x + 42, node.y + 20);
                    ctx.lineTo(rightchild.x + 42, rightchild.y + 20);
                    ctx.stroke();
                }
            }
        }
    }

    function drawparenttoleftchild(node1: Node) {
        if (ctx != undefined && canvas != undefined) {
            ctx.beginPath();
            ctx.lineWidth = 10;
            let leftchild = getleftchild(node1);
            if (leftchild != undefined) {
                ctx.moveTo(node1.x + 42, node1.y + 20);
                ctx.lineTo(leftchild.x + 42, leftchild.y + 20);
                ctx.stroke();
            }
        }
    }

    function drawparenttorightchild(node1: Node) {
        if (ctx != undefined && canvas != undefined) {
            ctx.beginPath();
            ctx.lineWidth = 10;
            let rightchild = getrightchild(node1);
            if (rightchild != undefined) {
                ctx.moveTo(node1.x + 42, node1.y + 20);
                ctx.lineTo(rightchild.x + 42, rightchild.y + 20);
                ctx.stroke();
            }
        }
    }

    function clearleftchildline(node1: Node) {
        if (ctx != undefined) {
            let leftchild = getleftchild(node1);
            let leftpos = node1.x + 21;
            let rightpos = node1.x + 21;
            let height = 0;
            if (leftchild != null) {
                leftpos = leftchild.x + 21;
                height = leftchild.y - node1.y;
                height += 25;
                rightpos += 30;
            }
            let fin = rightpos - leftpos;
            if (rightpos - leftpos < 0) {
                fin = node1.width;
            }
            console.log(
                "clearing rectangle of: " +
                    fin +
                    ", " +
                    height +
                    " starting at: " +
                    leftpos +
                    ", " +
                    node1.y,
            );
            ctx.clearRect(leftpos, node1.y, fin, height);
        }
    }

    function clearrightchildline(node1: Node) {
        if (ctx != undefined) {
            let rightchild = getrightchild(node1);
            let leftpos = node1.x + 21;
            let height = node1.y + 10;
            let rightpos = 0;
            if (rightchild != null) {
                rightpos = rightchild.x + 21;
                height = rightchild.y - node1.y;
                height += 25;
                rightpos += 30;
            }
            let fin = rightpos - leftpos;
            if (rightpos - leftpos < 0) {
                fin = node1.width;
            }
            console.log(
                "clearing rectangle of: " +
                    fin +
                    ", " +
                    height +
                    "starting at: " +
                    leftpos +
                    ", " +
                    node1.y,
            );
            ctx.clearRect(leftpos, node1.y, fin, height);
        }
    }

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
                        console.log(
                            "movement check called on: node " + node.id,
                        );
                        if (node.x != parentnode.x - parentnode.width / 4) {
                            clearleftchildline(parentnode);
                            node.x = parentnode.x - parentnode.width / 4;
                            node.y = parentnode.y + 125;
                            setTimeout(function () {
                                drawparenttoleftchild(parentnode);
                            }, 1000);

                            clearleftchildline(node);
                            setTimeout(function () {
                                drawparenttoleftchild(node);
                            }, 1000);

                            clearrightchildline(node);
                            setTimeout(function () {
                                drawparenttorightchild(node);
                            }, 1000);

                            console.log("moved node");
                        } else {
                            console.log("did not move node");
                        }
                    } else {
                        console.log(
                            "movement check called on: node " + node.id,
                        );
                        if (node.x != parentnode.x + parentnode.width / 4) {
                            clearrightchildline(parentnode);
                            node.x = parentnode.x + parentnode.width / 4;
                            node.y = parentnode.y + 125;
                            setTimeout(function () {
                                drawparenttorightchild(parentnode);
                            }, 1000);

                            clearleftchildline(node);
                            setTimeout(function () {
                                drawparenttoleftchild(node);
                            }, 1000);

                            clearrightchildline(node);
                            setTimeout(function () {
                                drawparenttorightchild(node);
                            }, 1000);
                            console.log("moved node");
                        } else {
                            console.log("did not move node");
                        }
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
            if (left.x + 200 > right.x) {
                totalwidth += 200;
            }
        }
        node.width = totalwidth;
        return node.width;
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
            let rightchild = getrightchild(node);
            parent = getparent(node);
            if (parent != undefined) {
                if (parent.lchildid == node.id) {
                    clearleftchildline(parent);
                    parent.lchildid = null;
                } else {
                    clearrightchildline(parent);
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



<canvas id="canvas" height={size[1]} width={size[0]} {@attach makecanvas}> </canvas>
<h1>Binary tree page!</h1>
<input bind:value={nodeinputvalue} placeholder="0" type="number" />
<button onclick={push}>Add node</button>

<br />
<input bind:value={node_to_delete} placeholder="0" type="number" />
<button onclick={deletenode}>delete node</button>

{#each allnodes as node (node.id)}
    <TreeNode id={node.id} value={node.val} x={node.x} y={node.y} />
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
