const apidocs = {
  openapi: "3.0.0",
  info: {
    title: "Library API",
    version: "1.0.0",
    description: "API documentation for Library system",
  },
  servers: [
    { url: "http://localhost:88/api/v1", description: "Development server" },
  ],
  components: {
    schemas: {
      Book: {
        type: "object",
        properties: {
          code: { type: "string", description: "Book code", example: "HOB-83" },
          title: {
            type: "string",
            description: "Book title",
            example: "The Hobbit, or There and Back Again",
          },
          author: {
            type: "string",
            description: "Book author",
            example: "J.R.R. Tolkien",
          },
          stock: {
            type: "integer",
            description: "Stock available",
            example: 1,
          },
          borrowedBy: { $ref: "#/components/schemas/BorrowedBook" },
        },
      },
      Member: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "Member code",
            example: "M002",
          },
          name: {
            type: "string",
            description: "Member name",
            example: "Ferry",
          },
          penalty: {
            type: "boolean",
            description: "Penalty status",
            example: false,
          },
          borrowedBooks: { $ref: "#/components/schemas/BorrowedBook" },
          penaltyEndDate: {
            type: "string",
            format: "date-time",
            description: "Penalty end date",
            example: "2024-06-10T00:00:00.000Z",
          },
        },
      },
      BorrowedBook: {
        type: "object",
        properties: {
          id: { type: "integer", description: "Borrowed book ID", example: 1 },
          borrowedAt: {
            type: "string",
            format: "date-time",
            description: "Date when the book was borrowed",
            example: "2024-05-01T00:00:00.000Z",
          },
          book: { $ref: "#/components/schemas/Book" },
          bookCode: {
            type: "string",
            description: "Code of the borrowed book",
            example: "HOB-83",
          },
          member: { $ref: "#/components/schemas/Member" },
          memberCode: {
            type: "string",
            description: "Code of the member who borrowed the book",
            example: "M002",
          },
        },
      },
      BorrowRequest: {
        type: "object",
        properties: {
          bookName: {
            type: "string",
            description: "Name of the book to borrow",
            example: "The Hobbit, or There and Back Again",
          },
          member: { $ref: "#/components/schemas/Member" },
        },
        required: ["bookName", "member"],
      },
      ReturnRequest: {
        type: "object",
        properties: {
          bookName: {
            type: "string",
            description: "Name of the book to return",
            example: "The Hobbit, or There and Back Again",
          },
          member: { $ref: "#/components/schemas/Member" },
        },
        required: ["bookName", "member"],
      },
    },
  },
  paths: {
    "/books/borrow": createEndpoint(
      "Borrow a book",
      "#/components/schemas/BorrowRequest",
      "Successfully borrowed a book"
    ),
    "/books/return": createEndpoint(
      "Return a book",
      "#/components/schemas/ReturnRequest",
      "Book has been successfully returned"
    ),
    "/books/list": {
      get: {
        summary: "Get list of available books",
        responses: createResponses(
          "List of available books",
          "successfully get all books list",
          [
            {
              code: "SHR-1",
              title: "A Study in Scarlet",
              author: "Arthur Conan Doyle",
              stock: 1,
            },
            {
              code: "TW-11",
              title: "Twilight",
              author: "Stephenie Meyer",
              stock: 1,
            },
            {
              code: "NRN-7",
              title: "The Lion, the Witch and the Wardrobe",
              author: "C.S. Lewis",
              stock: 1,
            },
            {
              code: "JK-45",
              title: "Harry Potter",
              author: "J.K Rowling",
              stock: 1,
            },
            {
              code: "HOB-83",
              title: "The Hobbit, or There and Back Again",
              author: "J.R.R. Tolkien",
              stock: 1,
            },
          ]
        ),
      },
    },
    "/members/list": {
      get: {
        summary: "Get list of all members",
        responses: {
          200: {
            description: "List of all members",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "successfully get all member list",
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Member",
                      },
                    },
                  },
                },
              },
            },
          },
          404: createErrorResponse(
            "No members found",
            "There's no member to show"
          ),
          500: createErrorResponse(
            "Error on server side",
            "Error on server side"
          ),
        },
      },
    },
  },
};

function createEndpoint(summary, requestSchemaRef, successMessage) {
  return {
    post: {
      summary: summary,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: requestSchemaRef },
          },
        },
      },
      responses: {
        200: {
          description: successMessage,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: successMessage },
                  data: { $ref: "#/components/schemas/BorrowedBook" },
                },
              },
            },
          },
        },
        400: createErrorResponse(
          "Invalid request body",
          "Please provide the required data"
        ),
        404: createErrorResponse(
          "Member or book not found",
          "Member not found"
        ),
        403: createErrorResponse(
          "Member cannot borrow book",
          "Member has reached the maximum limit for borrowing books"
        ),
        500: createErrorResponse(
          "Error on server side",
          "Error on server side"
        ),
      },
    },
  };
}

function createErrorResponse(description, exampleMessage) {
  return {
    description: description,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            message: { type: "string", example: exampleMessage },
          },
        },
      },
    },
  };
}

function createResponses(summary, message, exampleBooks) {
  return {
    200: {
      description: summary,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", example: message },
              data: {
                type: "object",
                properties: {
                  availableBooks: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Book" },
                    example: exampleBooks,
                  },
                  totalBooksAvailable: {
                    type: "number",
                    example: exampleBooks.length,
                  },
                },
              },
            },
          },
        },
      },
    },
    500: createErrorResponse("Error on server side", "Error on server side"),
  };
}

export default apidocs;
