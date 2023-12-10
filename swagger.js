const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Grade Exam',
      version: '1.0.0',
      description: 'Your API Description',
    },
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./Routers/*js'], // Replace with the path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;