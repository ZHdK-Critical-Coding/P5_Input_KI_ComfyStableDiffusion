# P5.js: Comfy Stable Diffusion

[Deutsch](README_DE.md)

Sends a text prompt to a ComfyUI server, runs a basic Stable Diffusion 1.5
text-to-image workflow and shows the result on the canvas. The simplest way
to get started with generating images from a sketch through ComfyUI.

## Installation

Requirements: a ComfyUI instance reachable from your computer (usually on
the local network, with a GPU). The workflow `workflows/workflow_api.json`
expects the checkpoint `SD1.5/v1-5-pruned-emaonly.ckpt` and the
**SaveImageWebsocket** node (included with ComfyUI).

Set the address of your ComfyUI server in the `instance` constant at the
top of `sketch.js` (default `http://192.168.2.8:8188`).

Libraries (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (included, not
used), [p5.comfyui-helper](https://github.com/gohai/p5.comfyui-helper) by
Gottfried Haider.

## How to Run

1. Open the folder in Visual Studio Code and start Live Server (click
   **Go Live** in the status bar).
2. The browser calls ComfyUI cross-origin. Either start ComfyUI with
   `--enable-cors-header`, or use the debugger configuration
   **Launch Chrome (no Security)** (Run and Debug panel).
3. Edit the prompt in the text field and press **generate**. A pulsing red
   dot is shown while the image is being generated.

## Coding Help

- **Config at the top of `sketch.js`**: `instance` (ComfyUI URL),
  `workflowfile` (file name in `workflows/`) and `defaultPrompt`.
- **`preload()`**: loads the workflow JSON. It must be exported in ComfyUI's
  API format (**Save (API)**); the keys are the node numbers.
- **`setup()`**: creates the canvas, the `ComfyUiP5Helper` (opens a
  WebSocket to ComfyUI), the prompt textarea and the **generate** button.
- **`requestImage()`**: writes a random seed into the KSampler node `3` and
  the prompt into node `6` (positive prompt), then calls
  `await comfy.run(workflow, gotImage)`. If the request fails (e.g. server
  not reachable), an alert shows the error and `running` is reset so you
  can try again. The negative prompt is in node `7`, the
  image size (512 × 512) in node `5`. If you use your own workflow, adapt
  the node numbers.
- **`libraries/p5.comfyui-helper.js`**: replaces `SaveImage` with
  `SaveImageWebsocket`, queues the workflow via `/prompt` and collects the
  result images from the WebSocket as blob URLs.
- **`gotImage(results, err)`**: loads the first result into `resImg`.
  Uncomment `requestImage()` at the end to generate images in a loop.
- **`draw()`**: draws `resImg` scaled to the 1024 × 1024 canvas and the
  pulsing dot while `running` is true.
