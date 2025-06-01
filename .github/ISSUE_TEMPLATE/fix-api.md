---
name: 🔌 Fix API
about: AI Agent task to fix API endpoints, requests, or integrations
title: '[API] Fix [API_ENDPOINT_OR_ISSUE]'
labels: ['api', 'ai-agent', 'fix', 'backend']
assignees: ''
---

## 🔌 API Issue

**Endpoint:** <!-- API endpoint URL or name -->
**Method:** <!-- GET/POST/PUT/DELETE/PATCH -->
**Issue Type:** <!-- Bug/Performance/Security/Integration -->
**Severity:** <!-- Critical/High/Medium/Low -->

## 🔍 Problem Description

### Current Issue
<!-- Describe what's wrong with the API -->

### Expected Behavior
<!-- What should the API do instead? -->

### Error Details
```
<!-- API error responses, status codes, error messages -->
```

## 🛠️ AI Agent Instructions

### 1. Investigation
- [ ] Test API endpoint manually
- [ ] Check API documentation
- [ ] Review request/response format
- [ ] Analyze error logs
- [ ] Check authentication/authorization

### 2. Code Analysis
- [ ] Review API client code
- [ ] Check request configuration
- [ ] Validate request parameters
- [ ] Examine error handling
- [ ] Review response processing

### 3. Fix Implementation
- [ ] Implement targeted fix
- [ ] Update request/response types
- [ ] Improve error handling
- [ ] Add proper validation
- [ ] Update API client methods

### 4. Testing
- [ ] Test API calls manually
- [ ] Verify error scenarios
- [ ] Test with different data
- [ ] Check edge cases
- [ ] Validate response handling

## 📋 API Details

### Endpoint Information
**URL:** <!-- Full API endpoint URL -->
**Headers:** <!-- Required headers -->
**Authentication:** <!-- Auth method used -->
**Parameters:** <!-- Query params, body params -->

### Request Format
```typescript
// Expected request structure
interface RequestType {
  // Define request interface
}
```

### Response Format
```typescript
// Expected response structure
interface ResponseType {
  // Define response interface
}
```

## 🔧 Common API Issues

### Request Issues
- [ ] **URL:** Incorrect endpoint URL
- [ ] **Method:** Wrong HTTP method
- [ ] **Headers:** Missing/incorrect headers
- [ ] **Auth:** Authentication problems
- [ ] **Params:** Invalid parameters

### Response Issues
- [ ] **Status:** Unexpected status codes
- [ ] **Format:** Response format mismatch
- [ ] **Types:** TypeScript type errors
- [ ] **Parsing:** JSON parsing errors
- [ ] **Validation:** Response validation fails

### Integration Issues
- [ ] **Timeout:** Request timeout problems
- [ ] **CORS:** Cross-origin issues
- [ ] **Network:** Network connectivity
- [ ] **Rate Limiting:** API rate limits
- [ ] **Caching:** Response caching issues

## 📁 Files to Check

**API Client:** <!-- app/utils/api.ts, composables/useApi.ts -->
**Types:** <!-- types/api.ts, interfaces/ -->
**Components:** <!-- Components using this API -->
**Stores:** <!-- Pinia stores using this API -->

## ✅ Fix Checklist

### API Client
- [ ] Request configuration correct
- [ ] Headers properly set
- [ ] Authentication working
- [ ] Parameters validated
- [ ] Error handling robust

### Type Safety
- [ ] Request types defined
- [ ] Response types defined
- [ ] Error types handled
- [ ] TypeScript compliance
- [ ] No type errors

### Error Handling
- [ ] Network errors caught
- [ ] API errors handled
- [ ] User feedback provided
- [ ] Retry logic implemented
- [ ] Fallback behavior defined

### Testing
- [ ] API calls work correctly
- [ ] Error scenarios handled
- [ ] Edge cases covered
- [ ] Performance acceptable
- [ ] No console errors

## 🚀 AI Agent Notes

- **Documentation:** Check API docs thoroughly
- **Testing:** Test all scenarios including errors
- **Types:** Ensure proper TypeScript typing
- **Security:** Validate authentication/authorization
- **Performance:** Monitor request/response times

## 📖 API Reference

**Documentation:** <!-- Link to API documentation -->
**Base URL:** <!-- API base URL -->
**Authentication:** <!-- Auth method and setup -->
**Rate Limits:** <!-- API rate limiting info -->
