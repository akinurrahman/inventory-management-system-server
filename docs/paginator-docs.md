# Paginator Utility Documentation

## Overview

A lightweight, flexible pagination utility for MongoDB/Mongoose that handles pagination, search, and filtering in a single method. Perfect for building REST APIs with minimal dependencies.

## Table of Contents

- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Response Format](#response-format)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Basic Usage

### Simple Pagination

```javascript
const User = require('./models/User');
const Paginator = require('./utils/paginator');

// Get paginated users
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10
});

console.log(result.data); // Array of users
console.log(result.pagination); // Pagination metadata
```

### With Express Controller

```javascript
// controllers/userController.js
const User = require('../models/User');
const Paginator = require('../utils/paginator');

exports.getUsers = async (req, res) => {
  try {
    const result = await Paginator.paginate(User, {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

---

## API Reference

### `Paginator.paginate(model, options)`

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `model` | Mongoose Model | ✅ Yes | - | The Mongoose model to query |
| `options` | Object | ❌ No | `{}` | Pagination options (see below) |

#### Options Object

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `page` | Number | `1` | Current page number (1-indexed) |
| `limit` | Number | `10` | Number of items per page |
| `filter` | Object | `{}` | MongoDB filter query |
| `search` | String | `null` | Search term for text search |
| `searchFields` | Array | `[]` | Fields to search in (used with `search`) |
| `sort` | Object | `{ createdAt: -1 }` | Sort criteria (MongoDB syntax) |
| `select` | String | `''` | Fields to include/exclude |
| `populate` | String/Object/Array | `null` | Relations to populate |
| `lean` | Boolean | `true` | Use lean() for better performance |

#### Returns

Returns a Promise that resolves to:

```javascript
{
  success: true,
  data: [...], // Array of documents
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalCount: 95,
    limit: 10,
    hasNextPage: true,
    hasPrevPage: false,
    nextPage: 2,
    prevPage: null
  }
}
```

---

## Examples

### Example 1: Pagination Only

```javascript
// GET /api/users?page=2&limit=20

exports.getUsers = async (req, res) => {
  const result = await Paginator.paginate(User, {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10
  });
  res.json(result);
};
```

**API Call:**
```bash
GET /api/users?page=2&limit=20
```

---

### Example 2: Filter Only

```javascript
// Get only active admin users

const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  filter: { 
    role: 'admin',
    isActive: true 
  }
});
```

**API Call:**
```bash
GET /api/users?page=1&limit=10&role=admin&isActive=true
```

---

### Example 3: Search Only

```javascript
// Search users by name or email

const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  search: 'john',
  searchFields: ['name', 'email', 'username']
});
```

**API Call:**
```bash
GET /api/users?page=1&limit=10&search=john
```

---

### Example 4: Filter + Search (Combined)

```javascript
// Search for admin users with 'john' in name/email

const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  filter: { role: 'admin' },
  search: 'john',
  searchFields: ['name', 'email']
});
```

**Query Generated:**
```javascript
{
  $and: [
    { role: 'admin' },
    {
      $or: [
        { name: { $regex: 'john', $options: 'i' } },
        { email: { $regex: 'john', $options: 'i' } }
      ]
    }
  ]
}
```

---

### Example 5: Field Selection

```javascript
// Return only specific fields (exclude password)

const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  select: 'name email role -password' // Include name, email, role; exclude password
});
```

---

### Example 6: Populate Relations

```javascript
// Populate user's role and posts

const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  populate: 'role posts' // Simple populate
});

// Advanced populate
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  populate: [
    { path: 'role', select: 'name permissions' },
    { path: 'posts', options: { limit: 5 } }
  ]
});
```

---

### Example 7: Custom Sorting

```javascript
// Sort by name ascending
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  sort: { name: 1 } // 1 = ascending, -1 = descending
});

// Multiple sort fields
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  sort: { role: 1, createdAt: -1 }
});
```

---

### Example 8: Date Range Filter

```javascript
// Get users created in a date range

const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  filter: {
    createdAt: {
      $gte: new Date('2024-01-01'),
      $lte: new Date('2024-12-31')
    }
  }
});
```

**Controller Implementation:**
```javascript
exports.getUsersByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const filter = {};
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const result = await Paginator.paginate(User, {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filter
  });
  
  res.json(result);
};
```

---

### Example 9: Price Range Filter

```javascript
// Get products in price range

exports.getProducts = async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  
  const filter = {};
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  const result = await Paginator.paginate(Product, {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filter,
    search: req.query.search,
    searchFields: ['name', 'description']
  });
  
  res.json(result);
};
```

**API Call:**
```bash
GET /api/products?page=1&limit=20&minPrice=100&maxPrice=500&search=laptop
```

---

### Example 10: Complete Real-World Example

```javascript
// Full-featured user search with all options

