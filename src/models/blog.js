import errors from '../errors'
import { validate, getSchema, Joi as T } from '../validator'

const ERRORS = {
  CreateBlogFailed: 400,
  UpdateBlogFailed: 400,
  BlogNotFound: 404,
}

errors.register(ERRORS)

export class Blog {
  constructor(data) {
    if (data) {
      if (data.id) this.id = data.id
      if (data.user) this.user = data.user
      if (data.title) this.title = data.title
      if (data.content) this.content = data.content
      if (data.status) this.status = data.status
      if (data.created) this.created = data.created
    }
  }

  static SCHEMA = {
    /* eslint-disable newline-per-chained-call */
    id: T.number().integer().min(1000000000).required(),
    user: T.object({
      id: T.number().integer().min(1000000000).required(),
    }).required(),
    title: T.string().required(),
    content: T.string(),
    page: T.number().integer().min(1).default(1).allow(null, ''),
    pagesize: T.number().integer().min(1).default(10).allow(null, ''),
  }

  static STATUS = {
    DRAFT: 10,
    PUBLISHED: 20,
    DELETED: 30,
  }

  async create() {
    validate(this, getSchema(Blog.SCHEMA, 'user', 'title', 'content'))
    const query = `
      INSERT INTO blog.blog (user_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING id
      ;`
    const result = await db.query(query, [this.user.id, this.title, this.content])
    if (result.rowCount <= 0) {
      throw new errors.CreateBlogFailedError()
    }
    const row = result.rows[0]
    this.id = row.id
    return new Blog(this)
  }

  async update() {
    validate(this, getSchema(Blog.SCHEMA, 'id', 'user', 'title', 'content'))
    const query = `
      UPDATE blog.blog
      SET
        title = $3,
        content = $4
      WHERE 
        id = $1
        AND user_id = $2
      RETURNING created
      ;`
    const result = await db.query(query, [
      this.id, this.user.id, this.title, this.content,
    ])
    if (result.rowCount <= 0) throw new errors.UpdateBlogFailedError()
    this.created = result.rows[0].created
    return new Blog(this)
  }

  async fill() {
    validate({ id: this.id }, getSchema(Blog.SCHEMA, 'id'))
    const query = `
      SELECT title, content, created
      FROM blog.blog
      WHERE 
        id = $1
        AND status <> $2
      ;`
    const result = await db.query(query, [this.id, Blog.STATUS.DELETED])
    if (result.rowCount <= 0) throw new errors.BlogNotFoundError()
    const row = result.rows[0]
    return new Blog({
      id: this.id,
      title: row.title,
      content: row.content,
      created: row.created,
    })
  }

  async delete() {
    validate(this, getSchema(Blog.SCHEMA, 'id', 'user'))
    const query = `
      UPDATE blog.blog
      SET status = $3
      WHERE 
        id = $1
        AND user_id = $2
      ;`
    await db.query(query, [this.id, this.user.id, Blog.STATUS.DELETED])
  }

  static async getBlogs(userId, page, pagesize) {
    const v = validate({
      user: { id: userId }, page, pagesize,
    }, getSchema(Blog.SCHEMA, 'user', 'page', 'pagesize'))
    /* eslint-disable no-param-reassign */
    page = v.page
    pagesize = v.pagesize
    const queryCount = `
      SELECT COUNT(id) AS cnt
      FROM blog.blog
      WHERE 
        user_id = $1
        AND status <> $2
      ;`
    const resultCount = await db.query(queryCount, [userId, Blog.STATUS.DELETED])
    if (resultCount.rowCount <= 0 || resultCount.rows[0].cnt <= 0) {
      return {
        total: 0,
      }
    }
    const query = `
      SELECT id, title, created
      FROM blog.blog
      WHERE 
        user_id = $1
        AND status <> $2
      ORDER BY id DESC
      OFFSET $3
      LIMIT $4
      ;`
    const result = await db.query(query, [
      userId,
      Blog.STATUS.DELETED,
      (page - 1) * pagesize,
      pagesize,
    ])
    const blogs = {
      total: resultCount.rows[0].cnt,
      items: [],
    }
    if (result.rowCount > 0) {
      for (const row of result.rows) {
        blogs.items.push(new Blog({
          id: row.id,
          title: row.title,
          created: row.created,
        }))
      }
    }
    return blogs
  }
}
