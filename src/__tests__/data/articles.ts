import { ArticleEntity } from "../../entities/Article";

/**
 * Each user has 10 articles.
 * First 5 articles are public and published
 * Last 4 articles are private and published
 * Last article is private and unpublished
 */

export const test_articles_1: ArticleEntity[] = [
  {
    id: 1,
    title: "Test Article #1",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 2,
    title: "Test Article #2",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 3,
    title: "Test Article #3",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 4,
    title: "Test Article #4",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 5,
    title: "Test Article #5",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 6,
    title: "Test Article #6",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 7,
    title: "Test Article #7",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 8,
    title: "Test Article #8",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 9,
    title: "Test Article #9",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 10,
    title: "Test Article #10",
    markdown: "Test Content",
    isPublic: false,
    isPublished: false
  }
];

export const test_articles_2: ArticleEntity[] = [
  {
    id: 11,
    title: "Test Article #11",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 12,
    title: "Test Article #12",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 13,
    title: "Test Article #13",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 14,
    title: "Test Article #14",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 15,
    title: "Test Article #15",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 16,
    title: "Test Article #16",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 17,
    title: "Test Article #17",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 18,
    title: "Test Article #18",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 19,
    title: "Test Article #19",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 20,
    title: "Test Article #20",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  }
];

export const test_articles_3: ArticleEntity[] = [
  {
    id: 21,
    title: "Test Article #21",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 22,
    title: "Test Article #22",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 23,
    title: "Test Article #23",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 24,
    title: "Test Article #24",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 25,
    title: "Test Article #25",
    markdown: "Test Content",
    isPublic: true,
    isPublished: true
  },
  {
    id: 26,
    title: "Test Article #26",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 27,
    title: "Test Article #27",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 28,
    title: "Test Article #28",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 29,
    title: "Test Article #29",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  },
  {
    id: 30,
    title: "Test Article #30",
    markdown: "Test Content",
    isPublic: false,
    isPublished: true
  }
];

describe("Articles Data", () => {
  it("should skip", () => {
    expect(true).toBeTruthy();
  });
});
