const siteModel = require("../models/siteModel");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// FROM SITE SETTING TEAM
module.exports.getSiteIdBySiteApiKey = async (req, res, next) => {
  const siteApiKey = req.headers["site-api-key"] || req.params.site_api_key;
  res.locals.site_api_key = siteApiKey;
  console.log(siteApiKey)

  console.log(res.locals.site_api_key);
  if (!siteApiKey) {
    return res.status(400).json({ error: "Site API key is required" });
  }

  try {
    const site = await prisma.um_site.findFirst({
      where: {
        site_api_key: siteApiKey,
      },
    });

    if (!site) {
      return res.status(404).json({ error: "Invalid Site API key" });
    }

    res.locals.site_id = site.site_id;
    console.log("site_id", res.locals.site_id);
    next();
  } catch (error) {
    console.error("Error retrieving site by API key:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// SITE SETTING TEAM
// Checks the site api key in the process
/* module.exports.siteServiceAvailability = async (req, res, next) => {
  try {
      const siteApiKey = req.headers['site-api-key'];
      const endpointUrl = req.url;
      const httpMethod = req.method.toUpperCase(); // eg: GET

      //const endpointUrl = "/api/report/usage"; Test
      console.log('API Key:', siteApiKey);
      console.log('Endpoint URL:', endpointUrl);
      console.log('HTTP Method:', httpMethod);

      // Check if the API key is present
      if (!siteApiKey) {
          return res.status(403).json({ message: "Missing API key in Request Header." });
      }

      // Call the function to validate the provided Site API key and check if the setting is enabled
      const result = await prisma.$queryRaw`
          CALL validate_and_check_availability(${siteApiKey}::text, ${endpointUrl}::text, ${httpMethod}::text, false)
      `;

      console.log(result);
      // [ { is_valid: true } ]
      if (result[0].is_valid) {
          // If validation is successful, get the siteId using the API key
          const site = await prisma.umSite.findFirst({
              where: { siteApiKey: siteApiKey },
              select: { siteId: true }
          });

          if (!site) {
              return res.status(403).json({ message: "Site not found for the provided API key." });
          }

          // site: {"siteId":16}
          res.locals.siteId = site.siteId; // Attach siteId to the req object
          console.log('Site ID:', res.locals.siteId);
          next();
      } else {
          res.status(403).json({ message: "Invalid request or functionality not available." });
      }
  } catch (error) {
      console.error('Error in siteServiceAvailability middleware:', error);

      if (error.code === 'P0001') {
          // Exception raised by RAISE EXCEPTION
          return res.status(403).json({ message: error.message });
      }

      res.status(500).json({ message: "Internal server error." });
    }
} */

module.exports.retrieveSiteId = async (req, res, next) => {
  //   const apiKey = req.query.api_key;
  const apiKey = req.headers["x-api-key"];

  try {
    const site = await siteModel.findSiteByApiKey(apiKey);
    const site_id = site.apiKey;

    if (site_id) {
      next();
    } else {
      return res.status(409).json({ message: "Unauthorized" });
    }
  } catch {
    res.status(404).json({ message: "Site not found" });
  }
};

module.exports.dummySiteIdRetrival = async (req, res, next) => {
  try {
    res.locals.site_id = 1;
    res.locals.email = req.body.email;
    next();
  } catch (error) {
    const errMsg = {
      errorFunction: "Error Retrieving site id",
      errorMessage: error.message,
    };
    console.log(errMsg);
    res.status(500).send(errMsg);
  }
};

module.exports.getAdminSites = async (req, res) => {
  const user_id = res.locals.user_id;
  const data = { user_id };

  try {
    const sites = await siteModel.getAllsitesForSiteAdmin(data);
    if (!sites) {
      return res.status(404).json({ message: "Sites not found" });
    } else {
      return res.status(200).json(sites);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports.crateSite = async (req, res) => {
  const {
    site_name,
    site_url,
    site_description,
    site_api_key,
    site_admin_user_id,
  } = req.body;
  const data = {
    site_name,
    site_url,
    site_description,
    site_api_key,
    site_admin_user_id,
  };
  try {
    const site = await siteModel.createSite(data);
    return res.status(200).json({ message: "Site created successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Site not created" });
  }
};
