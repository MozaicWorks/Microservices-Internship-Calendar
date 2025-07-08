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

## Enhanced Calendar Management APIs

### Calendar Search and Filtering
```http
# Search calendars by name or description
GET /api/calendars/search
Authorization: Bearer {sessionToken}
Query Parameters:
  - q: Search term (required)
  - userId: User ID (required)
  - limit: Max results (default: 20)
  - offset: Pagination offset (default: 0)

Response: 200 OK
[
  {
    "id": 1,
    "name": "Work Calendar",
    "description": "My work schedule",
    "color": "#FF5733",
    "ownerId": 1,
    "isShared": false,
    "eventCount": 15
  }
]

# Get calendar statistics
GET /api/calendars/{calendarId}/stats
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "calendarId": 1,
  "totalEvents": 25,
  "upcomingEvents": 8,
  "pastEvents": 17,
  "eventsByType": {
    "meeting": 12,
    "personal": 8,
    "reminder": 5
  },
  "busyHours": {
    "monday": 6.5,
    "tuesday": 8.0,
    "wednesday": 4.5
  }
}
```

### Bulk Calendar Operations
```http
# Bulk create calendars
POST /api/calendars/bulk
Content-Type: application/json
Authorization: Bearer {sessionToken}

{
  "calendars": [
    {
      "name": "Work Calendar",
      "color": "#FF5733",
      "ownerId": 1
    },
    {
      "name": "Personal Calendar", 
      "color": "#2196F3",
      "ownerId": 1
    }
  ]
}

Response: 201 Created
{
  "created": 2,
  "failed": 0,
  "calendars": [
    {
      "id": 1,
      "name": "Work Calendar",
      "color": "#FF5733",
      "ownerId": 1
    },
    {
      "id": 2,
      "name": "Personal Calendar",
      "color": "#2196F3", 
      "ownerId": 1
    }
  ]
}

# Archive calendar (soft delete)
PUT /api/calendars/{calendarId}/archive
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "id": 1,
  "name": "Work Calendar",
  "archived": true,
  "archivedAt": "2024-01-15T10:00:00Z"
}
```

## Enhanced Event Management APIs

### Event Search and Filtering
```http
# Advanced event search
GET /api/events/search
Authorization: Bearer {sessionToken}
Query Parameters:
  - q: Search term (title, description)
  - userId: User ID (required)
  - calendarId: Filter by calendar
  - startDate: Events starting after this date
  - endDate: Events starting before this date
  - status: EVENT_STATUS (upcoming, completed, cancelled)
  - type: Event type (meeting, personal, reminder)
  - hasReminder: true/false
  - isPremium: true/false
  - limit: Max results (default: 50)
  - offset: Pagination offset

Response: 200 OK
{
  "events": [
    {
      "id": 1,
      "title": "Team Meeting",
      "description": "Weekly team sync",
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T11:00:00Z",
      "calendarId": 1,
      "calendarName": "Work Calendar",
      "type": "meeting",
      "status": "upcoming",
      "isPremium": false,
      "hasReminder": true
    }
  ],
  "pagination": {
    "total": 125,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}

# Get events by date range
GET /api/events/range
Authorization: Bearer {sessionToken}
Query Parameters:
  - userId: User ID (required)
  - startDate: Start date (YYYY-MM-DD)
  - endDate: End date (YYYY-MM-DD)
  - calendarIds: Comma-separated calendar IDs (optional)

Response: 200 OK
{
  "dateRange": {
    "start": "2024-01-15",
    "end": "2024-01-21"
  },
  "events": [
    {
      "date": "2024-01-15",
      "events": [
        {
          "id": 1,
          "title": "Team Meeting",
          "startTime": "10:00",
          "endTime": "11:00",
          "calendarId": 1
        }
      ]
    }
  ]
}
```

### Event Operations
```http
# Duplicate event
POST /api/events/{eventId}/duplicate
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "newStartTime": "2024-01-22T10:00:00Z",
  "newEndTime": "2024-01-22T11:00:00Z",
  "title": "Team Meeting - Week 2" // optional, uses original if not provided
}

Response: 201 Created
{
  "id": 25,
  "title": "Team Meeting - Week 2",
  "startTime": "2024-01-22T10:00:00Z",
  "endTime": "2024-01-22T11:00:00Z",
  "originalEventId": 1
}

# Move event to different calendar
PUT /api/events/{eventId}/move
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "targetCalendarId": 2
}

Response: 200 OK
{
  "id": 1,
  "title": "Team Meeting",
  "calendarId": 2,
  "movedAt": "2024-01-15T12:00:00Z"
}

# Cancel event
PUT /api/events/{eventId}/cancel
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "reason": "Meeting room no longer available",
  "notifyAttendees": true
}

Response: 200 OK
{
  "id": 1,
  "status": "cancelled",
  "cancelledAt": "2024-01-15T12:00:00Z",
  "cancellationReason": "Meeting room no longer available"
}
```

