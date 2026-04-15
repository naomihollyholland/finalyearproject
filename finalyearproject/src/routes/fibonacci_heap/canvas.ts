
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

export function drawlines() {

    if (ctx != undefined && canvas != undefined) {
        ctx.beginPath()
        ctx.lineWidth = 10;
        let tempstore;
        let thisroot;
        for (let rootnode of treestruct.getroots()) {
            thisroot = treestruct.getnode(rootnode.id)
            if (tempstore != null && thisroot != null) {
                let leftx = tempstore.x
                let lefty = tempstore.y
                let rightx = thisroot.x
                let righty = thisroot.y

                wait(1.5).then(() => drawlinesifctx(ctx, leftx, lefty, rightx, righty))
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
                        let childx = childasnode.x
                        let childy = childasnode.y
                        let parentx = node.x
                        let parenty = node.y
                        wait(1.5).then(() => drawlinesifctx(ctx, parentx, parenty, childx, childy))
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
        wait(0.5).then(() => clearlineifctx(ctx, leftpos, node1.y, fin, height))
        console.log("cleared lines")
    }

}

export function clearlines() {
    wait(0.5).then(() => clearlinesifctx(ctx));
}

export function clearlinesifctx(ctx: CanvasRenderingContext2D | null) {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}


function drawlinesifctx(ctx: CanvasRenderingContext2D | null, node1x: number, node1y: number, node2x: number, node2y: number) {
    if (ctx) {
        ctx.moveTo(node1x + 50, node1y + 50);
        ctx.lineTo(node2x + 50, node2y + 50);
        ctx.stroke();
    }
}




async function wait(x: number) {
    return new Promise(resolve => setTimeout(resolve, x * 1000));
}

export function clearlineifctx(ctx: CanvasRenderingContext2D | null, leftpos: number, toppos: number, width: number, height: number) {
    if (ctx != null) {
        ctx.clearRect(leftpos, toppos, width, height)
    }
}

