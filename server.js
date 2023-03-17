import { ApolloServer, gql } from 'apollo-server';

let tweets = [
  {
    id: '1',
    text: 'hello',
  },
  {
    id: '2',
    text: 'welcome',
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
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
    allTweets() {
      return tweets;
    },
    tweet(root, args) {
      console.log(args);
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
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`Running on ${url}`));