exports.searchUsers = async (req, res) => {
  try {
    // Build dynamic filters
    const filters = {};
    
    if (req.query.role) filters.role = req.query.role;
    if (req.query.isActive) filters.isActive = req.query.isActive === 'true';
    if (req.query.country) filters.country = req.query.country;
    
    // Age range
    if (req.query.minAge || req.query.maxAge) {
      filters.age = {};
      if (req.query.minAge) filters.age.$gte = parseInt(req.query.minAge);
      if (req.query.maxAge) filters.age.$lte = parseInt(req.query.maxAge);
    }
    
    // Skills filter (array contains)
    if (req.query.skills) {
      filters.skills = { $in: req.query.skills.split(',') };
    }

    // Dynamic sorting
    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const result = await Paginator.paginate(User, {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      filter: filters,
      search: req.query.search,
      searchFields: ['name', 'email', 'username', 'bio'],
      sort: { [sortField]: sortOrder },
      select: '-password -__v',
      populate: 'role company'
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

**API Call:**
```bash
GET /api/users/search?page=1&limit=20&search=developer&role=user&country=US&minAge=25&maxAge=40&skills=javascript,react&sortBy=name&order=asc
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 95,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

### Pagination Metadata Explained

| Field | Type | Description |
|-------|------|-------------|
| `currentPage` | Number | Current page number |
| `totalPages` | Number | Total number of pages |
| `totalCount` | Number | Total number of documents matching query |
| `limit` | Number | Items per page |
| `hasNextPage` | Boolean | Whether there's a next page |
| `hasPrevPage` | Boolean | Whether there's a previous page |
| `nextPage` | Number/null | Next page number or null |
| `prevPage` | Number/null | Previous page number or null |

---

## Advanced Usage

### Multiple Populate with Select

```javascript
const result = await Paginator.paginate(Post, {
  page: 1,
  limit: 10,
  populate: [
    { 
      path: 'author', 
      select: 'name email avatar',
      populate: { path: 'role', select: 'name' }
    },
    { 
      path: 'comments',
      options: { limit: 5, sort: { createdAt: -1 } }
    }
  ]
});
```

### Array Filters

```javascript
// Find users with specific skills
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  filter: {
    skills: { $in: ['javascript', 'react'] }, // Has any of these
    // skills: { $all: ['javascript', 'react'] }, // Has all of these
  }
});
```

### Text Index Search (MongoDB Text Index)

First, create a text index on your model:

```javascript
// In your User model
userSchema.index({ name: 'text', bio: 'text', email: 'text' });
```

Then use text search:

```javascript
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  filter: { 
    $text: { $search: 'developer javascript' }
  }
});
```

### Geo-spatial Queries

```javascript
// Find users near a location
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  filter: {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: 5000 // 5km
      }
    }
  }
});
```

---

## Best Practices

### 1. Input Validation

```javascript
exports.getUsers = async (req, res) => {
  // Validate and sanitize inputs
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Max 100

  const result = await Paginator.paginate(User, {
    page,
    limit,
    select: '-password' // Always exclude sensitive fields
  });
  
  res.json(result);
};
```

### 2. Use Lean for Read-Only Operations

```javascript
// Good (default) - Use lean for better performance
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  lean: true // Returns plain JavaScript objects (faster)
});

// Only disable lean if you need Mongoose document methods
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  lean: false // Returns Mongoose documents (slower, but has methods)
});
```

### 3. Always Exclude Sensitive Fields

```javascript
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  select: '-password -resetToken -__v' // Exclude sensitive data
});
```

### 4. Index Your Sort Fields

```javascript
// In your model file
userSchema.index({ createdAt: -1 });
userSchema.index({ name: 1 });
```

### 5. Set Reasonable Limits

```javascript
// Prevent abuse
const MAX_LIMIT = 100;
const limit = Math.min(parseInt(req.query.limit) || 10, MAX_LIMIT);
```

### 6. Cache Count Queries (Optional)

For large datasets, counting can be slow. Consider caching:

```javascript
const redis = require('redis');
const client = redis.createClient();

const cacheKey = `count:users:${JSON.stringify(filter)}`;
let totalCount = await client.get(cacheKey);

if (!totalCount) {
  totalCount = await User.countDocuments(filter);
  await client.setex(cacheKey, 300, totalCount); // Cache for 5 minutes
}
```

---

## Troubleshooting

### Issue: Slow Queries

**Solution:** Add indexes to filtered and sorted fields

```javascript
// In your model
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });
```

### Issue: Empty Results on High Page Numbers

**Cause:** Requesting page beyond total pages

**Solution:** Frontend should disable "Next" button when `hasNextPage === false`

### Issue: Search Not Working

**Cause:** `searchFields` array is empty

**Solution:**
```javascript
const result = await Paginator.paginate(User, {
  search: 'john',
  searchFields: ['name', 'email'] // ✅ Must provide fields
});
```

### Issue: Populate Not Working

**Cause:** Invalid ref or field name

**Solution:** Check your model schema
```javascript
// In User model
const userSchema = new Schema({
  role: { type: Schema.Types.ObjectId, ref: 'Role' } // ✅ Correct ref name
});
```

### Issue: Case-Sensitive Search

**Cause:** By default, regex search is case-insensitive

**Solution:** It's already case-insensitive! Uses `$options: 'i'`

---

## Performance Tips

1. **Use lean()** - 50% faster for read-only operations (enabled by default)
2. **Index frequently queried fields** - Makes filtering/sorting fast
3. **Limit populate depth** - Deep populates are slow
4. **Use select to limit fields** - Less data = faster queries
5. **Consider cursor pagination** - For very large datasets or infinite scroll

---

## Migration from Other Libraries

### From mongoose-paginate-v2

```javascript
// Before (mongoose-paginate-v2)
const result = await User.paginate(
  { role: 'admin' },
  { page: 1, limit: 10 }
);

// After (Paginator)
const result = await Paginator.paginate(User, {
  page: 1,
  limit: 10,
  filter: { role: 'admin' }
});
```

### From Manual Pagination

```javascript
// Before (manual)
const skip = (page - 1) * limit;
const data = await User.find().skip(skip).limit(limit);
const total = await User.countDocuments();

// After (Paginator)
const result = await Paginator.paginate(User, {
  page: page,
  limit: limit
});
// Returns both data and pagination metadata
```