
describe('* Blog =======================', () => {

  const { Blog } = global.models

  describe('* Create', () => {
    it('new blog', async () => {
      const data = {
        user: { id: env.userId },
        title: 'Hello',
        content: 'World',
      }
      const blog = await new Blog(data).create()
      blog.should.have.property('id')
      env.blogId = blog.id
    })

    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await new Blog().create()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await new Blog({}).create()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Get blog', () => {
    it('list', async () => {
      const blogs = await Blog.getBlogs(env.userId)
      blogs.should.have.property('total')
      blogs.should.have.property('items').and.instanceOf(Array).with.lengthOf(1)
      for (const b of blogs.items) {
        b.should.have.property('id')
        b.should.have.property('title')
        b.should.have.property('created')
        b.should.not.have.property('content')
        b.should.not.have.property('user')
      }
    })

    it('detail', async () => {
      const blog = await new Blog({ id: env.blogId }).fill()
      blog.should.have.property('id')
      blog.should.have.property('title')
      blog.should.have.property('created')
      blog.should.have.property('content')
      blog.should.not.have.property('user')
    })

    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await Blog.getBlogs()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await new Blog().fill()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Update', () => {
    it('blog', async () => {
      const data = {
        id: env.blogId,
        title: 'Hello',
        content: 'Blog',
        user: { id: env.userId },
      }
      const blog = await new Blog(data).update()
      blog.should.have.property('id')
      blog.should.have.property('title')
      blog.should.have.property('content')
      blog.should.have.property('created')
    })

    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await new Blog().update()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Delete', () => {
    it('blog', async () => {
      await new Blog({
        id: env.blogId,
        user: { id: env.userId },
      }).delete()
    })

    it('Get blog lists', async () => {
      const blogs = await Blog.getBlogs(env.userId)
      blogs.should.have.property('total')
      blogs.should.not.have.property('items')
    })

    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await new Blog().delete()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })
})
