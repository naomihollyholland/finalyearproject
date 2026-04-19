
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
    marked: boolean
}

export interface rootitem {
    id: number;
    ismin: Boolean;
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
        children: null,
        width: 100,
        degree: 0,
        marked: false
    },
]);

let rootnodes: rootitem[] = $state([
    {
        id: 0,
        ismin: true
    }
])

let log = $state("hello!")
export const getlog = () => log

export const getNodes = () => allnodes;

export const getbutton = () => button;

export function recalculate_positions() {

    let firstnode
    if(rootnodes[0] != undefined){
        firstnode = getnode(rootnodes[0].id)
    } else {
        return;
    }
    let basepos = i[0]
    if (firstnode != undefined) {
        firstnode.x = basepos
    }

    //get the degree of everything, make sure its updated
    for (let item of allnodes) {
        if (item != undefined && item.children != undefined) {
            item.degree = item.children.length
        } else {
            item.degree = 0
        }
    }

    //for each element in rootnodes
    for (let node of rootnodes) {
        //get the root node as an actual node
        let rootasnode = getnode(node.id)
        if (rootasnode != undefined) {
            rootasnode.x = basepos
            rootasnode.y = i[1]
            calculate_widths(rootasnode)
            reevaluate_coordinates_of_children(rootasnode)
            basepos += rootasnode.width
        }


    }
    checklefftoverrun()

    wait(1.5).then( () => canvas.drawlines())
}


export function checklefftoverrun(){
    let max = 0
    for(let node of allnodes){
        if((node.x) <  500){
            let newval = Math.abs(node.x - 500)
            if(newval > max){
                max = newval
            }
        }
    }
    if(max > 0){
        max += 50
    }

    i[0] = i[0] + max
}

//given the root first, then everything else after, if it changes
export function reevaluate_coordinates_of_children(node: Node) {
    let basepos = node.x

    if (node.children != null) {

        for (let child of node.children) {
            let childasnode = getnode(child)
            if (childasnode != undefined) {
                childasnode.y = node.y + 125
                //if the child has moved
                if (childasnode.x != basepos) {
                    childasnode.x = basepos
                    //canvas.clearchildlines(node)
                    canvas.clearlines()
                    reevaluate_coordinates_of_children(childasnode)
                }

                basepos += childasnode.width
            }
        }
        console.log("reevaluated")
    }

}



export function calculate_widths(node: Node) {

    let totalwidth = 0;
    let childasnode;
    if (node.children != null) {
        for (let child of node.children) {
            childasnode = getnode(child)
            if (childasnode != undefined) {
                totalwidth += calculate_widths(childasnode)
            }
        }
    } else {
        node.width = 200;
        return node.width
    }

    node.width = totalwidth
    return node.width;

}

