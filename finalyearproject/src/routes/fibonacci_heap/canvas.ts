
import type { Attachment } from "svelte/attachments";
import type { Node } from "./FibonacciHeap.svelte.ts";
import * as treestruct from "./FibonacciHeap.svelte.ts";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
export const makecanvas: Attachment<HTMLCanvasElement> = (element) => {
    canvas = element;
    ctx = canvas.getContext("2d");
    if (ctx != null) {
        ctx.fillStyle = "black";
    }
    console.log(canvas);
    console.log(ctx);
    console.log("made a canvas and a context element!");
};


export function clearlines() {
    if (ctx != undefined) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export function drawlines() {

        if (ctx != undefined && canvas != undefined) {
            ctx.beginPath()
            let tempstore;
            let thisroot;
            for (let rootnode of treestruct.getroots()) {
                thisroot = treestruct.getnode(rootnode.id)
                if(tempstore != null && thisroot != null){
                    let leftx = tempstore.x + 50
                    let lefty = tempstore.y + 50
                    let rightx = thisroot.x + 50
                    let righty = thisroot.y + 50
                    ctx.beginPath()
                    ctx.moveTo(leftx, lefty);
                    ctx.lineTo(rightx, righty);
                    ctx.stroke();
                }
                tempstore = thisroot
            }
        }
    
    if (ctx != undefined && canvas != undefined) {
        for (let node of treestruct.getNodes()) {
            ctx.beginPath();
            ctx.lineWidth = 10;
            if (ctx != undefined && canvas != undefined && node.children != null) {
                ctx.beginPath();
                ctx.lineWidth = 10;
                let child = node.children[0]
                let childasnode = treestruct.getnode(child)

                for (let child of node.children) {
                    childasnode = treestruct.getnode(child)
                    if (childasnode != undefined) {
                        let childx = childasnode.x + 50
                        let childy = childasnode.y + 50
                        let parentx = node.x + 50
                        let parenty = node.y + 50
                        ctx.moveTo(parentx, parenty);
                        ctx.lineTo(childx, childy);
                        ctx.stroke();
                    }
                }
            }
        }
    }
}




export function clearchildlines(node1: Node) {
    if (ctx != undefined && node1.children != undefined) {
        let leftpos = node1.x;
        let rightpos = node1.x;
        let height = 25
        for (let child of node1.children) {
            let childasnode = treestruct.getnode(child)
            if (childasnode != undefined) {
                if (childasnode.x < leftpos) {
                    leftpos = childasnode.x
                }
                if (childasnode.x > rightpos) {
                    rightpos = childasnode.x
                }
            }
        }
        leftpos += 21
        rightpos += 21
        let fin = rightpos - leftpos;
        if (rightpos - leftpos < 0) {
            fin = node1.width;
        }
        ctx.clearRect(leftpos, node1.y, fin, height);
        console.log("cleared lines")
    }

}


