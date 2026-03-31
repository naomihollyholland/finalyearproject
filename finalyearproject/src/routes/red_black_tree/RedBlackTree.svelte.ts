
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
        val: 1,
        x: i[0],
        y: i[1],
        parentid: null,
        lchildid: null,
        rchildid: null,
        width: 100,
        isred: false
    },
]);

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


export function checklefftoverrun(){
    let max = 0
    for(let node of allnodes){
        if((node.x) <  300){
            let newval = Math.abs(node.x - 300)
            if(newval > max){
                max = newval
            }
        }
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
                //if the uncle is red, parent left
                if (uncle != null && uncle.isred) {
                    console.log("uncle is red, the parent is the left child")
                    console.log(uncle.isred)
                    parent.isred = false
                    uncle.isred = false
                    grandparent.isred = true
                    current = grandparent
                    currentparent = getparent(grandparent)

                    console.log("pushing blackness down from grandparent")
                    console.log($state.snapshot(allnodes))
                    console.log(uncle.isred)
                    console.log(grandparent.id)

                } else {
                    // if the uncle is black (or null), parent left, node right child of parent
                    if (parent.rchildid == current.id) {
                        console.log("left rotation needed" + parent.id)
                        leftrotation(parent)
                        console.log($state.snapshot(allnodes))
                        console.log("right rotation needed on grandparent: " + grandparent.id)
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
                        rightrotation(grandparent)
                        console.log($state.snapshot(allnodes))
                        parent.isred = false
                        grandparent.isred = true
                    }

                    current = null
                }
            }

            //if the parent is not the left child
            else if (current != null && !parentisleftchild && parent != null && grandparent != null) {
                //if the uncle is red
                console.log(uncle)
                if (uncle != null && uncle.isred) {
                    console.log("uncle is red, the parent is the right child")
                    console.log(uncle.isred)
                    parent.isred = false
                    if (uncle != null) {
                        uncle.isred = false
                    }
                    grandparent.isred = true
                    current = grandparent
                    currentparent = getparent(grandparent)
                    console.log("pushing blackness down from grandparent")
                    console.log($state.snapshot(allnodes))
                    console.log(uncle.isred)
                } else {
                    // if the uncle is black (or null)
                    if (parent.lchildid == current.id) {
                        console.log("right rotation needed on: " + parent.id)
                        rightrotation(parent)
                        console.log($state.snapshot(allnodes))
                        console.log("left rotation needed on grandparent: " + grandparent.id)
                        leftrotation(grandparent)
                        console.log($state.snapshot(allnodes))
                        let node = getnode(current.id)
                        if (node != null) {
                            node.isred = false
                        }
                        grandparent.isred = true
                    } else {
                        console.log("left rotation needed on grandparent: " + grandparent.id)
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

export function inorderpredecessor(node1: Node) {
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

export function inordersuccessor(node1: Node) {
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

export function deletenode(node_to_delete: number) {
    button = true
    console.log("node being deleted");
    let node = allnodes.find((node) => node.id === node_to_delete);
    if (node == undefined) {
        wait(3).then(() => button = false);
        return;
    }
    let doubleblack = false
    let swap = getswapcandidate(node);
    let parent = getparent(node);

    if (swap == null) {
        swap = getrightchild(node)
    }

    //swap is either the right child of the deleting node, or the in order successor
    if (swap != null) {
        console.log("in order successor found!")
        let swapparent = getparent(swap)
        let swapleft = getleftchild(swap)


        let swapparentid = -1
        if (swapparent != undefined) {
            swapparentid = swapparent.id
            console.log(swapparent.id)
        }

        console.log("before swap")
        console.log($state.snapshot(allnodes))

        //nodes are swapped here
        swapnodes(node, swap);

        console.log("nodes swapped");
        console.log($state.snapshot(allnodes))


        // at this point, the nodes have been swapped, so swap is where node is, and node is where swap is. 

        let potentialreplacement = null
        potentialreplacement = getleftchild(node)

        console.log(node.id)
        if (potentialreplacement != null) {
            console.log(potentialreplacement.id)
        } else {
            console.log(null)
        }

        //swapleft is black or a null node
        if (potentialreplacement == null || !potentialreplacement.isred) {

            if (node.isred) {
                console.log("one black, one red, so replacing node becomes black")
                // mark the replacing node as black
                if (potentialreplacement != null) {
                    potentialreplacement.isred = false
                }
            }
            if (!node.isred) {

                console.log("node is black, and replacing node is black, double black")
                //double black situation
                doubleblack = true
            }

        } else {
            //potentialreplacement must exist and be red

            if (!node.isred) {
                console.log("one black, one red, so replacing node becomes black")
                potentialreplacement.isred = false
            }

            if (node.isred) {
                //this should never happen, so im just gonna log something here
                console.log("double red situation, should be impossible")

            }
        }

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

        console.log("node: " + node_to_delete + " deleted")

        node = swapleft

        while (doubleblack && node && swapleft) {
            console.log("double black detected: " + node.id)
            //if the sibling is black and one of the sibling's children is red
            let sibling = null
            let siblingisleft = null
            let nodeparent = getparent(node)

            if (nodeparent == null) {
                doubleblack = false
                break;
            }

            if (nodeparent && nodeparent.lchildid == swapleft.id) {
                //the left child of the new node's parent is the new node
                //so the sibling is the right child
                sibling = getrightchild(nodeparent)
                siblingisleft = false
            } else if (nodeparent && nodeparent.rchildid == swapleft.id) {
                sibling = getleftchild(nodeparent)
                siblingisleft = true
            }
            //get the colour of the sibling
            let siblingcolour = null
            let siblingleftchild = null
            let siblingrightchild = null

            let siblingleftchildcolour = null
            let siblingrightchildcolour = null

            if (sibling != undefined) {
                siblingcolour = sibling.isred
                siblingleftchild = getleftchild(sibling)
                siblingrightchild = getrightchild(sibling)

                if (siblingleftchild != undefined) {
                    siblingleftchildcolour = siblingleftchild.isred
                }
                if (siblingrightchild != undefined) {
                    siblingrightchildcolour = siblingrightchild.isred
                }
            }


            //if the sibling does not exist or it is black and its children are black (equivalent)
            if ((sibling == null) || (!siblingcolour && !siblingleftchildcolour && !siblingrightchildcolour)) {
                console.log("sibling either does not exist or it is black and its children are also black")
                if (sibling != null) {
                    sibling.isred = true
                    if (node.isred) {
                        node.isred = false
                    } else {
                        node = getparent(node)
                    }
                }
            }


            //left left case

            //if the sibling's LEFT child is red, and the sibling is the LEFT child

            if (sibling && !siblingcolour && siblingleftchild && siblingleftchildcolour && siblingisleft) {
                console.log("sibling is left child, sibling's left child is red")
                siblingleftchild.isred = false
                rightrotation(sibling)
                doubleblack = false
            }

            //left right case

            //if the sibling is the RIGHT child and the sibling's LEFT child is red

            if (sibling && !siblingcolour && siblingleftchild && siblingleftchildcolour && !siblingisleft) {

                console.log("sibling is right child, sibling's left child is red")

                sibling.isred = true
                siblingleftchild.isred = false
                rightrotation(siblingleftchild)

                sibling.isred = false
                leftrotation(siblingleftchild)
                doubleblack = false
            }

            //right right case

            //if the siblings RIGHT child is red, and the sibling is the RIGHT child

            if (sibling && !siblingcolour && siblingrightchild && siblingrightchildcolour && !siblingisleft) {

                console.log("sibling is right child, sibling's right child is red")

                siblingrightchild.isred = false
                leftrotation(sibling)
                doubleblack = false
            }

            //right left case

            //if the sibling is the LEFT child and the siblings RIGHT child is red

            if (sibling && !siblingcolour && siblingrightchild && siblingrightchildcolour && siblingisleft) {

                console.log("sibling is left child, sibling's right child is red")

                sibling.isred = true
                siblingrightchild.isred = false
                leftrotation(siblingrightchild)

                sibling.isred = false
                rightrotation(siblingrightchild)
                doubleblack = false
            }

            //if sibling is RED
            if (sibling && siblingcolour) {
                console.log("sibling is red")
                if (nodeparent && siblingisleft) {
                    console.log("sibling is left child")
                    sibling.isred = false
                    nodeparent.isred = true
                    rightrotation(sibling)


                } else if (nodeparent && !siblingisleft) {

                    console.log("sibling is right child")

                    sibling.isred = false
                    nodeparent.isred = true
                    leftrotation(sibling)

                }
            }


        }



        let root = getroot()

        if (root != null) {
            root.isred = false
        }

        recalculate_positions();
        console.log($state.snapshot(allnodes));
        wait(3).then(() => button = false);
        return;
    }


    if (swap == null) {
        console.log("no in order successor");
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
            }
        } else if (rightchild != undefined && parent == undefined) {
            rightchild.parentid = null;
        }
        let index = allnodes.findIndex(
            (node) => node.id === node_to_delete,
        );

        allnodes.splice(index, 1);
        console.log($state.snapshot(allnodes));
        recalculate_positions();
        wait(3).then(() => button = false);
        return;
    }

}



export function leftrotation(tobeleft: Node) {


    let child = getrightchild(tobeleft)
    let parent = getparent(tobeleft)

    if (parent && child) {
        if (parent.rchildid == tobeleft.id) {
            parent.rchildid = child.id
        } else {
            parent.lchildid = child.id
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
        if (tobeleft.rchildid == child.id) {
            tobeleft.rchildid = null
        } else if (tobeleft.lchildid == child.id) {
            tobeleft.lchildid = null
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

async function wait(x: number) {
    return new Promise(resolve => setTimeout(resolve, x * 1000));
}

export function push(nodeinputvalue: number) {
    button = true
    if (!Number.isInteger(nodeinputvalue)) {
        return;
    }
    let id = 0;
    while (allnodes.find((node) => node.id === id)) {
        id = id + 1;
    }
    let node = {
        id: id,
        val: nodeinputvalue,
        x: 500,
        y: 500,
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
        let parent = getparent(node)
        if (parent != undefined) {
            node.y = parent.y + 125
        } else {
            node.y = i[1]
        }

        allnodes.push(node);
    }
    console.log("node id: " + node.id + " pushed")
    console.log($state.snapshot(allnodes));
    comparecolours(node)
    recalculate_positions();
    wait(3).then(() => button = false);
}
