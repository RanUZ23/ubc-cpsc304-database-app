CREATE TABLE Region_1(
  City VARCHAR(50) PRIMARY KEY,
  EmergPhone VARCHAR(13)
);

CREATE TABLE Region_2(
  RegionID INTEGER PRIMARY KEY,
  TerrainType VARCHAR(50),
  City VARCHAR(50),
  FOREIGN KEY (City)
    REFERENCES Region_1(City)
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
    REFERENCES Region_2(RegionID),
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
  Length_km DECIMAL(6,3),
  TerrainType VARCHAR(20),
  StartLoc VARCHAR(29),
  EndLoc VARCHAR(29),
  FOREIGN KEY (RegionID)
    REFERENCES Region_2(RegionID),
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

CREATE TABLE [User](
  Email VARCHAR(254),
  Username VARCHAR(25) NOT NULL UNIQUE,
  PhoneNum VARCHAR(13) NOT NULL UNIQUE,
  Hometown VARCHAR(30),
  PRIMARY KEY (Email)
);

CREATE TABLE Explores(
  TrailID INTEGER,
  Email VARCHAR(254),
  ExploreDate DATE,
  PRIMARY KEY (TrailID, Email),
  FOREIGN KEY (TrailID)
    REFERENCES LocatedIn_Trail_2(TrailID)
    ON DELETE CASCADE,
  FOREIGN KEY (Email)
    REFERENCES [User](Email)
    ON DELETE CASCADE
);

CREATE TABLE Writes_TrailReview_On(
  ReviewID INTEGER,
  TrailID INTEGER,
  Rating INTEGER,
  ReviewDate DATE,
  Comments VARCHAR(300),
  Email VARCHAR(254),
  PRIMARY KEY (ReviewID, TrailID),
  FOREIGN KEY (TrailID)
    REFERENCES LocatedIn_Trail_2(TrailID)
    ON DELETE CASCADE,
  FOREIGN KEY (Email)
    REFERENCES [User](Email)
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
  OpenTime TIME,
  CloseTime TIME,
  FOREIGN KEY (RegionID)
	REFERENCES Region_2(RegionID)
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
  Email VARCHAR(254) NOT NULL,
  Size INTEGER,
  Experience VARCHAR(20),
  FOREIGN KEY (Email)
  	REFERENCES [User](Email)
);

CREATE TABLE PartOf(
  Email VARCHAR(254),
  GroupID INTEGER,
  PRIMARY KEY (Email, GroupID),
  FOREIGN KEY (Email)
    REFERENCES [User](Email)
    ON DELETE CASCADE,
  FOREIGN KEY (GroupID)
	REFERENCES Leads_Group(GroupID)
    ON DELETE CASCADE
);

CREATE TABLE Has_Parking(
  FacilityID INTEGER PRIMARY KEY,
  RegionID INTEGER NOT NULL,
  OpenTime TIME,
  CloseTime TIME,
  Capacity INTEGER,
  Fee REAL,
  FOREIGN KEY (RegionID)
	REFERENCES Region_2(RegionID)
    ON DELETE CASCADE
);

CREATE TABLE Has_Restroom(
  FacilityID INTEGER PRIMARY KEY,
  RegionID INTEGER NOT NULL,
  OpenTime TIME,
  CloseTime TIME,
  Condition VARCHAR(20),
  FOREIGN KEY (RegionID)
	REFERENCES Region_2(RegionID)
    ON DELETE CASCADE
);

INSERT INTO Region_1 (City, EmergPhone) VALUES 
('Vancouver', '6041231234'), 
('Burnaby', '6042521245'), 
('Surrey', '6049728321'), 
('Coquitlam', '7789012322'), 
('Delta', '6045521829');

INSERT INTO Region_2 (RegionID, TerrainType, City) VALUES 
(123456, 'Rocky', 'Vancouver'), 
(654321, 'Forest', 'Burnaby'), 
(921876, 'Tundra', 'Surrey'), 
(231593, 'Rocky', 'Coquitlam'), 
(421657, 'Coastal', 'Delta');

INSERT INTO PartOf_Route_1 (Length_km, Difficulty, EstTime) VALUES
(2.5, 'Easy', 30),
(5.0, 'Moderate', 75),
(5.0, 'Hard', 150),
(12.7, 'Very Hard', 220),
(15.0, 'Extreme', 300);

INSERT INTO PartOf_Route_2 (RouteID, RegionID, Length_km, Difficulty) VALUES
(101, 123456, 2.5, 'Easy'),
(102, 654321, 5.0, 'Moderate'),
(103, 921876, 5.0, 'Hard'),
(104, 231593, 12.7, 'Very Hard'),
(105, 421657, 15.0, 'Extreme');

INSERT INTO LocatedIn_Trail_1(TerrainType, Sport) VALUES
('Mountain Pass', 'Ski'),
('Snowy', 'Snowboard'),
('Canyon', 'Hike'),
('Forest', 'Hike'), 
('Rocky', 'Mountain Bike');

INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, TerrainType, StartLoc, EndLoc) VALUES
(201, 123456, 'Mountain Mayhem', 5.2, 'Mountain Pass', '49.1234,-122.5678', '49.2234,-122.6789'),
(202, 654321, 'Frozen Peak Run', 7.8, 'Snowy', '50.3456,-121.2345', '50.4567,-121.3456'),
(203, 921876, 'Crazy Canyon Trail', 10.5, 'Canyon', '48.9876,-120.4567', '48.8765,-120.5678'),
(204, 231593, 'Deep Forest Fun', 6.3, 'Forest', '47.7654,-119.3456', '47.6543,-119.2345'),
(205, 421657, 'Rocky Rush', 8.0, 'Rocky', '46.5432,-118.1234', '46.4321,-118.0123');

