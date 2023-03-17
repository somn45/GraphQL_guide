import { ApolloServer, gql } from 'apollo-server';

let tweets = [
  {
    id: '1',
    text: 'hello',
    userId: '2',
  },
  {
    id: '2',
    text: 'welcome',
    userId: '1',
  },
];

let users = [
  {
    id: '1',
    firstname: 'nico',
    lastname: 'las',
  },
  {
    id: '2',
    firstname: 'elon',
    lastname: 'mask',
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    fullname: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(userId: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, args) {
      console.log(root);
      return tweets.find((tweet) => tweet.id === args.id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { userId }) {
      const tweet = tweets.find((tweet) => tweet.id === userId);
      if (!tweet) return false;
      tweets.filter((tweet) => tweet.id !== userId);
      return true;
    },
  },
  User: {
    fullname() {
      return 'hello';
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Running on ${url}`));
