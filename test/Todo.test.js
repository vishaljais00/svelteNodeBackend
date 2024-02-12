const request = require('supertest');
const app = require('../index'); // Adjust the path accordingly
const prisma = require('../prisma/client');

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
    createdTodoId = response.body.data.id; // Save the created todo ID for future tests
  });

  // Test case for getting all todos
  it('should get all todos', async () => {
    const response = await request(app).get('/api/todo');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'All todos fetched successfully');
    expect(response.body.data).toBeInstanceOf(Array);
  });

  // Test case for creating a todo
  it('if no task present in create', async () => {
    const response = await request(app)
      .post('/api/todo')
      .send({
        notask: "dds"
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'No Task Found');
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
    expect(response.body.data.id).toBe(createdTodoId);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Todo fetched successfully');
  });

  // Test case for getting all todos
  it('should get all todos by gql', async () => {
    const query = `
        query {
          todos {
            task
            done
            id
          }
        }
      `;

    const response = await request(app)
      .post('/api/gql')
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Todo Fetched Successfully');
    expect(response.body.data).toBeInstanceOf(Array);
  });



  // Test case for getting single todos in gql
  test('should get a single todo by ID in gql', async () => {
    // Assuming you have a valid todo ID for testing
    const todoId = createdTodoId

    const query = `
        query {
          todoById(id: "${todoId}") {
            task
            done
            id
          }
        }
      `;

    const response = await request(app)
      .post('/api/gql')
      .send({ query });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Todo Fetched Successfully');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('id', todoId);

  })

  // Test case for updating a todo
  it('should update a todo', async () => {
    const updatedTodo = {
      task: 'Updated Test Todo',
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
  it('pass wroung ID in deleting a todo ', async () => {
    const response = await request(app).delete(`/api/todo/someWrongID`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid Id');
  });

  // Test case for getting all todos
  it('negitive case pass wrong filed all todos by gql', async () => {
    const query = `
          query {
            todos {
              task
              done
              id
              ll
            }
          }
        `;

    const response = await request(app)
      .post('/api/gql')
      .send({ query });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  // Assuming you have a invalid todo ID for testing
  test('wrong ID todo  in gql', async () => {
    const query = `
        query {
          todoById(id: "wrongID") {
            task
            done
            id
          }
        }
      `;

    const response = await request(app)
      .post('/api/gql')
      .send({ query });

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid Id');
  })
  // Test case for update a todo
  it('pass wroung ID  in update a todo', async () => {
    const response = await request(app).put(`/api/todo/someWrongID`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid Id');
  });

  // Test case for get  a todo
  it('pass wroung ID for get a todo ', async () => {
    const response = await request(app).get(`/api/todo/someWrongID`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid Id');
  });

  it('ment to get failed by path ', async () => {
    const response = await request(app).delete(`/api/someWrongID`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Route not found');

  });


});
