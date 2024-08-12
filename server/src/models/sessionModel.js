const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.insertNewSession = async (param) => {
  const newSession = await prisma.um_session.create({
    data: {
      refresh_token: param.refresh_token,
      um_user: {
        connect: {
          user_id: param.user_id,
        },
      },
      um_site: {
        connect: {
          site_id: param.site_id,
        },
      },
    },
  });

  return newSession;
};

module.exports.findSessionByToken = async (data) => {
  const { refresh_token } = data;
  console.log("refresh_token: " + refresh_token);
  const trimmedData = refresh_token.trim();
  const session = await prisma.um_session.findFirst({
    where: {
      refresh_token: trimmedData,
    },
  });
  return session;
};

module.exports.updateSessionByToken = async (data) => {
  const { refresh_token, session_id } = data;

  const session = await prisma.um_session.update({
    data: {
      refresh_token: refresh_token,
    },
    where: {
      session_id: session_id,
    },
  });
  return session;
};

module.exports.updateLogoutTimestamp = async (data) => {
  const { user_id, site_id, refresh_token, expiry_duration } = data;

  try {
    // Find the latest session with logoutAt still null
    const session = await prisma.um_session.findFirst({
      where: {
        user_id: parseInt(user_id),
        site_id: parseInt(site_id),
        refresh_token: refresh_token,
        logout_at: null,
      },
      orderBy: {
        login_at: "desc", // Order by loginAt in descending order to get the latest session
      },
      select: {
        login_at: true,
        session_id: true, // Include session_id to use in the update query
      },
    });

    if (!session) {
      throw new Error("Session not found or already logged out");
    }

    // Determine the new logoutAt value
    let logout_at;
    if (expiry_duration !== undefined) {
      // If expiry_duration is provided, calculate logoutAt based on it
      logout_at = new Date(session.login_at.getTime() + expiry_duration);
    } else {
      // Otherwise, set logoutAt to the current time
      logout_at = new Date();
    }

    // Update the logoutAt timestamp
    const updatedLogoutSession = await prisma.um_session.update({
      where: {
        session_id: session.session_id,
      },
      data: {
        logout_at: logout_at,
      },
    });

    return updatedLogoutSession;
  } catch (error) {
    console.error("Error updating logout timestamp:", error);
    throw error;
  }
};

// Do not modify this function
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}


module.exports.getSessionReport = async (refreshTokenDuration) => {
  const refreshTokenDurationInSeconds = refreshTokenDuration / 1000;
  // Fetch sessions with duration
  let sessionDuration;
  const sessions = await prisma.um_session.findMany({
    select: {
      site_id: true,
      login_at: true,
      logout_at: true,
    },
  });

  const monthlyCounts = {};
  const yearlyCounts = {};

  sessions.forEach((session) => {
    if (session.logout_at === null) {
      // If logoutAt is null, calculate duration based on the current time
      sessionDuration = (new Date() - session.login_at) / 1000; // Duration
      if (sessionDuration > refreshTokenDuration) {
        sessionDuration = refreshTokenDurationInSeconds; // Limit the duration to the refresh token duration
      }
    }else {
      sessionDuration = (session.logout_at - session.login_at) / 1000; // Duration in seconds
    }
    
    const month = session.login_at.toISOString().slice(0, 7); // 'YYYY-MM'
    const [year, monthPart] = month.split("-"); // Split into year and month
    const yearOnly = session.login_at.getFullYear().toString(); // 'YYYY'

    // Aggregate monthly counts and durations
    if (!monthlyCounts[month]) {
      monthlyCounts[month] = {
        year,
        month: monthPart,
        count: 0,
        totalDurationMinutes: 0,
      };
    }
    monthlyCounts[month].count += 1;
    monthlyCounts[month].totalDurationMinutes += Math.floor(
      sessionDuration / 60
    );

    // Aggregate yearly counts and durations
    if (!yearlyCounts[yearOnly]) {
      yearlyCounts[yearOnly] = { count: 0, totalDurationMinutes: 0 };
    }
    yearlyCounts[yearOnly].count += 1;
    yearlyCounts[yearOnly].totalDurationMinutes += Math.floor(
      sessionDuration / 60
    );
  });

  // Format the results into the desired report structure
  const formattedMonthlyReport = Object.values(monthlyCounts).map(
    ({ year, month, count, totalDurationMinutes }) => {
      const averageDurationMinutes =
        count > 0 ? totalDurationMinutes / count : 0;
      return {
        report_type: "Monthly Active Sessions",
        year,
        month,
        count,
        totalDurationMinutes,
        totalDurationFormatted: formatDuration(totalDurationMinutes * 60), // Back to seconds for formatting
        averageDurationMinutes: averageDurationMinutes.toFixed(2),
        averageDurationFormatted: formatDuration(averageDurationMinutes * 60), // Back to seconds for formatting
      };
    }
  );

  const formattedYearlyReport = Object.entries(yearlyCounts).map(
    ([year, { count, totalDurationMinutes }]) => {
      const averageDurationMinutes =
        count > 0 ? totalDurationMinutes / count : 0;
      return {
        report_type: "Yearly Active Sessions",
        year,
        count,
        totalDurationMinutes,
        totalDurationFormatted: formatDuration(totalDurationMinutes * 60), // Back to seconds for formatting
        averageDurationMinutes: averageDurationMinutes.toFixed(2),
        averageDurationFormatted: formatDuration(averageDurationMinutes * 60), // Back to seconds for formatting
      };
    }
  );

  // Sort the reports
  formattedMonthlyReport.sort((a, b) => a.year - b.year || a.month - b.month);
  formattedYearlyReport.sort((a, b) => a.year - b.year);

  // Combine the reports
  const report = [...formattedMonthlyReport, ...formattedYearlyReport];

  return report;
};
