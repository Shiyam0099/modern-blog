let users = [
  {
    id: "1",
    name: "Shiyam",
    email: "shiyam@gmail.com",
    age: 27,
  },
  {
    id: "2",
    name: "Arabi",
    email: "arabi@gmail.com",
    age: 26,
  },
  {
    id: "3",
    name: "Nahar",
    email: "nahar@gmail.com",
    age: 47,
  },
];
let posts = [
  {
    id: "1",
    title: "What is Lorem Ipsum Meaw?",
    body: "Lorem Ipsum is simply dummy text goku of the printing and typesetting industry. Lorem Saitama Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    published: true,
    author: "2",
  },
  {
    id: "2",
    title: "Why do we use it Vhau?",
    body: "It is a long established fact that a reader will be distracted Goku by the readable Vegeta content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. ",
    published: false,
    author: "3",
  },
  {
    id: "3",
    title: "Where does it come from Chik?",
    body: "Contrary to popular belief, Lorem Ipsum is Saitama not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.nahar@gmail.com",
    published: true,
    author: "3",
  },
];

let comments = [
  {
    id: "1",
    text: "Very nice",
    author: "1",
    post: "2",
  },
  {
    id: "2",
    text: "Thank you",
    author: "1",
    post: "1",
  },
  {
    id: "3",
    text: "awesome",
    author: "2",
    post: "3",
  },
  {
    id: "4",
    text: "good job",
    author: "3",
    post: "3",
  },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
