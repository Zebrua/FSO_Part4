const dummy = (list) => {
    return 1
}

const totalLikes = (list) => {
    let like = 0
    list.map((blog) => {
        like += blog.likes
    })
    return like
}

const favoriteBlog = (list) => {
    let likes = [] 
    let fav = {title:"", author:"", likes:0}
    list.forEach((blog) => {
        likes.push(blog.likes)
    })
    const ind = likes.indexOf(Math.max(...likes))
    fav.title = list[ind].title
    fav.author = list[ind].author
    fav.likes = list[ind].likes
    return fav
}

const mostBlogs = (list) => {
    let authors = {}
    list.forEach((blog) => {
        if (authors[blog.author]) {
            authors[blog.author] += 1
        }else{
            authors[blog.author] = 1
        }
    })
    const val = Object.values(authors)
    const key = Object.keys(authors)
    const res = val.indexOf(Math.max(...val))
    return ({author:key[res], blogs: val[res]})
}
const mostLikes = (list) => {
    authors = {}
    list.forEach((blog) => {
        if (authors[blog.author]) {
            authors[blog.author] += blog.likes
        }else{
            authors[blog.author] = blog.likes
        }
    })
    const val = Object.values(authors)
    const key = Object.keys(authors)
    const res = val.indexOf(Math.max(...val))
    return ({author:key[res], likes: val[res]})
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
