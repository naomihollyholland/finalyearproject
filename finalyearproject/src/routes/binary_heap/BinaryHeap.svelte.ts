
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

export const getNodes = () => allnodes;

export function recalculate_positions() {
    let root = getroot();
    if (root != undefined) {
        heapify()
        calculate_widths(root);
    }
    console.log($state.snapshot(allnodes))
    for (let node of allnodes) {
        if (node.parentid == null) {
            console.log("recalc");
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
                        setTimeout( () => {
                            canvas.drawparenttoleftchild(parentnode);
                        }, 1000);

                        canvas.clearleftchildline(node);
                        setTimeout( () => {
                            canvas.drawparenttoleftchild(node);
                        }, 1000);

                        canvas.clearrightchildline(node);
                        setTimeout( () => {
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
    }
    
    console.log($state.snapshot(allnodes));
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

export function heapify(){
    
    let i = 0
    length = allnodes.length - 1
    console.log(length)
    console.log($state.snapshot(allnodes))
    let node = undefined;
    let parent = undefined
    while(i < allnodes.length){
        console.log("checking node in position: " + (length - i))
        node = allnodes[length - i]
        console.log("checking node " + node.id)
        parent = getparent(node)
        if(parent != undefined){
        console.log("parent of node is: " + parent.id)
        }
        if(parent != undefined && node != undefined){
            console.log("would check to swap: " + node.id + " and: " + parent.id)
            if(comparenodes(node, parent) == 1){
                swapnodes(node, parent)
                console.log(node.id)
                console.log(parent)
                console.log($state.snapshot(allnodes))
                console.log("swapped nodes: " + parent.id + " & " + node.id)
                node = getparent(node)
                parent = getparent(parent)
                // while(node != undefined && parent != undefined){
                //     if(comparenodes(node, parent) == 1 ){
                //         swapnodes(node, parent)
                //         console.log("swapped nodes: " + parent.id + " & " + node.id)
                //         node = getparent(node)
                //         parent = getparent(parent)
                //     }
                // }
                
            }
        }
        i += 1;    
    }    
}

export function swapnodes(node1: Node, node2: Node) {
    if (node1 == undefined || node2 == undefined) {
        console.log("one or both of two nodes was undefined");
        return;
    }
    console.log("node1: " + node1.id);
    console.log("node2: " + node2.id);
    console.log("state before:")
    console.log($state.snapshot(allnodes))

    //        get the temporary variables to store the information from the first node
    let node1pos = allnodes.findIndex((node) => node.id === node1.id)
    let node2pos = allnodes.findIndex((node) => node.id === node2.id)
    let tempx = node1.x;
    let tempy = node1.y;
    let templchild = node1.lchildid;
    let temprchild = node1.rchildid;
    let tempparentid = node1.parentid;


    //for node 1, swapping to node 2

    node1.x = node2.x
    node1.y = node2.y
    node1.lchildid = node2.lchildid
    if(node1.lchildid == node1.id){
        node1.lchildid = node2.id
    }

    node1.rchildid = node2.rchildid
    if(node1.rchildid == node1.id){
        node1.rchildid = node2.id
    }

    
    node1.parentid = node2.parentid
    if(node1.parentid == node1.id){
        node1.parentid = node2.id
    }

    let node1left = getleftchild(node1);
    let node1right = getrightchild(node1);
    let node1parent = getparent(node1);

    if(node1left != undefined){
        node1left.parentid = node1.id
    }
    if(node1right != undefined){
        node1right.parentid = node1.id
    }
    if(node1parent != undefined){
        if (node1parent.lchildid == node1.id) {
            node1parent.lchildid = node1.id;
        } else {
            node1parent.rchildid = node1.id;
        }
    }
    
    

    node2.x = tempx
    node2.y = tempy
    node2.lchildid = templchild
    if(node2.lchildid == node2.id){
        node2.lchildid = node1.id
    }

    node2.rchildid = temprchild
    if(node2.rchildid == node2.id){
        node2.rchildid = node1.id
    }

    
    node2.parentid = tempparentid
    if(node2.parentid == node2.id){
        node2.parentid = node1.id
    }

    let node2left = getleftchild(node2);
    let node2right = getrightchild(node2);
    let node2parent = getparent(node2);

    if(node2left != undefined){
        node2left.parentid = node2.id
    }
    if(node2right != undefined){
        node2right.parentid = node2.id
    }
    if(node2parent != undefined){
        if (node2parent.lchildid == node2.id) {
            node2parent.lchildid = node2.id;
        } else {
            node2parent.rchildid = node2.id;
        }
    }    
    
    
    
    
    allnodes[node1pos] = node2
    allnodes[node2pos] = node1
    console.log("after swap: ")
    console.log($state.snapshot(allnodes))
    
    
    
    
    
}


    //node1.x = node1.x;
    //node1.y = node2.y;

    //node1.lchildid = node2.lchildid;
    //node1.rchildid = node2.rchildid;

    // let left = getleftchild(node2);
    // if (left != undefined) {
    //     left.parentid = node1.id;
    // }

    // let right = getrightchild(node2);
    // if (right != undefined) {
    //     right.parentid = node1.id;
    // }

    // let parent = getparent(node2);
    // if (parent != undefined) {
    //     if (parent.lchildid == node2.id) {
    //         parent.lchildid = node1.id;
    //     } else {
    //         parent.rchildid = node1.id;
    //     }
    // }

    // node1.parentid = node2.parentid;

    // node2.x = tempx;
    // node2.y = tempy;
    // node2.lchildid = templchild;
    // node2.rchildid = temprchild;
    // node2.parentid = tempparentid;

    // if (node2.lchildid == node2.id) {
    //     node2.lchildid = node2lchild;
    //     if (node2lchild != null) {
    //         let leftchild = getnode(node2lchild);
    //         if (leftchild != undefined) {
    //             leftchild.parentid = node2.id;
    //         }
    //     }
    // }

    // if (node2.rchildid == node2.id) {
    //     node2.rchildid = node2rchild;
    //     if (node2rchild != null) {
    //         let rightchild = getnode(node2rchild);
    //         if (rightchild != undefined) {
    //             rightchild.parentid = node2.id;
    //         }
    //     }
    // }

    // if (node1left != undefined) {
    //     node1left.parentid = node2.id;
    // }

    // if (node1right != undefined) {
    //     node1right.parentid = node2.id;
    // }

    // if (node1parent != undefined) {
    //     if (node1parent.lchildid == node1.id) {
    //         node1parent.lchildid = node2.id;
    //     } else {
    //         node1parent.rchildid = node2.id;
    //     }
    // }



    //node2.parentid = tempparentid;

    //allnodes[node1pos] = node2
    //allnodes[node2pos] = node1

    //console.log("after swap: ")
    //console.log($state.snapshot(allnodes));



export function deleteMin(){
    swapnodes(allnodes[0], allnodes[allnodes.length - 1])
    allnodes.splice(allnodes.length-1, 1)
    heapify()
}

export function push(nodeinputvalue : number) {
    if(!Number.isInteger(nodeinputvalue)){
        return;
    }
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

    allnodes.push(node)

    let nodepos = allnodes.findIndex((node) => node.id === i)
    console.log("node position:" +  nodepos)

    let thenode = getnode(i)
    let parentpos = (nodepos - 1) / 2
    let leftchild = true
    if(!Number.isInteger(parentpos)){
        parentpos = ((nodepos - 2) / 2)
        leftchild = false
    }
    console.log("parent position:" + parentpos)
    let parent = allnodes[parentpos]
    console.log("parent id: " + parent.id)
    if(parent.lchildid == null && thenode != undefined){
        parent.lchildid = node.id
        thenode.parentid = parent.id
        thenode.x = parent.x - (parent.width / 3.5)
    } else if(parent.rchildid == null && thenode != undefined){
        parent.rchildid = node.id
        thenode.parentid = parent.id
        thenode.x = parent.x + (parent.width / 3.5)
    }
    if(thenode != undefined){
    thenode.y = parent.y + 125
    }

    console.log($state.snapshot(allnodes));
    console.log("heapifying")
    recalculate_positions();
}
