-- Insert roles into the roles table
INSERT INTO "roles" (role_id, role_name) VALUES
                                             (0, 'USER'),
                                             (1, 'ADMIN');

-- Users, hasła: Admin123!
INSERT INTO "users" (user_id, username, email, password_hash, first_name, surname, role_id, points, created_at) VALUES
                                                                                                          ('b39289b0-b88a-4f09-b8fd-38ab15071acf', 'jkowalski', 'janek.kowalski@example.com', '$2a$10$lS8vUm/10lIR3fkJHsA1feRLXkbtuk8ZcLqHzp6leNvX6i8Y9ozsS', 'Jan', 'Kowalski', 0, 10,CURRENT_TIMESTAMP),
                                                                                                          ('b3683311-a2e5-4546-b3e3-742f303b2d13', 'anowak', 'anna.nowak@example.com', '$2a$10$lS8vUm/10lIR3fkJHsA1feRLXkbtuk8ZcLqHzp6leNvX6i8Y9ozsS', 'Anna', 'Nowak', 1, 20,CURRENT_TIMESTAMP),
                                                                                                          ('46c520c6-8467-437b-9518-8126bc49cbd8', 'piotr_wisniewski', 'piotr.wisniewski@example.com', '$2a$10$lS8vUm/10lIR3fkJHsA1feRLXkbtuk8ZcLqHzp6leNvX6i8Y9ozsS', 'Piotr', 'Wiśniewski', 1, 30,CURRENT_TIMESTAMP),
                                                                                                          ('d42e011d-966c-4e16-837f-0e7f3952c039', 'katarzyna_lewandowska', 'katarzyna.lewandowska@example.com', '$2a$10$lS8vUm/10lIR3fkJHsA1feRLXkbtuk8ZcLqHzp6leNvX6i8Y9ozsS', 'Katarzyna', 'Lewandowska', 0, 40,CURRENT_TIMESTAMP),
                                                                                                          ('fc93bedd-290d-4061-8e39-4eeeb073190e', 'pawel_zielinski', 'pawel.zielinski@example.com', '$2a$10$lS8vUm/10lIR3fkJHsA1feRLXkbtuk8ZcLqHzp6leNvX6i8Y9ozsS', 'Paweł', 'Zieliński', 0, 50,CURRENT_TIMESTAMP);

-- Routes
INSERT INTO "routes" (route_id, name, description, max_time) VALUES
                                                                 ('72b49ff2-f07f-4b7b-b7ce-7a938017b983', 'Szlak Górski', 'Trasa wiodąca przez malownicze szlaki górskie.', 120),
                                                                 ('e8f7625c-2554-4a6b-9bc6-3581cc184a61', 'Wyprawa Ku Edukacji', 'Spacer przez gęste lasy pełne dzikiej przyrody.', 90),
                                                                 ('47835401-fad3-4817-bd76-3ae8c222943f', 'Zwiedzanie Miasta', 'Zwiedzanie najważniejszych zabytków miasta.', 180);

