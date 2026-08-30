/** The blog's posts, in order. One place: search and any nav read it. */
export interface Post {
  title: string;
  sub: string;
  href: string;
}

export const POSTS: Post[] = [
  {
    title: "The Philosophy: bringing the culture back",
    sub: "Why ansemchain exists, how fair launches work, Horns rewards from real trading, and the signed SocialFi feed.",
    href: "/1",
  },
];
