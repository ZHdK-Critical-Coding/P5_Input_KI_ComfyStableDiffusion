# P5 -> Comfy Stable Diffusion

A p5.js sketch that sends a text prompt to a ComfyUI server, runs a basic
Stable Diffusion 1.5 text-to-image workflow and shows the result on the canvas.

## How to Use

1. Run a ComfyUI instance that is reachable from your computer. The workflow
   `workflows/workflow_api.json` expects the checkpoint
   `SD1.5/v1-5-pruned-emaonly.ckpt` and the **SaveImageWebsocket** node
   (included with ComfyUI).
2. Set the address of your ComfyUI server in the `instance` constant at the
   top of `sketch.js`.
3. Start Live Server (click **Go Live** in the VS Code status bar).
4. The browser calls ComfyUI cross-origin. Either start ComfyUI with
   `--enable-cors-header`, or use the debugger configuration
   **Launch Chrome (no Security)** (Run and Debug panel).
5. Edit the prompt in the text field and press **generate**. A pulsing red
   dot is shown while the image is being generated.

## How it Works

The workflow (exported in ComfyUI's API format) is loaded as JSON. Before each
run the sketch writes the prompt into node `6` (positive prompt) and a random
seed into the KSampler node `3`. The p5.comfyui-helper replaces `SaveImage`
with `SaveImageWebsocket`, queues the workflow via `/prompt` and receives the
512 x 512 result over the WebSocket; it is scaled to the 1024 x 1024 canvas.
To use your own workflow, export it with **Save (API)** in ComfyUI and adapt
the node numbers in `requestImage()`.

## Libraries

- p5.js 1.10.0, p5.sound 1.0.1 (in `libraries/`)
- [p5.comfyui-helper](https://github.com/gohai/p5.comfyui-helper) by Gottfried Haider
