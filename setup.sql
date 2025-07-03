DROP TABLE Has_Restroom CASCADE CONSTRAINTS;
DROP TABLE Has_Parking CASCADE CONSTRAINTS;
DROP TABLE Owns_Equipment_2 CASCADE CONSTRAINTS;
DROP TABLE Has_RentalShop CASCADE CONSTRAINTS;
DROP TABLE Owns_Equipment_1 CASCADE CONSTRAINTS;

DROP TABLE Writes_TrailReview_On CASCADE CONSTRAINTS;
DROP TABLE Explores CASCADE CONSTRAINTS;
DROP TABLE Includes CASCADE CONSTRAINTS;

DROP TABLE PartOf CASCADE CONSTRAINTS;
DROP TABLE Leads_Group CASCADE CONSTRAINTS;
DROP TABLE AppUser CASCADE CONSTRAINTS;

DROP TABLE LocatedIn_Trail_2 CASCADE CONSTRAINTS;
DROP TABLE LocatedIn_Trail_1 CASCADE CONSTRAINTS;

DROP TABLE PartOf_Route_2 CASCADE CONSTRAINTS;
DROP TABLE PartOf_Route_1 CASCADE CONSTRAINTS;

DROP TABLE Region CASCADE CONSTRAINTS;

CREATE TABLE Region(
  RegionID INTEGER PRIMARY KEY,
  TerrainType VARCHAR(50),
  City VARCHAR(50),
  EmergPhone VARCHAR(13)
);

CREATE TABLE PartOf_Route_1(
  Length_km DECIMAL(6,3),
  Difficulty VARCHAR(20),
  EstTime INTEGER,
  PRIMARY KEY(Length_km, Difficulty)
);

CREATE TABLE PartOf_Route_2(
  RouteID INTEGER PRIMARY KEY,
  RegionID INTEGER NOT NULL,
  Length_km DECIMAL(6,3),
  Difficulty VARCHAR(20),
  FOREIGN KEY (RegionID)
    REFERENCES Region(RegionID),
  FOREIGN KEY (Length_km, Difficulty)
  	REFERENCES PartOf_Route_1(Length_km, Difficulty)
);

CREATE TABLE LocatedIn_Trail_1(
  TerrainType VARCHAR(20) PRIMARY KEY,
  Sport VARCHAR(20)
);

CREATE TABLE LocatedIn_Trail_2(
  TrailID INTEGER PRIMARY KEY,
  RegionID INTEGER,
  TrailName VARCHAR(30),
  Length_km INTEGER,
  Sport VARCHAR(20),
  TerrainType VARCHAR(20),
  StartLoc VARCHAR(29),
  EndLoc VARCHAR(29),
  FOREIGN KEY (RegionID)
    REFERENCES Region(RegionID),
  FOREIGN KEY (TerrainType)
    REFERENCES LocatedIn_Trail_1(TerrainType)
);

CREATE TABLE Includes(
  RouteID INTEGER,
  TrailID INTEGER,
  PRIMARY KEY (RouteID, TrailID),
  FOREIGN KEY (RouteID) 
  	REFERENCES PartOf_Route_2(RouteID)
    ON DELETE CASCADE,
  FOREIGN KEY (TrailID)
  	REFERENCES LocatedIn_Trail_2(TrailID)
    ON DELETE CASCADE
);

CREATE TABLE AppUser(
  Email VARCHAR(254) NOT NULL UNIQUE,
  Username VARCHAR(25),
  PhoneNum VARCHAR(13) NOT NULL UNIQUE,
  Hometown VARCHAR(30),
  PRIMARY KEY (Username)
);

CREATE TABLE Explores(
  TrailID INTEGER,
  Username VARCHAR(25),
  ExploreDate VARCHAR(30),
  PRIMARY KEY (TrailID, Username),
  FOREIGN KEY (TrailID)
    REFERENCES LocatedIn_Trail_2(TrailID)
    ON DELETE CASCADE,
  FOREIGN KEY (Username)
    REFERENCES AppUser(Username)
    ON DELETE CASCADE
);

CREATE TABLE Writes_TrailReview_On(
  ReviewID INTEGER,
  TrailID INTEGER,
  Rating INTEGER,
  ReviewDate VARCHAR(30),
  Comments VARCHAR(300),
  Username VARCHAR(25),
  PRIMARY KEY (ReviewID, TrailID),
  FOREIGN KEY (TrailID)
    REFERENCES LocatedIn_Trail_2(TrailID)
    ON DELETE CASCADE,
  FOREIGN KEY (Username)
    REFERENCES AppUser(Username)
    ON DELETE SET NULL
);