-- Places
INSERT INTO "places" (place_id, name, description, latitude, longitude, more_info_link) VALUES
                                                                            ('c9f39e58-d9bb-47c8-b032-0d01339df459', 'Zamek Królewski na Wawelu', 'Symbol potęgi i władzy polskich królów, to zamek pełen historii i niezwykłych dzieł sztuki.', 50.05346, 19.93596, 'https://pl.wikipedia.org/wiki/Wawel'),
                                                                            ('c5291a74-15e0-4a45-9030-7a87e1e06817', 'Sukiennice', 'Centrum handlowe i kulturalne Krakowa od setek lat, Sukiennice to ikona miasta.', 50.06169, 19.93735, 'https://pl.wikipedia.org/wiki/Sukiennice_w_Krakowie'),
                                                                            ('4c7576b6-4477-4c5f-9eed-b41539c9fabc', 'Kościół Mariacki', 'Jeden z najważniejszych kościołów w Polsce, z niezwykłym ołtarzem Wita Stwosza.', 50.06166, 19.93881, 'https://pl.wikipedia.org/wiki/Sukiennice_w_Krakowie'),
                                                                            ('40f24aa2-8af7-4a5f-920f-eeb1a6ac3736', 'Barbakan', 'Impresyjna średniowieczna fortyfikacja, która kiedyś broniła miasta, obecnie stanowi malowniczy element krajobrazu Krakowa.', 50.06520, 19.94150, 'https://pl.wikipedia.org/wiki/Barbakan'),
                                                                            ('f6c6ce14-c9ca-4758-90e4-a1a68f9cc803', 'Collegium Maius', 'Najstarszy budynek Uniwersytetu Jagiellońskiego powstały z zakupionej przez króla Władysława Jagiełło w 1400 r. kamienicy. Znajdują się tutaj zabytkowe kolekcje: naukowa, malarska, rzeźby różnych epok, rzemiosła artystycznego.', 50.06165, 19.93341, 'https://pl.wikipedia.org/wiki/Collegium_Maius_Uniwersytetu_Jagiello%C5%84skiego'),
                                                                            ('27b9a75f-ece8-4975-b89c-b614e312e388', 'Kopiec Kościuszki', 'Wzniesiony na Wzgórzu Kościuszki, upamiętnia bohaterstwo Tadeusza Kościuszki i jego udział w walkach o niepodległość Polski.', 50.05491, 19.89335, 'https://pl.wikipedia.org/wiki/Kopiec_Ko%C5%9Bciuszki_w_Krakowie'),
                                                                            ('8931cf12-6258-4ff9-9701-3b8e1b3ac179', 'Kopiec Piłsudskiego', 'Położony na Skałce, symbolizuje pamięć i czyny Józefa Piłsudskiego, ważnej postaci w historii Polski.', 50.06004, 19.84716, 'https://pl.wikipedia.org/wiki/Kopiec_J%C3%B3zefa_Pi%C5%82sudskiego_w_Krakowie'),
                                                                            ('77cbbf6d-4b7b-4d38-bd86-201330a50194', 'Kopiec Krakusa', 'Usytuowany na wzgórzu Lasoty, według legendy to mogiła mitycznego Kraka, założyciela Krakowa.', 50.03808, 19.95844, 'https://pl.wikipedia.org/wiki/Kopiec_Krakusa'),
                                                                            ('b1b65f65-2a7f-4da9-9826-fb5bf0991625', 'Kopiec Wandy', 'Znajduje się w Podgórzu, opowiada legendę o księżniczce Wandzie, która rzekomo popełniła samobójstwo, aby uchronić Kraków przed najeźdźcami.', 50.07022, 20.06807, 'https://pl.wikipedia.org/wiki/Kopiec_Wandy'),
                                                                            ('8d6cba81-8c39-4c8e-94b4-9fc6384df87e', 'Kopiec Jana Pawła II', 'Poświęcony jest pamięci i dziedzictwu świętego papieża Jana Pawła II, urodzonego w Wadowicach niedaleko Krakowa. Jest najmłodszym krakowskim kopcem.', 50.04425, 19.91724, 'https://pl.wikipedia.org/wiki/Kopiec_Jana_Paw%C5%82a_II_w_Krakowie');


-- Achievements
INSERT INTO "achievements" (achievement_id, name, description) VALUES
                                                                   ('e2247346-11b7-4960-aef3-90cb1ab9d0c4', 'Zdobywca Gór', 'Odwiedź wszystkie szczyty górskie na trasie.'),
                                                                   ('38ea7480-29af-4497-b93a-9019ce4e2676', 'Eksplorator Miast', 'Zwiedź wszystkie zabytki w mieście.'),
                                                                   ('c53ebf51-b535-47a0-8b18-9f28b3018a4c', 'Akademicka przygoda', 'Zobacz wszystkie główne uczelnie w Krakowie.');

-- Posts
INSERT INTO "posts" (post_id, user_id, content, created_at, updated_at) VALUES
                                                                            ('9a000f53-c75a-494b-866b-a51c8c188ff2', 'b39289b0-b88a-4f09-b8fd-38ab15071acf', 'Moja propozycja to dodanie trasy po Nowej Hucie. Tajemniczych miejsc tam nie brakuje!', '2024-07-27 10:00:00', '2024-07-27 10:00:00'),
                                                                            ('11f62f93-fe2a-4551-b81e-18044317e9d2', 'b3683311-a2e5-4546-b3e3-742f303b2d13', 'Wszystkie kopce na których byłam wyglądają cudownie!.', '2024-07-27 12:00:00', '2024-07-27 12:00:00');

-- Threads
INSERT INTO "threads" (thread_id, title, created_by, created_at, updated_at) VALUES
                                                                                 ('95ca8fa9-47f1-4c7d-8b7a-2d96225d738a', 'Propozycja dodania trasy', 'b39289b0-b88a-4f09-b8fd-38ab15071acf', '2024-07-27 08:00:00', '2024-07-27 08:00:00'),
                                                                                 ('01fae080-a036-46ae-80f1-d16316b61ad7', 'Ulubione miejsca w mieście', 'b39289b0-b88a-4f09-b8fd-38ab15071acf', '2024-07-27 09:00:00', '2024-07-27 09:00:00');

-- Leagues
INSERT INTO "leagues" (league_id, name, color) VALUES
                                                   ('b2dbd6c4-568f-4ebe-810b-802b5fb327d6', 'Złota Liga ', '#FFD700'),
                                                   ('eabf4eab-08e3-4469-bb44-5ef2ec2beb39', 'Liga Srebrna', '#C0C0C0'),
                                                   ('b2cb5e9c-d805-4a79-ac99-577fe8a94bd5', 'Liga Brązowa', '#C0C0C0');

