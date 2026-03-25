
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
    console.log("canvas: " + canvas);
    console.log("ctx: " + ctx);
    if (ctx != undefined && canvas != undefined) {
        for (let node of treestruct.getNodes()) {
            ctx.beginPath();
            //for left child
            ctx.lineWidth = 10;
//
          //  if (leftchild != undefined) {
          //      ctx.moveTo(node.x + 50, node.y + 50);
          //      ctx.lineTo(leftchild.x + 50, leftchild.y + 50);
          //      ctx.stroke();
          //  }
//
          //  //for right child
          //  let rightchild = treestruct.getrightchild(node);
          //  if (rightchild != undefined) {
          //      ctx.moveTo(node.x + 50, node.y + 50);
          //      ctx.lineTo(rightchild.x + 50, rightchild.y + 50);
          //      ctx.stroke();
          //  }
        }
    }
}


export function drawparenttochildren(node1: Node) {
    if (ctx != undefined && canvas != undefined && node1.children != null) {
        ctx.beginPath();        
        ctx.lineWidth = 10;
        let child = node1.children[0]
        let childasnode = treestruct.getnode(child)
        console.log("child")
        console.log(childasnode)

        

        //console.log(node1.children)
        //for (let child of node1.children) {
        //    console.log(child)
        //    childasnode = treestruct.getnode(child)
        //    console.log(childasnode)
        //    if (childasnode != undefined) {
        //        let childx = childasnode.x + 50
        //        let childy = childasnode.y + 50
        //        let parentx = node1.x + 50
        //        let parenty = node1.y + 50
        //        ctx.moveTo(parentx, parenty);
        //        ctx.lineTo(childx, childy);
        //        ctx.stroke();
//
        //        console.log("drawn line to:" + childasnode.id)
        //    }
        //}
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


