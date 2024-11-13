const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
    const { title, author, url, likes } = request.body;

    if (!title || !url) {
        return response.status(400).json({ error: 'Title and URL are required' });
    }

    try {
        const blog = new Blog({
            title,
            author,
            url,
            likes: likes || 0,
        });

        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        next(error);
    }
});


blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(request.params.id);

        response.status(204).end();
    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const { title, author, url, likes } = request.body;

    const updatedBlog = {
        title,
        author,
        url,
        likes
    };

    try {
        const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
            new: true
        })

        response.json(result)
    } catch (error) {
        next(error)
    }
});

module.exports = blogsRouter