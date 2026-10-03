-- ZeroWaste Meals — claim pickup start tracking
--
-- Adds the timestamp an NGO records when it marks a claim's pickup as under way. This backs the
-- PICKUP_STARTED notification and the "Start pickup" control on the NGO's claimed-food page.
--
-- The pickup is deliberately tracked on the claim rather than as a new DonationStatus: the listing
-- stays CLAIMED for the whole of its pickup, so every existing status filter, badge and admin
-- count keeps its current meaning. No existing table is otherwise touched and no rows are altered.
--
-- The running application uses spring.jpa.hibernate.ddl-auto=update, so Hibernate adds this column
-- automatically on first start. Run this script manually only if the database is managed outside
-- of the application (e.g. a Neon branch that is schema-pinned).

ALTER TABLE claims
    ADD COLUMN IF NOT EXISTS pickup_started_at TIMESTAMP NULL;

-- Supports the "has this pickup already started" guard without scanning the table.
CREATE INDEX IF NOT EXISTS idx_claims_pickup_started_at
    ON claims (pickup_started_at)
    WHERE pickup_started_at IS NOT NULL;
