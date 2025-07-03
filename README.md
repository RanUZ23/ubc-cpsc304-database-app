# CPSC 304 Project
# Extra Information

Line Numbers for SQL Queries:

- Insert, appService.js, Line 192
- Update, appService.js, Line 248
- Delete, appService.js, Line 264
- Selection, appService.js, Line 464
- Projection, appService.js, Line 480
- Join, appService.js, Line 544
- Aggregation with GROUP BY, appService.js, Line 426
- Aggregation with Having, appService.js, Line 404
- Nested aggregation with GROUP BY, appService.js, Line 558:
- Division, appService.js, Line 600

Integrity Constraints:
Some integrity constraints that we would have wanted could not be implemented. Namely, ON UPDATE CASCADE is not supported by Oracle (a full breakdown of where we would have used this is included in the repository in Milestone 2). Also, full participation constraints are not enforced because of a lack of assertion examples.
