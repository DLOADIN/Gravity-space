export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Art Marketplace API',
    version: '1.0.0',
    description: 'API documentation for the Art Marketplace platform',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://art-project-alu.fly.dev',
      description: 'Production server',
    },
  ],
  paths: {
    '/api/users': {
      get: {
        summary: 'Get all users',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new user',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUserInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/artworks': {
      get: {
        summary: 'Get all artworks',
        tags: ['Artworks'],
        responses: {
          '200': {
            description: 'List of artworks',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Artwork',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new artwork',
        tags: ['Artworks'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/CreateArtworkInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Artwork created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Artwork',
                },
              },
            },
          },
        },
      },
    },
    '/api/artworks/my-artworks': {
      get: {
        summary: 'Get logged-in artist\'s artworks',
        tags: ['Artworks'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of artist\'s artworks',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Artwork',
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Not logged in',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden - Not an artist',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/artworks/{id}': {
      get: {
        summary: 'Get artwork by ID',
        tags: ['Artworks'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Artwork details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Artwork',
                },
              },
            },
          },
          '404': {
            description: 'Artwork not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update artwork',
        tags: ['Artworks'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/UpdateArtworkInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Artwork updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Artwork',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete artwork',
        tags: ['Artworks'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Artwork deleted successfully',
          },
        },
      },
    },
    '/api/categories': {
      get: {
        summary: 'Get all categories',
        tags: ['Categories'],
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Category',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new category',
        tags: ['Categories'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Category',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/categories/{id}': {
      get: {
        summary: 'Get category by ID',
        tags: ['Categories'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Category details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Category',
                },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update category',
        tags: ['Categories'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateCategoryInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Category',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete category',
        tags: ['Categories'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Category deleted successfully',
          },
          '400': {
            description: 'Cannot delete category with existing artworks',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/transactions': {
      get: {
        summary: 'Get all transactions',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Transaction',
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new transaction',
        tags: ['Transactions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateTransactionInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transaction created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transaction',
                },
              },
            },
          },
          '400': {
            description: 'Artwork is already sold',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/transactions/{id}': {
      get: {
        summary: 'Get transaction by ID',
        tags: ['Transactions'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Transaction details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transaction',
                },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update transaction status',
        tags: ['Transactions'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateTransactionInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Transaction updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transaction',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete transaction',
        tags: ['Transactions'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Transaction deleted successfully',
          },
          '400': {
            description: 'Cannot delete completed transactions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/transactions/user/{userId}': {
      get: {
        summary: 'Get transactions by user ID',
        tags: ['Transactions'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of user transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Transaction',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'User name',
                    example: 'John Doe'
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'User email',
                    example: 'john@example.com'
                  },
                  password: {
                    type: 'string',
                    description: 'User password',
                    example: 'password123'
                  },
                  role: {
                    type: 'string',
                    enum: ['user', 'artist'],
                    default: 'user',
                    description: 'User role'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          format: 'uuid'
                        },
                        name: {
                          type: 'string'
                        },
                        email: {
                          type: 'string',
                          format: 'email'
                        },
                        role: {
                          type: 'string',
                          enum: ['user', 'artist']
                        }
                      }
                    },
                    token: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid request body or user already exists'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/auth/signin': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'User email',
                    example: 'john@example.com'
                  },
                  password: {
                    type: 'string',
                    description: 'User password',
                    example: 'password123'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User signed in successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          format: 'uuid'
                        },
                        name: {
                          type: 'string'
                        },
                        email: {
                          type: 'string',
                          format: 'email'
                        },
                        role: {
                          type: 'string',
                          enum: ['user', 'artist']
                        }
                      }
                    },
                    token: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Invalid credentials'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/artists': {
      get: {
        summary: 'Get all artists',
        tags: ['Artists'],
        responses: {
          '200': {
            description: 'List of artists',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Artist',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/artists/{id}': {
      get: {
        summary: 'Get artist by ID',
        tags: ['Artists'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Artist details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Artist',
                },
              },
            },
          },
          '404': {
            description: 'Artist not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update artist profile',
        tags: ['Artists'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateArtistInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Artist updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Artist',
                },
              },
            },
          },
          '403': {
            description: 'Unauthorized - Can only update own profile',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'Artist not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete user',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/checkout': {
      post: {
        summary: 'Process checkout and create payment request',
        tags: ['Checkout'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['buyerId', 'items', 'shippingAddress'],
                properties: {
                  buyerId: {
                    type: 'string',
                    format: 'uuid',
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['artworkId', 'quantity', 'price'],
                      properties: {
                        artworkId: {
                          type: 'string',
                          format: 'uuid',
                        },
                        quantity: {
                          type: 'number',
                          minimum: 1,
                        },
                        price: {
                          type: 'number',
                          minimum: 0,
                        },
                      },
                    },
                  },
                  shippingAddress: {
                    type: 'object',
                    required: ['fullName', 'streetAddress', 'city', 'state', 'zipCode', 'country'],
                    properties: {
                      fullName: {
                        type: 'string',
                      },
                      streetAddress: {
                        type: 'string',
                      },
                      city: {
                        type: 'string',
                      },
                      state: {
                        type: 'string',
                      },
                      zipCode: {
                        type: 'string',
                      },
                      country: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Checkout processed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        transactions: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Transaction',
                          },
                        },
                        checkoutUrl: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'object' } },
            ],
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'] },
          profileImageURL: { type: 'string', format: 'uri' },
          bio: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateUserInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['user', 'admin'] },
          profileImageURL: { type: 'string', format: 'uri' },
          bio: { type: 'string' },
        },
      },
      Artwork: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          imageUrl: { type: 'string', format: 'uri' },
          categoryId: { type: 'string', format: 'uuid' },
          artistId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateArtworkInput: {
        type: 'object',
        required: ['title', 'price', 'categoryId', 'artistId', 'image'],
        properties: {
          title: { type: 'string', minLength: 2 },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          categoryId: { type: 'string', format: 'uuid' },
          artistId: { type: 'string', format: 'uuid' },
          image: { type: 'string', format: 'binary' },
        },
      },
      UpdateArtworkInput: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 2 },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          categoryId: { type: 'string', format: 'uuid' },
          artistId: { type: 'string', format: 'uuid' },
          image: { type: 'string', format: 'binary' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCategoryInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 2 },
          description: { type: 'string' },
        },
      },
      UpdateCategoryInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          description: { type: 'string' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
          buyerId: { type: 'string', format: 'uuid' },
          artworkId: { type: 'string', format: 'uuid' },
          transactionDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTransactionInput: {
        type: 'object',
        required: ['buyerId', 'artworkId'],
        properties: {
          buyerId: { type: 'string', format: 'uuid' },
          artworkId: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
        },
      },
      UpdateTransactionInput: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
        },
      },
      SignupInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['user', 'artist'], default: 'user' },
        },
      },
      SigninInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      Artist: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          profileImageURL: { type: 'string', format: 'uri' },
          bio: { type: 'string' },
          role: { type: 'string', enum: ['artist'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UpdateArtistInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          bio: { type: 'string' },
          profileImageURL: { type: 'string', format: 'uri' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
}; 
