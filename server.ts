import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Captura de Leads
  app.post("/api/cotizar", (req, res) => {
    const { nombre, telefono, modelo, mensaje } = req.body;
    console.log("Nuevo Lead Recibido:", { nombre, telefono, modelo, mensaje });
    
    // Aquí se integraría con una base de datos o servicio de email
    res.status(200).json({ 
      success: true, 
      message: "¡Gracias! Un asesor se contactará contigo pronto." 
    });
  });

  // Vite middleware para desarrollo
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor profesional activo en http://localhost:${PORT}`);
  });
}

startServer();
