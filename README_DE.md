# P5.js: Comfy Stable Diffusion

[English](readme.md)

Schickt einen Text-Prompt an einen ComfyUI-Server, führt einen einfachen
Stable-Diffusion-1.5-Workflow (Text zu Bild) aus und zeigt das Ergebnis auf
der Zeichenfläche. Der einfachste Einstieg, um aus einem Sketch über
ComfyUI Bilder zu generieren.

## Installation

Voraussetzungen: eine ComfyUI-Instanz, die vom eigenen Computer aus
erreichbar ist (meist im lokalen Netz, mit GPU). Der Workflow
`workflows/workflow_api.json` erwartet den Checkpoint
`SD1.5/v1-5-pruned-emaonly.ckpt` und den Node **SaveImageWebsocket** (in
ComfyUI enthalten).

Die Adresse des ComfyUI-Servers in der Konstante `instance` oben in
`sketch.js` eintragen (Standard `http://192.168.2.8:8188`).

Bibliotheken (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (eingebunden,
nicht verwendet), [p5.comfyui-helper](https://github.com/gohai/p5.comfyui-helper)
von Gottfried Haider.

## Ausführen

1. Den Ordner in Visual Studio Code öffnen und Live Server starten (in der
   Statusleiste auf **Go Live** klicken).
2. Der Browser greift Cross-Origin auf ComfyUI zu. Entweder ComfyUI mit
   `--enable-cors-header` starten oder die Debugger-Konfiguration
   **Launch Chrome (no Security)** verwenden (Panel Run and Debug).
3. Den Prompt im Textfeld anpassen und auf **generate** klicken. Während
   das Bild generiert wird, pulsiert ein roter Punkt.

## Coding-Hilfe

- **Konfiguration oben in `sketch.js`**: `instance` (ComfyUI-URL),
  `workflowfile` (Dateiname in `workflows/`) und `defaultPrompt`.
- **`preload()`**: lädt das Workflow-JSON. Es muss im API-Format von
  ComfyUI exportiert sein (**Save (API)**); die Schlüssel sind die
  Node-Nummern.
- **`setup()`**: erstellt die Zeichenfläche, den `ComfyUiP5Helper` (öffnet
  einen WebSocket zu ComfyUI), das Prompt-Textfeld und den Knopf
  **generate**.
- **`requestImage()`**: schreibt einen zufälligen Seed in den
  KSampler-Node `3` und den Prompt in Node `6` (positiver Prompt) und ruft
  dann `await comfy.run(workflow, gotImage)` auf. Schlägt die Anfrage fehl
  (z. B. Server nicht erreichbar), zeigt ein Alert den Fehler und `running`
  wird zurückgesetzt, sodass man es erneut versuchen kann. Der negative
  Prompt steht in
  Node `7`, die Bildgrösse (512 × 512) in Node `5`. Bei einem eigenen
  Workflow die Node-Nummern anpassen.
- **`libraries/p5.comfyui-helper.js`**: ersetzt `SaveImage` durch
  `SaveImageWebsocket`, stellt den Workflow über `/prompt` in die
  Warteschlange und sammelt die Ergebnisbilder aus dem WebSocket als
  Blob-URLs.
- **`gotImage(results, err)`**: lädt das erste Ergebnis in `resImg`. Wer
  `requestImage()` am Ende einkommentiert, generiert Bilder in einer
  Schleife.
- **`draw()`**: zeichnet `resImg` skaliert auf die 1024 × 1024 grosse
  Zeichenfläche und den pulsierenden Punkt, solange `running` true ist.
