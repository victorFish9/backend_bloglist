const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.post('/', async (request, response, next) => {
    const user = request.user;
    const { title, url, likes } = request.body;

    if (!title || !url) {
        return response.status(400).json({ error: 'Title and URL are required' });
    }

    const blog = new Blog({
        title,
        url,
        likes: likes || 0,
        user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

// blogsRouter.post('/', async (request, response, next) => {
//     const body = request.body
//     try {
//         const decodedToken = jwt.verify(request.token, process.env.SECRET)
//         if (!decodedToken.id) {
//             return response.status(401).json({ error: 'token invalid' })
//         }
//         const user = await User.findById(decodedToken.id)

//         if (!body.title || !body.url) {
//             return response.status(400).json({ error: 'Title and URL are required' });
//         }


//         const blog = new Blog({
//             title: body.title,
//             user: user.id,
//             url: body.url,
//             likes: body.likes || 0,
//         });

//         const savedBlog = await blog.save();
//         user.blogs = user.blogs.concat(savedBlog._id)
//         await user.save()
//         response.status(201).json(savedBlog);
//     } catch (error) {
//         next(error);
//     }
// });


blogsRouter.delete('/:id', async (request, response, next) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' });
    }

    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'Forbidden: You can only delete your own blogs' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});


// blogsRouter.delete('/:id', async (request, response, next) => {
//     try {
//         const decodedToken = jwt.verify(request.token, process.env.SECRET)
//         if (!decodedToken.id) {
//             return response.status(401).json({ error: 'token invalid' })
//         }

//         const userId = decodedToken.id

//         const blog = await Blog.findById(request.params.id)
//         if (!blog) {
//             return response.status(404).json({ error: 'blog not found' })
//         }

//         if (blog.user.toString() !== userId.toString()) {
//             return response.status(403).json({ error: 'forbidden: you can only delete your own blogs' })
//         }

//         await Blog.findByIdAndDelete(request.params.id)
//         response.status(204).end()
//     } catch (error) {
//         next(error)
//     }
// })

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