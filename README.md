# Companies API

## Description

IT Patagonia challenge.

This project manages company registrations (PyME and Corporate types), and exposes endpoints to retrieve companies that have recently joined or made transfers in the last 30 days.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Overwiew

## Base URL

http://localhost:3000

## Endpoints

## POST /companies

```
Payload for PyME company:

{
  "name": "TEST Pyme 219 SA",
  "type": "pyme",
  "joinedAt": "2025-06-06T14:30:00.000Z",
  "pymeCode": "PYM-12345",
  "transfers": [
    {
      "amount": 15000,
      "date": "2025-06-15T10:00:00.000Z"
    },
    {
      "amount": 22000,
      "date": "2025-06-10T14:30:00.000Z"
    }
  ]
}

Payload for Corporate company:

{
  "name": "Tech Corp",
  "type": "corporate",
  "joinedAt": "2025-06-01T12:00:00.000Z",
  "headquarters": "USA",
  "transfers": [
    {
      "amount": 50000,
      "date": "2025-06-20T14:00:00.000Z"
    }
  ]
}

Response:

{
  "id": "generated-uuid"
}

```
## GET /companies/joined-last-month
Returns all companies registered within the last 30 days
## GET /companies/with-transfers-last-month
Returns companies that made at least one transfer in the last 30 days

## Validation Rules
Type must be either "pyme" or "corporate".

If type === "pyme", pymeCode is required.

If type === "corporate", headquarters is required.

transfers is optional but must be an array if provided.

Each transfer's date must also be a valid ISO date string.

## Tips
Use a REST client like Postman.

Set the header Content-Type: application/json.

Always send dates in ISO 8601 format.

## AWS Lambda 
```
Input:
{
  "name": "Empresa Pyme Lambda",
  "type": "pyme", // o "corporate"
  "joinedAt": "2025-06-06T14:30:00.000Z",
  "pymeCode": "PYM-54321",           // requerido si type = "pyme"
  "headquarters": "Buenos Aires",    // requerido si type = "corporate"
  "transfers": [
    {
      "amount": 15000,
      "date": "2025-06-15T10:00:00.000Z"
    }
  ]
}

Output:
{
  "status": "success",
  "message": "Company registered successfully",
  "companyId": "uuid-generated"
}
or
{
  "status": "error",
  "message": "Validation failed: pymeCode is required for pyme companies"
}

CODE:

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

// Types for quick validation
interface Transfer {
  amount: number;
  date: string;
}

interface CompanyInput {
  name: string;
  type: 'pyme' | 'corporate';
  joinedAt: string;
  pymeCode?: string;
  headquarters?: string;
  transfers?: Transfer[];
}

// Simple function to validate the input data
function validateCompany(input: CompanyInput): string | null {
  if (!input.name) return 'Name is required';
  if (input.type !== 'pyme' && input.type !== 'corporate') return 'Type must be "pyme" or "corporate"';
  if (!input.joinedAt || isNaN(Date.parse(input.joinedAt))) return 'Valid joinedAt date is required';
  if (input.type === 'pyme' && !input.pymeCode) return 'pymeCode is required for pyme companies';
  if (input.type === 'corporate' && !input.headquarters) return 'headquarters is required for corporate companies';
  if (input.transfers) {
    for (const t of input.transfers) {
      if (typeof t.amount !== 'number' || t.amount <= 0) return 'Each transfer must have a positive amount';
      if (!t.date || isNaN(Date.parse(t.date))) return 'Each transfer must have a valid date';
    }
  }
  return null;
}

// Simulated storage function (replace with real integration e.g. DynamoDB)
async function saveCompanyToDB(company: any): Promise<void> {
  // Here you would implement the logic to save the company to an AWS database (DynamoDB, RDS, etc.)
  // For now, we simulate a successful save with a delay
  return new Promise((resolve) => setTimeout(resolve, 100));
}

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 'error', message: 'Missing request body' }),
      };
    }

    const input: CompanyInput = JSON.parse(event.body);

    // Validate input data
    const validationError = validateCompany(input);
    if (validationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 'error', message: `Validation failed: ${validationError}` }),
      };
    }

    // Build the company object to store
    const companyToSave = {
      id: uuidv4(),
      name: input.name,
      type: input.type,
      joinedAt: new Date(input.joinedAt).toISOString(),
      pymeCode: input.pymeCode,
      headquarters: input.headquarters,
      transfers: input.transfers?.map(t => ({
        id: uuidv4(),
        amount: t.amount,
        date: new Date(t.date).toISOString(),
      })) || [],
    };

    // Save company to DB
    await saveCompanyToDB(companyToSave);

    // Successful response
    return {
      statusCode: 201,
      body: JSON.stringify({
        status: 'success',
        message: 'Company registered successfully',
        companyId: companyToSave.id,
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: 'Internal server error' }),
    };
  }
};



```
It can be called directly from a front-end, or the backend.

Basic validation is done inside the Lambda to ensure the data is correct before saving it.

Data can be stored in AWS services like DynamoDB or RDS, depending on your architecture.
