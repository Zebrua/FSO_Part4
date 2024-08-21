const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('./list_helper.js')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('fans favorite', () => {
  const listOfBlogs = [
    {
      id: "dalfjlaksjföaöjdaöslm",
      title: "How to make fettuchini pasta",
      author: "Perell Kono",
      url: "http://websitetopoolblogpostsfrom.net/fettuchini",
      likes: 4
    },{
      id: "sdadlakfödlskfaök",
      title: "Three steps to become an elite marathoner",
      author: "Cirka de Varma",
      url: "http://websitetopoolblogpostsfrom.net/elite",
      likes: 13
    },{
      id: "dökåapoäpofäadma",
      title: "Reasons to come up with puppy names",
      author: "Rumble Kamble",
      url: "http://websitetopoolblogpostsfrom.net/fantasy",
      likes: 9
    },{
      id: "ökföiöfosdöfknsdmf",
      title: "Jumping into the unknown",
      author: "Gustaff Gratto",
      url: "http://websitetopoolblogpostsfrom.net/jump",
      likes: 11
    }
  ]

  test('list of blog is mapped to find fans favorite', () => {
    const result = listHelper.favoriteBlog(listOfBlogs)
    const compare = {title:listOfBlogs[1].title, author:listOfBlogs[1].author, likes:listOfBlogs[1].likes}
    assert.deepStrictEqual(result,compare)
  })

})

describe("most posts", () => {
  const listOfBlogs = [
    {
      id: "dalfjlaksjföaöjdaöslm",
      title: "How to make fettuchini pasta",
      author: "Perell Kono",
      url: "http://websitetopoolblogpostsfrom.net/fettuchini",
      likes: 4
    },{
      id: "sdadlakfödlskfaök",
      title: "Three steps to become an elite marathoner",
      author: "Cirka de Varma",
      url: "http://websitetopoolblogpostsfrom.net/elite",
      likes: 13
    },{
      id: "dökåapoäpofäadma",
      title: "Reasons to come up with puppy names",
      author: "Cirka de Varma",
      url: "http://websitetopoolblogpostsfrom.net/fantasy",
      likes: 9
    },{
      id: "ökföiöfosdöfknsdmf",
      title: "Jumping into the unknown",
      author: "Gustaff Gratto",
      url: "http://websitetopoolblogpostsfrom.net/jump",
      likes: 11
    },{
      _id: 'sdalfmaöfaslkdasdcxamcz',
      title: 'Go To Statement Considered Harmful',
      author: 'Cirka de Varma',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test("finding author with most blogposts", () => {
    const result = listHelper.mostBlogs(listOfBlogs)
    assert.deepStrictEqual(result,{author:"Cirka de Varma", blogs:3})
  })
})
describe("most likes", () => {
  const listOfBlogs = [
    {
      id: "dalfjlaksjföaöjdaöslm",
      title: "How to make fettuchini pasta",
      author: "Perell Kono",
      url: "http://websitetopoolblogpostsfrom.net/fettuchini",
      likes: 4
    },{
      id: "sdadlakfödlskfaök",
      title: "Three steps to become an elite marathoner",
      author: "Cirka de Varma",
      url: "http://websitetopoolblogpostsfrom.net/elite",
      likes: 13
    },{
      id: "dökåapoäpofäadma",
      title: "Reasons to come up with puppy names",
      author: "Cirka de Varma",
      url: "http://websitetopoolblogpostsfrom.net/fantasy",
      likes: 9
    },{
      id: "ökföiöfosdöfknsdmf",
      title: "Jumping into the unknown",
      author: "Gustaff Gratto",
      url: "http://websitetopoolblogpostsfrom.net/jump",
      likes: 11
    },{
      _id: 'sdalfmaöfaslkdasdcxamcz',
      title: 'Go To Statement Considered Harmful',
      author: 'Cirka de Varma',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test("finding author with most likes across the list", () => {
    const result = listHelper.mostLikes(listOfBlogs)
    assert.deepStrictEqual(result, {author:"Cirka de Varma", likes:27})
  })
})