### Recurring Events
```http
# Create recurring event
POST /api/events/recurring
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "title": "Daily Standup",
  "description": "Team daily standup meeting",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T09:30:00Z",
  "calendarId": 1,
  "recurrenceRule": {
    "frequency": "DAILY", // DAILY, WEEKLY, MONTHLY, YEARLY
    "interval": 1, // Every 1 day
    "daysOfWeek": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    "endDate": "2024-12-31T23:59:59Z"
  }
}

Response: 201 Created
{
  "seriesId": "series_abc123",
  "eventsCreated": 250,
  "firstEvent": {
    "id": 30,
    "title": "Daily Standup",
    "startTime": "2024-01-15T09:00:00Z",
    "seriesId": "series_abc123"
  }
}

# Update recurring event series
PUT /api/events/series/{seriesId}
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "updateType": "ALL", // ALL, THIS_AND_FUTURE, THIS_ONLY
  "title": "Updated Daily Standup",
  "startTime": "2024-01-15T09:15:00Z",
  "endTime": "2024-01-15T09:45:00Z"
}

Response: 200 OK
{
  "seriesId": "series_abc123",
  "eventsUpdated": 180,
  "updateType": "ALL"
}
```

## Payment Service APIs (Enhanced)

### Payment History and Management
```http
# Get user payment history
GET /api/payments/user/{userId}/history
Authorization: Bearer {sessionToken}
Query Parameters:
  - startDate: Filter from date (optional)
  - endDate: Filter to date (optional)
  - status: Payment status filter (optional)
  - limit: Results limit (default: 20)

Response: 200 OK
{
  "payments": [
    {
      "id": 1,
      "amount": 500,
      "currency": "usd",
      "status": "succeeded",
      "eventId": 1,
      "eventTitle": "Premium Meeting",
      "createdAt": "2024-01-15T10:00:00Z",
      "paidAt": "2024-01-15T10:02:00Z"
    }
  ],
  "totalSpent": 2500,
  "paymentCount": 5
}

# Get payment analytics
GET /api/payments/analytics
Authorization: Bearer {sessionToken}
Query Parameters:
  - period: TIME_PERIOD (week, month, quarter, year)
  - userId: User ID (optional for admin)

Response: 200 OK
{
  "period": "month",
  "totalRevenue": 15000,
  "totalTransactions": 30,
  "averageTransactionValue": 500,
  "revenueByDay": [
    {
      "date": "2024-01-01",
      "revenue": 1500,
      "transactions": 3
    }
  ],
  "topUsers": [
    {
      "userId": 5,
      "userName": "John Doe",
      "totalSpent": 2500,
      "transactionCount": 5
    }
  ]
}

# Process refund
POST /api/payments/{paymentId}/refund
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "amount": 500, // full or partial refund
  "reason": "Event cancelled by organizer"
}

Response: 200 OK
{
  "refundId": "ref_123456",
  "originalPaymentId": 1,
  "refundAmount": 500,
  "status": "processing",
  "estimatedArrival": "2024-01-20T00:00:00Z"
}
```

### Subscription Management
```http
# Create subscription plan
POST /api/payments/subscriptions
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "userId": 1,
  "planType": "PREMIUM_MONTHLY", // BASIC, PREMIUM_MONTHLY, PREMIUM_YEARLY
  "paymentMethodId": "pm_card_visa"
}

Response: 201 Created
{
  "subscriptionId": "sub_123456",
  "userId": 1,
  "planType": "PREMIUM_MONTHLY",
  "status": "active",
  "currentPeriodStart": "2024-01-15T00:00:00Z",
  "currentPeriodEnd": "2024-02-15T00:00:00Z",
  "nextBillingDate": "2024-02-15T00:00:00Z"
}

# Get subscription status
GET /api/payments/subscriptions/user/{userId}
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "subscription": {
    "id": "sub_123456",
    "planType": "PREMIUM_MONTHLY",
    "status": "active",
    "features": [
      "unlimited_premium_events",
      "advanced_sharing",
      "priority_support",
      "custom_themes"
    ],
    "usage": {
      "premiumEventsThisMonth": 15,
      "sharedCalendars": 8
    }
  }
}
```

