import { server } from "../src/server"
import Prisma from "../src/db";

import { Entry } from "../../frontend/src/@types/context";

// describe("server test", () => {
//   it("should assert 1 + 1 is 2", () => {
//     expect(1 + 1).toEqual(2);
//   });
// });

// Build and teardown test environment

let entry: Entry | null = null;

beforeEach(async () => {
  // create an entry before each test
  const res = await server.inject({
    method: "POST",
    url: "/create/",
    payload: {
      title: "Test title",
      description: "Entry description before each test",
      created_at: new Date(),
      scheduledDate: new Date("2024-10-09T00:00:00.000Z"),
    },
  });
  
  // save entry for use in tests
  entry = res.json() as Entry;
});

afterEach(async () => {
  // delete the entry after each test
  if (entry !== null && entry !== undefined) {
    await server.inject({
      method: "DELETE",
      url: `/delete/${entry.id}`
    });
    entry = null;
  }
});

let testPayload: Entry = {
  title: "Test title",
  description: "Test description",
  created_at: new Date(),
  scheduledDate: new Date("2024-07-04T00:00:00.000Z"),
};

let updatedTestPayload: Entry = {
  title: "Updated title",
  description: "Updated description",
  created_at: new Date(),
  scheduledDate: new Date("2024-07-04T00:00:00.000Z"),
};

// test GET methods

test("GET /get/ returns all entries", async () => {
  if (entry === null) throw new Error("Entry not created");
  
  const res = await server.inject({
    method: "GET",
    url: "/get/",
  });
  
  expect(res.statusCode).toEqual(200);
  expect(res.json().length).toBeGreaterThan(0);

  expect(res.json()).toContainEqual({
    id: entry.id,
    title: "Test title",
    description: "Entry description before each test",
    created_at: expect.any(String),
    scheduledDate: "2024-10-09T00:00:00.000Z",
  }); 
});

test("GET /get/:id returns expected entry", async () => {
  if (entry === null) throw new Error("Entry not created");

  const res = await server.inject({
    method: "GET",
    url: `/get/${entry.id}`,
  });

  expect(res.statusCode).toEqual(200);
  expect(res.json()).toEqual({
    id: entry.id,
    title: "Test title",
    description: "Entry description before each test",
    created_at: expect.any(String),
    scheduledDate: "2024-10-09T00:00:00.000Z",
  });
});

test("GET /get/:id returns 500 if entry not found", async () => {
  if (entry === null) throw new Error("Entry not created");

  await server.inject({
    method: "DELETE",
    url: `/delete/${entry.id}`
  });

  const res = await server.inject({
    method: "GET",
    url: `/get/${entry.id}`
  });

  expect(res.statusCode).toEqual(500);
  expect(res.json().msg).toEqual(`Error finding entry with id ${entry.id}`);
});


// test POST methods


test("POST /create/ creates a new entry", async () => {
  const res = await server.inject({
    method: "POST",
    url: "/create/",
    payload: testPayload,
  });

  expect(res.statusCode).toEqual(200);
  expect(res.json()).toEqual({
    id: res.json().id,
    title: "Test title",
    description: "Test description",
    created_at: expect.any(String),
    scheduledDate: "2024-07-04T00:00:00.000Z",
  });
  
  await Prisma.entry.delete({ where: { id: res.json().id } });
});

test("POST /create/ increases size of entries by one", async () => {
  const res1 = await server.inject({
    method: "GET",
    url: "/get/",
  });

  expect(res1.statusCode).toEqual(200);
  const prevLength = res1.json().length;

  const res2 = await server.inject({
    method: "POST",
    url: "/create/",
    payload: testPayload,
  });

  const res3 = await server.inject({
    method: "GET",
    url: "/get/",
  });

  expect(res3.statusCode).toEqual(200);
  expect(res3.json().length).toEqual(prevLength + 1);

  await Prisma.entry.delete({ where: { id: res2.json().id } });
});

test("POST /create/ assigns unique id to each entry", async () => {
  const res1 = await server.inject({
    method: "POST",
    url: "/create/",
    payload: testPayload,
  });

  const res2 = await server.inject({
    method: "POST",
    url: "/create/",
    payload: testPayload,
  });

  expect(res1.json().id).not.toEqual(res2.json().id);
  expect(res1.json().title).toEqual(res2.json().title);
  expect(res1.json().description).toEqual(res2.json().description);
  expect(res1.json().created_at).toEqual(res2.json().created_at);
  expect(res1.json().scheduledDate).toEqual(res2.json().scheduledDate);

  await Prisma.entry.delete({ where: { id: res1.json().id } });
  await Prisma.entry.delete({ where: { id: res2.json().id } });
});

