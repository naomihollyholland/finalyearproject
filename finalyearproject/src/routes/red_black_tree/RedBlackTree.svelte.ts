
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
    isred: boolean;
}
let i = $state([500, 150]);
let button = $state(false)
let allnodes: Node[] = $state([
    {
        id: 0,
        val: 0,
        x: i[0],
        y: i[1],
        parentid: null,
        lchildid: null,
        rchildid: null,
        width: 100,
        isred: false
    }
]);








let log = $state("hello!")
export const getlog = () => log

export const getNodes = () => allnodes;
export const getbutton = () => button;

export function recalculate_positions() {
    //console.log("start of recalculation")
    //console.log($state.snapshot(allnodes))
    let root = getroot();


    //console.log("after initial update of widths and balances")
    //console.log($state.snapshot(allnodes))


    //console.log("rotations all done:")
    //console.log($state.snapshot(allnodes))

    root = getroot()
    if (root != undefined) {
        calculate_widths(root);
        reevaluate_coordinate(root)
    }

    checklefftoverrun()
    //console.log($state.snapshot(allnodes));
}

export function reevaluate_coordinate(node: Node) {
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
        if (parent.lchildid == node.id) {
            isleftchild = true
        }
        node.y = parent.y + 125
        if (isleftchild && node.x != parent.x - (parent.width / 3.5)) {
            canvas.clearleftchildline(parent);

            node.x = parent.x - (parent.width / 3.5)

            setTimeout(() => {
                canvas.drawparenttoleftchild(parent);
            }, 1000)
            canvas.clearleftchildline(node);
            setTimeout(() => {
                canvas.drawparenttoleftchild(node);
            }, 1000)
            canvas.clearrightchildline(node);
            setTimeout(() => {
                canvas.drawparenttorightchild(node);
            }, 1000);

        } else if (!isleftchild && node.x != parent.x + (parent.width / 3.5)) {
            canvas.clearrightchildline(parent);
            node.x = parent.x + (parent.width / 3.5);
            setTimeout(() => {
                canvas.drawparenttorightchild(parent);
            }, 1000)
            canvas.clearleftchildline(node);
            setTimeout(() => {
                canvas.drawparenttoleftchild(node);
            }, 1000)
            canvas.clearrightchildline(node);
            setTimeout(() => {
                canvas.drawparenttorightchild(node);
            }, 1000);


        }
    }

    let leftchild = getleftchild(node)
    let rightchild = getrightchild(node)
    if (leftchild != null && leftchild.x != node.x - (node.width / 3.5)) {
        reevaluate_coordinate(leftchild)
    }
    if (rightchild != null && rightchild.x != node.x + (node.width / 3.5)) {
        reevaluate_coordinate(rightchild)
    }
}


export function checklefftoverrun() {
    let max = 0
    for (let node of allnodes) {
        if ((node.x) < 500) {
            let newval = Math.abs(node.x - 500)
            if (newval > max) {
                max = newval
            }
        }
    }

    if (max > 0) {
        max += 50
    }


    i[0] = i[0] + max
}

