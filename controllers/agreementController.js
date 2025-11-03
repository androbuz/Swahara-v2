const Agreement = require('../models/Agreement');
const User = require('../models/User');

class AgreementController {
  // Show dashboard with agreements
  async showDashboard(req, res) {
    try {
      const message = req.query.message;
      const currentUser = await User.getCurrentUser(req.session.user.id);
      
      const myAgreements = await Agreement.getMyActiveAgreements(currentUser.id);
      const pendingAgreements = await Agreement.getPendingAgreements(currentUser.phone);
      const stats = await Agreement.getStats(currentUser.id, currentUser.phone);

      res.render('dashboard', {
        currentUser,
        myAgreements,
        pendingAgreements,
        stats,
        message
      });
    } catch (error) {
      console.error('Error in showDashboard:', error);
      res.status(500).render('error', { error });
    }
  }

  // Show single agreement details
  async showAgreementDetails(req, res) {
    try {
      const agreementId = req.params.agreementId;
      const agreement = await Agreement.findById(agreementId);
      
      if (!agreement) {
        return res.redirect('/dashboard');
      }

      const currentUser = await User.getCurrentUser(req.session.user.id);

      res.render('agreement-details', {
        currentUser,
        agreement
      });
    } catch (error) {
      console.error('Error in showAgreementDetails:', error);
      res.status(500).render('error', { error });
    }
  }

  // Show all agreements with a specific party
  async showPartyAgreements(req, res) {
    try {
      const partyName = req.params.partyName;
      const currentUser = await User.getCurrentUser(req.session.user.id);
      const agreements = await Agreement.getAgreementsByParty(partyName, currentUser.id);

      res.render('party-agreements', {
        currentUser,
        partyName,
        agreements
      });
    } catch (error) {
      console.error('Error in showPartyAgreements:', error);
      res.status(500).render('error', { error });
    }
  }

  // Accept agreement
  async acceptAgreement(req, res) {
    try {
      const agreementId = req.params.agreementId;
      await Agreement.accept(agreementId);
      res.redirect('/dashboard?message=Agreement accepted!');
    } catch (error) {
      console.error('Error in acceptAgreement:', error);
      res.status(500).render('error', { error });
    }
  }

  // Reject agreement
  async rejectAgreement(req, res) {
    try {
      const agreementId = req.params.agreementId;
      await Agreement.reject(agreementId);
      res.redirect('/dashboard?message=Agreement rejected');
    } catch (error) {
      console.error('Error in rejectAgreement:', error);
      res.status(500).render('error', { error });
    }
  }

  // Show create agreement form
  async showCreateForm(req, res) {
    try {
      const currentUser = await User.getCurrentUser(req.session.user.id);

      res.render('create-agreement', {
        currentUser
      });
    } catch (error) {
      console.error('Error in showCreateForm:', error);
      res.status(500).render('error', { error });
    }
  }

  // Create new agreement
  async createAgreement(req, res) {
    try {
      const { partyName, partyPhone, title, description, amount, dueDate } = req.body;
      const currentUser = await User.getCurrentUser(req.session.user.id);

      await Agreement.create({
        title,
        description,
        otherPartyName: partyName,
        otherPartyPhone: partyPhone,
        createdById: currentUser.id,
        amount,
        dueDate,
        status: 'pending'
      });

      res.redirect('/dashboard?message=Agreement created successfully!');
    } catch (error) {
      console.error('Error in createAgreement:', error);
      res.status(500).render('error', { error });
    }
  }
}

module.exports = new AgreementController();
