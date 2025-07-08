# Complete REST API Specifications

This document contains the complete API specifications for all services in the SimpleCal application.

## User Management APIs

### Register new user
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123",
  "timezone": "America/New_York"
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "timezone": "America/New_York",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

[Include all API specifications from the curriculum]
