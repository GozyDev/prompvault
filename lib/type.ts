type Favorite = {
  userId: string;
  promptId: string;
};

type Bookmark = {
  userId: string;
  promptId: string;
};

export type Prompt = {
  id: string;
  title: string;
  content: string; // the full prompt
  imageUrl: string;
  tags: string[];
  metadata: [];
  categories: string[];
  userId: string;
  user: {
    email: string;
    name: string;
    imageUrl: string;
    id: string;
  };
  remixedFromId?: string | null;
  favorites: Favorite[];
  bookmarks: Bookmark[];
  remixes: Prompt[];
  _count: {
    favorites: number;
    bookmarks: number;
    remixes: number;
  };
};

export type Usertype = {
  id: string;
  email: string;
  imageUrl: string;
  name: string;
};

interface Bookmarks {
  id: string;
  userId: string;
  prompt: Prompt;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  bio: string;
  pronouns: string;
  imageUrl: string;
  prompts: Prompt[];
  bookmarks: Bookmarks[];
  // Changed to array of prompts
  createdAt: string;
}

export type PayLoad = {
id:string
} | undefined
