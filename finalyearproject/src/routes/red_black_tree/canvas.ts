
import type { Attachment } from "svelte/attachments";
import type { Node } from "./RedBlackTree.svelte.ts";
import * as treestruct from "./RedBlackTree.svelte.ts";



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
    wait(0.25).then(() => clearlinesifctx(ctx));
}

export function clearlinesifctx(ctx: CanvasRenderingContext2D | null) {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export function drawlines() {
    console.log("canvas: " + canvas);
    console.log("ctx: " + ctx);
    if (ctx != undefined && canvas != undefined) {
        for (let node of treestruct.getNodes()) {
            ctx.beginPath();
            //for left child
            ctx.lineWidth = 10;
            let leftchild = treestruct.getleftchild(node);
            if (leftchild != undefined) {
                wait(1).then(() => drawlinesifctx(ctx, node.x, node.y, leftchild.x, leftchild.y))
            }

            //for right child
            let rightchild = treestruct.getrightchild(node);
            if (rightchild != undefined) {
                wait(1).then(() => drawlinesifctx(ctx, node.x, node.y, rightchild.x, rightchild.y))
            }
        }
    }
}


function drawlinesifctx(ctx: CanvasRenderingContext2D | null, node1x: number, node1y: number, node2x: number, node2y: number) {
    if (ctx) {
        ctx.moveTo(node1x + 50, node1y + 50);
        ctx.lineTo(node2x + 50, node2y + 50);
        ctx.stroke();
    }
}

export function drawparenttoleftchild(node1: Node) {
    if (ctx != undefined && canvas != undefined) {
        ctx.beginPath();
        ctx.lineWidth = 10;
        let leftchild = treestruct.getleftchild(node1);
        if (leftchild != undefined) {
                wait(1).then(() => drawlinesifctx(ctx, node1.x, node1.y, leftchild.x, leftchild.y))
        }
    }
}

export function drawparenttorightchild(node1: Node) {
    if (ctx != undefined && canvas != undefined) {
        ctx.beginPath();
        ctx.lineWidth = 10;
        let rightchild = treestruct.getrightchild(node1);
        if (rightchild != undefined) {
                wait(1).then(() => drawlinesifctx(ctx, node1.x, node1.y, rightchild.x, rightchild.y))
        }
    }
}

export function clearleftchildline(node1: Node) {
    if (ctx != undefined) {
        let leftchild = treestruct.getleftchild(node1);
        let leftpos = node1.x + 21;
        let rightpos = node1.x + 21;
        let height = 0;
        if (leftchild != null) {
            leftpos = leftchild.x + 21;
            height = leftchild.y - node1.y;
            height += 25;
            rightpos += 30;
        }
        let fin = rightpos - leftpos;
        if (rightpos - leftpos < 0) {
            fin = node1.width;
        }
        console.log(
            "clearing rectangle of: " +
            fin +
            ", " +
            height +
            " starting at: " +
            leftpos +
            ", " +
            node1.y,
        );
        wait(0.25).then(() => clearlineifctx(ctx, leftpos, node1.y, fin, height));

    }
}

async function wait(x: number) {
    return new Promise(resolve => setTimeout(resolve, x * 1000));
}

export function clearrightchildline(node1: Node) {
    if (ctx != undefined) {
        let rightchild = treestruct.getrightchild(node1);
        let leftpos = node1.x + 21;
        let height = node1.y + 10;
        let rightpos = 0;
        if (rightchild != null) {
            rightpos = rightchild.x + 21;
            height = rightchild.y - node1.y;
            height += 25;
            rightpos += 30;
        }
        let fin = rightpos - leftpos;
        if (rightpos - leftpos < 0) {
            fin = node1.width;
        }
        console.log(
            "clearing rectangle of: " +
            fin +
            ", " +
            height +
            "starting at: " +
            leftpos +
            ", " +
            node1.y,
        );

        wait(0.25).then(() => clearlineifctx(ctx, leftpos, node1.y, fin, height));

    }
}

export function clearlineifctx(ctx: CanvasRenderingContext2D | null, leftpos: number, toppos: number, width: number, height: number) {
    if (ctx != null) {
        ctx.clearRect(leftpos, toppos, width, height)
    }
}

