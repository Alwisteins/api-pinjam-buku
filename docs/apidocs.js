const apidocs = {
  openapi: "3.0.0",
  info: {
      title: "Library API",
      version: "1.0.0",
      description: "API documentation for Library system",
  },
  servers: [
      {
          url: "http://localhost:88",
          description: "Localhost server",
      },
  ],
  components: {
      schemas: {
          Book: {
              type: "object",
              properties: {
                  id: { type: "integer", description: "Book ID" },
                  title: { type: "string", description: "Book title" },
                  author: { type: "string", description: "Book author" },
                  available: { type: "boolean", description: "Availability of the book" },
              },
          },
          Member: {
              type: "object",
              properties: {
                  id: { type: "integer", description: "Member ID" },
                  name: { type: "string", description: "Member name" },
                  email: { type: "string", description: "Member email" },
              },
          },
          BorrowRequest: {
              type: "object",
              properties: {
                  bookName: { type: "string", description: "Name of the book to borrow" },
                  member: {
                      type: "object",
                      properties: {
                          name: { type: "string", description: "Member name" },
                          code: { type: "string", description: "Member code" },
                      },
                      required: ["name", "code"],
                  },
              },
              required: ["bookName", "member"],
          },
          ReturnRequest: {
              type: "object",
              properties: {
                  bookName: { type: "string", description: "Name of the book to return" },
                  member: {
                      type: "object",
                      properties: {
                          name: { type: "string", description: "Member name" },
                          code: { type: "string", description: "Member code" },
                      },
                      required: ["name", "code"],
                  },
              },
              required: ["bookName", "member"],
          },
      },
  },
  paths: {
      "/books/borrow": {
          get: {
              summary: "Borrow a book",
              requestBody: {
                  required: true,
                  content: {
                      "application/json": {
                          schema: { $ref: "#/components/schemas/BorrowRequest" },
                      },
                  },
              },
              responses: {
                  "200": {
                      description: "Successfully borrowed a book",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                      data: { type: "object" },
                                  },
                              },
                          },
                      },
                  },
                  "400": {
                      description: "Invalid request body",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
                  "404": {
                      description: "Member or book not found",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
                  "403": {
                      description: "Member cannot borrow book",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
                  "500": {
                      description: "Error on server side",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
              },
          },
      },
      "/books/return": {
          post: {
              summary: "Return a book",
              requestBody: {
                  required: true,
                  content: {
                      "application/json": {
                          schema: { $ref: "#/components/schemas/ReturnRequest" },
                      },
                  },
              },
              responses: {
                  "200": {
                      description: "Book has been successfully returned",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                      data: { type: "object" },
                                  },
                              },
                          },
                      },
                  },
                  "400": {
                      description: "Invalid request body",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
                  "404": {
                      description: "Member or book not found",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
                  "401": {
                      description: "Member penalized",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                      data: { type: "object" },
                                  },
                              },
                          },
                      },
                  },
                  "500": {
                      description: "Error on server side",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
              },
          },
      },
      "/books/list": {
          get: {
              summary: "Get list of available books",
              responses: {
                  "200": {
                      description: "List of available books",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                      data: {
                                          type: "object",
                                          properties: {
                                              availableBooks: {
                                                  type: "array",
                                                  items: { $ref: "#/components/schemas/Book" },
                                              },
                                              totalBooksAvailable: { type: "integer" },
                                          },
                                      },
                                  },
                              },
                          },
                      },
                  },
                  "404": {
                      description: "No books available",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
                  "500": {
                      description: "Error on server side",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
              },
          },
      },
      "/members/list": {
          get: {
              summary: "Get list of members",
              responses: {
                  "200": {
                      description: "List of members",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                      data: {
                                          type: "array",
                                          items: { $ref: "#/components/schemas/Member" },
                                      },
                                  },
                              },
                          },
                      },
                  },
                  "404": {
                      description: "No members found",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
                  "500": {
                      description: "Error on server side",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "object",
                                  properties: {
                                      message: { type: "string" },
                                  },
                              },
                          },
                      },
                  },
              },
          },
      },
  },
};

export default apidocs;
