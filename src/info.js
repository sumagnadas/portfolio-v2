export const apps = [
  {
    id: "file",
    name: "About Me",
    img: "assets/icons/folder.svg",
    folders: [
      { name: "Skills",files:[{name: 'random'}],folders:[{name: 'random'}]  },
      { name: "Random stuff" },
      { name: "more stuff" },
    ],
    files: [{ name: "Resume.pdf" }],
  },
  {
    id: "projects",
    name: "Projects",
    img: "assets/icons/folder.svg",
    folders: [],
    files: [],
  },
  { id: "random", name: "random app", img: "assets/test.png" },
];

export const socialLinks = [
    { id: "github", link: "https://github.com/sumagnadas", file: "svg" },
    { id: "linkedin", link: "https://linkedin.com/in/sumagnadas" },
    { id: "leetcode", link: "https://leetcode.com/sumagnadas" },
    {
      id: "codeforces",
      link: "https://codeforces.com/profile/sumagnadas",
      file: "svg",
    },
];