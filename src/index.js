import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ Captura cualquier ruta que empiece con /deezer/
app.get(/^\/deezer\/(.*)/, async (req, res) => {
  try {
    const subPath = req.params[0]; // Lo que viene después de /deezer/
    const query = req.url.includes("?") ? "?" + req.url.split("?")[1] : "";
    const deezerUrl = `https://api.deezer.com/${subPath}${query}`;

    const response = await fetch(deezerUrl);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error en el proxy:", err);
    return res.status(500).json({ error: "Error al obtener datos de Deezer" });
  }
});

//Para ver si el servidor está cargado.
app.get("/checkStatus", (req, res)=>{
  return res.status(200).json(true);
});

app.get("/trackLyrics", async (req, res) => {
  const { title, artist } = req.query;
  const url = `https://lyrics.lewdhutao.my.eu.org/v2/musixmatch/lyrics?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo la letra" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy Deezer activo en el puerto ${PORT}`);
});
