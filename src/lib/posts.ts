/** The blog's posts, in order. One place: the index and search both read it. */
export interface Post {
  title: string;
  sub: string;
  href: string;
}

export const POSTS: Post[] = [
  {
    title: "The Philosophy: bringing the culture back",
    sub: "Why ansemchain exists and how its fair launches work.",
    href: "/1",
  },
  {
    title: "Horns and a feed that is actually yours",
    sub: "How Horns route real trading back to stakers, and how the signed social feed works.",
    href: "/2",
  },
];
