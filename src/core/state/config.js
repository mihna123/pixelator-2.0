/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvasElement");

export const PIXELS_X = 32;
export const PIXELS_Y = 32;
export const PIXEL_WIDTH = Number(canvas.width) / PIXELS_X;
export const PIXEL_HEIGHT = Number(canvas.height) / PIXELS_Y;