-- Notifications
INSERT INTO "notifications" (notification_id, user_id, message, created_at) VALUES
    ('ec2f9f2a-6d26-495c-8dd6-a1702a4d81b3', 'b39289b0-b88a-4f09-b8fd-38ab15071acf', 'Zdobyłeś nowe osiągnięcie!', '2024-07-27 11:00:00');

-- Users_Achievements
INSERT INTO "users_achievements" (user_id, achievement_id, progress, achieved_at) VALUES
    ('b39289b0-b88a-4f09-b8fd-38ab15071acf', 'e2247346-11b7-4960-aef3-90cb1ab9d0c4', 100.0, '2024-07-27 11:00:00');

-- Users_Routes
INSERT INTO "users_routes" (user_id, route_id, visited_at) VALUES
    ('b39289b0-b88a-4f09-b8fd-38ab15071acf', '72b49ff2-f07f-4b7b-b7ce-7a938017b983', '2024-07-27 07:00:00');

-- Routes_Places
INSERT INTO "routes_places" (route_id, place_id) VALUES
                                                     ('47835401-fad3-4817-bd76-3ae8c222943f','c9f39e58-d9bb-47c8-b032-0d01339df459'),
                                                     ('47835401-fad3-4817-bd76-3ae8c222943f','c5291a74-15e0-4a45-9030-7a87e1e06817'),
                                                     ('47835401-fad3-4817-bd76-3ae8c222943f','4c7576b6-4477-4c5f-9eed-b41539c9fabc'),
                                                     ('47835401-fad3-4817-bd76-3ae8c222943f','40f24aa2-8af7-4a5f-920f-eeb1a6ac3736'),
                                                     ('72b49ff2-f07f-4b7b-b7ce-7a938017b983','27b9a75f-ece8-4975-b89c-b614e312e388'),
                                                     ('72b49ff2-f07f-4b7b-b7ce-7a938017b983','8931cf12-6258-4ff9-9701-3b8e1b3ac179'),
                                                     ('72b49ff2-f07f-4b7b-b7ce-7a938017b983','77cbbf6d-4b7b-4d38-bd86-201330a50194'),
                                                     ('72b49ff2-f07f-4b7b-b7ce-7a938017b983','b1b65f65-2a7f-4da9-9826-fb5bf0991625'),
                                                     ('72b49ff2-f07f-4b7b-b7ce-7a938017b983','8d6cba81-8c39-4c8e-94b4-9fc6384df87e');

-- Posts_Threads
INSERT INTO "posts_threads" (post_id, thread_id) VALUES
                                                     ('9a000f53-c75a-494b-866b-a51c8c188ff2', '95ca8fa9-47f1-4c7d-8b7a-2d96225d738a'),
                                                     ('11f62f93-fe2a-4551-b81e-18044317e9d2', '01fae080-a036-46ae-80f1-d16316b61ad7');

-- Points of all users in all time
INSERT INTO "points_of_users" (user_id, points, period) VALUES
                                                            ('b39289b0-b88a-4f09-b8fd-38ab15071acf', 1020, '2024-07-27'),
                                                            ('b39289b0-b88a-4f09-b8fd-38ab15071acf', 980, '2024-06-30'),
                                                            ('b39289b0-b88a-4f09-b8fd-38ab15071acf', 660, '2024-05-31'),
                                                            ('b3683311-a2e5-4546-b3e3-742f303b2d13', 810, '2024-07-27'),
                                                            ('b3683311-a2e5-4546-b3e3-742f303b2d13', 620, '2024-06-27'),
                                                            ('46c520c6-8467-437b-9518-8126bc49cbd8', 930, '2024-07-27'),
                                                            ('d42e011d-966c-4e16-837f-0e7f3952c039', 1040, '2024-07-27'),
                                                            ('fc93bedd-290d-4061-8e39-4eeeb073190e', 1140, '2024-07-27');

-- Users_Leagues
INSERT INTO "leagues_of_users" (user_id, league_id) VALUES
                                                        ('b39289b0-b88a-4f09-b8fd-38ab15071acf', 'b2dbd6c4-568f-4ebe-810b-802b5fb327d6'),
                                                        ('b39289b0-b88a-4f09-b8fd-38ab15071acf', 'eabf4eab-08e3-4469-bb44-5ef2ec2beb39'),
                                                        ('b39289b0-b88a-4f09-b8fd-38ab15071acf', 'b2cb5e9c-d805-4a79-ac99-577fe8a94bd5'),
                                                        ('b3683311-a2e5-4546-b3e3-742f303b2d13', 'b2cb5e9c-d805-4a79-ac99-577fe8a94bd5'),
                                                        ('46c520c6-8467-437b-9518-8126bc49cbd8', 'b2cb5e9c-d805-4a79-ac99-577fe8a94bd5'),
                                                        ('d42e011d-966c-4e16-837f-0e7f3952c039', 'b2cb5e9c-d805-4a79-ac99-577fe8a94bd5'),
                                                        ('fc93bedd-290d-4061-8e39-4eeeb073190e', 'b2cb5e9c-d805-4a79-ac99-577fe8a94bd5');
