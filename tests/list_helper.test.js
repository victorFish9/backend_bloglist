const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
});

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
    ];

    const listWithMultipleBlogs = [
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422b891b54a676234d17fa',
            title: 'Node.js Best Practices',
            author: 'John Doe',
            url: 'https://nodejsbestpractices.com/',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422ba71b54a676234d17fb',
            title: 'JavaScript Tips and Tricks',
            author: 'Jane Smith',
            url: 'https://jstips.com/',
            likes: 15,
            __v: 0
        }
    ];

    const emptyList = [];

    test('when list is empty, total likes should be zero', () => {
        const result = listHelper.totalLikes(emptyList);
        assert.strictEqual(result, 0);
    });

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        assert.strictEqual(result, 5);
    });

    test('when list has multiple blogs, calculates the total likes correctly', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs);
        assert.strictEqual(result, 32);
    });
});

describe('favorite blog', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ];

    const listWithMultipleBlogs = [
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422b891b54a676234d17fa',
            title: 'Node.js Best Practices',
            author: 'John Doe',
            url: 'https://nodejsbestpractices.com/',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422ba71b54a676234d17fb',
            title: 'JavaScript Tips and Tricks',
            author: 'Jane Smith',
            url: 'https://jstips.com/',
            likes: 15,
            __v: 0
        }
    ];

    const emptyList = [];

    test('when list is empty, returns null', () => {
        const result = listHelper.favoriteBlog(emptyList);
        assert.strictEqual(result, null);
    });

    test('when list has only one blog, returns that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog);
        assert.deepStrictEqual(result, {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        });
    });

    test('when list has multiple blogs, returns the one with most likes', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs);
        assert.deepStrictEqual(result, {
            title: 'JavaScript Tips and Tricks',
            author: 'Jane Smith',
            likes: 15
        });
    });
});

describe('most blogs', () => {
    const listWithMultipleBlogs = [
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422b891b54a676234d17fa',
            title: 'Node.js Best Practices',
            author: 'John Doe',
            url: 'https://nodejsbestpractices.com/',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422ba71b54a676234d17fb',
            title: 'JavaScript Tips and Tricks',
            author: 'Jane Smith',
            url: 'https://jstips.com/',
            likes: 15,
            __v: 0
        },
        {
            _id: '5a422bc61b54a676234d17fc',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            url: 'https://cleancode.com/',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422bc71b54a676234d17fd',
            title: 'Clean Architecture',
            author: 'Robert C. Martin',
            url: 'https://cleanarchitecture.com/',
            likes: 8,
            __v: 0
        },
        {
            _id: '5a422bc81b54a676234d17fe',
            title: 'Refactoring',
            author: 'Martin Fowler',
            url: 'https://refactoring.com/',
            likes: 6,
            __v: 0
        },
        {
            _id: '5a422bc91b54a676234d17ff',
            title: 'TDD by Example',
            author: 'Robert C. Martin',
            url: 'https://tdd.com/',
            likes: 12,
            __v: 0
        }
    ];

    test('author with most blogs', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs);
        assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 });
    });

    test('when list is empty, returns null', () => {
        const result = listHelper.mostBlogs([]);
        assert.strictEqual(result, null);
    });
});

describe('most likes', () => {
    const blogs = [
        {
            _id: '1',
            title: 'Blog A',
            author: 'Author One',
            url: 'http://example.com',
            likes: 10,
            __v: 0
        },
        {
            _id: '2',
            title: 'Blog B',
            author: 'Author Two',
            url: 'http://example.com',
            likes: 5,
            __v: 0
        },
        {
            _id: '3',
            title: 'Blog C',
            author: 'Author One',
            url: 'http://example.com',
            likes: 7,
            __v: 0
        },
        {
            _id: '4',
            title: 'Blog D',
            author: 'Author Three',
            url: 'http://example.com',
            likes: 12,
            __v: 0
        }
    ];

    test('author with most likes', () => {
        const result = listHelper.mostLikes(blogs);
        assert.deepStrictEqual(result, { author: 'Author One', likes: 17 });
    });

    test('when list is empty, returns null', () => {
        const result = listHelper.mostLikes([]);
        assert.strictEqual(result, null);
    });
});
