
import type { Attachment } from "svelte/attachments";
import * as canvas from "./canvas.ts";


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

export function recalculate_positions() {
    let root = getroot();
    if (root != undefined) {
        calculate_widths(root);
    }
    console.log($state.snapshot(allnodes))
    for (let node of allnodes) {
        if (node.parentid == null) {
            console.log("recalc");
            console.log(i[0])
            node.x = i[0];
            node.y = i[1];
        }
        if (node.parentid != null) {
            let parentnode = getparent(node);
            if (parentnode != undefined) {
                node.y = parentnode.y + 125;
                if (parentnode.lchildid == node.id) {
                    console.log(
                        "movement check called on: node " + node.id,
                    );
                    if ((node.x != parentnode.x - (parentnode.width / 3.5))) {
                        canvas.clearleftchildline(parentnode);
                        node.x = parentnode.x - (parentnode.width / 3.5);
                        setTimeout(() => {
                            canvas.drawparenttoleftchild(parentnode);
                        }, 1000);

                        canvas.clearleftchildline(node);
                        setTimeout(() => {
                            canvas.drawparenttoleftchild(node);
                        }, 1000);

                        canvas.clearrightchildline(node);
                        setTimeout(() => {
                            canvas.drawparenttorightchild(node);
                        }, 1000);

                        console.log("moved node");
                    } else {
                        console.log("did not move node: " + node.id);
                    }
                } else {
                    console.log(
                        "movement check called on: node " + node.id,
                    );
                    if ((node.x != parentnode.x + (parentnode.width / 3.5))) {
                        canvas.clearrightchildline(parentnode);
                        node.x = parentnode.x + (parentnode.width / 3.5);
                        setTimeout(() => {
                            canvas.drawparenttorightchild(parentnode);
                        }, 1000);

                        canvas.clearleftchildline(node);
                        setTimeout(() => {
                            canvas.drawparenttoleftchild(node);
                        }, 1000);

                        canvas.clearrightchildline(node);
                        setTimeout(() => {
                            canvas.drawparenttorightchild(node);
                        }, 1000);
                        console.log("moved node");
                    } else {
                        console.log("did not move node: " + node.id)
                    }
                }
            }
        }
        checklefftoverrun()
    }
    console.log($state.snapshot(allnodes));
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


export function swapnodes(node1: Node, node2: Node) {
    if (node1 == undefined || node2 == undefined) {
        console.log("one or both of two nodes was undefined");
        return;
    }
    console.log("node1: " + node1.id);
    console.log("node2: " + node2.id);

    //        get the temporary variables to store the information from the first node
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

export function getswapcandidate(node1: Node) {

    let inorderpredecessor = getleftchild(node1);;
    if (inorderpredecessor != undefined) {
        console.log("looping to find in order predecessor");
        let next = getrightchild(inorderpredecessor);
        while (inorderpredecessor != undefined && next != undefined) {
            inorderpredecessor = getrightchild(inorderpredecessor);
            if (inorderpredecessor != undefined) {
                next = getrightchild(inorderpredecessor)
            }

        }
        return inorderpredecessor;
    }

    return null;
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

export function deletenode(node_to_delete: number) {

    button = true
    log = ">Node with id " + node_to_delete + " is being deleted.<br>" + log
    let node = allnodes.find((node) => node.id === node_to_delete);
    if (node == undefined) {
        wait(3).then(() => button = false);
        log = ">Invalid ID. Please enter a valid ID.<br>" + log
        return;
    }

    let swap = getswapcandidate(node);
    let parent = getparent(node);

    //if there is an in order predecessor
    if (swap != null) {
        log = ">The node being deleted has an in-order predecessor, with id "+ swap.id + ".<br>" + log
        let swapparent = getparent(swap)
        let swapleft = getleftchild(swap)

        let swapparentid = -1
        if (swapparent != undefined) {
            swapparentid = swapparent.id
            console.log(swapparent.id)
        }

        swapnodes(node, swap);
        log = ">Swap the node and the predecessor.<br>" + log
        console.log("nodes swapped");
        console.log($state.snapshot(allnodes))
        parent = getparent(node);
        if (parent != undefined) {
            if (parent.lchildid == node.id) {
                parent.lchildid = null;
            } else {
                parent.rchildid = null;
            }
        }
        console.log("found node to be swapped");
        $state.snapshot(node.id)
        $state.snapshot(swap.id)
        let index = allnodes.findIndex((node) => node.id === node_to_delete);

        allnodes.splice(index, 1);
        log = ">Delete the node, as it now has either no children or one child.<br>" + log


        swapparent = getnode(swapparentid)
        if (swapleft != undefined) {
            console.log(swapleft)
            if (swapparent != undefined) {
                console.log(swapparent)
                swapparent.rchildid = swapleft.id;
                swapleft.parentid = swapparent.id;
                console.log("added the in order predecessor's child into the right spot")
            }
        }

        wait(0.5).then(() => recalculate_positions());
        console.log($state.snapshot(allnodes));
        wait(3).then(() => button = false);
        return;
    }


    if (swap == null) {
        console.log("no in order successor");
        log = ">The node being deleted does not have an in-order predecessor.<br>" + log

        let rightchild = getrightchild(node);
        let leftchild = getleftchild(node)
        parent = getparent(node);
        if (parent != undefined) {
            if (rightchild != undefined) {
                rightchild.parentid = parent.id
                parent.rchildid = rightchild.id

            } else if (leftchild != undefined) {
                leftchild.parentid = parent.id
                parent.lchildid = leftchild.id
            } else {
                parent.rchildid = null
            }
        } else if (rightchild != undefined && parent == undefined) {
            rightchild.parentid = null;
        }
        log = ">If the node has a child, it has replaced its parent.<br>" + log
        log = ">Delete the node.<br>" + log
        let index = allnodes.findIndex(
            (node) => node.id === node_to_delete,
        );


        allnodes.splice(index, 1);
        console.log($state.snapshot(allnodes));
        wait(0.5).then(() => recalculate_positions());
        wait(3).then(() => button = false);
        return;
    }

}


async function wait(x: number) {
    return new Promise(resolve => setTimeout(resolve, x * 1000));
}




export function placenode(node1: Node, node2: Node) {
    console.log($state.snapshot(allnodes));
    if (comparenodes(node1, node2) <= 0) {
        if (node2.lchildid == null) {
            node2.lchildid = node1.id;
            node1.parentid = node2.id;
            //console.log(node1, node2);
                wait(0.5).then(() => recalculate_positions());
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
            wait(0.5).then(() => recalculate_positions());
        }
    } else if (comparenodes(node1, node2) > 0) {
        if (node2.rchildid == null) {
            node2.rchildid = node1.id;
            node1.parentid = node2.id;
            //console.log(node1, node2);
            wait(0.5).then(() => recalculate_positions());
        } else {
            placenode(
                node1,
                allnodes.find((node) => node.id === node2.rchildid) as Node,
            );
            wait(0.5).then(() => recalculate_positions());
        }
    } else {
        wait(0.5).then(() => recalculate_positions());
        return;
    }
}

export function searchwithnode(node: Node, nodevalue: number) {
    log = ">Checking node with value " + node.val + ".<br>" + log
    if (nodevalue == node.val) {
        log = ">Node found! id is " + node.id + ".<br>" + log
        return;
    } else if (nodevalue < node.val) {
        log = ">Value is less than node, checking left subtree.<br>" + log
        let leftchild = getleftchild(node)
        if (leftchild != undefined) {
            searchwithnode(leftchild, nodevalue)
        } else {
            log = ">Subtree does not exist! Node could not be found.<br>" + log
        }

    } else if (nodevalue > node.val) {
        log = ">Value is greater than node, checking right subtree.<br>" + log
        let rightchild = getrightchild(node)
        if (rightchild != undefined) {
            searchwithnode(rightchild, nodevalue)
        } else {
            log += "<br> subtree does not exist! node could not be found."
        }
    }
}

export function searchfor(nodevalue: number) {

    button = true
    let node = getroot()
    if (node != undefined) {
        log = ">Checking root node with value " + node.val + ".<br>" + log
        if (nodevalue == node.val) {
        log = ">Node found! id is " + node.id + ".<br>" + log
        } else if (nodevalue < node.val) {
        log = ">Value is less than node, checking left subtree.<br>" + log
            let leftchild = getleftchild(node)
            if (leftchild != undefined) {
                searchwithnode(leftchild, nodevalue)
            } else {
                log = ">Subtree does not exist! Node could not be found.<br>" + log
            }

        } else if (nodevalue > node.val) {
        log = ">Value is greater than node, checking right subtree.<br>" + log
            let rightchild = getrightchild(node)
            if (rightchild != undefined) {
                searchwithnode(rightchild, nodevalue)
            } else {
                log = ">Subtree does not exist! Node could not be found.<br>" + log
            }
        }
    }
    wait(3).then(() => button = false);
}

export const getbutton = () => button;

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
    let node = {
        id: i,
        val: nodeinputvalue,
        x: 700,
        y: 35,
        parentid: null,
        lchildid: null,
        rchildid: null,
        width: 100,
    };

    if (allnodes.length < 1) {
        allnodes.push(node);
        log = ">Added node with id " + node.id + " and value " + node.val + ".<br>" + log
    } else {
        placenode(node, getroot() as Node);
        allnodes.push(node);
        log = ">Added node with id " + node.id + " and value " + node.val + ".<br>" + log
    }
    console.log($state.snapshot(allnodes));
    wait(0.5).then(() => recalculate_positions());
    wait(3).then(() => button = false);
}
