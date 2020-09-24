const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const path = require("path");
const fs = require("fs");

const typeDefs = gql`
  type File {
    url: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    fileUpload(file: Upload!): File!
  }
`;

function generateRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const resolvers = {
  Query: {
    hello: () => {
      return "hello there";
    },
  },
  Mutation: {
    fileUpload: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const { ext } = path.parse(filename);
      const randomName = generateRandomString(12) + ext;
      const stream = createReadStream();
      const pathname = path.join(__dirname, `/public/images/${randomName}`);
      await stream.pipe(fs.createWriteStream(pathname));
      return {
        url: `http://localhost:4000/images/${randomName}`,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();

server.applyMiddleware({ app });

app.use(express.static("public"));

app.listen({ port: 4000 }, () => {
  console.log("server running");
});
