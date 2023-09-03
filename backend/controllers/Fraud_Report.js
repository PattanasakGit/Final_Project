const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;
const { insertData, getData, updateData, deleteData, getDataById, getNextDataId } = require('../database/Database.js');
var str_collection = "FRAUD_REPORT";

function formatDate(date) {
    const formattedDate = moment(date).utcOffset('+07:00').format('YYYY/MM/DD HH:mm:ss');
    return formattedDate;
}

const FRAUD_REPORTSchema = new Schema({
    ID: { type: Number, required: true, unique: true },
    TITLE: { type: String },
    INFORMATION: { type: String },
    IMG_FRAUD_REPORT: { type: String },
    SELLER: { type: String },
    EMAIL_REPORTER: { type: String },
}, { versionKey: false });

const DataModel = mongoose.model(str_collection, FRAUD_REPORTSchema);

async function addFRAUD_REPORT(req, res) {
    try {
        const FRAUD_REPORT = req.body;
        FRAUD_REPORT.ID = await getNextDataId(DataModel);

        await insertData(FRAUD_REPORT, DataModel);

        console.log('FRAUD_REPORT added successfully');
        res.status(200).json({ status: true, message: 'FRAUD_REPORT added successfully' });
    } catch (error) {
        console.error('Failed to insert FRAUD_REPORT:', error);
        res.status(500).json({ error: error.message });
    }
}

async function listFRAUD_REPORT(req, res) {
    try {
        const data = await getData(DataModel);
        res.status(200).json(data);
    } catch (error) {
        console.error('Failed to retrieve FRAUD_REPORTS:', error);
        res.status(500).json({ error: error.message });
    }
}

async function updateFRAUD_REPORT(req, res) {
    try {
        const { id } = req.params;
        const newData = req.body;

        await updateData(id, newData, DataModel);

        console.log('FRAUD_REPORT updated successfully');
        res.status(200).json({ status: true, message: 'FRAUD_REPORT updated successfully' });
    } catch (error) {
        console.error('Failed to update FRAUD_REPORT:', error);
        res.status(500).json({ error: error.message });
    }
}

async function deleteFRAUD_REPORT(req, res) {
    try {
        const { id } = req.params;

        await deleteData(id, DataModel);

        console.log('FRAUD_REPORT deleted successfully');
        res.status(200).json({ status: true, message: 'FRAUD_REPORT deleted successfully' });
    } catch (error) {
        console.error('Failed to delete FRAUD_REPORT:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getFRAUD_REPORT_Id(req, res) {
    try {
        const { id } = req.params;

        const FRAUD_REPORT = await getDataById(id, DataModel);
        if (!FRAUD_REPORT) {
            return res.status(404).json({ error: 'FRAUD_REPORT not found ' });
        }

        res.status(200).json(FRAUD_REPORT);
    } catch (error) {
        console.error('Failed to retrieve FRAUD_REPORT:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addFRAUD_REPORT, listFRAUD_REPORT, updateFRAUD_REPORT, deleteFRAUD_REPORT, getFRAUD_REPORT_Id };
