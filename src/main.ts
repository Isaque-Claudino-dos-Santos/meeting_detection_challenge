import Application from "./core/Application";

const dataSet = Bun.argv[2];

if (!dataSet) {
  throw new Error("informe um argumento de acordo com o README.md");
}

const app = new Application();

app.run(dataSet);
