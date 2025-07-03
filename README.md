# Full-Stack Trail Management Database App – UBC CPSC 304

This project was developed as part of the final group assignment for **CPSC 304 – Introduction to Relational Databases** at the **University of British Columbia**.

The application focuses on **trail management and outdoor recreation**, helping users explore, review, and plan routes for hiking, biking, and skiing across British Columbia.

---

## 🌐 Domain Overview

- Fitness, outdoor recreation, and trail navigation
- Users can browse trails by region, plan routes, read/write trail reviews, and view nearby facilities
- Trails are associated with geographic regions, user reviews, rental equipment, and group events

---

## 🧠 Features

- Entity-relationship modeling for users, trails, routes, facilities, and equipment
- Complex SQL schema and queries (joins, aggregates, nested queries)
- Support for user-generated reviews, group formation, and route planning
- Normalized to BCNF with foreign key constraints and cascading actions
- REST API backend with Oracle SQL and Node.js (Express)
- Frontend using HTML, CSS, JavaScript, and Bootstrap

---

## 🧱 Database Design

The database supports:

- Trail and Route management with difficulty levels and terrain types
- Facility management (restrooms, rental shops, parking)
- Group planning and user exploration tracking
- Review system tied to trail-user relationships

### Example Tables:
- `User(Email, Username, PhoneNum, Hometown)`
- `Trail(TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, ...)`
- `Route(RouteID, RegionID, Difficulty, EstTime)`
- `TrailReview(ReviewID, TrailID, Email, Rating, Comments, ReviewDate)`
- `Facility(FacilityID, RegionID, Type, Location, OpenTime, CloseTime)`
- `Equipment(EquipmentID, Type, Condition, Availability, Price, FacilityID)`

---

## 🛠️ Tech Stack

- **Database**: Oracle SQL + PL/SQL
- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Tools**: GitHub, Postman, VSCode

---

## 👨‍💻 My Role (Rani Naser)

- Designed core database schema and normalized relational model
- Wrote SQL DDL, DML, and advanced queries (nested, joins, triggers)
- Developed Node.js backend endpoints and API logic
- Built parts of the front-end UI using Bootstrap
- Collaborated in team GitHub workflow, testing, and deployment
