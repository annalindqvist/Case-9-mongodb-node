import { SITE_NAME } from "../configs.js";

async function getDashboard(req, res) {
    res.render("dashboard", {serverMessage: req.query, site: SITE_NAME});
}

export default {
    getDashboard
}

