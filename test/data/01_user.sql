INSERT INTO "user".user (email, password, nickname, avatar)
VALUES (
  'qiang@iuffy.com', 
  crypt('123456', gen_salt('bf', 8)), 
  'Qiang', 
  'https://avatars2.githubusercontent.com/u/3116788'
);
