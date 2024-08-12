const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Check if the user has verified their email
module.exports.checkEmailVerify = async (data) => {
  const { user_id, site_id } = data;

  const prismaStatement = await prisma.um_authentication.findFirst({
    where: {
      user_id: parseInt(user_id),
      site_id: parseInt(site_id),
    },
    select: {
      email_verified_at: true,
    },
  });

  return prismaStatement;
};

module.exports.insertNewAuth = async (data) => {
  const { hash, user_id, site_id } = data;
  try {
    const newUser = await prisma.um_authentication.create({
      data: {
        user_id: parseInt(user_id),
        site_id: parseInt(site_id),
        password: hash,
      },
    });

    if (!newUser) {
      return null;
    }
    return newUser;
  } catch (error) {
    console.error("Error creating user auth:", error);
    throw error;
  }
};

module.exports.getAuthRecord = async (data) => {
  const { user_id, site_id } = data;
  try {
    const user = await prisma.um_authentication.findFirst({
      where: {
        user_id: parseInt(user_id),
        site_id: parseInt(site_id),
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user auth record:", error);
    throw error;
  }
};

module.exports.updateAuthAccessToken = async (param) => {
  const user = await prisma.um_authentication.findFirst({
    where: {
      user_id: param.user_id,
      site_id: param.site_id,
    },
  });

  if (user) {
    updateUser = await prisma.um_authentication.update({
      where: {
        auth_id: user.auth_id,
      },

      data: {
        access_token: param.access_token,
      },
    });
  }

  return updateUser;
};

module.exports.updateAuthRefreshToken = async (param) => {
  const user = await prisma.um_authentication.findFirst({
    where: {
      user_id: param.user_id,
      site_id: param.site_id,
    },
  });

  if (user) {
    updateUser = await prisma.um_authentication.update({
      where: {
        auth_id: user.auth_id,
      },

      data: {
        refresh_token: param.refresh_token,
      },
    });
  }

  return updateUser;
};

module.exports.getVerificationReport = async () => {
  // Fetch records with email_verified_at and two_fa_enabled_at
  const authentications = await prisma.um_authentication.findMany({
    select: {
      email_verified_at: true,
      two_fa_enabled_at: true,
    },
  });

  const monthlyCounts = {};
  const yearlyCounts = {};

  authentications.forEach((auth) => {
    // Handle email_verified_at
    if (auth.email_verified_at) {
      const emailVerifiedMonth = auth.email_verified_at
        .toISOString()
        .slice(0, 7); // 'YYYY-MM'
      const emailVerifiedYear = auth.email_verified_at.getFullYear().toString(); // 'YYYY'

      // Aggregate monthly email verification counts
      if (!monthlyCounts[emailVerifiedMonth]) {
        monthlyCounts[emailVerifiedMonth] = {
          emailVerified: 0,
          twoFaEnabled: 0,
        };
      }
      monthlyCounts[emailVerifiedMonth].emailVerified += 1;

      // Aggregate yearly email verification counts
      if (!yearlyCounts[emailVerifiedYear]) {
        yearlyCounts[emailVerifiedYear] = { emailVerified: 0, twoFaEnabled: 0 };
      }
      yearlyCounts[emailVerifiedYear].emailVerified += 1;
    }

    // Handle two_fa_enabled_at
    if (auth.two_fa_enabled_at) {
      const twoFaEnabledMonth = auth.two_fa_enabled_at
        .toISOString()
        .slice(0, 7); // 'YYYY-MM'
      const twoFaEnabledYear = auth.two_fa_enabled_at.getFullYear().toString(); // 'YYYY'

      // Aggregate monthly two-factor authentication counts
      if (!monthlyCounts[twoFaEnabledMonth]) {
        monthlyCounts[twoFaEnabledMonth] = {
          emailVerified: 0,
          twoFaEnabled: 0,
        };
      }
      monthlyCounts[twoFaEnabledMonth].twoFaEnabled += 1;

      // Aggregate yearly two-factor authentication counts
      if (!yearlyCounts[twoFaEnabledYear]) {
        yearlyCounts[twoFaEnabledYear] = { emailVerified: 0, twoFaEnabled: 0 };
      }
      yearlyCounts[twoFaEnabledYear].twoFaEnabled += 1;
    }
  });

  // Format the results into the desired report structure
  const formattedMonthlyReport = Object.entries(monthlyCounts).map(
    ([month, { emailVerified, twoFaEnabled }]) => {
      const [year, monthPart] = month.split("-");
      return {
        report_type: "Monthly Verification and 2FA",
        year: parseInt(year),
        month: parseInt(monthPart),
        emailVerified,
        twoFaEnabled,
      };
    }
  );

  const formattedYearlyReport = Object.entries(yearlyCounts).map(
    ([year, { emailVerified, twoFaEnabled }]) => ({
      report_type: "Yearly Verification and 2FA",
      year: parseInt(year),
      emailVerified,
      twoFaEnabled,
    })
  );

  // Sort the reports
  formattedMonthlyReport.sort((a, b) => a.year - b.year || a.month - b.month);
  formattedYearlyReport.sort((a, b) => a.year - b.year);

  // Combine the reports
  const report = [...formattedMonthlyReport, ...formattedYearlyReport];

  return report;
};
