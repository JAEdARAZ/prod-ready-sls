const { init } = require('../steps/init')
const when = require('../steps/when')
const teardown = require('../steps/teardown')
const given = require('../steps/given')

const mode = process.env.TEST_MODE

describe('Given an authenticated user', () => {
  let user

  beforeAll(async () => {
    await init()
    if(mode == 'http') {
      user = await given.an_authenticated_user()
    }
  })

  afterAll(async () => {
    if(mode == 'http') {
      await teardown.an_authenticated_user(user)
    }
  })

  describe(`When we invoke the POST /restaurants/search endpoint with theme 'cartoon'`, () => {
    it(`Should return an array of 4 restaurants`, async () => {
      const res = await when.we_invoke_search_restaurants('cartoon', user)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(4)

      for (const restaurant of res.body) {
        expect(restaurant).toHaveProperty('name')
        expect(restaurant).toHaveProperty('image')
      }
    })
  })
})