const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const roleObjectAry = [
    {
        role_name : "superadmin",
        created_at : new Date().toISOString(),
        updated_at : new Date().toISOString()
    },
    {
        role_name : "site_admin",
        created_at : new Date().toISOString(),
        updated_at : new Date().toISOString()
    },
    {
        role_name : "user",
        created_at : new Date().toISOString(),
        updated_at : new Date().toISOString()
    }
]

const siteObjAry = [
    {

                site_name: "http://localhost:8082/api/users/sites/"
    },
    {

        site_name: "http://localhost:8082/api/sites/" 
    },
    {

                site_name: "http://localhost:8082/users/sites/" 
    }
]


async function initRoles() {

    for (let elem of roleObjectAry) {
        let newUser = await prisma.um_role.create({ 
            data: {
                role_id: elem.role_id,
                role_name: elem.role_name,
                created_at: new Date(elem.created_at),
                updated_at: new Date(elem.updated_at)
              }
        });
      newUser;
    }
}

async function initSites() {

    for (let elem of siteObjAry) {
        let newSite = await prisma.um_site.create({ 
            data: {
                site_id: elem.site_id,
                site_name: elem.site_name
              }
        });
      newSite;
    }
}


async function initNewSite1() {
    let newSite = await prisma.um_site.create({ 
        data: {
            site_id: 4,
            site_name: "http://localhost:5173/"
          }
    });
    newSite; 
}


async function initNewUser1() {
    let user = await prisma.um_user.create({ 
        data: {
            email : "test@gmail.com"
          }
    });
    user; 
}

async function initNewauth1() {
    let user = await prisma.um_authentication.create({ 
        data: {
            user_id: 1, 
            site_id: 1, 
            password: '$2b$10$A/kSXZvVvFW2IiraLYGHn.i/37FGzvreP28k6YKvHKRnrpb8wlkd2', 
            provider_id: 1, 
            access_token: 'some_access_token', 
            refresh_token: 'some_refresh_token', 
            email_verified_at: new Date('2024-07-18T12:34:56'), 
            two_FA_enabled_at: new Date('2024-07-18T12:34:56'),
            created_at: new Date('2024-07-18T12:34:56'),
            updated_at: new Date('2024-07-18T12:34:56')
        },
    });
    user; 
}

//initNewUser1();
//initNewauth1();

//initRoles();
//initSites();
//initNewSite1();