## Notification Service APIs (Enhanced)

### Notification Preferences
```http
# Get user notification preferences
GET /api/notifications/users/{userId}/preferences
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "userId": 1,
  "preferences": {
    "emailNotifications": true,
    "smsNotifications": false,
    "pushNotifications": true,
    "eventReminders": {
      "enabled": true,
      "minutesBefore": [15, 60] // 15 minutes and 1 hour before
    },
    "calendarSharing": {
      "enabled": true,
      "emailOnly": false
    },
    "paymentConfirmations": {
      "enabled": true,
      "emailOnly": true
    }
  }
}

# Update notification preferences
PUT /api/notifications/users/{userId}/preferences
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "emailNotifications": true,
  "smsNotifications": true,
  "eventReminders": {
    "enabled": true,
    "minutesBefore": [5, 15, 60]
  }
}

Response: 200 OK
{
  "userId": 1,
  "preferences": {
    "emailNotifications": true,
    "smsNotifications": true,
    "eventReminders": {
      "enabled": true,
      "minutesBefore": [5, 15, 60]
    }
  },
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

### Notification History and Management
```http
# Get user notifications
GET /api/notifications/users/{userId}
Authorization: Bearer {sessionToken}
Query Parameters:
  - status: NOTIFICATION_STATUS (unread, read, all)
  - type: NOTIFICATION_TYPE (event_reminder, calendar_shared, payment_confirmation)
  - limit: Results limit (default: 20)
  - offset: Pagination offset

Response: 200 OK
{
  "notifications": [
    {
      "id": 1,
      "type": "event_reminder",
      "title": "Event Reminder",
      "message": "Your meeting 'Team Standup' starts in 15 minutes",
      "status": "unread",
      "createdAt": "2024-01-15T09:45:00Z",
      "eventId": 1,
      "eventTitle": "Team Standup"
    }
  ],
  "unreadCount": 3,
  "totalCount": 25
}

# Mark notification as read
PUT /api/notifications/{notificationId}/read
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "id": 1,
  "status": "read",
  "readAt": "2024-01-15T12:00:00Z"
}

# Mark all notifications as read
PUT /api/notifications/users/{userId}/mark-all-read
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "markedAsRead": 5,
  "remainingUnread": 0
}

# Delete notification
DELETE /api/notifications/{notificationId}
Authorization: Bearer {sessionToken}

Response: 204 No Content
```

## Sharing Service APIs (Enhanced)

### Calendar Sharing Management
```http
# Get shared calendars for user
GET /api/sharing/users/{userId}/shared-calendars
Authorization: Bearer {sessionToken}
Query Parameters:
  - permission: PERMISSION_LEVEL (read, write, admin)
  - status: SHARING_STATUS (pending, active, revoked)

Response: 200 OK
{
  "sharedWithMe": [
    {
      "sharingId": 1,
      "calendarId": 5,
      "calendarName": "Project Alpha",
      "ownerName": "Jane Smith",
      "permission": "write",
      "status": "active",
      "sharedAt": "2024-01-10T10:00:00Z"
    }
  ],
  "sharedByMe": [
    {
      "sharingId": 2,
      "calendarId": 1,
      "calendarName": "Work Calendar",
      "sharedWithEmail": "colleague@company.com",
      "permission": "read",
      "status": "pending",
      "sharedAt": "2024-01-12T14:00:00Z"
    }
  ]
}

# Share calendar with multiple users
POST /api/sharing/calendars/{calendarId}/share-bulk
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "recipients": [
    {
      "email": "user1@example.com",
      "permission": "read"
    },
    {
      "email": "user2@example.com", 
      "permission": "write"
    }
  ],
  "message": "I've shared my work calendar with you"
}

Response: 201 Created
{
  "calendarId": 1,
  "successful": [
    {
      "sharingId": 5,
      "email": "user1@example.com",
      "permission": "read"
    },
    {
      "sharingId": 6,
      "email": "user2@example.com",
      "permission": "write"  
    }
  ],
  "failed": []
}

# Update sharing permission
PUT /api/sharing/{sharingId}/permission
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "newPermission": "admin"
}

Response: 200 OK
{
  "sharingId": 1,
  "calendarId": 5,
  "permission": "admin",
  "updatedAt": "2024-01-15T12:00:00Z"
}