CREATE TABLE Owns_Equipment_1(
  Type VARCHAR(30),
  Condition VARCHAR(20),
  Price REAL,
  PRIMARY KEY (Type, Condition)
);

CREATE TABLE Has_RentalShop(
  FacilityID INTEGER PRIMARY KEY,
  RegionID INTEGER NOT NULL,
  Location VARCHAR(29),
  OpenTime VARCHAR(30),
  CloseTime VARCHAR(30),
  FOREIGN KEY (RegionID)
	REFERENCES Region(RegionID)
    ON DELETE CASCADE
);

CREATE TABLE Owns_Equipment_2(
  EquipmentID INTEGER PRIMARY KEY,
  Availablility INTEGER,
  Type VARCHAR(30),
  Condition VARCHAR(20),
  FacilityID INTEGER NOT NULL,
  FOREIGN KEY (Type, Condition)
  	REFERENCES Owns_Equipment_1(Type, Condition)
    ON DELETE CASCADE,
  FOREIGN KEY (FacilityID)
  	REFERENCES Has_RentalShop(FacilityID)
    ON DELETE CASCADE
);

CREATE TABLE Leads_Group(
  GroupID INTEGER PRIMARY KEY,
  Username VARCHAR(25) NOT NULL,
  Experience VARCHAR(20),
  FOREIGN KEY (Username)
  	REFERENCES AppUser(Username)
);

CREATE TABLE PartOf(
  Username VARCHAR(25),
  GroupID INTEGER,
  PRIMARY KEY (Username, GroupID),
  FOREIGN KEY (Username)
    REFERENCES AppUser(Username)
    ON DELETE CASCADE,
  FOREIGN KEY (GroupID)
	REFERENCES Leads_Group(GroupID)
    ON DELETE CASCADE
);

CREATE TABLE Has_Parking(
  FacilityID INTEGER PRIMARY KEY,
  RegionID INTEGER NOT NULL,
  OpenTime VARCHAR(30),
  CloseTime VARCHAR(30),
  Capacity INTEGER,
  Fee REAL,
  FOREIGN KEY (RegionID)
	REFERENCES Region(RegionID)
    ON DELETE CASCADE
);

CREATE TABLE Has_Restroom(
  FacilityID INTEGER PRIMARY KEY,
  RegionID INTEGER NOT NULL,
  OpenTime VARCHAR(30),
  CloseTime VARCHAR(30),
  Condition VARCHAR(20),
  FOREIGN KEY (RegionID)
	REFERENCES Region(RegionID)
    ON DELETE CASCADE
);

-- Region
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (123456, 'Rocky', 'Vancouver', 6041231234);
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (654321, 'Forest', 'Burnaby', '6042521245');
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (921876, 'Tundra', 'Surrey', '6049728321');
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (231593, 'Rocky', 'Coquitlam', '7789012322');
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (421657, 'Coastal', 'Delta', '6045521829');
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (1, 'Mountain', 'Vancouver', '604-555-1234');
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (2, 'Coastal', 'Vancouver', '604-555-5678');
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (3, 'Forest', 'Seattle', '206-555-7890');
INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) VALUES (4, 'Desert', 'Los Angeles', '323-555-3456');

-- PartOf_Route_1
INSERT INTO PartOf_Route_1 (Length_km, Difficulty, EstTime) VALUES (2.5, 'Easy', 30);
INSERT INTO PartOf_Route_1 (Length_km, Difficulty, EstTime) VALUES (5.0, 'Moderate', 75);
INSERT INTO PartOf_Route_1 (Length_km, Difficulty, EstTime) VALUES (5.0, 'Hard', 150);
INSERT INTO PartOf_Route_1 (Length_km, Difficulty, EstTime) VALUES (12.7, 'Very Hard', 220);
INSERT INTO PartOf_Route_1 (Length_km, Difficulty, EstTime) VALUES (15.0, 'Extreme', 300);

