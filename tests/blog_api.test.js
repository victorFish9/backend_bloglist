const { describe, test, after, before, afterEach } = require('node:test');
const mongoose = require('mongoose');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const config = require('../utils/config')
const api = supertest(app);

before(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI);
});

afterEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany([
        { title: 'My book', author: 'Author A', url: 'http://example.com/1', likes: 10 },
        { title: 'Learning HTTP', author: 'Author B', url: 'http://example.com/2', likes: 5 }
    ]);
});

after(async () => {
    await mongoose.connection.close();
});

describe('GET /api/blogs', () => {
    test('blogs are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, 2);
    });

    test('the first blog is about HTTP methods', async () => {
        const response = await api.get('/api/blogs');
        const titles = response.body.map(blog => blog.title);
        assert.strictEqual(titles.includes('My book'), true);
    });

    test('blogs have unique identifier property named id', async () => {
        const response = await api.get('/api/blogs');
        const blogs = response.body;

        assert.strictEqual(Array.isArray(blogs), true);
        blogs.forEach(blog => {
            assert.ok(blog.id, 'Blog should have an id property');
            assert.strictEqual(typeof blog.id, 'string');
            assert.strictEqual(blog._id, undefined);
            assert.strictEqual(blog.__v, undefined);
        });
    });
});

describe('POST /api/blogs', () => {
    test('a new blog can be added', async () => {
        const newBlog = {
            title: 'New Blog Post',
            author: 'Victor',
            url: 'http://example.com/new',
            likes: 7,
        };

        const initialBlogs = await api.get('/api/blogs');
        const initialCount = initialBlogs.body.length;

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAfterPost = await api.get('/api/blogs');
        const finalCount = blogsAfterPost.body.length;

        assert.strictEqual(finalCount, initialCount + 1);

        const titles = blogsAfterPost.body.map(blog => blog.title);
        assert.ok(titles.includes(newBlog.title));
    });

    test('if likes property is missing, it defaults to 0', async () => {
        const newBlog = {
            title: 'No Likes Blog',
            author: 'Victor',
            url: 'http://example.com/no-likes',
        };

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const savedBlog = response.body;
        assert.strictEqual(savedBlog.likes, 0);
    });

    test('returns 400 if title is missing', async () => {
        const newBlog = {
            author: 'Victor',
            url: 'http://example.com/missing-title',
            likes: 10,
        };

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400);

        assert.strictEqual(response.body.error, 'Title and URL are required');
    });

    test('returns 400 if url is missing', async () => {
        const newBlog = {
            title: 'Missing URL',
            author: 'Victor',
            likes: 5,
        };

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400);

        assert.strictEqual(response.body.error, 'Title and URL are required');
    });

    test('successfully creates a blog when title and url are provided', async () => {
        const newBlog = {
            title: 'Valid Blog',
            author: 'Victor',
            url: 'http://example.com/valid-blog',
            likes: 7,
        };

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const savedBlog = response.body;
        assert.strictEqual(savedBlog.title, 'Valid Blog');
        assert.strictEqual(savedBlog.url, 'http://example.com/valid-blog');
    });
});

describe('DELETE /api/blogs/:id', () => {
    test('a blog can be deleted', async () => {
        const initialBlogs = await api.get('/api/blogs');
        const blogToDelete = initialBlogs.body[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204);

        const blogsAfterDelete = await api.get('/api/blogs');
        const finalCount = blogsAfterDelete.body.length;

        assert.strictEqual(finalCount, initialBlogs.body.length - 1);

        const titles = blogsAfterDelete.body.map(blog => blog.title);
        assert.strictEqual(titles.includes(blogToDelete.title), false);
    });

    test('returns 400 if the id is malformatted', async () => {
        const malformattedId = '123';

        const response = await api
            .delete(`/api/blogs/${malformattedId}`)
            .expect(400);

        assert.strictEqual(response.body.error, 'malformatted id');
    });
});


describe('PUT /api/blogs/:id', () => {
    let blogId;

    before(async () => {
        const newBlog = {
            title: 'Initial Blog Title',
            author: 'Author C',
            url: 'http://example.com/3',
            likes: 5,
        };

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        blogId = response.body.id; // Capture the ID of the blog for later tests
    });

    test('should update a blog successfully', async () => {
        const updatedBlog = {
            title: 'Updated Blog Title',
            author: 'Updated Author',
            url: 'http://updated-example.com',
            likes: 15,
        };

        const response = await api
            .put(`/api/blogs/${blogId}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.title, updatedBlog.title);
        assert.strictEqual(response.body.author, updatedBlog.author);
        assert.strictEqual(response.body.url, updatedBlog.url);
        assert.strictEqual(response.body.likes, updatedBlog.likes);
    });


    test('returns 400 if the id is malformatted', async () => {
        const malformattedId = '123';

        const updatedBlog = {
            title: 'Malformatted ID Test',
            author: 'Test Author',
            url: 'http://malformatted-example.com',
            likes: 5,
        };

        const response = await api
            .put(`/api/blogs/${malformattedId}`)
            .send(updatedBlog)
            .expect(400);

        assert.strictEqual(response.body.error, 'malformatted id');
    });
})