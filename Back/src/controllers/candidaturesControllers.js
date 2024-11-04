const Candidatures = require('../models/candidatures');

exports.getAllCandidatures = async (req, res, next) => {
    try {
        const candidatures = await Candidatures.findAll();
        res.json(candidatures);
    } catch (error) {
        next(error);
    }
}

exports.getCandidatureById = async (req, res, next) => {
    try {
        const candidature = await Candidatures.findByPk(id);
        res.json(candidature)
    } catch (error) {
        next(error);
    }
}

exports.getCreateCandidature = async (req, res, next) => {
    try {
        const candidature = await Candidatures.create(req.body);
        res.json(candidature);
    } catch (error) {
        next(error);
    }
}

exports.getUpdateCandidature = async (req, res, next) => {
    try {
        const candidature = await Candidatures.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(candidature);
    } catch (error) {
        next(error);
    }
}

exports.getDeleteCandidature = async (req, res, next) => {
    try {
        const candidature = await Candidatures.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json(candidature);
    } catch (error) {
        next(error);
    }
}