export function comparecolours(node: Node) {
    let root = getroot()
    if (root != null) {
        if (root.id == node.id) {
            root.isred = false
        }
    }
    let parent = getparent(node)
    let uncle = null
    let grandparent = null
    let parentisleftchild = false
    let current = null
    if (node) {
        current = node
    }
    let currentparent = parent
    if (current != null) {
        while (current != null && currentparent != null && current.isred && currentparent.isred) {
            console.log("checking on parent: " + current.id)
            log = ">Checking on the parent " + current.id + ".<br>" + log
            parent = getparent(current)
            uncle = null
            if (parent != null) {
                grandparent = getparent(parent)
            } else {
                grandparent = null
            }
            if (grandparent != null && parent != null) {
                if (grandparent.lchildid == parent.id) {
                    uncle = getrightchild(grandparent)
                    parentisleftchild = true
                } else {
                    uncle = getleftchild(grandparent)
                    parentisleftchild = false
                }
            } else {
                current = null
            }





            //if the parent is the left child
            if (current != null && parentisleftchild && grandparent != null && parent != null) {
                log = ">Parent is the left child.<br>" + log
                //if the uncle is red, parent left
                if (uncle != null && uncle.isred) {
                    console.log("uncle is red, the parent is the left child")
                    log = ">The uncle is red, and the parent is the left child.<br>" + log
                    console.log(uncle.isred)
                    parent.isred = false
                    uncle.isred = false
                    grandparent.isred = true
                    current = grandparent
                    currentparent = getparent(grandparent)

                    console.log("pushing blackness down from grandparent")
                    log = ">Moving the black colouring down from the grandparent to it's children.<br>" + log
                    console.log($state.snapshot(allnodes))
                    console.log(uncle.isred)
                    console.log(grandparent.id)

                } else {
                    // if the uncle is black (or null), parent left, node right child of parent
                    if (parent.rchildid == current.id) {
                        console.log("left rotation needed" + parent.id)
                        log = ">Left rotation needed on the parent " + parent.id + ".<br>" + log
                        leftrotation(parent)
                        console.log($state.snapshot(allnodes))
                        console.log("right rotation needed on grandparent: " + grandparent.id)
                        log = ">Right rotation needed on the grandparent " + grandparent.id + ".<br>" + log
                        rightrotation(grandparent)
                        console.log($state.snapshot(allnodes))

                        let node = getnode(current.id)
                        if (node != null) {
                            node.isred = false
                        }
                        grandparent.isred = true
                    } else {
                        //if the uncle is black or null, parent is left, and the node is left
                        console.log("right rotation needed on grandparent: " + grandparent.id)
                        log = ">Right rotation needed on the grandparent " + grandparent.id + ".<br>" + log
                        rightrotation(grandparent)
                        console.log($state.snapshot(allnodes))
                        parent.isred = false
                        grandparent.isred = true
                    }

                    current = null
                }
            }else if (current != null && !parentisleftchild && parent != null && grandparent != null) {
                log = ">Parent is the right child.<br>" + log
                //if the uncle is red
                console.log(uncle)
                if (uncle != null && uncle.isred) {
                    console.log("uncle is red, the parent is the right child")
                    log = ">The uncle is red, and the parent is the right child.<br>" + log
                    console.log(uncle.isred)
                    parent.isred = false
                    if (uncle != null) {
                        uncle.isred = false
                    }
                    grandparent.isred = true
                    current = grandparent
                    currentparent = getparent(grandparent)

                    log = ">Moving the black colouring down from the grandparent to it's children.<br>" + log
                    console.log($state.snapshot(allnodes))
                    console.log(uncle.isred)
                } else {
                    // if the uncle is black (or null)
                    if (parent.lchildid == current.id) {
                        log = ">Right rotation needed on the parent " + parent.id + ".<br>" + log
                        rightrotation(parent)
                        console.log($state.snapshot(allnodes))
                        log = ">Left rotation needed on the grandparent " + grandparent.id + ".<br>" + log
                        leftrotation(grandparent)
                        console.log($state.snapshot(allnodes))
                        let node = getnode(current.id)
                        if (node != null) {
                            node.isred = false
                        }
                        grandparent.isred = true
                    } else {
                        log = ">Left rotation needed on the grandparent " + grandparent.id + ".<br>" + log
                        leftrotation(grandparent)
                        console.log($state.snapshot(allnodes))
                        parent.isred = false
                        grandparent.isred = true
                    }
                    current = null

                }
            }
        }
    }
    root = getroot()
    if (root != null) {
        root.isred = false
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

export function getnode(nodeid: number) {
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
    let tempcolour = node1.isred;
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
    node1.isred = node2.isred

    node2.x = tempx;
    node2.y = tempy;
    node2.lchildid = templchild;
    node2.rchildid = temprchild;
    node2.parentid = tempparentid;
    node2.isred = tempcolour;

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
    console.log("node being deleted");
    let node = allnodes.find((node) => node.id === node_to_delete);
    if (node == undefined) {
        wait(3).then(() => button = false);
        log = ">Invalid ID. Please enter a valid ID.<br>" + log
        return;
    }

    let swap = getswapcandidate(node);
    let parent = getparent(node);

    let doubleblack = false
    let siblingofdoubleblack: Node | undefined

    console.log($state.snapshot(allnodes))
    let doubleblackisleft
    //if there is an in order predecessor
    if (swap != null) {

        log = ">Found swap candidate with id " + swap.id + ".<br>" + log
        let swapparent = getparent(swap)
        let swapleft = getleftchild(swap)
        let swapparentid = -1
        if (swapparent != undefined) {
            swapparentid = swapparent.id
            console.log(swapparent.id)
        }

        swapnodes(node, swap);
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

        swapparent = getnode(swapparentid)
        console.log(node.parentid)
        console.log(swap.id)
        console.log(swapparentid)

        if (node.id == node.parentid) {
            swapparentid = swap.id
        }


        swapparent = getnode(swapparentid)
        if (swapparent != undefined) {
            console.log(swapparent.id)
        }




        //if the node now has a child, it is black, and the node is black
        if ((!node.isred && swapleft == undefined) && swapparent != undefined || (swapleft && !swapleft.isred) && swapparent != undefined) {
            console.log("the replacement node is also black! double black!")
            console.log("the sibling of this child is the right child of the parent: " + swapparent.rchildid)
            log = ">Found double black node.<br>" + log
            doubleblack = true
            doubleblackisleft = true
            if (swapparent.rchildid != null) {
                siblingofdoubleblack = getnode(swapparent.rchildid)
            }
        } else if (!node.isred && swapleft == undefined && swapparent != undefined) {
            console.log("no replacement node, and the deleted node is black, double black!")
            console.log("the sibling of this child is the left child of the parent: " + swapparent.lchildid)
            log = ">Found double black node.<br>" + log
            doubleblack = true
            doubleblackisleft = false
            if (swapparent.lchildid != null) {
                siblingofdoubleblack = getnode(swapparent.lchildid)
            }
        } else if (swapleft != undefined) {
            swapleft.isred = false
        }






        if (swapparent && swapparent.lchildid == node.id) {
            swapparent.lchildid = null
        }



        let index = allnodes.findIndex((node) => node.id === node_to_delete);

        if (node != undefined) {
            console.log("node is red: " + node.isred)
        }


        //remove the pointer from the parent

        let todelete = getnode(index)
        if (todelete != undefined) {
            let parentofdelete = getparent(todelete)
            if (parentofdelete != undefined) {
                if (parentofdelete.lchildid == todelete.id) {
                    parentofdelete.lchildid = null
                } else {
                    parentofdelete.rchildid = null
                }
            }
        }

        log = ">Deleted the node with id " + node.id + ".<br>" + log
        allnodes.splice(index, 1);


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
        console.log("the node to be deleted does not have any in order predecessor")
        console.log("no in order predecessor");
        log = ">No in order predecessor found.<br>" + log

        let nodecolour: boolean = node.isred
        let replacecolour: boolean = false

        let replacementisleft: boolean = true

        let rightchild = getrightchild(node);
        let leftchild = getleftchild(node)
        parent = getparent(node)

        let nodeisleftchild = true

        if (parent != undefined && parent.rchildid == node.id) {
            nodeisleftchild = false
        }


        if (parent != undefined) {
            if (rightchild != undefined) {
                rightchild.parentid = parent.id
                parent.rchildid = rightchild.id
                replacecolour = rightchild.isred
                replacementisleft = false

            } else if (leftchild != undefined) {
                leftchild.parentid = parent.id
                parent.lchildid = leftchild.id
                replacecolour = leftchild.isred
                replacementisleft = true
            }
        } else if (rightchild != undefined && parent == undefined) {
            rightchild.parentid = null;
            replacecolour = rightchild.isred
            replacementisleft = false
        }
        let index = allnodes.findIndex(
            (node) => node.id === node_to_delete,
        );


        let todelete = getnode(index)
        if (todelete != undefined) {
            let parentofdelete = getparent(todelete)
            if (parentofdelete != undefined) {
                if (parentofdelete.lchildid == todelete.id) {
                    console.log(todelete.id)
                    parentofdelete.lchildid = null
                } else {
                    console.log(todelete.id)
                    parentofdelete.rchildid = null
                }
            }
        }

        console.log("last splice")
        allnodes.splice(index, 1);
        log = ">Deleted the node with id " + index + ".<br>" + log

        if (node != undefined) {
            console.log("node is red: " + nodecolour)
            console.log("replacement is red: " + replacecolour)
        }


        console.log($state.snapshot(allnodes))

        console.log(rightchild)

        //one of the node or the replacement is black
        if ((nodecolour && !replacecolour) || (!nodecolour && replacecolour)) {
            console.log("one of the children or replacements is red")
            if (!replacementisleft && rightchild) {
                rightchild.isred = false
            } else {
                if (leftchild != undefined) {
                    leftchild.isred = false
                }

            }
        }

        console.log($state.snapshot(allnodes))

        if (!nodecolour && !replacecolour) {
            console.log("double black!")
            if (replacementisleft && leftchild != undefined) {
                console.log("a black node exists, and is replacing the node")
                console.log("the left child: " + leftchild.id + " is a double black!")
                log = ">Double black node with id " + leftchild.id + ".<br>" + log
                doubleblackisleft = true

                doubleblack = true
                let parentofdoubleblack = getparent(leftchild)
                if (parentofdoubleblack != undefined) {
                    if (parentofdoubleblack.rchildid == leftchild.id) {
                        siblingofdoubleblack = getleftchild(parentofdoubleblack)
                    } else if (parentofdoubleblack.lchildid == leftchild.id) {
                        siblingofdoubleblack = getrightchild(parentofdoubleblack)
                    }
                }

            } else if (!replacementisleft && rightchild != undefined) {
                console.log("a black node exists, and is replacing the node")
                console.log("the right child: " + rightchild.id + " is a double black!")

                log = ">Double black node with id " + rightchild.id + ".<br>" + log
                doubleblack = true
                doubleblackisleft = false
                let parentofdoubleblack = getparent(rightchild)
                if (parentofdoubleblack != undefined) {
                    if (parentofdoubleblack.rchildid == rightchild.id) {
                        siblingofdoubleblack = getleftchild(parentofdoubleblack)
                    } else if (parentofdoubleblack.lchildid == rightchild.id) {
                        siblingofdoubleblack = getrightchild(parentofdoubleblack)
                    }
                }


            } else {
                console.log("a null node exists, and is replacing the node")
                if (parent != undefined && nodeisleftchild) {
                    console.log("the null left child of parent: " + parent.id + " is double black!")
                    console.log("the sibling of this child is the right child of the parent: " + parent.rchildid)
                    log = ">Double black is the left child of the node with id " + parent.id + ".<br>" + log
                    doubleblackisleft = true
                    doubleblack = true
                    if (parent.rchildid != null) {
                        siblingofdoubleblack = getnode(parent.rchildid)
                    }

                } else if (parent != undefined && !nodeisleftchild) {
                    console.log("the null right child of parent: " + parent.id + " is double black!")
                    console.log("the sibling of this child is the left child of the parent: " + parent.lchildid)
                    log = ">Double black is the right child of the node with id " + parent.id + ".<br>" + log
                    doubleblackisleft = false
                    doubleblack = true
                    if (parent.lchildid != null) {
                        siblingofdoubleblack = getnode(parent.lchildid)
                    }
                } else {
                    console.log("no parent! the tree is empty?")
                }
            }
        }

        console.log($state.snapshot(allnodes))
        console.log($state.snapshot(siblingofdoubleblack))


        //if there was a double black, handle it here!


        if (doubleblack && siblingofdoubleblack) {
            console.log("handling the double black")
            log = ">Managing the double black.<br>" + log
            let parentofsibling = getparent(siblingofdoubleblack)
            //while node is not double black
            while (doubleblack) {

                console.log("looping!")
                console.log("sibling id: " + siblingofdoubleblack.id)
                console.log($state.snapshot(allnodes))
                //if sibling is black and at least one of siblings children is red
                let siblingleftchild
                let siblingrightchild
                if (siblingofdoubleblack == undefined) {
                    siblingleftchild = null
                    siblingrightchild = null
                } else {
                    siblingleftchild = getleftchild(siblingofdoubleblack)
                    siblingrightchild = getrightchild(siblingofdoubleblack)
                }
                console.log(siblingleftchild)
                console.log(siblingrightchild)


                let siblingisleft = null
                if (parentofsibling != undefined) {
                    if (parentofsibling.lchildid == siblingofdoubleblack.id) {
                        siblingisleft = true
                    } else {
                        siblingisleft = false
                    }
                }

                //if the sibling is black, but has a red child
                if (!siblingofdoubleblack.isred && (siblingleftchild && siblingleftchild.isred) || (siblingrightchild && siblingrightchild.isred)) {

                    if (siblingisleft) {
                        //if sibling is the left child of the parent, and the left child of the sibling is red
                        if (siblingleftchild && siblingleftchild.isred && parentofsibling) {
                            //left left case
                            log = ">Left left case.<br>" + log
                            console.log("left-left case")
                            siblingleftchild.isred = false
                            rightrotation(parentofsibling)
                            doubleblack = false
                        }
                        //if the sibling is the left child of the parent, and the right child of the sibling is red
                        else if (siblingrightchild && siblingrightchild.isred && parentofsibling) {
                            //left right case
                            log = ">Left right case.<br>" + log
                            console.log("left-right case")
                            siblingrightchild.isred = false
                            siblingofdoubleblack.isred = true
                            leftrotation(siblingrightchild)

                            siblingofdoubleblack.isred = false
                            rightrotation(siblingrightchild)
                            doubleblack = false

                        }
                    } else {

                        //if sibling is the right child of the parent, and the left child of the sibling is red
                        if (siblingrightchild && siblingleftchild && siblingleftchild.isred && parentofsibling) {
                            //right left case
                            log = ">Right left case.<br>" + log

                            siblingrightchild.isred = false
                            siblingofdoubleblack.isred = true
                            console.log(siblingofdoubleblack.id)
                            rightrotation(siblingleftchild)

                            siblingofdoubleblack.isred = true
                            leftrotation(parentofsibling)

                            siblingofdoubleblack.isred = true


                            doubleblack = false

                        }
                        //if the sibling is the left child of the parent, and the right child of the sibling is red
                        else if (siblingrightchild && siblingrightchild.isred && parentofsibling) {
                            //right right case
                            log = ">Right right case.<br>" + log
                            console.log("right-right case")
                            siblingrightchild.isred = false
                            leftrotation(parentofsibling)

                            doubleblack = false

                        }

                    }


                    //if the sibling is black and both children are black
                } else if ((parentofsibling != undefined && !siblingofdoubleblack) || parentofsibling != undefined && !siblingofdoubleblack.isred && (siblingleftchild == null || !siblingleftchild.isred) && (siblingrightchild == null || !siblingrightchild.isred)) {
                    console.log("sibling is black and both children are black")
                    log = ">Sibling is black, and both of its children are black.<br>" + log

                    if (siblingofdoubleblack != undefined) {
                        siblingofdoubleblack.isred = true
                    }

                    if (parentofsibling.isred) {
                        parentofsibling.isred = false
                        doubleblack = false
                    } else {

                        //check the double black on the grandparent
                        log = ">Moving the double black up the tree, as it now occurs on the grandparent.<br>" + log
                        let grandparent = getparent(parentofsibling)
                        if (grandparent != null && grandparent.lchildid == parentofsibling.id) {
                            doubleblackisleft = true
                            siblingofdoubleblack = getrightchild(grandparent)


                        } else if (grandparent != null) {
                            doubleblackisleft = false
                            siblingofdoubleblack = getleftchild(grandparent)

                        }

                        let root = getroot()
                        while (siblingofdoubleblack == undefined || grandparent != root) {

                            log = ">Trying to find a sibling for the double black, if not, try again higher up the tree.<br>" + log
                            console.log("looping again to try and find a sibling")
                            let grandparent = getparent(parentofsibling)
                            if (grandparent != null && grandparent.lchildid == parentofsibling.id) {
                                doubleblackisleft = true
                                siblingofdoubleblack = getrightchild(grandparent)
                                parentofsibling = grandparent


                            } else if (grandparent != null) {
                                doubleblackisleft = false
                                siblingofdoubleblack = getleftchild(grandparent)
                                parentofsibling = grandparent
                            }
                        }
                        //temp
                        doubleblack = false
                    }
                } else if (parentofsibling && siblingofdoubleblack.isred) {
                    console.log("sibling is red")
                    parentofsibling.isred = true
                    siblingofdoubleblack.isred = false

                    if (doubleblackisleft) {
                        //sibling is on the right
                        leftrotation(parentofsibling)
                        log = ">Sibling of double black rotated left.<br>" + log
                    } else {
                        //sibling is on the left
                        rightrotation(parentofsibling)
                        log = ">Sibling of double black rotated right.<br>" + log
                    }


                    if (doubleblackisleft) {

                        //get the new sibling

                        let parentright = getrightchild(parentofsibling)

                        console.log($state.snapshot(parentright))

                        if (parentright != undefined) {
                            parentright.isred = true

                            let parentrightlchild = getleftchild(parentright)
                            let parentrightrchild = getrightchild(parentright)

                            if (parentrightrchild != undefined && parentrightrchild.isred) {

                                parentright.isred = false
                                parentofsibling.isred = true
                                leftrotation(parentofsibling)
                                log = ">parent of double black rotated left.<br>" + log

                            } else if (parentrightlchild != undefined && parentrightlchild.isred) {
                                log = ">Right left case.<br>" + log
                                parentrightlchild.isred = false
                                parentofsibling.isred = true

                                rightrotation(parentright)
                                leftrotation(parentofsibling)
                                log = ">right child of parent of double black rotated right.<br>" + log
                                log = ">parent of double black rotated left.<br>" + log


                            }
                        }

                    } else if (!doubleblackisleft) {
                        let parentleft = getleftchild(parentofsibling)


                        if (parentleft != undefined) {
                            parentleft.isred = true

                            let parentleftlchild = getleftchild(parentleft)
                            let parentleftrchild = getrightchild(parentleft)

                            if (parentleftlchild != undefined && parentleftlchild.isred) {
                                console.log("left-left")
                                parentleft.isred = false
                                parentofsibling.isred = true
                                rightrotation(parentofsibling)
                                log = ">parent of double black rotated right.<br>" + log

                            }
                            else if (parentleftrchild != undefined && parentleftrchild.isred) {
                                console.log("left-right")
                                parentleftrchild.isred = false
                                parentofsibling.isred = true


                                leftrotation(parentleft)
                                rightrotation(parentofsibling)
                                log = ">left child of parent of double black rotated left.<br>" + log
                                log = ">parent of double black rotated right.<br>" + log
                            }





                            doubleblack = false
                        }
                    }


                }

            }



        }


        let root = getroot()
        if (root != null) {
            root.isred = false
        }


        console.log($state.snapshot(allnodes));
        wait(0.5).then(() => recalculate_positions());

        wait(3).then(() => button = false);
        return;
    }

}



export function leftrotation(tobeleft: Node) {


    let child = getrightchild(tobeleft)
    let parent = getparent(tobeleft)

    if (parent && child) {
        if (parent.lchildid == tobeleft.id) {
            parent.lchildid = child.id
        } else {
            parent.rchildid = child.id
        }
        child.parentid = parent.id
    } else {
        if (child) {
            child.parentid = null
        }
    }

    let leftchildofchild = null
    if (child) {
        leftchildofchild = getleftchild(child)
    }

    if (child && tobeleft) {
        child.lchildid = tobeleft.id
        tobeleft.parentid = child.id
        if (leftchildofchild) {
            tobeleft.rchildid = leftchildofchild.id
            leftchildofchild.parentid = tobeleft.id
        }
        if (tobeleft.lchildid == child.id) {
            tobeleft.lchildid = null
        } else if (tobeleft.rchildid == child.id) {
            tobeleft.rchildid = null
        }
    }
}

export function rightrotation(toberight: Node) {


    let child = getleftchild(toberight)
    let parent = getparent(toberight)

    if (parent && child) {
        if (parent.lchildid == toberight.id) {
            parent.lchildid = child.id
        } else {
            parent.rchildid = child.id
        }
        child.parentid = parent.id
    } else {
        if (child) {
            child.parentid = null
        }
    }

    let rightchildofchild = null
    if (child) {
        rightchildofchild = getrightchild(child)
    }

    if (child && toberight) {
        child.rchildid = toberight.id
        toberight.parentid = child.id
        if (rightchildofchild) {
            toberight.lchildid = rightchildofchild.id
            rightchildofchild.parentid = toberight.id
        }
        if (toberight.lchildid == child.id) {
            toberight.lchildid = null
        } else if (toberight.rchildid == child.id) {
            toberight.rchildid = null
        }
    }
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

async function wait(x: number) {
    return new Promise(resolve => setTimeout(resolve, x * 1000));
}

export function push(nodeinputvalue: number) {
    button = true
    if (!Number.isInteger(nodeinputvalue)) {
        wait(3).then(() => button = false);
        log = ">Invalid input. Please enter a valid integer.<br>" + log
        return;
    }
    let id = 0;
    while (allnodes.find((node) => node.id === id)) {
        id = id + 1;
    }
    let node = {
        id: id,
        val: nodeinputvalue,
        x: 700,
        y: 35,
        parentid: null,
        lchildid: null,
        rchildid: null,
        width: 100,
        isred: true
    };

    if (allnodes.length < 1) {
        allnodes.push(node);
    } else {
        placenode(node, getroot() as Node);

        allnodes.push(node);
    }
    log = ">Added a node with id " + node.id + " and value " + node.val + " to the red-black tree.<br>" + log
    wait(0.25).then(() => comparecolours(node));
    wait(0.5).then(() => recalculate_positions());
    wait(3).then(() => button = false);
}
