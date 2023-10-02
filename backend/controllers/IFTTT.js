const axios = require('axios');

async function IFTTT_NewProduct(req, res) {
    try {
        const event = 'NewProduct';
        const apiKey = 'cqOUDIfBCoBgEdeaZc5stu';
        const url = `https://maker.ifttt.com/trigger/${event}/with/key/${apiKey}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error triggering IFTTT:', error);
        res.status(500).json({ error: 'Error triggering IFTTT' });
    }
};

async function IFTTT_NewUser(req, res) {
    try {
        const event = 'NewUser';
        const apiKey = 'cqOUDIfBCoBgEdeaZc5stu';
        const url = `https://maker.ifttt.com/trigger/${event}/with/key/${apiKey}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error triggering IFTTT:', error);
        res.status(500).json({ error: 'Error triggering IFTTT' });
    }
};

async function IFTTT_NewAds(req, res) {
    try {
        const event = 'Ads';
        const apiKey = 'mZNrsTsowYp3xo2kacJli0Ig0HEoMoEYhoXQi-1Ttvr';
        const url = `https://maker.ifttt.com/trigger/${event}/with/key/${apiKey}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error triggering IFTTT:', error);
        res.status(500).json({ error: 'Error triggering IFTTT' });
    }
};

async function IFTTT_NewReport(req, res) {
    try {
        const event = 'Report';
        const apiKey = 'mZNrsTsowYp3xo2kacJli0Ig0HEoMoEYhoXQi-1Ttvr';
        const url = `https://maker.ifttt.com/trigger/${event}/with/key/${apiKey}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error triggering IFTTT:', error);
        res.status(500).json({ error: 'Error triggering IFTTT' });
    }
};

module.exports = { IFTTT_NewProduct, IFTTT_NewUser, IFTTT_NewAds, IFTTT_NewReport };
