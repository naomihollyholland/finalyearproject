
import type { Attachment } from "svelte/attachments";
import * as canvas from "./canvas.ts";
import { get } from "svelte/store";


export interface Node {
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
let button = $state(false)
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

let log = $state("Hello! this is the log!<br>As you perform operations, the log will walk through what is happening step by step.<br>Enjoy!<br><br>")
export const getlog = () => log

export const getNodes = () => allnodes;
export const getbutton = () => button;

export function recalculate_positions() {
    checklefftoverrun()
    console.log("recalculating position")
    wait(0.25).then(() => heapify())
    let root = allnodes[0];

    canvas.clearlines()
    checklefftoverrun()
    if (root != undefined) {
        calculate_widths(root);

        console.log("root node is: " + root.id)
        reevaluate_coordinate(root)
    }
    checklefftoverrun()



    wait(1).then(() => canvas.drawlines())
    console.log($state.snapshot(allnodes));
}

export function reevaluate_coordinate(node: Node) {
    console.log("node id: " + node.id)
    let parent = getparent(node)
    let isleftchild = false
    if (parent == undefined) {
        node.x = i[0]
        node.y = i[1]
        let leftchild = getleftchild(node)
        let rightchild = getrightchild(node)
        if (leftchild != null) {
            reevaluate_coordinate(leftchild)
        }
        if (rightchild != null) {
            reevaluate_coordinate(rightchild)
        }
    }


    if (parent != undefined) {
        console.log("parent of node " + node.id + " is " + parent.id)
        if (parent.lchildid == node.id) {
            isleftchild = true
        }
        node.y = parent.y + 125
        if (isleftchild && node.x != parent.x - (parent.width / 3.5)) {
            node.x = parent.x - (parent.width / 3.5)
        } else if (!isleftchild && node.x != parent.x + (parent.width / 3.5)) {
            node.x = parent.x + (parent.width / 3.5);
        }
    } else {
        console.log(node.id + " has no parent")
    }
    let leftchild = getleftchild(node)
    let rightchild = getrightchild(node)
    if (leftchild != null) {
        reevaluate_coordinate(leftchild)
    }
    if (rightchild != null) {
        reevaluate_coordinate(rightchild)
    }

}







export function checklefftoverrun() {
    let max = 0
    for (let node of allnodes) {
        if ((node.x) < 500) {
            let newval = Math.abs(node.x) - 500
            if (newval > max) {
                max = newval
            }
        }
    }
    if (max > 0) {
        max += 50
        i[0] = i[0] + max
    }
}

export function calculate_widths(node: Node) {
    let totalwidth = 0;

    let leftchild = getleftchild(node);
    let rightchild = getrightchild(node);
    if (leftchild == undefined && rightchild == undefined) {
        node.width = 200;
        return node.width;
    }
    if (leftchild != undefined) {
        totalwidth += calculate_widths(leftchild);
    }
    if (rightchild != undefined) {
        totalwidth += calculate_widths(rightchild);
    }
    let left = inorderpredecessor(node, false);
    let right = inordersuccessor(node, false);

    if (left != undefined && right != undefined) {
        if (left.x + 200 > right.x) {
            totalwidth += 200;
        }
    }
    node.width = totalwidth;
    return node.width;
}

export function inorderpredecessor(node1: Node, isloud: boolean) {
    let lchild = getleftchild(node1);
    let inorderpredecessor = lchild;
    if (inorderpredecessor != undefined) {
        console.log("looping to find in order predecessor");
        let rightchild = getrightchild(inorderpredecessor);
        while (rightchild != undefined) {
            inorderpredecessor = rightchild;
            rightchild = getrightchild(rightchild);
        }
        if (isloud) {
            log = ">Found in order successor, with id " + inorderpredecessor.id + ".<br>" + log
        }

        return inorderpredecessor;
    }
    if (isloud) {
        log = ">Could not find in order predecessor.<br>" + log
    }

    return undefined;
}

export function inordersuccessor(node1: Node, isloud: boolean) {
    let rchild = getrightchild(node1);
    let inordersuccessor = rchild;
    if (inordersuccessor != undefined) {
        console.log("looping to find in order successor");
        let leftchild = getleftchild(inordersuccessor);
        while (leftchild != undefined) {
            inordersuccessor = leftchild;
            leftchild = getleftchild(leftchild);
        }
        if (isloud) {
            log = ">Found in order successor, with id " + inordersuccessor.id + ".<br>" + log
        }
        return inordersuccessor;
    }
    if (isloud) {
        log = ">Could not find in order successor.<log>" + log
    }

    return undefined;
}

export function getnode(nodeid: Number) {
    return allnodes.find((node) => node.id === nodeid);
}

export function getroot() {
    let root = allnodes.find((node) => node.parentid === null);
    return root;
}

export function comparenodes(node1: Node, node2: Node) {
    if (node1.val < node2.val) return -1;
    if (node1.val > node2.val) return 1;
    return 0;
}

export function getleftchild(node1: Node) {
    return allnodes.find((node) => node.id == node1.lchildid);
}

export function getrightchild(node1: Node) {
    return allnodes.find((node) => node.id == node1.rchildid);
}

export function getparent(node1: Node) {
    return allnodes.find((node) => node.id == node1.parentid);
}



export function heapify() {

    log = ">Heapifying the binary heap.<br>" + log
    let j = 0
    length = allnodes.length - 1
    console.log(length)
    console.log($state.snapshot(allnodes))
    let node = undefined;
    let parent = undefined
    while (j < allnodes.length) {
        console.log("checking node in position: " + (length - j))
        node = allnodes[length - j]
        console.log("checking node " + node.id)
        let nodepos = length - j
        console.log("node position:" + nodepos)

        let parentpos = (nodepos - 1) / 2
        let leftchild = true
        if (!Number.isInteger(parentpos)) {
            parentpos = ((nodepos - 2) / 2)
            leftchild = false
        }
        parent = allnodes[parentpos]
        if (parent != undefined) {
            console.log("parent of node is: " + parent.id)
        }
        if (parent != undefined && node != undefined) {
            console.log("would check to swap: " + node.id + " and: " + parent.id)
            if (comparenodes(node, parent) == -1) {
                swapnodes(node, parent)

                console.log(node.id)
                console.log(parent)
                console.log($state.snapshot(allnodes))
                console.log("swapped nodes: " + parent.id + " & " + node.id)
                node = getparent(node)
                parent = getparent(parent)
                let check = false
                while (node != undefined && parent != undefined && !check) {
                    console.log(node.id)
                    console.log(parent.id)
                    console.log(check)
                    if (comparenodes(node, parent) == -1) {
                        let tempnode = node
                        let tempparent = parent
                        swapnodes(tempnode, tempparent)


                        console.log("swapped nodes: " + parent.id + " & " + node.id)
                        let newnode = getparent(node)
                        if (newnode != undefined)
                            node = newnode
                        else {
                            check = true
                        }
                        
                        let newparent = getparent(parent)
                        if (newparent != undefined)
                            parent = newparent
                        else {
                            check = true
                        }

                    } else {
                        console.log("break!")
                        check = true
                    }

                }

            }
        }
        j += 1;
    }
    let root = getroot()
    if (root != undefined) {
        root.x = i[0]
        root.y = i[1]
    }

    log = ">Heapified the binary heap!<br>" + log
    console.log($state.snapshot(allnodes))
}


export function swapnodes(node1: Node, node2: Node) {
    if (node1 == undefined || node2 == undefined) {
        console.log("one or both of two nodes was undefined");
        return;
    }
    console.log("node1: " + node1.id);
    console.log("node2: " + node2.id);

    let static1 = $state.snapshot(node1)
    let static2 = $state.snapshot(node2)


    let static1l = getleftchild(static1)
    let static1r = getrightchild(static1)
    let static1p = getparent(static1)

    let static2l = getleftchild(static2)
    let static2r = getrightchild(static2)
    let static2p = getparent(static2)


    console.log($state.snapshot(allnodes))
    //swap the 1st node's children and parents to point to the new pointer
    if (static1l != undefined) {
        static1l.parentid = node2.id
    }

    if (static1r != undefined) {
        static1r.parentid = node2.id
    }

    if (static1p != undefined) {
        if (static1p.lchildid == static1.id) {
            static1p.lchildid = node2.id
        } else {
            static1p.rchildid = node2.id
        }
    }

    //swap the 2nd node's children and parents to the new pointer

    if (static2l != undefined) {
        static2l.parentid = node1.id
    }

    if (static2r != undefined) {
        static2r.parentid = node1.id
    }

    if (static2p != undefined) {
        if (static2p.lchildid == static2.id) {
            static2p.lchildid = node1.id
        } else {
            static2p.rchildid = node1.id
        }
    }

    let static1id = static1.id
    let static2id = static2.id
    let static1val = static1.val
    let static2val = static2.val

    let static1x = static1.x
    let static2x = static2.x
    let static1y = static1.y
    let static2y = static2.y


    static2.x = node1.x
    static2.y = node1.y
    static1.x = node2.x
    static1.y = node2.y

    //swap the nodes
    console.log("deboog")
    console.log(node1)
    node1 = static2
    console.log(node1)
    console.log("huh")
    node2 = static1

    //but keep the id and value
    node1.val = static1val
    node1.id = static1id
    node1.x = static2x
    node1.y = static2y

    node2.val = static2val
    node2.id = static2id

    node2.x = static1x
    node2.y = static1y

    console.log("what now:(")
    console.log(node1)
    console.log(node2)


    console.log("afterswap")
    console.log($state.snapshot(allnodes))

    console.log("node")
    console.log(node1.id)
    console.log(node1.lchildid)
    console.log(node1.rchildid)
    console.log(node1.parentid)
    console.log(node1.val)

    console.log("node2")
    console.log(node2.id)
    console.log(node2.lchildid)
    console.log(node2.rchildid)
    console.log(node2.parentid)
    console.log(node2.val)

    if (node1.lchildid == node1.id) {
        node1.lchildid = node2.id
    }

    if (node1.rchildid == node1.id) {
        node1.rchildid = node2.id
    }

    if (node1.parentid == node1.id) {
        node1.parentid = node2.id
    }


    if (node2.lchildid == node2.id) {
        node2.lchildid = node1.id
    }

    if (node2.rchildid == node2.id) {
        node2.rchildid = node1.id
    }

    if (node2.parentid == node2.id) {
        node2.parentid = node1.id
    }

    console.log($state.snapshot(allnodes))






    let tempstore1 = $state.snapshot(node1)
    let tempstore2 = $state.snapshot(node2)

    let node1index = allnodes.findIndex((node) => node.id == node1.id)
    let node2index = allnodes.findIndex((node) => node.id == node2.id)

    console.log(tempstore1)
    console.log(tempstore2)


    allnodes[node1index] = tempstore2
    allnodes[node2index] = tempstore1
    console.log("nodes swapped!")
    console.log($state.snapshot(allnodes))

}




async function wait(x: number) {
    return new Promise(resolve => setTimeout(resolve, x * 1000));
}

export function decreasekey(nodeid: number, number: number) {

    button = true

    let node = getnode(nodeid)

    if (node != undefined) {
        if (node.val > number) {
            node.val = number
            log = ">Value of node replaced!<br>" + log
            let parent = getparent(node)
            let check = true
            let tempnodeid = node.id
            while (parent != undefined && check && node != undefined) {
                if (node.val < parent.val && node != undefined) {
                    tempnodeid = node.id
                    swapnodes(node, parent)
                    node = getnode(tempnodeid)
                    if (node != undefined) {
                        parent = getparent(node)
                    } else {
                        check = false
                    }
                    log = ">Node is less than parent, so the comparison repeats with this node and the parent.<br>" + log
                } else {
                    log = ">Finished decreasing key.<br>" + log
                    check = false
                }

            }
        } else {
            log = ">New value is not less than current value. No change made.<br>" + log
        }

    }

    let root = getroot()
    if (root != undefined) {
        root.x = i[0]
        root.y = i[1]
    }
    wait(0.5).then(() => recalculate_positions())

    wait(3).then(() => button = false);
}

export function deleteMin() {
    button = true
    swapnodes(allnodes[0], allnodes[allnodes.length - 1])
    allnodes.splice(allnodes.length - 1, 1)
    wait(0.25).then(() => heapify())
    wait(0.5).then(() => recalculate_positions())
    wait(3).then(() => button = false);
}

export function push(nodeinputvalue: number) {
    button = true
    if (!Number.isInteger(nodeinputvalue)) {
        wait(3).then(() => button = false);
        log = ">Invalid input. Please enter a valid integer.<br>" + log
        return;
    }
    let i = 0;
    while (allnodes.find((node) => node.id === i)) {
        i = i + 1;
    }

    let node: Node = {
        id: i,
        val: nodeinputvalue,
        x: 700,
        y: 35,
        parentid: null,
        lchildid: null,
        rchildid: null,
        width: 100,
    };

    log = ">Added a node with id " + node.id + " and value " + node.val + " to the bottom of the heap.<br>" + log
    allnodes.push(node)

    let nodepos = allnodes.findIndex((node) => node.id === i)
    console.log("node position:" + nodepos)

    let parentpos = (nodepos - 1) / 2
    let leftchild = true
    if (!Number.isInteger(parentpos)) {
        parentpos = ((nodepos - 2) / 2)
        leftchild = false
    }
    console.log("parent position:" + parentpos)
    let parent = allnodes[parentpos]
    if (parent != undefined) {
        if (parent.lchildid == null && node != undefined) {
            parent.lchildid = node.id
            node.parentid = parent.id
        } else if (parent.rchildid == null && node != undefined) {
            parent.rchildid = node.id
            node.parentid = parent.id

        }

    }


    wait(0.5).then(() => recalculate_positions())

    wait(3).then(() => button = false);
}