-- PartOf_Route_2
INSERT INTO PartOf_Route_2 (RouteID, RegionID, Length_km, Difficulty) VALUES (101, 123456, 2.5, 'Easy');
INSERT INTO PartOf_Route_2 (RouteID, RegionID, Length_km, Difficulty) VALUES (102, 654321, 5.0, 'Moderate');
INSERT INTO PartOf_Route_2 (RouteID, RegionID, Length_km, Difficulty) VALUES (103, 921876, 5.0, 'Hard');
INSERT INTO PartOf_Route_2 (RouteID, RegionID, Length_km, Difficulty) VALUES (104, 231593, 12.7, 'Very Hard');
INSERT INTO PartOf_Route_2 (RouteID, RegionID, Length_km, Difficulty) VALUES (105, 421657, 15.0, 'Extreme');

-- LocatedIn_Trail_1
INSERT INTO LocatedIn_Trail_1 (TerrainType, Sport) VALUES ('Mountain Pass', 'Ski');
INSERT INTO LocatedIn_Trail_1 (TerrainType, Sport) VALUES ('Snowy', 'Snowboard');
INSERT INTO LocatedIn_Trail_1 (TerrainType, Sport) VALUES ('Canyon', 'Hike');
INSERT INTO LocatedIn_Trail_1 (TerrainType, Sport) VALUES ('Forest', 'Hike');
INSERT INTO LocatedIn_Trail_1 (TerrainType, Sport) VALUES ('Rocky', 'Mountain Bike');
INSERT INTO LocatedIn_Trail_1 (TerrainType, Sport) VALUES ('Mountain', 'Ski');
INSERT INTO LocatedIn_Trail_1 (TerrainType, Sport) VALUES ('Coastal', 'Hike');
INSERT INTO LocatedIn_Trail_1 (TerrainType, Sport) VALUES ('Tree Forest', 'Hike');

-- LocatedIn_Trail_2
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc) 
VALUES (201, 123456, 'Mountain Mayhem', 5.2, 'Hiking', 'Mountain Pass', '49.1234,-122.5678', '49.2234,-122.6789');
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc) 
VALUES (202, 654321, 'Frozen Peak Run', 7.8, 'Skiing', 'Snowy', '50.3456,-121.2345', '50.4567,-121.3456');
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc) 
VALUES (203, 921876, 'Crazy Canyon Trail', 10.5, 'Trail Running', 'Canyon', '48.9876,-120.4567', '48.8765,-120.5678');
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc) 
VALUES (204, 231593, 'Deep Forest Fun', 6.3, 'Mountain Biking', 'Forest', '47.7654,-119.3456', '47.6543,-119.2345');
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc) 
VALUES (205, 421657, 'Rocky Rush', 8.0, 'Rock Climbing', 'Rocky', '46.5432,-118.1234', '46.4321,-118.0123');
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc)
VALUES (1, 1, 'Mountain Trail', 5, 'Hiking', 'Mountain', 'Trailhead A', 'Summit Peak');
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc)
VALUES (2, 2, 'Coastal Path', 10, 'Cycling', 'Coastal', 'Beach Start', 'Harbor End');
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc)
VALUES (3, 1, 'Alpine Ridge', 8, 'Running', 'Mountain', 'Base Camp', 'Ridge View');
INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc)
VALUES (4, 3, 'Forest Walk', 12, 'Hiking', 'Forest', 'Forest Entrance', 'Woodland Camp');



-- Includes
INSERT INTO Includes (RouteID, TrailID) VALUES (101, 201);
INSERT INTO Includes (RouteID, TrailID) VALUES (102, 202);
INSERT INTO Includes (RouteID, TrailID) VALUES (103, 203);
INSERT INTO Includes (RouteID, TrailID) VALUES (104, 204);
INSERT INTO Includes (RouteID, TrailID) VALUES (105, 205);

-- AppUser
INSERT INTO AppUser (Email, Username, PhoneNum, Hometown) 
VALUES ('HikingBoy123@gmail.com', 'TheHiker', '6042198766', 'Vancouver');
INSERT INTO AppUser (Email, Username, PhoneNum, Hometown) 
VALUES ('HikingGirl123@gmail.com', 'CuriousCat', '7782128743', 'Barcelona');
INSERT INTO AppUser (Email, Username, PhoneNum, Hometown) 
VALUES ('BigDino667@gmail.com', 'TerrifyingDino', '7781426578', 'Burnaby');
INSERT INTO AppUser (Email, Username, PhoneNum, Hometown) 
VALUES ('TypicalTaco@gmail.com', 'OutDoorEnthusiast', '6049871111', 'Coquitlam');
INSERT INTO AppUser (Email, Username, PhoneNum, Hometown) 
VALUES ('PinkFuzzBear98@gmail.com', 'TheTraveler', '6048982351', 'Vancouver');


