const _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;

    const favorite = blogs.reduce((prev, current) =>
        current.likes > prev.likes ? current : prev
    );

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    };
};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    const authorCounts = _.countBy(blogs, 'author');
    const topAuthor = Object.entries(authorCounts).reduce((max, [author, count]) => {
        return count > max.blogs ? { author, blogs: count } : max;
    }, { author: '', blogs: 0 });

    return topAuthor;
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    const authorLikes = _(blogs)
        .groupBy('author')
        .map((blogs, author) => ({
            author,
            likes: _.sumBy(blogs, 'likes')
        }))
        .maxBy('likes');

    return authorLikes || null;
};


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}