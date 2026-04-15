### Deadline
4/16/2026
11:59pm

# Stage 1 (BACKEND) Task: Data Persistence & API Design Assessment

### Requirements / Task Brief

Build a POST endpoint at /api/profiles that accepts a name, calls three external APIs (Genderize, Agify, Nationalize), aggregates the responses, applies classification logic, and stores the result in a database.


### Processing rules:

- Call all three APIs using the provided name and aggregate the responses
- Extract gender, gender_probability, and count from Genderize. Rename count to sample_size
- Extract age from Agify. Classify age_group: 0–12 → child, 13–19 → teenager, 20–59 → adult, 60+ → senior
- Extract country list from Nationalize. Pick the country with the highest probability as country_id
- Store the processed result with a UUID v7 id and UTC created_at timestamp


### Idempotency: 

if the same name is submitted more than once, do not create a new record. Return the existing one with `"message": "Profile already exists"`.



### Input validation:

- Missing or empty name returns 400 Bad Request

- Non-string name returns 422 Unprocessable Entity


### Edge cases:

- Genderize returns gender: null or count: 0 → return error, do not store

- Agify returns age: null → return error, do not store

- Nationalize returns no country data → return error, do not store


All errors follow this structure:


```json
{ "status": "error", "message": "<error message>" }
```


Status codes: `400`, `422`, `404`, `500/502` where appropriate. CORS header: `Access-Control-Allow-Origin: *`. Without this, the grading script cannot reach your server. All timestamps in UTC ISO 8601. All IDs in UUID v7. Response structure must match exactly.



### Expected response format:

```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 46,
    "age_group": "adult",
    "country_id": "DRC",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}
```

## Evaluation Criteria / Acceptance Criteria

`API Design (Endpoints)`: ======= **15 points**

`Multi-API Integration`: ======= **15 points**

`Data Persistence`: ============= **20 points**

`Idempotency Handling`: ========== **15 points**

`Filtering Logic`: ======= **10 points**

`Data Modeling`: ======= **10 points**

`Error Handling`: ======= **10 points**

`Response Structure`: ======= **5 points**

### Submission Format
Two things:

- GitHub repository link with a clear README
- Public API base URL


The repository has to be public. All endpoints have to be live when testing runs.

### Submission Link
Run /submit in **#track-backend**

`Points`: 100

`Format`: Integer

`Pass Mark`: 75