-- Explores
INSERT INTO Explores (TrailID, Username, ExploreDate) VALUES (201, 'TheHiker', '2024-08-01');
INSERT INTO Explores (TrailID, Username, ExploreDate) VALUES (202, 'CuriousCat', '2025-03-03');
INSERT INTO Explores (TrailID, Username, ExploreDate) VALUES (203, 'TerrifyingDino', '2024-12-01');
INSERT INTO Explores (TrailID, Username, ExploreDate) VALUES (204, 'OutDoorEnthusiast', '2024-09-30');
INSERT INTO Explores (TrailID, Username, ExploreDate) VALUES (205, 'TheTraveler', '2025-01-01');

-- Writes_TrailReview_On
INSERT INTO Writes_TrailReview_On (ReviewID, TrailID, Rating, ReviewDate, Comments, Username) 
VALUES (1, 201, 10, '2024-08-02', 'Such a great adventure!', 'TheHiker');
INSERT INTO Writes_TrailReview_On (ReviewID, TrailID, Rating, ReviewDate, Comments, Username) 
VALUES (2, 202, 1, '2025-03-07', 'Terrible! It was way too cold', 'CuriousCat');
INSERT INTO Writes_TrailReview_On (ReviewID, TrailID, Rating, ReviewDate, Comments, Username) 
VALUES (3, 203, 7, '2024-12-02', 'Not too bad!', 'TerrifyingDino');
INSERT INTO Writes_TrailReview_On (ReviewID, TrailID, Rating, ReviewDate, Comments, Username) 
VALUES (4, 204, 2, '2024-09-30', 'This was way too hard!', 'OutDoorEnthusiast');
INSERT INTO Writes_TrailReview_On (ReviewID, TrailID, Rating, ReviewDate, Comments, Username) 
VALUES (5, 205, 10, '2025-01-01', 'A very fun adventure, would recommend!', 'TheTraveler');

-- Owns_Equipment_1
INSERT INTO Owns_Equipment_1 (Type, Condition, Price) VALUES ('Mountain Bike', 'Good', 25.50);
INSERT INTO Owns_Equipment_1 (Type, Condition, Price) VALUES ('Snowboard', 'Excellent', 40.00);
INSERT INTO Owns_Equipment_1 (Type, Condition, Price) VALUES ('Hiking Poles', 'Fair', 15.75);
INSERT INTO Owns_Equipment_1 (Type, Condition, Price) VALUES ('Ski Set', 'Like New', 50.00);
INSERT INTO Owns_Equipment_1 (Type, Condition, Price) VALUES ('Camping Tent', 'Used', 35.00);

-- Has_RentalShop
INSERT INTO Has_RentalShop (FacilityID, RegionID, Location, OpenTime, CloseTime) 
VALUES (301, 123456, 'Vancouver Downtown', '08:00:00', '18:00:00');
INSERT INTO Has_RentalShop (FacilityID, RegionID, Location, OpenTime, CloseTime) 
VALUES (302, 654321, 'Burnaby Mountain', '09:00:00', '19:00:00');
INSERT INTO Has_RentalShop (FacilityID, RegionID, Location, OpenTime, CloseTime) 
VALUES (303, 921876, 'Surrey Central', '07:30:00', '17:30:00');
INSERT INTO Has_RentalShop (FacilityID, RegionID, Location, OpenTime, CloseTime) 
VALUES (304, 231593, 'Coquitlam Park', '10:00:00', '20:00:00');
INSERT INTO Has_RentalShop (FacilityID, RegionID, Location, OpenTime, CloseTime) 
VALUES (305, 421657, 'Delta Waterfront', '06:45:00', '16:45:00');

-- Owns_Equipment_2
INSERT INTO Owns_Equipment_2 (EquipmentID, Availablility, Type, Condition, FacilityID) 
VALUES (201, 5, 'Mountain Bike', 'Good', 301);
INSERT INTO Owns_Equipment_2 (EquipmentID, Availablility, Type, Condition, FacilityID) 
VALUES (202, 3, 'Snowboard', 'Excellent', 302);
INSERT INTO Owns_Equipment_2 (EquipmentID, Availablility, Type, Condition, FacilityID) 
VALUES (203, 8, 'Hiking Poles', 'Fair', 303);
INSERT INTO Owns_Equipment_2 (EquipmentID, Availablility, Type, Condition, FacilityID) 
VALUES (204, 4, 'Ski Set', 'Like New', 304);
INSERT INTO Owns_Equipment_2 (EquipmentID, Availablility, Type, Condition, FacilityID) 
VALUES (205, 2, 'Camping Tent', 'Used', 305);

