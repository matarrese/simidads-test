class SimidResizePoc extends BaseSimidCreative {
  constructor() {
    super();
    this.consoleElement = null;
    
    window.addEventListener("DOMContentLoaded", () => {
      this.consoleElement = document.getElementById("console");
      const btn = document.getElementById("resize-btn");
      btn.addEventListener("click", () => this.triggerResize());
      this.log("DOM loaded. Calling ready()...");
      this.ready();
    });
  }

  log(message, type = "info") {
    console.log(`[POC] ${message}`);
    if (this.consoleElement) {
      const entry = document.createElement("div");
      entry.className = `log-entry ${type}`;
      entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
      this.consoleElement.appendChild(entry);
      this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
    }
  }

  onInit(eventData) {
    super.onInit(eventData);
    this.log("SIMID initialized.", "success");
    this.log(`Creative Dimensions: ${JSON.stringify(this.environmentData.creativeDimensions)}`);
    this.log(`Video Dimensions: ${JSON.stringify(this.environmentData.videoDimensions)}`);
  }

  onStart(eventData) {
    super.onStart(eventData);
    this.log("Creative started.", "success");
    this.log("Click the button to trigger requestResize.");
  }

  triggerResize() {
    this.log("Attempting to call requestResize...", "info");
    
    const currentDims = this.environmentData.creativeDimensions;
    
    // Use fallback if dimensions are missing or zero
    const targetWidth = currentDims && currentDims.width ? Math.floor(currentDims.width / 2) : 320;
    const targetHeight = currentDims && currentDims.height ? Math.floor(currentDims.height / 2) : 240;

    const resizeParams = {
      creativeDimensions: {
        x: 0,
        y: 0,
        width: targetWidth,
        height: targetHeight
      },
      videoDimensions: {
        x: 0,
        y: 0,
        width: targetWidth,
        height: targetHeight
      },
      fullscreen: false
    };

    this.log(`Requesting resize to: ${JSON.stringify(resizeParams)}`, "info");

    try {
      // Using the string directly to be safe if CreativeMessage is not in scope
      this.simidProtocol.sendMessage("Creative:requestResize", resizeParams)
        .then(() => {
          this.log("requestResize resolved successfully by player.", "success");
        })
        .catch((error) => {
          this.log(`requestResize REJECTED or failed: ${JSON.stringify(error)}`, "error");
        });
    } catch (e) {
      this.log(`Exception when calling requestResize: ${e.message}`, "error");
    }
  }
}

// Instantiate the creative
new SimidResizePoc();
