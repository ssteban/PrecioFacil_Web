const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const http = require('http');

http.get('http://localhost:4200/cerrar-venta', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.on("error", (err) => {
      console.log("DOM ERROR:", err);
    });
    virtualConsole.on("jsdomError", (err) => {
      console.log("JSDOM ERROR:", err);
    });
    virtualConsole.on("log", (message) => {
      console.log("DOM LOG:", message);
    });

    const dom = new JSDOM(data, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost:4200/cerrar-venta",
      virtualConsole
    });

    setTimeout(() => {
        console.log("Page loaded in JSDOM");
        try {
            const document = dom.window.document;
            const submitBtn = document.querySelector('button[type="submit"]');
            
            if (submitBtn) {
                console.log("Submit button found. Simulating click without input (should trigger validation/alert)...");
                submitBtn.disabled = false; // Force click
                submitBtn.click();
            } else {
                console.log("Elements not found!");
            }
        } catch (e) {
            console.error("Test Error:", e);
        }
    }, 5000);
  });
});
