const data = {
  email: 'user@iuffy.com',
  password: '1qaz!QAZ',
  nickname: 'User',
  avatar: 'https://avatars2.githubusercontent.com/u/3116788',
}

describe('* User =======================', () => {

  const { User } = global.models

  describe('* New user by email', () => {
    it('Register', async () => {
      const { email, password } = data
      const user = await new User({ email }).create(password)
      user.should.have.property('id')
      env.userId = user.id
      user.should.have.property('email')
      user.should.not.have.property('avatar')
      user.should.not.have.property('nickname')
    })

    describe('* Error handling', () => {
      it('Email invalid', async () => {
        try {
          env.errCount_expected++
          const email = 'invalid email'
          const { password } = data
          await new User({ email }).create(password)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          await new User({ email }).create()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { password } = data
          await new User().create(password)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Login', () => {
    it('by email', async () => {
      const { email, password } = data
      const result = await new User({ email }).login(password)
      result.should.have.property('id')
      result.should.have.property('email')
      result.should.not.have.property('password')
    })

    describe('* Error handling', () => {
      it('Invalid identification', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          const password = 'wrong'
          await new User({ email }).login(password)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidIdentificationError')
          err.should.have.property('statusCode').and.equal(401)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          await new User({ email }).login()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Change password', () => {
    it('Change password', async () => {
      const id = env.userId
      const oldPassword = data.password
      const password = '2wsx@WSX'
      data.password = password
      const result = await new User({ id }).changePassword(password, oldPassword)
      result.should.have.property('id')
    })

    it('Login by email and new password', async () => {
      const { email, password } = data
      const result = await new User({ email }).login(password)
      result.should.have.property('id')
    })

    describe('* Error handling', () => {
      it('Invalid identification', async () => {
        try {
          env.errCount_expected++
          const id = env.userId
          const oldPassword = 'wrong'
          const password = 'new password'
          await new User({ id }).changePassword(password, oldPassword)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidIdentificationError')
          err.should.have.property('statusCode').and.equal(401)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const id = env.userId
          await new User({ id }).changePassword()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Get user', () => {
    it('Get user by id', async () => {
      const user = await new User({ id: env.userId }).fill()
      user.should.have.property('id')
      user.should.have.property('email')
      user.should.not.have.property('nickname')
      user.should.not.have.property('avatar')
    })

    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await new User().fill()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Unauthorized', async () => {
        try {
          env.errCount_expected++
          await new User({ id: 1000000001 }).fill()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidIdentificationError')
          err.should.have.property('statusCode').and.equal(401)
        }
      })
    })
  })

  describe('* Update user profile', () => {
    it('Update user profile', async () => {
      const { avatar, nickname } = data
      const user = await new User({
        id: env.userId, avatar, nickname,
      }).update()
      user.should.have.property('id')
      user.should.have.property('email')
      user.should.have.property('nickname')
      user.should.have.property('avatar')
    })

    it('Get user by id', async () => {
      const user = await new User({ id: env.userId }).fill()
      user.should.have.property('id')
      user.should.have.property('email')
      user.should.have.property('nickname')
      user.should.have.property('avatar')
    })

    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await new User().update()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidProfileError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Invalid profile', async () => {
        try {
          const id = env.userId
          env.errCount_expected++
          await new User({ id }).update()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidProfileError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })
})
