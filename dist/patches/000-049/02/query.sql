--------------------------------
-- Blog schema and tables
--------------------------------

CREATE SCHEMA "blog";

--------------------------------
-- 文章

CREATE SEQUENCE "blog".next_id_seq;

CREATE OR REPLACE FUNCTION "blog".next_id(OUT result bigint) AS $$
DECLARE
    our_epoch bigint := 1466352806721;
    seq_id bigint;
    now_millis bigint;
    shard_id int := 0;
BEGIN
    SELECT nextval('"blog".next_id_seq') % 128 INTO seq_id;
    SELECT FLOOR(EXTRACT(EPOCH FROM current_timestamp) * 1000) INTO now_millis;
    result := (now_millis - our_epoch) << 12;
    result := result | (shard_id << 7);
    result := result | (seq_id);
END;
$$ LANGUAGE PLPGSQL;

CREATE TABLE "blog".blog
(
  id bigint DEFAULT "blog".next_id() NOT NULL,
  user_id bigint NOT NULL,
  title varchar NOT NULL,
  content text,
  status int DEFAULT 1,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES "user".user (id) MATCH SIMPLE
)
WITH (
  OIDS=FALSE
);

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "blog".blog
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

--------------------------------