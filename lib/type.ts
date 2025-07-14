type Favorite = {
  id: string;
  userId: string;
  promptId: string;
};

type Bookmark = {
  id: string;
  userId: string;
  promptId: string;
};

export type Prompt = {
  id: string;
  title: string;
  content: string; // the full prompt
  imageUrl: string;
  user: {
    email: string;
    name: string;
    imageUrl: string;
  };
  remixedFromId?: string | null;
  favorites: Favorite[];
  bookmarks: Bookmark[];
  _count: {
    favorites: number;
    bookmarks:number
  };
};

