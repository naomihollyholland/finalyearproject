
import type { Attachment } from "svelte/attachments";
import * as canvas from "./canvas.ts";
import { get } from "svelte/store";


export interface Node {
    id: number;
    val: number;
    x: number;
    y: number;
    parentid: number | null;
    children: number[] | null;
    width: number;
    degree: number;
}

export interface rootlist {
    id: Number;
    leftpointer: Number;
    rightpointer: Number;
    ismin: Boolean; 
}

let i = $state([500, 150]);

let allnodes: Node[] = $state([
    {
        id: 0,
        val: 1,
        x: i[0],
        y: i[1],
        parentid: null,
        children: null,
        width: 100,
        degree: 0
    },
]);

let rootnodes: rootlist[] = $state([])

export const getNodes = () => allnodes;

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

    //console.log($state.snapshot(allnodes));
}

export function reevaluate_coordinate(node: Node) {
}



export function calculate_widths(node: Node) {

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

export function getparent(node1: Node) {
    return allnodes.find((node) => node.id == node1.parentid);
}





export function deletenode(node_to_delete: number) {
}

export function union(node1:Node, node2:Node){

}





export function placenode(node1: Node, node2: Node) {
    console.log($state.snapshot(allnodes));
    if (comparenodes(node1, node2) <= 0) {
    } else {
        recalculate_positions();
        return;
    }
}

export function push(nodeinputvalue: number) {
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
        children: null,
        width: 100,
        degree: 0
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
    recalculate_positions();
}
