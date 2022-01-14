const mongoose = require("mongoose");

const url = process.env.DATABASE_URL || "mongodb://localhost:27017";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function main(schemaName, schema, data) {
  await mongoose.connect(url, connectionParams);

  const Model = mongoose.model(`${schemaName}`, schema);

  if (!data) {
    return Model;
  }

  const modelInstance = new Model(data);

  return modelInstance;
}

module.exports = { main };
