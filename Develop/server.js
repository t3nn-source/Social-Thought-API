import express from 'express';
import db from "./src/config/connection.js";
import routes from "./src/routes/index.js";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

db.once("open", () => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🌍 API server running at http://localhost:${PORT}`);
    });
  });

