const request = require('supertest');
const app = require('../index'); // Adjust the path accordingly

describe('Todo API Endpoints', () => {
  // Dummy data for testing
  const dummyTodo = {
    task: 'Test Todo',
  };

  let createdTodoId;

  // Test case for creating a todo
  it('should create a new todo', async () => {
    const response = await request(app)
      .post('/api/todo')
      .send(dummyTodo);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Todo created successfully');
    createdTodoId = response.body.data._id; // Save the created todo ID for future tests
  });

  // Test case for getting all todos
  it('should get all todos', async () => {
    const response = await request(app).get('/api/todo');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'All todos fetched successfully');
    expect(response.body.data).toBeInstanceOf(Array);
  });

  // Test case for getting a single todo
  it('should get a single todo', async () => {
    const response = await request(app).get(`/api/todo/${createdTodoId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Todo fetched successfully');
    expect(response.body.data._id).toBe(createdTodoId);
  });

  // Test case for updating a todo
  it('should update a todo', async () => {
    const updatedTodo = {
      title: 'Updated Test Todo',
      description: 'This is an updated test todo',
    };

    const response = await request(app)
      .put(`/api/todo/${createdTodoId}`)
      .send(updatedTodo);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Todo updated successfully');
  });

  // Test case for deleting a todo
  it('should delete a todo', async () => {
    const response = await request(app).delete(`/api/todo/${createdTodoId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Todo deleted successfully');
  });

  // Test case for deleting a todo
  it('pass wroung ID ', async () => {
    const response = await request(app).delete(`/api/todo/someWrongID`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid todo ID');
  });

  it('ment to get failed by path ', async () => {
    const response = await request(app).delete(`/api/someWrongID`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Route not found');

  });
});
