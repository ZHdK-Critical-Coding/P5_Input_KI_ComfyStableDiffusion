// ============================================
// ComfyUI Workflow Example with p5.js
// ============================================

// NOTE: This example expects the checkpoint `v1-5-pruned-emaonly.ckpt` to be installed locally

// URL of the ComfyUI instance running on local network
const instance = "http://192.168.2.8:8188";

// JSON workflow file to use
const workflowfile = "workflow_api.json";

// Default text prompt for image generation
const defaultPrompt = "a robot consisting of plastic black holder parts and small circuit boards and large circuit boards mainboards and plastic bottom case parts lower side and plastic red phones and black spiral cables and one plastic multicolor upper cases on the floor of a clean gallery space.";

// Variables for workflow, ComfyUI helper, generated image, and prompt
let workflow;
let comfy;    // ComfyUI helper instance
let resImg;   // Generated image to display
let prompt;   // User-editable textarea for prompt
let running = false; // Flag to prevent multiple simultaneous runs

// ============================================
// Preload function (p5.js)
// ============================================
function preload() {
  // Load the workflow JSON file before setup
  workflow = loadJSON(`./workflows/${workflowfile}`);
}

// ============================================
// Setup function (p5.js)
// ============================================
function setup() {
  createCanvas(1024, 1024); // Create canvas for displaying the generated image
  comfy = new ComfyUiP5Helper(instance); // Initialize ComfyUI helper with instance URL
  console.log("workflow is", workflow);

  // Create a textarea for user input
  prompt = createElement('textarea', defaultPrompt);

  // Create a button to trigger image generation
  let button = createButton('generate');
  button.mousePressed(requestImage); // Call requestImage when pressed
}

// ============================================
// Request image generation
// ============================================
async function requestImage() {
  if (running) return; // Prevent multiple concurrent runs

  // Set running flag
  running = true;

  try {
    // Randomize seed to produce variation in generated image
    workflow[3].inputs.seed = random(9999999);

    // Update prompt in the workflow before running
    workflow[6].inputs.text = prompt.value();

    // Run the workflow through ComfyUI helper
    // comfy.run() is async: `await` it, so errors (e.g. server not reachable)
    // end up in the catch block below
    await comfy.run(workflow, gotImage);

  } catch (err) {
    // Show an alert if there is an error
    alert(err);
    running = false; // Reset running flag on error
  }
}

// ============================================
// Callback after workflow execution
// ============================================
function gotImage(results, err) {
  running = false; // Reset running flag

  // `results` contains outputs from the workflow nodes
  console.log("gotImage", results, err);

  // Load the first generated image for display
  if (results && results.length > 0) {
    resImg = loadImage(results[0].src);
  }

  // Optional: automatically generate another image
  // requestImage();
}

// ============================================
// Draw function (p5.js)
// ============================================
function draw() {
  background(128); // Gray background

  // Display generated image on the canvas
  if (resImg) {
    image(resImg, 0, 0, width, height);
  }

  // Visual indicator (flashing red circle) while workflow is running
  if (running) {
    noStroke();
    fill(255, 0, 0, frameCount % 128); // Alpha pulsates
    circle(40, 40, 20);
  }
}