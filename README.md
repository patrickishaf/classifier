# Stage 2 (BACKEND) Task: Intelligence Query Engine Assessment

### Input validation:

- Missing or empty query returns 400 Bad Request

- Non-string name returns 422 Unprocessable Entity

## Natural Language Parsing Approach

The *Natural Language Parser* decodes the following data from the query:

- country
- gender
- age group
- age range
- sort column
- sort order

### Supported Keywords

- above
- below
- from
- in
- and
- order
- of
- page
- limit

### Filter Mapping

This section explains how each keyword maps to filters. This string will be used as a case study:
**men and women above 30 and below 80 from nigeria in ascending order of age page 1 limit 10**

`above`

If this keyword is detected, the parser expects the token that comes after it to be a number (e.g 30). If that requirement is satisfied, the parser interprets it as a query for ages above 30

`below`

If this keyword is detected, the parser expects the token that comes after it to be a number (e.g 30). If that requirement is satisfied, the parser interprets it as a query for ages below 30

`and`

If the and keyword is detected, the parser checks the tokens before and after it. If they are valid keys of the country map for example, the parser will expect the 

`from`

If this keyword is detected, the parser checks if the token that comes after it can map to a valid country id using the map of country names to country ids. If that condtion is met, the parser interprets it as a query for individuals with a matching country id

`in`

This keyword is an alternative to **from**. It performs the same function

`limit`

If the token that comes after this keyword is a valid number, the parser converts it into pagination parameters. From the sample string, results will have a page size of 10

`of`

If this keyword is detected, the parser expects the token that comes after it to be one of *age*, *name*, *gender* or *country*. The parser interprets queries that match this condition as sort directives. In the example string above, it will sort according to age

`order`

If the token that comes before this keyword is a valid sort order string lke *ascending*, *descending*, *increasing*, *decreasing*, etc, the parser decodes that the results are to be sorted and in the given order

`page`

If the token that comes after this keyword is a valid number, the parser converts it into pagination parameters. From the sample string, only the results on page 1 will be shown

### Core Logic

The core logic of the *Natural Language Parser* depends on four major mechanisms - a query string that tokens can be extracted from, maps that convert tokens into database queries, a filter object that is composed from the tokens in th estring and variables like child, teenager, nigeria. Multiple variables can map to the same token.

The *Natural Language Parser* splits the query into an array of strings. The splitting is based on the spaces between words. (This means that country names and other criteria like `united kingdom` will not work and have to be underscored like this `united_kingdom`)

```javascript
[
  'men',       'and',
  'women',     'from',
  'nigeria',   'below',
  '30',        'in',
  'ascending', 'order',
  'of',        'gender',
  'page',      '5',
  'limit',     '20'
]
```

When the array of strings is created, each string is treated like a potential token and loop runs to detect keywords like *above*, *below*, *from*, *in*, *and*, *order*, *of* and *page*

If the keyword *above* is detected, the loop will expect the token that comes after it to be a number and if the next token is a number (e.g 30), that means the user is looking for ages above 30.

The same logic applies to the word *below*. If it is detected, the loop will expect the token that comes after it to be a number and if that requirement is satisfied, it means the user is looking for ages below the number.

`in`


### Limitations

Clauses related to pagination don't have to be in the right order. This means that a that contains this clause `of age in ascending order` will work just like `in ascending order of age` and that doesn't make logical sense or constitute lexical meaning

Using the `and` keyword does not work. If you try a query like `adults and children and teenagers`, only the last and will be considered. This means that the parser will only filter for children and teenagers.

Separating tokens by commas has no effect so you can not combine filters using commas. `adults, children and teenagers` will have the same effect as `children and teenagers`


### Keyword Index:

- above
- and
- below
- from
- in
- limit
- order
- of
- page