INSERT INTO Includes (RouteID, TrailID) VALUES
(101, 201),
(102, 202),
(103, 203),
(104, 204),
(105, 205);

INSERT INTO [User] (Email, Username, PhoneNum, Hometown) VALUES
('HikingBoy123@gmail.com', 'TheHiker', '6042198766', 'Vancouver'),
('HikingGirl123@gmail.com', 'CuriousCat', '7782128743', 'Barcelona'),
('BigDino667@gmail.com', 'TerrifyingDino', '7781426578', 'Burnaby'),
('TypicalTaco@gmail.com', 'OutDoorEnthusiast', '6049871111', 'Coquitlam'),
('PinkFuzzBear98@gmail.com', 'TheTraveler', '6048982351', 'Vancouver');

INSERT INTO Explores (TrailID, Email, ExploreDate) VALUES
(201, 'HikingBoy123@gmail.com', '2024-08-01'),
(202, 'HikingGirl123@gmail.com', '2025-03-03'),
(203, 'BigDino667@gmail.com', '2024-12-01'),
(204, 'TypicalTaco@gmail.com', '2024-09-30'),
(205, 'PinkFuzzBear98@gmail.com', '2025-01-01');

INSERT INTO Writes_TrailReview_On (ReviewID, TrailID, Rating, ReviewDate, Comments, Email) VALUES
(1, 201, 10, '2024-08-02', 'Such a great adventure!', 'Hikingboy123@gmail.com'),
(2, 202, 1, '2025-03-07', 'Terrible! It was way too cold', 'HikingGirl123@gmail.com'),
(3, 203, 7, '2024-12-02', 'Not too bad!', 'BigDino667@gmail.com'),
(4, 204, 2, '2024-09-30', 'This was way too hard!', 'TypicalTaco@gmail.com'),
(5, 205, 10, '2025-01-01', 'A very fun adventure, would recommend!', 'PinkFuzzBear98@gmail.com');

INSERT INTO Owns_Equipment_1 (Type, Condition, Price) VALUES
('Mountain Bike', 'Good', 25.50),
('Snowboard', 'Excellent', 40.00),
('Hiking Poles', 'Fair', 15.75),
('Ski Set', 'Like New', 50.00),
('Camping Tent', 'Used', 35.00);

INSERT INTO Has_RentalShop (FacilityID, RegionID, Location, OpenTime, CloseTime) VALUES
(301, 123456, 'Vancouver Downtown', '08:00:00', '18:00:00'),
(302, 654321, 'Burnaby Mountain', '09:00:00', '19:00:00'),
(303, 921876, 'Surrey Central', '07:30:00', '17:30:00'),
(304, 231593, 'Coquitlam Park', '10:00:00', '20:00:00'),
(305, 421657, 'Delta Waterfront', '06:45:00', '16:45:00');

INSERT INTO Owns_Equipment_2 (EquipmentID, Availablility, Type, Condition, FacilityID) VALUES
(201, 5, 'Mountain Bike', 'Good', 301),
(202, 3, 'Snowboard', 'Excellent', 302),
(203, 8, 'Hiking Poles', 'Fair', 303),
(204, 4, 'Ski Set', 'Like New', 304),
(205, 2, 'Camping Tent', 'Used', 305);

INSERT INTO Leads_Group (GroupID, Email, Size, Experience) VALUES
(987, 'HikingBoy123@gmail.com', 5, 'Intermediate'),
(223, 'HikingGirl123@gmail.com', 8, 'Expert'),
(198, 'BigDino667@gmail.com', 4, 'Beginner'),
(822, 'TypicalTaco@gmail.com', 6, 'Advanced'),
(342, 'PinkFuzzBear98@gmail.com', 3, 'Intermediate');

INSERT INTO PartOf (Email, GroupID) VALUES
('HikingBoy123@gmail.com', 987),
('HikingGirl123@gmail.com', 223),
('BigDino667@gmail.com', 198),
('TypicalTaco@gmail.com', 822),
('PinkFuzzBear98@gmail.com', 342);

INSERT INTO Has_Parking (FacilityID, RegionID, OpenTime, CloseTime, Capacity, Fee) VALUES
(301, 123456, '06:00:00', '22:00:00', 50, 5.00),
(302, 654321, '05:30:00', '23:00:00', 100, 7.50),
(303, 921876, '07:00:00', '21:00:00', 30, 3.00),
(304, 231593, '08:00:00', '20:00:00', 75, 6.00),
(305, 421657, '06:30:00', '22:30:00', 60, 4.50);

INSERT INTO Has_Restroom (FacilityID, RegionID, OpenTime, CloseTime, Condition) VALUES
(301, 123456, '06:00:00', '22:00:00', 'Clean'),
(302, 654321, '05:30:00', '23:00:00', 'Well-Maintained'),
(303, 921876, '07:00:00', '21:00:00', 'Needs Repair'),
(304, 231593, '08:00:00', '20:00:00', 'Average'),
(305, 421657, '06:30:00', '22:30:00', 'Excellent');

SELECT * FROM Region_1;
SELECT * FROM Region_2;
SELECT * FROM PartOf_Route_1;
SELECT * FROM PartOf_Route_2;
SELECT * FROM LocatedIn_Trail_1
SELECT * FROM LocatedIn_Trail_2
SELECT * FROM Includes
SELECT * FROM [User]
SELECT * FROM Explores
SELECT * FROM Writes_TrailReview_On
SELECT * FROM Owns_Equipment_1
SELECT * FROM Has_RentalShop
SELECT * FROM Owns_Equipment_2
SELECT * FROM Leads_Group
SELECT * FROM PartOf
SELECT * FROM Has_Parking
SELECT * FROM Has_Restroom