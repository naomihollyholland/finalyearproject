
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
        id:0,
        ismin:true
    }
])

export const getNodes = () => allnodes;

export function recalculate_positions() {

    console.log($state.snapshot(allnodes))
    let firstnode = getnode(rootnodes[0].id)
    let basepos = i[0]
    if(firstnode != undefined){
        firstnode.x = basepos
    }

    //get the degree of everything, make sure its updated
    for(let item of allnodes){
        if(item != undefined && item.children != undefined){
            item.degree = item.children.length
        } else{
            item.degree = 0
        }
    }

    //for each element in rootnodes
    for(let node of rootnodes){
        //get the root node as an actual node
        let rootasnode = getnode(node.id)
        if(rootasnode != undefined){
            rootasnode.x = basepos
            rootasnode.y = i[1]
            calculate_widths(rootasnode)
            reevaluate_coordinates_of_children(rootasnode)
            basepos += rootasnode.width
        }

        //
    }
    console.log($state.snapshot(allnodes));
}


//given the root first, then everything else after, if it changes
export function reevaluate_coordinates_of_children(node: Node) {
    
    let basepos = node.x

    if(node.children != null){
        
        for(let child of node.children){
            let childasnode = getnode(child)
            if(childasnode != undefined){
                childasnode.y = node.y + 125
                //if the child has moved
                if(childasnode.x != basepos){
                    childasnode.x = basepos
                    canvas.clearchildlines(node)
                    reevaluate_coordinates_of_children(childasnode)
                }
                //childasnode.x = basepos
                basepos += childasnode.width
            }
        }
        canvas.drawparenttochildren(node)
    }

}



export function calculate_widths(node: Node) {

    let totalwidth = 0;
    let childasnode;
    if(node.children != null){
        for(let child of node.children){
            childasnode = getnode(child)
            if(childasnode != undefined){
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

export function deletemin(){
    let min;
    for(let item of rootnodes){
        if(item.ismin){
            min = item
            break
        }
    }
    let array = Array(rootnodes.length)

    console.log($state.snapshot(rootnodes))
    console.log("minimum's children adding to the root list")
    //add the minimum's children to the root list
    if(min != undefined){
        let minasnode = getnode(min.id)
        if(minasnode != undefined && minasnode.children != undefined){
            for(let children of minasnode.children){
                let newitem = {
                    id: children, 
                    ismin: false
                }
                rootnodes.push(newitem);
            }
        }
    }

    console.log($state.snapshot(rootnodes))
    console.log("done")

    //make an array with a size equal to the rootnodes size
    for(let item of rootnodes){
        let itemasnode = getnode(item.id)
        if(itemasnode){
            console.log(itemasnode.degree)
            while(array[itemasnode.degree] != undefined){
                console.log("doing union")
                //do a union of the item in there, and the item to be put in there


                 let storednode = getnode(array[itemasnode.degree])
                 if(storednode != undefined){
                    if(itemasnode.val > storednode.val){
                        console.log(storednode.degree)
                        array[itemasnode.degree] = undefined
                        union(storednode, itemasnode)
                        itemasnode = storednode
                        console.log(itemasnode.degree)
                    } else {
                        console.log(itemasnode.degree)
                        array[itemasnode.degree] = undefined
                        union(itemasnode, storednode)
                        console.log(itemasnode.degree)
                        }

                 }

            }
            array[itemasnode.degree] = itemasnode.id
        }
    }

    let val = null
    let min_id = null

    for(let item of rootnodes){
        let itemasnode = getnode(item.id)
        if(itemasnode != undefined){
            if(val == null){
                min_id = itemasnode.id
                val = itemasnode.val
            } else if(itemasnode.val < val){
                    min_id = itemasnode.id
                    val = itemasnode.val
            }
            
        }
    }

    for(let item of rootnodes){
        if(item.id == min_id){
            item.ismin = true
        } else {
            item.ismin = false
        }
    }

    recalculate_positions()
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
export function union(base: Node, toappend: Node){
    base.degree += 1;
    if(base.children != null){
        base.children.push(toappend.id)
    } else {
        base.children = [toappend.id]
    }
    console.log("children of " + base.id + " are: " + base.children)
    

    let parent = getparent(toappend)

    if(parent != null){
        if(parent.children != undefined){
            let id = parent.children.findIndex((child) => child === toappend.id)
            parent.children.splice(id, 1)
        }
    } else {
            let id = rootnodes.findIndex((child) => child.id === toappend.id)
            rootnodes.splice(id, 1)
    }
    toappend.parentid = base.id

    reevaluate_coordinates_of_children(base)
    canvas.clearchildlines(base)
    canvas.drawparenttochildren(base)
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
        for(let rootnode of rootnodes){
            let nodeid = rootnode.id
            let nodemin = rootnode.ismin
            let item = getnode(nodeid) 
            if(nodemin && item){
                if(node.val < item.val){
                    newitem.ismin = true
                    rootnode.ismin = false
                }
            }

        }
        rootnodes.push(newitem)

    }
    console.log("node id: " + node.id + " pushed")
    console.log($state.snapshot(allnodes));
    recalculate_positions();
}
