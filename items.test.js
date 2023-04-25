process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
let items = require('./fakeDb');

let cheetos = {name: 'Cheetos', price: 1.50};

beforeEach(function() {
  items.push(cheetos);
})

afterEach(function() {
  items.length = 0;
})

/** GET /items - returns `{items: [item, ...]}` */
describe('GET /items', () => {
  test('Get all items', async() => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({items: [cheetos]});
  })
})

/** GET /items/[name] - return data about one item: `{item: item}` */
describe('GET /items/:name', () => {
  test('Get item by name', async() => {
    const res = await request(app).get(`/items/${cheetos.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({item: cheetos});
  })
  test('Respond with 404 for invalid item', async() => {
    const res = await request(app).get('/items/sourpatch');
    expect(res.statusCode).toBe(404);
  })
})

/** POST /items - create item from data; return `{item: item}` */
describe('POST /items', () => {
  test('Creating an item', async() => {
    const newItem = {name:'Kitkat', price:1.05};
    const res = await request(app).post('/items').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: newItem });
  })
  test('Respond with 400 if name or price is missing', async() => {
    const noPrice = {name: 'Apple'}
    const res = await request(app).post('/items').send(noPrice);
    expect(res.statusCode).toBe(400);

    const noName = {price: 10.99}
    const res2 = await request(app).post('/items').send(noName);
    expect(res2.statusCode).toBe(400);
  })
})

/** PATCH /items/[name] - update item; return `{item: item}` */
describe('PATCH /items/:name', () => {
  test('Updating an item', async() => {
    const res = await request(app).patch(`/items/${cheetos.name}`).send({name: 'Sourpatch'});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({updated: {name:'Sourpatch'}});
  })
  test('Respond with 404 for invalid name', async() => {
    const res = await request(app).patch('/items/grape').send({name: 'Sourpatch'});
    expect(res.statusCode).toBe(404);
  })
})


/** DELETE /items/[name] - delete item: return {message: "Deleted"}` */
describe('DELETE /items/:name', () => {
  test('Deleting an item', async() => {
    const res = await request(app).delete(`/items/${cheetos.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({message: 'Deleted'})
  })
  test('Respond with 404 for deleting invalid name', async() => {
    const res = await request(app).delete('/items/test');
    expect(res.statusCode).toBe(404);
  })
})