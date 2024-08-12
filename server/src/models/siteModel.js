const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.findSiteByApiKey = async (param) => { 
        const selectedSite = await prisma.um_site.findUnique({
          where: {
            siteApiKey : param,
          },
        });
        return selectedSite;
}

module.exports.getAllsitesForSiteAdmin = async (data) => {
    const { user_id } = data;
    const rolePermissionId = await prisma.um_role_permission.findMany({
        where: {
            role_id: 2,
        },
        select: {
            role_permission_id: true,
        },
    });

    if (!rolePermissionId || rolePermissionId.length === 0) {
        return null;
    }

    const rolePermissionIds = rolePermissionId.map(rolePermission => rolePermission.role_permission_id);
    const siteIds = await prisma.um_user_site_role_permission.findMany({
        where: {
            user_id: user_id,
            role_permission_id: {
                in: rolePermissionIds,
            },
        },
        select: {
            site_id: true,
        },
    });

    if (!siteIds || siteIds.length === 0) {
        return null;
    }

    const siteDetails = await prisma.um_site.findMany({
        where: {
            site_id: {
                in: siteIds,
            },
        },
    });

    if (!siteDetails || siteDetails.length === 0) {
        return null;        
    }

    return siteDetails;
}

module.exports.createSite = async (data) => {
    const { site_name, site_url, site_description, site_api_key, site_admin_user_id } = data;

    try {
        const site = await prisma.um_site.create({
            data: {
                site_name: site_name,
                site_url: site_url,
                site_description: site_description,
                site_api_key: site_api_key,
                user_id: site_admin_user_id,
            },
        });
        console.log('Site created:', site); 
        return site; 
    } catch (error) {
        console.error('Error creating site:', error);
        throw new Error('Failed to create site'); 
    }
}