test("POST /create/ returns 500 if invalid data entered", async () => {
  const res = await server.inject({
    method: "POST",
    url: "/create/",
    payload: {
      ...testPayload,
      invalidField: "Invalid",
    },
  });

  expect(res.statusCode).toEqual(500);
  expect(res.json().msg).toEqual("Error creating entry");
});


// test DELETE methods


test("DELETE /delete/:id deletes an entry", async () => {
  if (entry === null) throw new Error("Entry not created");

  const res = await server.inject({
    method: "DELETE",
    url: `/delete/${entry.id}`
  });

  expect(res.statusCode).toEqual(200);
  expect(res.json().msg).toEqual("Deleted successfully");
});

test("DELETE /delete/:id decreases size of entries by one", async () => {
  if (entry === null) throw new Error("Entry not created");
  
  const res1 = await server.inject({
    method: "GET",
    url: "/get/",
  });
  
  const prevLength = res1.json().length;
  
  const res2 = await server.inject({
    method: "DELETE",
    url: `/delete/${entry.id}`
  });

  expect(res2.statusCode).toEqual(200);
  expect(res2.json().msg).toEqual("Deleted successfully");

  const res3 = await server.inject({
    method: "GET",
    url: "/get/",
  });

  expect(res3.statusCode).toEqual(200);
  expect(res3.json().length).toEqual(prevLength - 1);
});

test("DELETE /delete/:id returns 500 if error deleting entry", async () => {
  if (entry === null) throw new Error("Entry not created");

  const entryID = entry.id;
  
  const res1 = await server.inject({
    method: "DELETE",
    url: `/delete/${entryID}`
  });

  expect(res1.statusCode).toEqual(200);
  expect(res1.json().msg).toEqual("Deleted successfully");

  const res2 = await server.inject({
    method: "DELETE",
    url: `/delete/${entryID}`
  });

  expect(res2.statusCode).toEqual(500);
  expect(res2.json().msg).toEqual("Error deleting entry");
});


// test PUT methods


test("PUT /update/:id updates an entry", async () => {
  if (entry === null) throw new Error("Entry not created");

  const res = await server.inject({
    method: "PUT",
    url: `/update/${entry.id}`,
    payload: updatedTestPayload,
  });

  const updatedEntry = await server.inject({
    method: "GET",
    url: `/get/${entry.id}`,
  });

  expect(res.statusCode).toEqual(200);
  expect(res.json().msg).toEqual("Updated successfully");
  expect(updatedEntry.json()).toEqual({
    id: entry.id,
    title: "Updated title",
    description: "Updated description",
    created_at: expect.any(String),
    scheduledDate: "2024-07-04T00:00:00.000Z",
  });
});

test("PUT /update/:id does not change size of entries", async () => {
  if (entry === null) throw new Error("Entry not created");

  const res1 = await server.inject({
    method: "GET",
    url: "/get/",
  });

  expect(res1.statusCode).toEqual(200);
  const prevLength = res1.json().length;

  const res2 = await server.inject({
    method: "PUT",
    url: `/update/${entry.id}`,
    payload: updatedTestPayload,
  });

  expect(res2.statusCode).toEqual(200);
  expect(res2.json().msg).toEqual("Updated successfully");

  const res3 = await server.inject({
    method: "GET",
    url: "/get/",
  });

  expect(res3.statusCode).toEqual(200);
  expect(res3.json().length).toEqual(prevLength);

  await Prisma.entry.delete({ where: { id: entry.id } });
});

test("PUT /update/:id returns 500 if invalid data entered", async () => {
  if (entry === null) throw new Error("Entry not created");

  const res = await server.inject({
    method: "PUT",
    url: `/update/${entry.id}`,
    payload: {
      ...updatedTestPayload,
      invalidField: "Invalid",
    },
  })

  expect(res.statusCode).toEqual(500);
  expect(res.json().msg).toEqual("Error updating");
  
  // check entry remains unchanged
  const updatedEntry = await server.inject({
    method: "GET",
    url: `/get/${entry.id}`,
  });

  expect(updatedEntry.json()).toEqual({
    id: entry.id,
    title: "Test title",
    description: "Entry description before each test",
    created_at: expect.any(String),
    scheduledDate: "2024-10-09T00:00:00.000Z",
  });
});