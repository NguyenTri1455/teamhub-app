import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1765611148994 implements MigrationInterface {
    name = 'InitialSchema1765611148994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "avatarUrl" varchar, "password" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('member'), "name" varchar, "isActive" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "invitation" ("email" varchar PRIMARY KEY NOT NULL, "invitedBy" varchar NOT NULL, "invitedAt" datetime NOT NULL DEFAULT (datetime('now')), "status" varchar NOT NULL DEFAULT ('pending'))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar, "eventTimestamp" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "location" varchar, "createdBy" varchar)`);
        await queryRunner.query(`CREATE TABLE "duty_rotation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "currentIndex" integer NOT NULL, "memberOrder" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "global_setting" ("key" varchar PRIMARY KEY NOT NULL, "value" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "beer_party" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "status" varchar NOT NULL DEFAULT ('active'), "endedAt" datetime, "totalCount" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "beer_party_participant" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "partyId" integer NOT NULL, "memberId" integer NOT NULL, "name" varchar NOT NULL, "avatar" varchar, "count" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "fund_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "description" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "balanceAfter" decimal(10,2) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_beer_party_participant" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "partyId" integer NOT NULL, "memberId" integer NOT NULL, "name" varchar NOT NULL, "avatar" varchar, "count" integer NOT NULL DEFAULT (0), CONSTRAINT "FK_ecce4bd7f55e65691260db28dca" FOREIGN KEY ("partyId") REFERENCES "beer_party" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_beer_party_participant"("id", "partyId", "memberId", "name", "avatar", "count") SELECT "id", "partyId", "memberId", "name", "avatar", "count" FROM "beer_party_participant"`);
        await queryRunner.query(`DROP TABLE "beer_party_participant"`);
        await queryRunner.query(`ALTER TABLE "temporary_beer_party_participant" RENAME TO "beer_party_participant"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beer_party_participant" RENAME TO "temporary_beer_party_participant"`);
        await queryRunner.query(`CREATE TABLE "beer_party_participant" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "partyId" integer NOT NULL, "memberId" integer NOT NULL, "name" varchar NOT NULL, "avatar" varchar, "count" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "beer_party_participant"("id", "partyId", "memberId", "name", "avatar", "count") SELECT "id", "partyId", "memberId", "name", "avatar", "count" FROM "temporary_beer_party_participant"`);
        await queryRunner.query(`DROP TABLE "temporary_beer_party_participant"`);
        await queryRunner.query(`DROP TABLE "fund_transaction"`);
        await queryRunner.query(`DROP TABLE "beer_party_participant"`);
        await queryRunner.query(`DROP TABLE "beer_party"`);
        await queryRunner.query(`DROP TABLE "global_setting"`);
        await queryRunner.query(`DROP TABLE "duty_rotation"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "invitation"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
