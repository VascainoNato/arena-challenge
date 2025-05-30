import { api } from "./api";

// This const fetches posts from Product Hunt API using GraphQL.
// It accepts two parameters: order (we are looking for Ranking or Newest posts), and cursor for pagination (if needed - desktop).
export const fetchPosts = async (
  order: "RANKING" | "NEWEST",
  cursor?: string
) => {
    // We define a GraphQL to query as a string.
    // The first 20 defines the number of posts to retrieve.
    // If we have a cursor, we add it to fetch the next page of results.
  const query = `
  query {
    posts(order: ${order}, first: 25${cursor ? `, after: "${cursor}"` : ""}) {
      edges {
        node {
          id
          name
          tagline
          description
          votesCount
          thumbnail {
            url
          }
          media {
            url
            type
          }
          makers {
            id
            name
            username
            profileImage
          }
          slug
          website
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;
  // Why do we use Edges and Nodes in Query? It's a GraphQL pagination format, known as RCS - Edges are the lists of elements, Node is the content inside each item and the Cursor is used for pagination/display.
  // We send a Post to the API with the query in the request body
  const res = await api.post("", { query });
  // We return only the useful data from the response.
  if (res.data.errors) {
    console.error("GraphQL Errors:", res.data.errors);
  }
    if (!res.data?.data?.posts) {
    throw new Error("No posts returned from Product Hunt API.");
  }
  return res.data.data.posts;
};

export const fetchVotesOnly = async (order: "RANKING" | "NEWEST") => {
  const query = `
    query {
      posts(order: ${order}, first: 25) {
        edges {
          node {
            id
            votesCount
          }
        }
      }
    }
  `;
  const res = await api.post("", { query });

  if (res.data.errors) {
    console.error("GraphQL Errors:", res.data.errors);
  }

  if (!res.data?.data?.posts) {
    throw new Error("No vote data returned from Product Hunt API.");
  }

  return res.data.data.posts;
};
