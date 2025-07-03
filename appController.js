const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.get('/trail', async (req, res) => {
    const tableContent = await appService.fetchTrail();
    res.json({ data: tableContent });
});

router.post("/initiate-trail", async (req, res) => {
    const initiateResult = await appService.initiateTrail();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-trail", async (req, res) => {
    const { trailId, regionId, name, length, sport, terrain, start, end } = req.body;
    const insertResult = await appService.insertTrail(trailId, regionId, name, length, sport, terrain, start, end);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-trail", async (req, res) => {
    const { trailId, regionId, name, length, sport, terrain, start, end } = req.body;
    const updateResult = await appService.updateTrail(trailId, regionId, name, length, sport, terrain, start, end);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-trail", async (req, res) => {
    const { trailId } = req.body;
    const deleteResult = await appService.deleteTrail(trailId);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-user", async (req, res) => {
    const initiateResult = await appService.initiateUser();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post("/create-user", async (req, res) => {
    const { username, email, phoneNum, hometown } = req.body;
    const insertResult = await appService.createUser(username, email, phoneNum, hometown);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post("/initiate-group", async (req, res) => {
    const initiateResult = await appService.initiateGroup();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post("/create-group", async (req, res) => {
    const { groupID, username, experience } = req.body;
    const insertResult = await appService.createGroup(groupID, username, experience);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})


router.get('/largest-group', async (req, res) => {
    const tableContent = await appService.fetchLargestGroup();
    res.json({ data: tableContent });
});

router.get('/professional-group', async (req, res) => {
    const tableContent = await appService.fetchProfessionalGroup();
    res.json({ data: tableContent });
});


// SELECT with AND/OR
router.post("/trail-select", async (req, res) => {
    const { conditions } = req.body;
    try {
        const { rows, metaData } = await appService.selectTrail(conditions);
        res.json({ success: true, data: rows, meta: metaData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2) PROJECTION
router.post("/trail-project", async (req, res) => {
    const { columns } = req.body;
    try {
        const { rows, metaData } = await appService.projectTrail(columns);
        res.json({ success: true, data: rows, meta: metaData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/initiate-region", async (req, res) => {
    const initiateResult = await appService.initiateRegion();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-region", async (req, res) => {
    const { regionId, terrain, city, phone } = req.body;
    const insertResult = await appService.insertRegion(regionId, terrain, city, phone);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/region', async (req, res) => {
    const tableContent = await appService.fetchRegion();
    res.json({ data: tableContent });
});

router.get('/join', async (req, res) => {
    const tableContent = await appService.fetchRegionJoin();
    res.json({ data: tableContent });
});

router.get('/user-groups', async (req, res) => {
    const tableContent = await appService.fetchUserGroups();
    res.json({ data: tableContent });
});

router.post("/add-user", async (req, res) => {
    const { groupID, username } = req.body;
    const addResult = await appService.addUser(groupID, username);
    if (addResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})
router.get('/division-regions-all-sports', async (req, res) => {
    try {
      const { rows, metaData } = await appService.getRegionsWithAllSports();
      res.json({ success: true, data: rows, meta: metaData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

module.exports = router;