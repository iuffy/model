import errors from '../errors'
import { validate, getSchema, Joi as T } from '../validator'

const ERRORS = {
  InvalidIdentification: 401,
  EmailDuplicated: 400,
  CreateUserFailed: 400,
  UpdateUserFailed: 400,
  InvalidProfile: 400,
  UserInactive: 400,
}

errors.register(ERRORS)

export class User {
  constructor(data) {
    if (data) {
      if (data.id) this.id = data.id
      if (data.email) this.email = data.email
      if (data.nickname) this.nickname = data.nickname
      if (data.avatar) this.avatar = data.avatar
    }
  }

  static SCHEMA = {
    /* eslint-disable newline-per-chained-call */
    id: T.number().integer().min(1000000000).required(),
    email: T.string().email().required(),
    password: T.string().required(),
    oldPassword: T.string().required(),
    nickname: T.string().allow('', null),
    avatar: T.string().allow('', null),
  }

  static STATUS = {
    INACTIVE: 10,
    ACTIVE: 20,
    DISABLED: 90,
  }

  // 第一版简化流程，不验证邮箱所有者，只验证是否重复
  // 状态保留未验证，但可以正常使用系统
  // 第二版增加验证邮箱功能，未验证的用户不能使用系统
  // 注册
  async create(password) {
    validate({ email: this.email, password }, getSchema(User.SCHEMA, 'email', 'password'))
    await User.checkEmail(this.email)
    const query = `
      INSERT INTO "user".user (email, password)
      VALUES ($1, crypt($2, gen_salt('bf', 8)))
      RETURNING id
      ;`
    /* eslint-disable no-undef */
    const result = await db.query(query, [this.email, password])
    if (result.rowCount <= 0) {
      throw new errors.CreateUserFailedError()
    }
    const row = result.rows[0]
    return new User({
      id: row.id,
      email: this.email,
      status: row.status,
    })
  }

  async login(password) {
    const data = {
      email: this.email,
      password,
    }
    validate(data, getSchema(User.SCHEMA, 'email', 'password'))
    const query = `
      SELECT id, status, avatar, nickname
      FROM "user".user
      WHERE
        email ILIKE $1
        AND password = crypt($2, password)
      ;`
    const result = await db.query(query, [this.email, password])
    if (result.rowCount <= 0) {
      throw new errors.InvalidIdentificationError()
    }
    const row = result.rows[0]
    // if (row.status === User.STATUS.INACTIVE) throw new errors.UserInactiveError()
    return new User({
      id: row.id,
      email: this.email,
      nickname: row.nickname,
      avatar: row.avatar,
    })
  }

  async changePassword(password, oldPassword) {
    const ext = {
      password: T.string().min(6),
    }
    const data = {
      id: this.id,
      password,
      oldPassword,
    }
    validate(data, getSchema(User.SCHEMA, 'id', 'password', 'oldPassword'), ext)
    const query = `
      UPDATE "user".user
      SET password = crypt($3, gen_salt('bf', 8))
      WHERE
        id = $1
        AND password = crypt($2, password)
      RETURNING id, email, avatar, nickname
      ;`
    const params = [this.id, oldPassword, password]
    const result = await db.query(query, params)
    if (result.rowCount <= 0) {
      throw new errors.InvalidIdentificationError()
    }
    const row = result.rows[0]
    return new User({
      id: row.id,
      email: row.email,
      nickname: row.nickname,
      avatar: row.avatar,
    })
  }

  async fill() {
    validate({ id: this.id }, getSchema(User.SCHEMA, 'id'))
    const query = `
      SELECT email, avatar, nickname
      FROM "user".user
      WHERE id = $1
      ;`
    const result = await db.query(query, [this.id])
    if (result.rowCount <= 0) throw new errors.InvalidIdentificationError()
    const row = result.rows[0]
    return new User({
      id: this.id,
      email: row.email,
      avatar: row.avatar,
      nickname: row.nickname,
    })
  }

  // 修改email需要验证，暂不做
  async update() {
    if (Object.keys(this).length <= 1) throw new errors.InvalidProfileError()
    validate(this, getSchema(User.SCHEMA, 'id', 'nickname', 'avatar'))
    const user = await this.fill()
    this.avatar = this.avatar || user.avatar
    this.nickname = this.nickname || user.nickname
    const query = `
      UPDATE "user".user
      SET
        avatar = $2,
        nickname = $3
      WHERE id = $1
      RETURNING email
      ;`
    const result = await db.query(query, [
      this.id, this.avatar, this.nickname,
    ])
    if (result.rowCount <= 0) throw new errors.UpdateUserFailedError()
    this.email = result.rows[0].email
    return new User(this)
  }

  static async checkEmail(email) {
    validate({ email }, getSchema(this.SCHEMA, 'email'))
    const query = `
      SELECT 1
      FROM "user".user
      WHERE email ILIKE $1
      ;`
    /* eslint-disable no-undef */
    const result = await db.query(query, [email])
    if (result.rowCount > 0) {
      // 如果别人用我的邮箱注册过，状态是非激活，
      // 但我只能通过密码找回，不能创建第二个同邮箱账号
      throw new errors.EmailDuplicatedError()
    }
  }
}
