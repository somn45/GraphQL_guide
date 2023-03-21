import { ApolloServer, gql } from 'apollo-server';
import fetch from 'node-fetch';

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
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
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
    allMovies: [Movie!]!
    movie(id: String!): Movie!
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
    allMovies() {
      return fetch('https://yts.mx/api/v2/list_movies.json')
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
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
