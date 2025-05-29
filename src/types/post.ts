// This interface defines the structure of a Post object received from the Product Hunt API, It is used for typing the response returned by the productHuntService.ts service.
export interface Post {
  id: string;
  name: string;
  description: string;
  votesCount: number;
  thumbnail: {
    url: string;
  };
}