--------------------------------
-- User schema and tables
--------------------------------

CREATE SCHEMA "user";

--------------------------------
-- 用户註冊信息

CREATE SEQUENCE "user".next_id_seq;

CREATE OR REPLACE FUNCTION "user".next_id(OUT result bigint) AS $$
DECLARE
    our_epoch bigint := 1466352806721;
    seq_id bigint;
    now_millis bigint;
    shard_id int := 0;
BEGIN
    SELECT nextval('"user".next_id_seq') % 128 INTO seq_id;
    SELECT FLOOR(EXTRACT(EPOCH FROM current_timestamp) * 1000) INTO now_millis;
    result := (now_millis - our_epoch) << 12;
    result := result | (shard_id << 7);
    result := result | (seq_id);
END;
$$ LANGUAGE PLPGSQL;

CREATE TABLE "user".user
(
  id bigint DEFAULT "user".next_id() NOT NULL,
  email varchar NOT NULL,
  password varchar NOT NULL,
  status int DEFAULT 1,
  nickname varchar,
  avatar varchar,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE UNIQUE INDEX idx_unique_user_email
  ON "user".user
  USING btree
  (lower(email::text) COLLATE pg_catalog."default");

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "user".user
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

--------------------------------
