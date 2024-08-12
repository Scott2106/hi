const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

const constructTokenURL = (provider_name) => {
  const tokenEndpoints = {
    Github: {
      url: `https://github.com/login/oauth/access_token`,
      Content_Type: "application/json",
    },
    LinkedIn: {
      url: `https://www.linkedin.com/oauth/v2/accessToken`,
      Content_Type: "application/x-www-form-urlencoded",
    },
    Google: {
      url: `https://oauth2.googleapis.com/token`,
      Content_Type: "application/x-www-form-urlencoded",
    },
  };

  return tokenEndpoints[provider_name];
};

const constructUserURL = (provider_name) => {
  const userEndpoints = {
    Github: {
      url: "https://api.github.com/user",
      email: "https://api.github.com/user/emails",
    },
    LinkedIn: {
      url: "https://api.linkedin.com/v2/userinfo",
    },
    Google: {
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    },
  };

  return userEndpoints[provider_name];
};

module.exports.getProviderId = async (data) => {
  const { provider_name } = data;
  const provider = await prisma.um_oauth_provider.findFirst({
    where: {
      provider_name: provider_name,
    },
    select: {
      provider_id: true,
    },
  });
  return provider;
};

module.exports.readOAuthCredentials = async (data) => {
  const { site_id, provider_name } = data;
  const credentials = await prisma.um_oauth_key.findFirst({
    where: {
      um_oauth_provider: {
        provider_name,
      },
      site_id: parseInt(site_id),
    },
    select: {
      client_id: true,
      client_secret: true,
      um_oauth_provider: {
        select: {
          provider_id: true,
        },
      },
    },
  });
  return credentials;
};

module.exports.updateOAuthCredentials = async (data) => {
  const { site_id, provider_name, client_id, client_secret } = data;
  const provider = await prisma.um_oauth_provider.findFirst({
    where: {
      provider_name: provider_name,
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }
  const { provider_id } = provider;

  const updatedCredentials = await prisma.um_oauth_key.updateMany({
    data: {
      client_id: client_id,
      client_secret: client_secret,
    },
    where: {
      site_id: parseInt(site_id, 10), // Ensure proper integer parsing
      provider_id: provider_id, // Ensure correct type if needed
    },
  });
  return updatedCredentials;
};
module.exports.insertOAuthCredentials = async (data) => {
  const { site_id, provider_name, client_id, client_secret } = data;
  const provider = await prisma.um_oauth_provider.findFirst({
    where: {
      provider_name: provider_name,
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }
  const { provider_id } = provider;

  const checkCredentials = await prisma.um_oauth_key.findFirst({
    where: {
      site_id: parseInt(site_id),
      provider_id: provider_id,
    },
  });

  if (checkCredentials) {
    throw new Error("Credentials already exist. Cannot insert again.");
  }

  const newCredentials = await prisma.um_oauth_key.create({
    data: {
      site_id: parseInt(site_id),
      provider_id: provider_id,
      client_id: client_id,
      client_secret: client_secret,
    },
  });
  return newCredentials;
};

module.exports.exchangeToken = async (data) => {
  const {
    client_id,
    client_secret,
    code,
    redirect_uri,
    grant_type,
    provider_name,
  } = data;

  const { url, Content_Type } = constructTokenURL(provider_name);
  const response = await axios(url, {
    method: "POST",
    headers: {
      "Content-Type": Content_Type,
      Accept: "application/json",
    },
    data: {
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type,
    },
  });
  return response;
};

module.exports.readUserData = async (data) => {
  const { access_token, provider_name } = data;
  console.log("From the model: " + access_token);

  const { url } = constructUserURL(provider_name);
  const userData = await axios(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return userData;
};

module.exports.readUserEmail = async (data) => {
  const { access_token, provider_name } = data;

  const { email } = constructUserURL(provider_name);
  const userEmail = await axios(email, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/vnd.github+json",
    },
  });
  return userEmail;
};

module.exports.addOAuthUser = async (data) => {
  const { email, site_id, provider_id, oauthId } = data;
  const role_permission_id = 5;
  try {
    let registerEmail;
    const response = await prisma.$transaction(async () => {
      const searchUserEmail = await prisma.um_user.findFirst({
        where: {
          email,
        },
        select: {
          user_id: true,
        },
      });

      if (!searchUserEmail) {
        registerEmail = await prisma.um_user.create({
          data: {
            email,
          },
        });
        console.log("Register Email Response: ", registerEmail);
      }

      const registerUser = await prisma.um_authentication.create({
        data: {
          user_id: searchUserEmail
            ? searchUserEmail.user_id
            : registerEmail.user_id,
          site_id: parseInt(site_id),
          provider_id: parseInt(provider_id),
          oauth_sub_id: parseInt(oauthId),
        },
      });
      console.log("Register User Response: ", registerUser);

      const insertRolePermission =
        await prisma.um_user_site_role_permission.create({
          data: {
            user_id: searchUserEmail
              ? searchUserEmail.user_id
              : registerEmail.user_id,
            site_id: parseInt(site_id),
            role_permission_id,
          },
        });
      console.log("Insert Role Permission Response: ", insertRolePermission);

      return {
        authentication: registerUser,
        rolePermission: insertRolePermission,
      };
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports.getUser = async (data) => {
  const { site_id, provider_id, oauth_sub_id } = data;
  console.log("data from get user", data);
  const user = await prisma.um_authentication.findFirst({
    where: {
      site_id: parseInt(site_id),
      provider_id: parseInt(provider_id),
      oauth_sub_id: parseInt(oauth_sub_id),
    },
    select: {
      user_id: true,
    },
  });
  return user;
};

module.exports.getOAuthID = async (data) => {
  const { site_id, user_id } = data;
  const user = await prisma.um_authentication.findFirst({
    where: {
      site_id: parseInt(site_id),
      user_id: parseInt(user_id),
    },
    select: {
      oauth_sub_id: true,
    },
  });
  return user;
};

module.exports.checkSiteModificationPermissions = async (data) => {
  const { site_id, user_id } = data;

  // Check if the user has one of the following roles: Site Owner, Site Manager, or Site Administrator
  // Role IDs: 2 (Site Owner), 3 (Site Manager), 4 (Site Administrator)

  const user = await prisma.um_user_site_role_permission.findFirst({
    where: {
      site_id: parseInt(site_id),
      user_id: parseInt(user_id),
      role_permission_id: {
        in: [2, 3, 4],
      },
    },
  });

  return user;
};
