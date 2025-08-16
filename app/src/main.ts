import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

// Enables CORS for all origins.
app.use(cors());

if (!process.env.PORT) {
  console.log("Consider specifying a default port in the .env file.");
}

if (!process.env.VIRTUAL_ENVIRONMENT) {
  console.log(
    "Please make sure to define a default virtual environment in the .env file for consistency.",
  );
}

if (!process.env.DATABASE_URL) {
  console.log("You must specify the database URL in the .env file.");
}

function main() {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

main();
