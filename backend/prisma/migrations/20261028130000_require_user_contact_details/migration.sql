ALTER TABLE "users" ADD COLUMN "hometown" VARCHAR(100);

UPDATE "users"
SET
    "name" = COALESCE(NULLIF(BTRIM("name"), ''), 'User'),
    "surname" = COALESCE(NULLIF(BTRIM("surname"), ''), 'Unknown'),
    "mobilePhone" = COALESCE(NULLIF(BTRIM("mobilePhone"), ''), '+48 000 000 000'),
    "hometown" = COALESCE(NULLIF(BTRIM("hometown"), ''), 'Unknown');

ALTER TABLE "users"
    ALTER COLUMN "name" SET NOT NULL,
    ALTER COLUMN "surname" SET NOT NULL,
    ALTER COLUMN "mobilePhone" SET NOT NULL,
    ALTER COLUMN "hometown" SET NOT NULL;
