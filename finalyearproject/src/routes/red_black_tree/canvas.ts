
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
    if (ctx != undefined) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export function drawlines() {
    //console.log("canvas: " + canvas);
    //console.log("ctx: " + ctx);
    if (ctx != undefined && canvas != undefined) {
        for (let node of treestruct.getNodes()) {
            ctx.beginPath();
            //for left child
            ctx.lineWidth = 10;
            let leftchild = treestruct.getleftchild(node);
            if (leftchild != undefined) {
                ctx.moveTo(node.x + 50, node.y + 50);
                ctx.lineTo(leftchild.x + 50, leftchild.y + 50);
                ctx.stroke();
            }

            //for right child
            let rightchild = treestruct.getrightchild(node);
            if (rightchild != undefined) {
                ctx.moveTo(node.x + 50, node.y + 50);
                ctx.lineTo(rightchild.x + 50, rightchild.y + 50);
                ctx.stroke();
            }
        }
    }
}

export function drawparenttoleftchild(node1: Node) {
    if (ctx != undefined && canvas != undefined) {
        ctx.beginPath();
        ctx.lineWidth = 10;
        let leftchild = treestruct.getleftchild(node1);
        if (leftchild != undefined) {
            ctx.moveTo(node1.x + 50, node1.y + 50);
            ctx.lineTo(leftchild.x + 50, leftchild.y + 50);
            ctx.stroke();
        }
    }
}

export function drawparenttorightchild(node1: Node) {
    if (ctx != undefined && canvas != undefined) {
        ctx.beginPath();
        ctx.lineWidth = 10;
        let rightchild = treestruct.getrightchild(node1);
        if (rightchild != undefined) {
            ctx.moveTo(node1.x + 50, node1.y + 50);
            ctx.lineTo(rightchild.x + 50, rightchild.y + 50);
            ctx.stroke();
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
    //    console.log(
    //         "clearing rectangle of: " +
    //         fin +
    //         ", " +
    //         height +
    //         " starting at: " +
    //         leftpos +
    //         ", " +
    //         node1.y,
    //     );
        ctx.clearRect(leftpos, node1.y, fin, height);
    }
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
        // console.log(
        //     "clearing rectangle of: " +
        //     fin +
        //     ", " +
        //     height +
        //     "starting at: " +
        //     leftpos +
        //     ", " +
        //     node1.y,
        // );
        ctx.clearRect(leftpos, node1.y, fin, height);
    }
}