-- Leads_Group
INSERT INTO Leads_Group (GroupID, Username, Experience) VALUES (987, 'TheHiker', 'Intermediate');
INSERT INTO Leads_Group (GroupID, Username, Experience) VALUES (223, 'CuriousCat', 'Expert');
INSERT INTO Leads_Group (GroupID, Username, Experience) VALUES (198, 'TerrifyingDino', 'Beginner');
INSERT INTO Leads_Group (GroupID, Username, Experience) VALUES (822, 'OutDoorEnthusiast', 'Advanced');
INSERT INTO Leads_Group (GroupID, Username, Experience) VALUES (342, 'TheTraveler', 'Intermediate');

-- PartOf
INSERT INTO PartOf (Username, GroupID) VALUES ('TheHiker', 987);
INSERT INTO PartOf (Username, GroupID) VALUES ('CuriousCat', 223);
INSERT INTO PartOf (Username, GroupID) VALUES ('TerrifyingDino', 198);
INSERT INTO PartOf (Username, GroupID) VALUES ('OutDoorEnthusiast', 822);
INSERT INTO PartOf (Username, GroupID) VALUES ('TheTraveler', 342);

-- Has_Parking
INSERT INTO Has_Parking (FacilityID, RegionID, OpenTime, CloseTime, Capacity, Fee) 
VALUES (301, 123456, '06:00:00', '22:00:00', 50, 5.00);
INSERT INTO Has_Parking (FacilityID, RegionID, OpenTime, CloseTime, Capacity, Fee) 
VALUES (302, 654321, '05:30:00', '23:00:00', 100, 7.50);
INSERT INTO Has_Parking (FacilityID, RegionID, OpenTime, CloseTime, Capacity, Fee) 
VALUES (303, 921876, '07:00:00', '21:00:00', 30, 3.00);
INSERT INTO Has_Parking (FacilityID, RegionID, OpenTime, CloseTime, Capacity, Fee) 
VALUES (304, 231593, '08:00:00', '20:00:00', 75, 6.00);
INSERT INTO Has_Parking (FacilityID, RegionID, OpenTime, CloseTime, Capacity, Fee) 
VALUES (305, 421657, '06:30:00', '22:30:00', 60, 4.50);

-- Has_Restroom
INSERT INTO Has_Restroom (FacilityID, RegionID, OpenTime, CloseTime, Condition) 
VALUES (301, 123456, '06:00:00', '22:00:00', 'Clean');
INSERT INTO Has_Restroom (FacilityID, RegionID, OpenTime, CloseTime, Condition) 
VALUES (302, 654321, '05:30:00', '23:00:00', 'Well-Maintained');
INSERT INTO Has_Restroom (FacilityID, RegionID, OpenTime, CloseTime, Condition) 
VALUES (303, 921876, '07:00:00', '21:00:00', 'Needs Repair');
INSERT INTO Has_Restroom (FacilityID, RegionID, OpenTime, CloseTime, Condition) 
VALUES (304, 231593, '08:00:00', '20:00:00', 'Average');
INSERT INTO Has_Restroom (FacilityID, RegionID, OpenTime, CloseTime, Condition) 
VALUES (305, 421657, '06:30:00', '22:30:00', 'Excellent');


SELECT * FROM Region;
SELECT * FROM PartOf_Route_1;
SELECT * FROM PartOf_Route_2;
SELECT * FROM LocatedIn_Trail_1;
SELECT * FROM LocatedIn_Trail_2;
SELECT * FROM Includes;
SELECT * FROM AppUser;
SELECT * FROM Explores;
SELECT * FROM Writes_TrailReview_On;
SELECT * FROM Owns_Equipment_1;
SELECT * FROM Has_RentalShop;
SELECT * FROM Owns_Equipment_2;
SELECT * FROM Leads_Group;
SELECT * FROM PartOf;
SELECT * FROM Has_Parking;
SELECT * FROM Has_Restroom;