# Revoke calendar sharing
DELETE /api/sharing/{sharingId}
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "sharingId": 1,
  "status": "revoked",
  "revokedAt": "2024-01-15T12:00:00Z"
}
```

### Permission Validation
```http
# Check user permission for calendar
GET /api/sharing/calendars/{calendarId}/users/{userId}/permission
Authorization: Bearer {sessionToken}

Response: 200 OK
{
  "calendarId": 1,
  "userId": 2,
  "permission": "write",
  "hasAccess": true,
  "canRead": true,
  "canWrite": true,
  "canAdmin": false,
  "isOwner": false
}

# Batch permission check
POST /api/sharing/permissions/batch-check
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "checks": [
    {
      "calendarId": 1,
      "userId": 2,
      "requiredPermission": "write"
    },
    {
      "calendarId": 3,
      "userId": 2,
      "requiredPermission": "read"
    }
  ]
}

Response: 200 OK
{
  "results": [
    {
      "calendarId": 1,
      "userId": 2,
      "hasPermission": true,
      "actualPermission": "write"
    },
    {
      "calendarId": 3,
      "userId": 2,
      "hasPermission": false,
      "actualPermission": null
    }
  ]
}
```

## System Health and Monitoring APIs

### Health Checks
```http
# Service health check
GET /api/health
Response: 200 OK
{
  "status": "UP",
  "service": "calendar-service",
  "version": "1.0.0",
  "timestamp": "2024-01-15T12:00:00Z",
  "checks": {
    "database": "UP",
    "messageQueue": "UP",
    "externalServices": "UP"
  }
}

# Detailed health information
GET /api/health/detailed
Authorization: Bearer {adminToken}

Response: 200 OK
{
  "status": "UP",
  "details": {
    "database": {
      "status": "UP",
      "connectionPool": {
        "active": 5,
        "idle": 10,
        "max": 20
      },
      "responseTime": "12ms"
    },
    "messageQueue": {
      "status": "UP",
      "queueDepths": {
        "notification.events": 0,
        "payment.events": 2
      }
    }
  }
}
```

### Metrics and Analytics
```http
# Get service metrics
GET /api/metrics
Authorization: Bearer {adminToken}

Response: 200 OK
{
  "service": "calendar-service",
  "metrics": {
    "requests": {
      "total": 1250,
      "successful": 1200,
      "failed": 50,
      "averageResponseTime": "125ms"
    },
    "resources": {
      "cpuUsage": "45%",
      "memoryUsage": "512MB",
      "diskUsage": "2.5GB"
    },
    "business": {
      "activeUsers": 150,
      "calendarsCreated": 45,
      "eventsCreated": 320
    }
  }
}
```

## Error Response Enhancements

### Detailed Error Responses
```http
# Enhanced error response format
{
  "timestamp": "2024-01-15T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/events",
  "details": {
    "validationErrors": [
      {
        "field": "startTime",
        "rejectedValue": "invalid-date",
        "message": "Start time must be a valid ISO 8601 datetime"
      },
      {
        "field": "calendarId", 
        "rejectedValue": null,
        "message": "Calendar ID is required"
      }
    ]
  },
  "correlationId": "abc123-def456",
  "suggestions": [
    "Ensure start time is in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)",
    "Provide a valid calendar ID"
  ]
}

# Rate limiting error
{
  "timestamp": "2024-01-15T12:00:00Z",
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "path": "/api/events",
  "details": {
    "limit": 100,
    "windowSeconds": 3600,
    "remainingRequests": 0,
    "resetTime": "2024-01-15T13:00:00Z"
  }
}
```

### Common HTTP Status Codes and Their Usage

```http
# Success Responses
200 OK                    # Successful GET, PUT requests
201 Created               # Successful POST requests (resource created)
202 Accepted              # Async operation initiated
204 No Content            # Successful DELETE requests

# Client Error Responses  
400 Bad Request           # Invalid request data/format
401 Unauthorized          # Authentication required or invalid
403 Forbidden             # User lacks permission for operation
404 Not Found             # Resource doesn't exist
409 Conflict              # Resource already exists or business rule violation
422 Unprocessable Entity  # Valid format but business logic error
429 Too Many Requests     # Rate limiting

# Server Error Responses
500 Internal Server Error # Unexpected server error
502 Bad Gateway           # External service error
503 Service Unavailable   # Service temporarily down
504 Gateway Timeout       # External service timeout
```

