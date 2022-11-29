import { SITE_NAME } from "../configs.js";

async function getDashboard(req, res) {
    res.render("dashboard", {serverMessage: req.query, site: SITE_NAME});
}

async function getProfile(req, res) {
    res.render("profile", {serverMessage: req.query, site: SITE_NAME});
}

export default {
    getDashboard,
    getProfile
}

