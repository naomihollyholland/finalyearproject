
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

// export function heapify(){
    
//     let i = 0
//     length = allnodes.length - 1
//     console.log(length)
//     console.log($state.snapshot(allnodes))
//     let node = undefined;
//     let parent = undefined
//     while(i < allnodes.length){
//         console.log("checking node in position: " + (length - i))
//         node = allnodes[length - i]
//         console.log("checking node " + node.id)
//         parent = getparent(node)
//         if(parent != undefined){
//         console.log("parent of node is: " + parent.id)
//         }
//         let temp;
//         if(parent != undefined && node != undefined){
//             console.log("would check to swap: " + node.id + " and: " + parent.id)
//             while((comparenodes(node, parent) == 1)){
//                 swapnodes(node, parent)
//                 console.log(node.id)
//                 console.log(parent)
//                 console.log($state.snapshot(allnodes))
//                 console.log("swapped nodes: " + parent.id + " & " + node.id)
//                 temp = $state.snapshot(parent)

                                
//             }
//         }
//         i += 1;    
//     }    
// }

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
                swapnodes(node,parent)
                console.log(node.id)
                console.log(parent)
                console.log($state.snapshot(allnodes))
                console.log("swapped nodes: " + parent.id + " & " + node.id)
                node = getparent(node)
                parent = getparent(parent)
                let check = false
                while(node != undefined && parent != undefined && !check){
                    console.log(node.id)
                    console.log(parent.id)
                    console.log(check)
                        if(comparenodes(node, parent) == 1 ){
                            swapnodes(node, parent)
                            console.log("swapped nodes: " + parent.id + " & " + node.id)
                            let newnode = getparent(node)
                            if(newnode != undefined)
                                node = newnode
                            else{
                                check = true
                            }
                            let newparent = getparent(parent)
                            if(newparent != undefined)
                                parent = newparent
                            else{
                                check = true
                            }
                            
                        } else {
                            console.log("break!")
                            check = true
                        }

                }
                
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
    if(static1l != undefined){
        static1l.parentid = node2.id
    }

    if(static1r != undefined){
        static1r.parentid = node2.id
    }
    
    if(static1p != undefined){
        if(static1p.lchildid == static1.id){
            static1p.lchildid = node2.id
        } else {
            static1p.rchildid = node2.id
        }
    }

    //swap the 2nd node's children and parents to the new pointer

    if(static2l != undefined){
        static2l.parentid = node1.id
    }

    if(static2r != undefined){
        static2r.parentid = node1.id
    }
    
    if(static2p != undefined){
        if(static2p.lchildid == static2.id){
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
    

    //swap the nodes
    node1 = static2
    node2 = static1

    //but keep the id and value
    node1.val = static1val
    node1.id = static1id
    node1.x = static1x
    node1.y = static1y

    node2.val = static2val
    node2.id = static2id

    node2.x = static2x
    node2.y = static2y

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

    if(node1.lchildid == node1.id){
        node1.lchildid = node2.id
    }

    if(node1.rchildid == node1.id){
        node1.rchildid = node2.id
    }
    
    if(node1.parentid == node1.id){
        node1.parentid = node2.id
    }

    
    if(node2.lchildid == node2.id){
        node2.lchildid = node1.id
    }

    if(node2.rchildid == node2.id){
        node2.rchildid = node1.id
    }
    
    if(node2.parentid == node2.id){
        node2.parentid = node1.id
    }

    console.log($state.snapshot(allnodes))






    let tempstore1 =  $state.snapshot(node1)
    let tempstore2 = $state.snapshot(node2)

    let node1index = allnodes.findIndex((node) => node.id == node1.id)
    let node2index = allnodes.findIndex((node) => node.id == node2.id)

    allnodes[node1index] = tempstore2
    allnodes[node2index] = tempstore1
    console.log("nodes swapped!")
    console.log($state.snapshot(allnodes))

}


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

    let node : Node = {
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



    //this is fucking stupid
    let parentpos = (nodepos-1) / 2
    let leftchild = true
    if(!Number.isInteger(parentpos)){
        parentpos = ((nodepos - 2) / 2)
        leftchild = false
    }
    console.log("parent position:" + parentpos)
    let parent = allnodes[parentpos]
    if(parent != undefined){
        if(parent.lchildid == null && node != undefined){
            parent.lchildid = node.id
            node.parentid = parent.id
            node.x = parent.x - (parent.width / 3.5)
        } else if(parent.rchildid == null && node != undefined){
            parent.rchildid = node.id
            node.parentid = parent.id
            node.x = parent.x + (parent.width / 3.5)
        }
        if(node != undefined){
            node.y = parent.y + 125
        }
    }

    console.log($state.snapshot(allnodes));
    console.log("heapifying")
    recalculate_positions();

    console.log("finished heapifying")
    console.log($state.snapshot(allnodes));
}
