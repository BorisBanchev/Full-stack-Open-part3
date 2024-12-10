const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Person = require("./models/person");
const port = process.env.PORT;

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(cors());
app.use(express.static("dist"));

app.use(express.json());

const generateId = () => {
  const newId =
    Math.floor(Math.random() * (10000 - persons.length)) + persons.length;
  return newId.toString();
};

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    let infoText = `Phonebook has info for ${count} people`;
    let date = new Date();
    response.send(`<b>${infoText}</b><br><br><b>${date}</b>`);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  if (persons.find((person) => person.number === body.number)) {
    return response.status(400).json({
      error: "number must be unique",
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
