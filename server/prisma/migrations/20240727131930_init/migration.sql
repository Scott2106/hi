/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `um_session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "um_session_refresh_token_key" ON "um_session"("refresh_token");

-- RenameForeignKey
ALTER TABLE "um_authentication" RENAME CONSTRAINT "um_authentication_provider_id_fkey" TO "fk_provider_id";

-- RenameForeignKey
ALTER TABLE "um_authentication" RENAME CONSTRAINT "um_authentication_site_id_fkey" TO "fk_site_id";

-- RenameForeignKey
ALTER TABLE "um_authentication" RENAME CONSTRAINT "um_authentication_user_id_fkey" TO "fk_user_id";

-- RenameForeignKey
ALTER TABLE "um_oauth_key" RENAME CONSTRAINT "um_oauth_key_provider_id_fkey" TO "fk_provider_id";

-- RenameForeignKey
ALTER TABLE "um_oauth_key" RENAME CONSTRAINT "um_oauth_key_site_id_fkey" TO "fk_site_id";

-- RenameForeignKey
ALTER TABLE "um_request" RENAME CONSTRAINT "um_request_auth_id_fkey" TO "fk_auth_id";

-- RenameForeignKey
ALTER TABLE "um_request" RENAME CONSTRAINT "um_request_service_id_fkey" TO "fk_service_id";

-- RenameForeignKey
ALTER TABLE "um_request" RENAME CONSTRAINT "um_request_site_id_fkey" TO "fk_site_id";