export function deletemin() {
    button = true
    canvas.clearlines()
    let min;
    let index = 0
    let allnodesid = -1
    for (let item of rootnodes) {
        if (item.ismin) {
            min = item
            allnodesid = item.id
            break
        }
        index += 1
    }

    console.log("minimum's children adding to the root list")
    log = ">Adding the children of the minimum node to the root list.<br>" + log
    //add the minimum's children to the root list
    if (min != undefined) {
        let minasnode = getnode(min.id)
        if (minasnode != undefined && minasnode.children != undefined) {
            for (let children of minasnode.children) {
                let newitem = {
                    id: children,
                    ismin: false
                }
                rootnodes.push(newitem);
            }
        }
    }

    rootnodes.splice(index, 1)
    log = ">Minimum node " + allnodesid + " deleted.<br>" + log
    let allnodesindex = allnodes.findIndex((node) => node.id === allnodesid);
    if (allnodesindex != -1) {
        allnodes.splice(allnodesindex, 1)
    }
    console.log("done")

    //make an array with a size equal to the rootnodes size

    log = ">Consolidating the root list to make sure there are no two nodes with the same degree.<br>" + log

    let array = Array(rootnodes.length).fill(null)
    console.log($state.snapshot(rootnodes))

    log = ">Creating array for consolidation.<br>" + log
    let rootnodeslength = $state.snapshot(rootnodes.length)
    for (let j = 0; j != rootnodeslength; j += 1) {
        let rootid = rootnodes[j].id
        let itemasnode = getnode(rootid)

        if (itemasnode != null) {
            console.log("checking node: " + $state.snapshot(itemasnode.id))

            if (array[itemasnode.degree] == null) {
                array[itemasnode.degree] = itemasnode.id
                log = ">Node " + itemasnode.id + " with degree " + itemasnode.degree + " added to the array.<br>" + log
            } else {

                let storednode = getnode(array[itemasnode.degree])
                let check = true
                while (storednode != null && check) {
                    storednode = getnode(array[itemasnode.degree])
                    
                    //if there is a conflict with the space the new node will have to fit
                    if(array[itemasnode.degree + 1] != null && storednode != undefined){
                         log = ">Conflict with node " + storednode.id + " and node " + itemasnode.id + " at degree " + itemasnode.degree + ", performing a union.<br>" + log
                        array[itemasnode.degree] = null
                        log = ">Clearing the conflicted space in the array.<br>" + log
                        if(storednode.val > itemasnode.val){
                            union(itemasnode, storednode)
                        } else {
                            union(storednode, itemasnode)
                            itemasnode = storednode
                        }
                        //rootnodes has gotten smaller, and j needs to check this index again, since it has been squashed
                        
                        rootnodeslength -= 1
                        j -= 1
                        console.log("moving up the chain")
                        log = ">Iterating upwards, to check if this union causes any conflicts.<br>" + log
                    } else if(storednode != undefined){
                        array[itemasnode.degree] = null
                        log = ">Performing union of node " + storednode.id + " and node " + itemasnode.id + ".<br>" + log
                        if(storednode.val > itemasnode.val){
                            union(itemasnode, storednode)
                        } else {
                            union(storednode, itemasnode)
                            itemasnode = storednode
                        }
                        array[itemasnode.degree] = itemasnode.id
                        check = false
                        rootnodeslength -= 1
                        j -= 1



                    } else {
                        console.log("storednode is not real")
                        check = false
                    }


                }


            }


        }
        console.log(array)
    }

    let val = null
    let min_id = null

    for (let item of rootnodes) {
        let itemasnode = getnode(item.id)
        if (itemasnode != undefined) {
            if (val == null) {
                min_id = itemasnode.id
                val = itemasnode.val
            } else if (itemasnode.val < val) {
                min_id = itemasnode.id
                val = itemasnode.val
            }

        }
    }

    for (let item of rootnodes) {
        if (item.id == min_id) {
            item.ismin = true
        } else {
            item.ismin = false
        }
    }

    recalculate_positions()
    wait(3).then(() => button = false);
}

export function getroots() {
    return rootnodes;
}

async function wait(x: number) {
    return new Promise(resolve => setTimeout(resolve, x * 1000));
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




//takes two nodes, changes base's children to include the item toappend
export function union(base: Node, toappend: Node) {
    canvas.clearlines()
    log = ">Union of node " + base.id + " and node " + toappend.id + ".<br>" + log
    base.degree += 1;
    if (base.children != null) {
        base.children.push(toappend.id)
    } else {
        base.children = [toappend.id]
    }
    console.log("children of " + base.id + " are: " + base.children)


    let parent = getparent(toappend)

    if (parent != null) {
        if (parent.children != undefined) {
            let id = parent.children.findIndex((child) => child === toappend.id)
            parent.children.splice(id, 1)
        }
    } else {
        let id = rootnodes.findIndex((child) => child.id === toappend.id)
        rootnodes.splice(id, 1)
    }
    toappend.parentid = base.id


    reevaluate_coordinates_of_children(base)
    wait(1.5).then(() => canvas.drawlines())
    console.log($state.snapshot(allnodes))
}

export function placenode(node1: Node, node2: Node) {
    console.log($state.snapshot(allnodes));
    if (comparenodes(node1, node2) <= 0) {
    } else {
        wait(0.5).then(() => recalculate_positions());
        return;
    }
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
        x: 700,
        y: 35,
        parentid: null,
        children: null,
        width: 100,
        degree: 0,
        marked: false
    };

    if (allnodes.length < 1) {
        allnodes.push(node);
        let newitem = {
            id: id,
            ismin: true
        }
        rootnodes.push(newitem);
    } else {
        allnodes.push(node);
        let newitem = {
            id: id,
            ismin: false
        }
        for (let rootnode of rootnodes) {
            let nodeid = rootnode.id
            let nodemin = rootnode.ismin
            let item = getnode(nodeid)
            if (nodemin && item) {
                if (node.val < item.val) {
                    newitem.ismin = true
                    rootnode.ismin = false
                }
            }

        }
        rootnodes.push(newitem)

    }
    console.log("node id: " + node.id + " pushed")
        log = ">node " + node.id + " pushed to the heap, with value " + node.val + "<br>" + log
    console.log($state.snapshot(allnodes));
    wait(0.5).then(() => recalculate_positions());
    wait(3).then(() => button = false);
}
