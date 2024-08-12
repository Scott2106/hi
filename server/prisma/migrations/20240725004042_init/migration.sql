-- CreateTable
CREATE TABLE "um_authentication" (
    "auth_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "password" VARCHAR(72),
    "provider_id" INTEGER,
    "access_token" VARCHAR(550),
    "refresh_token" VARCHAR(550),
    "email_verified_at" TIMESTAMP(6),
    "two_FA_enabled_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "um_authentication_pkey" PRIMARY KEY ("auth_id")
);

-- CreateTable
CREATE TABLE "um_oauth_key" (
    "key_id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "client_secret" VARCHAR(128) NOT NULL,

    CONSTRAINT "um_oauth_key_pkey" PRIMARY KEY ("key_id")
);

-- CreateTable
CREATE TABLE "um_provider" (
    "provider_id" SERIAL NOT NULL,
    "provider_name" VARCHAR(8) NOT NULL,

    CONSTRAINT "um_provider_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "um_request" (
    "request_id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "auth_id" INTEGER NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "used" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "um_request_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "um_role" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "um_role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "um_service" (
    "service_id" SERIAL NOT NULL,
    "service_name" VARCHAR(16) NOT NULL,

    CONSTRAINT "um_service_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "um_session" (
    "session_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "login_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logout_at" TIMESTAMP(6),

    CONSTRAINT "um_session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "um_site" (
    "site_id" SERIAL NOT NULL,
    "site_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "token_expiry_time" VARCHAR(64) NOT NULL,

    CONSTRAINT "um_site_pkey" PRIMARY KEY ("site_id")
);

-- CreateTable
CREATE TABLE "um_user" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "um_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "um_user_site_role" (
    "user_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "um_user_site_role_pkey" PRIMARY KEY ("user_id","site_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "um_user_email_key" ON "um_user"("email");

-- AddForeignKey
ALTER TABLE "um_authentication" ADD CONSTRAINT "um_authentication_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "um_provider"("provider_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_authentication" ADD CONSTRAINT "um_authentication_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_authentication" ADD CONSTRAINT "um_authentication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_oauth_key" ADD CONSTRAINT "um_oauth_key_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "um_provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_oauth_key" ADD CONSTRAINT "um_oauth_key_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_request" ADD CONSTRAINT "um_request_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "um_authentication"("auth_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_request" ADD CONSTRAINT "um_request_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "um_service"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_request" ADD CONSTRAINT "um_request_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_request" ADD CONSTRAINT "um_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_session" ADD CONSTRAINT "um_session_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_session" ADD CONSTRAINT "um_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_site_role" ADD CONSTRAINT "um_user_site_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "um_role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_site_role" ADD CONSTRAINT "um_user_site_role_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "um_site"("site_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "um_user_site_role" ADD CONSTRAINT "um_user_site_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "um_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
