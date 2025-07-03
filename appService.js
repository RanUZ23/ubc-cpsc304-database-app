const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function fetchTrail() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM LocatedIn_Trail_2');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateTrail() {
    return await withOracleDB(async (connection) => {
        try {
            // Drop dependent tables first
            await connection.execute(`DROP TABLE Includes CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Explores CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Writes_TrailReview_On CASCADE CONSTRAINTS`);

            // Then drop LocatedIn_Trail_2
            await connection.execute(`DROP TABLE LocatedIn_Trail_2 CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Some tables might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE LocatedIn_Trail_2 (
                TrailID INTEGER PRIMARY KEY,
                RegionID INTEGER,
                TrailName VARCHAR(30),
                Length_km INTEGER,
                Sport VARCHAR(20),
                TerrainType VARCHAR(20),
                StartLoc VARCHAR(29),
                EndLoc VARCHAR(29),
                FOREIGN KEY (RegionID) REFERENCES Region(RegionID)
            )
        `);

        return true;
    }).catch(() => {
        return false;
    });
}


async function insertTrail(trailId, regionId, name, length, sport, terrain, start, end) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO LocatedIn_Trail_2 (TrailID, RegionID, TrailName, Length_km, Sport, TerrainType, StartLoc, EndLoc) 
             VALUES (:bindTrailId, :bindRegionId, :bindName, :bindLength, :bindSport, :bindTerrain, :bindStart, :bindEnd)`,
            {
                bindTrailId: trailId,
                bindRegionId: regionId,
                bindName: name,
                bindLength: length,
                bindSport: sport,
                bindTerrain: terrain,
                bindStart: start,
                bindEnd: end
            },
            {
                autoCommit: true
            }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Error:', error);
        return false;
    });
}

async function updateTrail(trailId, regionId, name, length, sport, terrain, start, end) {
    return await withOracleDB(async (connection) => {
        const queryOn = [];
        const bindVal = { bindTrailId: trailId };
        if (name != "") {
            queryOn.push('TrailName = :bindName');
            bindVal.bindName = name;
        }
        if (regionId != "") {
            queryOn.push('RegionID = :bindRegionId');
            bindVal.bindRegionId = regionId;
        }
        if (length != "") {
            queryOn.push('Length_km = :bindLength');
            bindVal.bindLength = length;
        }
        if (sport != "") {
            queryOn.push('Sport = :bindSport');
            bindVal.bindSport = sport;
        }
        if (terrain != "") {
            queryOn.push('TerrainType = :bindTerrain');
            bindVal.bindTerrain = terrain;
        }
        if (start != "") {
            queryOn.push('StartLoc = :bindStart');
            bindVal.bindStart = start;
        }
        if (end != "") {
            queryOn.push('EndLoc = :bindEnd');
            bindVal.bindEnd = end;
        }
        const result = await connection.execute(
            `UPDATE LocatedIn_Trail_2
            SET ${queryOn.join(', ')}
            WHERE TrailID = :bindTrailId`,
            bindVal,
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error(err);
        return false;
    });
}

async function deleteTrail(trailId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM LocatedIn_Trail_2 WHERE TRAILID = :bindTrailId`,
            {
                bindTrailId: trailId,
            },
            {
                autoCommit: true
            }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Error:', error);
        return false;
    });
}

async function initiateUser() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PartOf CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Leads_Group CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE AppUser CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('One or more tables might not exist, proceeding to create...');
        }

        await connection.execute(`
            CREATE TABLE AppUser (
                Email VARCHAR(254) NOT NULL UNIQUE,
                Username VARCHAR(25),
                PhoneNum VARCHAR(13) NOT NULL UNIQUE,
                Hometown VARCHAR(30),
                PRIMARY KEY (Username)
            )
        `);

        return true;
    }).catch((error) => {
        console.error('Error:', error);
        return false;
    });
}


async function createUser(username, email, phoneNum, hometown) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO AppUser (Email, Username, PhoneNum, Hometown)
             VALUES (:bindEmail, :bindUsername, :bindPhoneNum, :bindHometown)`,
            {
                bindEmail: { val: email },
                bindUsername: { val: username },
                bindPhoneNum: { val: phoneNum },
                bindHometown: { val: hometown }
            },
            {
                autoCommit: true
            }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Error:', error);
        return false;
    });
}

async function initiateGroup() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PartOf`);
        } catch (err) {
            console.log('PartOf might not exist.');
        }
        try {
            await connection.execute(`DROP TABLE Leads_Group`);
        } catch (err) {
            console.log('Leads_Group might not exist.');
        }

        await connection.execute(`
            CREATE TABLE Leads_Group (
                GroupID INTEGER PRIMARY KEY,
                Username VARCHAR(25) NOT NULL,
                Experience VARCHAR(20),
                FOREIGN KEY (Username) REFERENCES AppUser(Username)
            )
        `);

        await connection.execute(`
            CREATE TABLE PartOf (
                Username VARCHAR(25),
                GroupID INTEGER,
                PRIMARY KEY (Username, GroupID),
                FOREIGN KEY (Username) REFERENCES AppUser(Username) ON DELETE CASCADE,
                FOREIGN KEY (GroupID) REFERENCES Leads_Group(GroupID) ON DELETE CASCADE
            )
        `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function createGroup(groupID, username, experience) {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(
                `INSERT INTO Leads_Group (GroupID, Username, Experience)
           VALUES (:bindGroupID, :bindUsername, :bindExperience)`,
                {
                    bindGroupID: { val: groupID },
                    bindUsername: { val: username },
                    bindExperience: { val: experience }
                }
            );

            await connection.execute(
                `INSERT INTO PartOf (Username, GroupID)
           VALUES (:bindUsername, :bindGroupID)`,
                {
                    bindUsername: { val: username },
                    bindGroupID: { val: groupID }
                },
                {
                    autoCommit: true
                }
            );

            return true;

        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    });
}

