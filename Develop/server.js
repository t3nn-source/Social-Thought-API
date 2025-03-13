import express from 'express';
import routes from "./src/routes/index.js";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

