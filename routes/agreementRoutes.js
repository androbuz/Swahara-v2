const express = require('express');
const router = express.Router();
const agreementController = require('../controllers/agreementController');
const { requireAuth } = require('../middleware/auth');

// Dashboard
router.get('/dashboard', requireAuth, agreementController.showDashboard);

// View agreements
router.get('/agreements/party/:partyName', requireAuth, agreementController.showPartyAgreements);
router.get('/agreements/:agreementId', requireAuth, agreementController.showAgreementDetails);

// Agreement actions
router.post('/agreements/:agreementId/accept', requireAuth, agreementController.acceptAgreement);
router.post('/agreements/:agreementId/reject', requireAuth, agreementController.rejectAgreement);

// Create agreement
router.get('/create-agreement', requireAuth, agreementController.showCreateForm);
router.post('/create-agreement', requireAuth, agreementController.createAgreement);

module.exports = router;