async function fetchLargestGroup() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT g.GroupID, g.Username AS Leader, g.Experience, COUNT(p.Username)
            FROM Leads_Group g, PartOf p
            WHERE g.GroupID = p.GroupID
            GROUP BY g.GroupID, g.Username, g.Experience
            HAVING COUNT(p.Username) = (
                SELECT MAX(Users)
                FROM (
                    SELECT COUNT(*) AS Users
                    FROM PartOf
                    GROUP BY GroupID
                )
            )
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchProfessionalGroup() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT g.GroupID, g.Username AS Leader, g.Experience, COUNT(p.Username)
            FROM Leads_Group g, PartOf p
            WHERE g.GroupID = p.GroupID
            AND g.Experience LIKE '%pro%'
            GROUP BY g.GroupID, g.Username, g.Experience
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Selection with multiple conditions
async function selectTrail(conditions) {
    return await withOracleDB(async (connection) => {
        let whereClauses = [];
        let binds = {};

        if (!conditions || conditions.length === 0) {
            const result = await connection.execute(`SELECT * FROM LocatedIn_Trail_2`);
            return result.rows;
        }

        conditions.forEach((cond, idx) => {
            const placeHolder = `val${idx}`;
            whereClauses.push(`${cond.column} ${cond.operator} :${placeHolder}`);
            binds[placeHolder] = cond.value;
        });

        let sqlWhere = "WHERE ";
        for (let i = 0; i < whereClauses.length; i++) {
            const cond = conditions[i];
            sqlWhere += `(${whereClauses[i]}) `;
            if (cond.connector && i < whereClauses.length - 1) {
                sqlWhere += cond.connector + " ";
            }
        }

        const query = `SELECT * FROM LocatedIn_Trail_2 ${sqlWhere}`;
        console.log("selectTrail() query = ", query);
        const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return { rows: result.rows, metaData: result.metaData };
    });
}


// Projection
async function projectTrail(columns) {
    return await withOracleDB(async (connection) => {
        if (!columns || columns.length === 0) {
            columns = ['*'];
        }
        const colStr = columns.join(', ');

        const query = `SELECT ${colStr} FROM LocatedIn_Trail_2`;
        console.log("projectTrail() query = ", query);
        const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return { rows: result.rows, metaData: result.metaData };
    });
}

async function initiateRegion() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Writes_TrailReview_On CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Explores CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Includes CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Owns_Equipment_2 CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE LocatedIn_Trail_2 CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE PartOf_Route_2 CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Has_RentalShop CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Has_Parking CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Has_Restroom CASCADE CONSTRAINTS`);
            await connection.execute(`DROP TABLE Region CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log('Some tables might not exist, proceeding to create Region...');
        }

        await connection.execute(`
            CREATE TABLE Region (
                RegionID INTEGER PRIMARY KEY,
                TerrainType VARCHAR(50),
                City VARCHAR(50),
                EmergPhone VARCHAR(13)
            )
        `);

        return true;
    }).catch(() => {
        return false;
    });
}


async function insertRegion(regionId, terrain, city, phone) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Region (RegionID, TerrainType, City, EmergPhone) 
             VALUES (:bindRegionId, :bindTerrainType, :bindCity, :bindPhone)`,
            {
                bindRegionId: regionId,
                bindTerrainType: terrain,
                bindCity: city,
                bindPhone: phone
            },
            {
                autoCommit: true
            }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Error:', error);
        return false;
    });
}

async function fetchRegion() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Region');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchRegionJoin() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.TrailName, t.Length_km, t.Sport, t.TerrainType
            FROM LocatedIn_Trail_2 t, Region r
            WHERE t.RegionID = r.RegionID
            AND r.City LIKE '%Vancouver%'`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchUserGroups() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT au.Username, au.Hometown, COUNT(p.GroupID)
            FROM AppUser au, PartOf p
            WHERE au.Username = p.Username
            GROUP BY au.Username, au.Hometown
            HAVING COUNT(p.GroupID) = (
                SELECT MAX(Groups)
                FROM (
                    SELECT COUNT(GroupID) AS Groups
                    FROM PartOf
                    GROUP BY Username
                )
            )
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function addUser(groupID, username) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PartOf (GroupID, Username)
             VALUES (:bindGroupID, :bindEmail)`,
            {
                bindGroupID: { val: groupID },
                bindEmail: { val: email }
            },
            {
                autoCommit: true
            }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Error:', error);
        return false;
    });
}

async function getRegionsWithAllSports() {
    return await withOracleDB(async (connection) => {
      const query = `
        SELECT t.RegionID
        FROM LocatedIn_Trail_2 t
        GROUP BY t.RegionID
        HAVING COUNT(DISTINCT t.Sport) = (
          SELECT COUNT(DISTINCT Sport)
          FROM LocatedIn_Trail_2
        )
      `;
      const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      return { rows: result.rows, metaData: result.metaData };
    });
  }

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    fetchTrail,
    initiateTrail,
    insertTrail,
    updateTrail,
    deleteTrail,
    initiateUser,
    createUser,
    initiateGroup,
    createGroup,
    fetchLargestGroup,
    fetchProfessionalGroup,
    selectTrail,
    projectTrail,
    initiateRegion,
    insertRegion,
    fetchRegion,
    fetchRegionJoin,
    fetchUserGroups,
    addUser,
    getRegionsWithAllSports
};