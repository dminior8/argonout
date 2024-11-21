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
INSERT INTO "routes" (route_id, name, description, max_time, is_visited) VALUES
                                                                 ('72b49ff2-f07f-4b7b-b7ce-7a938017b983', 'Szlak Górski', 'Trasa wiodąca przez malownicze szlaki górskie.', 120, false),
                                                                 ('e8f7625c-2554-4a6b-9bc6-3581cc184a61', 'Wyprawa ku naturze', 'Spacer przez gęste lasy pełne dzikiej przyrody.', 90, false),
                                                                 ('47835401-fad3-4817-bd76-3ae8c222943f', 'Zwiedzanie Miasta', 'Zwiedzanie najważniejszych zabytków miasta.', 180, false),
                                                                 ('174bcf58-bdfc-4d39-910d-61f0f62675b7', 'Smoczy szlak', 'Przemieżanie miasta śladami krakowskich smoków.', 180, false);

-- Places
INSERT INTO "places" (place_id, name, description, latitude, longitude, more_info_link, is_visited) VALUES
                                                                            ('c9f39e58-d9bb-47c8-b032-0d01339df459', 'Zamek Królewski na Wawelu', 'Symbol potęgi i władzy polskich królów, to zamek pełen historii i niezwykłych dzieł sztuki.', 50.05346, 19.93596, 'https://pl.wikipedia.org/wiki/Wawel', false),
                                                                            ('c5291a74-15e0-4a45-9030-7a87e1e06817', 'Sukiennice', 'Centrum handlowe i kulturalne Krakowa od setek lat, Sukiennice to ikona miasta.', 50.06169, 19.93735, 'https://pl.wikipedia.org/wiki/Sukiennice_w_Krakowie', false),
                                                                            ('4c7576b6-4477-4c5f-9eed-b41539c9fabc', 'Kościół Mariacki', 'Jeden z najważniejszych kościołów w Polsce, z niezwykłym ołtarzem Wita Stwosza.', 50.06166, 19.93881, 'https://pl.wikipedia.org/wiki/Sukiennice_w_Krakowie', false),
                                                                            ('40f24aa2-8af7-4a5f-920f-eeb1a6ac3736', 'Barbakan', 'Impresyjna średniowieczna fortyfikacja, która kiedyś broniła miasta, obecnie stanowi malowniczy element krajobrazu Krakowa.', 50.06520, 19.94150, 'https://pl.wikipedia.org/wiki/Barbakan', false),
                                                                            ('f6c6ce14-c9ca-4758-90e4-a1a68f9cc803', 'Collegium Maius', 'Najstarszy budynek Uniwersytetu Jagiellońskiego powstały z zakupionej przez króla Władysława Jagiełło w 1400 r. kamienicy. Znajdują się tutaj zabytkowe kolekcje: naukowa, malarska, rzeźby różnych epok, rzemiosła artystycznego.', 50.06165, 19.93341, 'https://pl.wikipedia.org/wiki/Collegium_Maius_Uniwersytetu_Jagiello%C5%84skiego', false),
                                                                            ('27b9a75f-ece8-4975-b89c-b614e312e388', 'Kopiec Kościuszki', 'Wzniesiony na Wzgórzu Kościuszki, upamiętnia bohaterstwo Tadeusza Kościuszki i jego udział w walkach o niepodległość Polski.', 50.05491, 19.89335, 'https://pl.wikipedia.org/wiki/Kopiec_Ko%C5%9Bciuszki_w_Krakowie', false),
                                                                            ('8931cf12-6258-4ff9-9701-3b8e1b3ac179', 'Kopiec Piłsudskiego', 'Położony na Skałce, symbolizuje pamięć i czyny Józefa Piłsudskiego, ważnej postaci w historii Polski.', 50.06004, 19.84716, 'https://pl.wikipedia.org/wiki/Kopiec_J%C3%B3zefa_Pi%C5%82sudskiego_w_Krakowie', false),
                                                                            ('77cbbf6d-4b7b-4d38-bd86-201330a50194', 'Kopiec Krakusa', 'Usytuowany na wzgórzu Lasoty, według legendy to mogiła mitycznego Kraka, założyciela Krakowa.', 50.03808, 19.95844, 'https://pl.wikipedia.org/wiki/Kopiec_Krakusa', false),
                                                                            ('b1b65f65-2a7f-4da9-9826-fb5bf0991625', 'Kopiec Wandy', 'Znajduje się w Podgórzu, opowiada legendę o księżniczce Wandzie, która rzekomo popełniła samobójstwo, aby uchronić Kraków przed najeźdźcami.', 50.07022, 20.06807, 'https://pl.wikipedia.org/wiki/Kopiec_Wandy', false),
                                                                            ('8d6cba81-8c39-4c8e-94b4-9fc6384df87e', 'Kopiec Jana Pawła II', 'Poświęcony jest pamięci i dziedzictwu świętego papieża Jana Pawła II, urodzonego w Wadowicach niedaleko Krakowa. Jest najmłodszym krakowskim kopcem.', 50.04425, 19.91724, 'https://pl.wikipedia.org/wiki/Kopiec_Jana_Paw%C5%82a_II_w_Krakowie', false),

                                                                            ('3524f55f-f20e-43f0-955a-f6a1518042f7', 'Smok Astronom', 'Smok trzymający przyrządy znane z obrazów o Mikołaju Koperniku nawiązuje do dziejów astronomii w Krakowie, a szczególnie do pierwszego państwowego obserwatorium astronomicznego w Collegium Śniadeckiego, które było ulokowane na terenie pobliskiego Ogrodu Botanicznego.', 50.063159, 19.956810, 'https://www.krakow.pl/instcbi/277531,inst,114919,2721,instcbi.html', false),
                                                                            ('f62d9573-f89d-4852-b298-ba2c8f7912ab', 'Smok Filmowiec', 'Przy ścianie kina „Kijów”, przy al. Zygmunta Krasińskiego 34, rozstawił swoją kamerę Smok Filmowiec. To kino jest jednym z bardziej charakterystycznych miejsc Krakowa. Kilka pokoleń krakowian oglądało tu tysiące filmów, ale także przedstawień teatralnych, wysłuchało wielu koncertów. Sam gmach oddano do użytku w 1967 r.', 50.058198, 19.925250, 'https://www.krakow.pl/instcbi/277531,inst,109882,2721,instcbi.html', false),
                                                                            ('6e9610b8-aad9-4081-9cec-b33747cfe97f', 'Smok Fotograf', 'Smok Fotograf ma aparat, który nawiązuje wprost do czasów, gdy technika nie pozwalała na szybkie naświetlenie zdjęcia. Smok stoi przy Muzeum Fotografii (MuFo), jednak warto wiedzieć, że przez długie lata było to miejsce, którego nie wolno było fotografować. Mieścił się tu jeden z ważnych obiektów wojskowych, najpierw Twierdzy Kraków, a następnie wojskowego kompleksu zajmowanego przez żołnierzy polskich.', 50.070343, 19.953859, 'https://www.krakow.pl/instcbi/277531,inst,114917,2721,instcbi.html', false),
                                                                            ('4cb24611-a6c8-46d4-8289-c57f13e2a8b5', 'Smok Geodeta', 'Przy Szkole Podstawowej nr 29 przy al. Edwarda Dembowskiego 12 stoi Smok Geodeta. Na pomiarach miasta zna się najlepiej. Okiem doświadczonego mierniczego spogląda tachimetr. To ustawiony na trójnogim statywie instrument do pomiarów geodezyjnych, na podstawie których wykreślane są dokładne mapy. Miejsce, w którym smok dokonuje pomiarów nie jest przypadkowe. Przez szkołę przebiega bowiem krakowski południk zerowy, czyli „polskie Greenwich”. Południk krakowski to jeden z najstarszych południków zerowych na świecie. Korzystał z niego sam Mikołaj Kopernik, pisząc rewolucyjne dzieło „O obrotach sfer niebieskich”.', 50.041747, 19.954854, 'https://www.krakow.pl/instcbi/277531,inst,109876,2721,instcbi.html', false),
                                                                            ('b54c53f6-826a-480d-951e-c6db609c4cb8', 'Smok Kazimierz', 'Smok Kazimierz pędzi wesoło, trzymając w łapach torby z zakupami. Zerka przez dziedziniec na stojące obok ceglane budynki Galerii Kazimierz. Pięknie odrestaurowane, mają już ponad 150 lat i nadal służą krakowianom, choć w innej roli niż do tej, w której pierwotnie je zbudowano.Przez długie lata funkcjonowała tam rzeźnia miejska, która został zbudowana w 1878 r. według projektu Macieja Moraczewskiego, ojca przyszłego premiera II Rzeczypospolitej.', 50.052764, 19.954771, 'https://www.krakow.pl/instcbi/277531,inst,113679,2721,instcbi.html', false),
                                                                            ('5ce84b2a-fd89-4315-ba17-7f2cfce7c2ee', 'Smok Lekarz', 'Smok lekarz nawiązuje do historia kompleksu szpitali na Wesołej i dziejów medycyny krakowskiej. ul. Mikołaja Kopernika przez długie dekady kojarzyła się krakowianom z klinikami uniwersyteckimi i Collegium Medicum, czyli medycznym centrum Krakowa. Obiekty te powstały od XIX w. Jak większość gmachów publicznych z końca XIX w. łączyły w sobie majestat z pięknem formy.', 50.063109, 19.952977, 'https://www.krakow.pl/instcbi/277531,inst,114916,2721,instcbi.html',false),
                                                                            ('afb340e3-1d89-41cd-b804-fb6a8ca53bdf', 'Smok Malarz', 'Na placu Teodora Axentowicza rozgościł się Smok Malarz. Szuka tematu na obraz, który następnie umieści w trzymanej przez siebie ramie. Wybrał dobre miejsce. Patronem tego placu, przypominającego bardziej mały park z centralnym skwerem, otoczonego zielenią drzew i krzewów – patronuje polski artysta malarz ormiańskiego pochodzenia, rektor krakowskiej Akademii Sztuk Pięknych, Teodor Axentowicz (1859-1938). Axentowicza łączyły silne związki z Lwowem, popularyzował sztukę Ormian.', 50.071530, 19.926262, 'https://www.krakow.pl/instcbi/277531,inst,109879,2721,instcbi.html', false),
                                                                            ('ead3c570-a52e-400e-a6e8-b9e1e79218ce', 'Smok Romantyk', 'W wielu miastach symbolem romantyzmu i stałości uczuć stało się nie tyle czerwone serce, ale kłódka z imionami lub inicjałami zakochanych, którą można przypiąć do trwałego elementu, a klucz wyrzucić. Takim miejscem dla licznych krakowian i turystów stała się kładka łącząca Kazimierz i Podgórze nosząca imię o. Laetusa Bernatka.', 50.046045, 19.948159, 'https://www.krakow.pl/instcbi/277531,inst,114922,2721,instcbi.html',false),
                                                                            ('8fb7f26c-3fe4-4d0c-a28c-806754f799e7', 'Smok Sportowiec', 'Smok sportowiec trzyma koło hula-hop. Spotkamy go naprzeciwko budynku Towarzystwa Sportowego „Sokół”. Towarzystwo Gimnastyczne „Sokół” to organizacja powstała w czasie zaborów. Popularyzowała gimnastykę wśród społeczeństwa polskiego, ale też np. turystykę oraz sporty paramilitarne. Działacze i sportowcy wychowani w „Sokole” zakładali potem różne kluby sportowe.', 50.059475, 19.926691, 'https://www.krakow.pl/instcbi/277531,inst,114914,2721,instcbi.html',false),
                                                                            ('591e510e-490d-48b9-906e-f96bf13a698d', 'Smok Turysta', 'Przy wejściu do parku Wojciecha Bednarskiego stoi Smok Turysta. Trzyma w łapach aparat fotograficzny, aby uchwycić na zdjęciach piękno przyrody Podgórza. Ten malowniczo położony park, jeden z najpiękniejszych w Krakowie powstał z inicjatywy podgórskiego społecznika, Wojciecha Bednarskiego (1841-1914). Otwarto go w 1896 r. W okresie międzywojennym park rozbudowano, poszerzając o teren dawnego kamieniołomu z wysokimi, wapiennymi ścianami, nazywanego „szkołą Twardowskiego”. W tym miejscu swoją pracownię alchemiczną miał mieć legendarny czarnoksiężnik. ', 50.042122, 19.951214, 'https://www.krakow.pl/instcbi/277531,inst,109877,2721,instcbi.html', false),
                                                                            ('4e437898-e9ec-45d8-b943-d1ca76ecf558', 'Smok wawelski', 'Smok Wawelski stoi przy wejściu do Smoczej Jamy, mieszczącej się u stóp Zamku Królewskiego na Wawelu. Można do niej dotrzeć idąc od ulicy Bernardyńskiej lub Smoczej. Można też wejść na bulwary wiślane od strony Podzamcza.Jest rzeźbą autorstwa Bronisława Chromego, którą postawiono na dużym kamieniu w 1972 r.', 50.053011, 19.933581, 'https://www.krakow.pl/instcbi/277531,inst,109885,2721,instcbi.html', false),
                                                                            ('9127f23d-44b3-40a3-9226-7329b2c592ec', 'Smok Wodny', 'Smok Wodny z rybą w łapie stoi przy pl. Na Groblach. Jak sama nazwa wskazuje, niegdyś na środku obecnego placu był staw, który jednocześnie był dawnym portem wiślanym. Wspomnianymi groblami odcięto w średniowieczu rozległe zakole Wisły – biegnące od Salwatora, przez Błonia, w kierunku Starego Miasta i Wawelu – zakładając w nim liczne stawy rybne, a po sąsiedzku, port wiślany.', 50.055462, 19.931763, 'https://www.krakow.pl/instcbi/277531,inst,109881,2721,instcbi.html', false),
                                                                            ('3c543300-b15a-4cf0-80c6-1db72a9a2ad1', 'Smok z latawcem', 'Wśród zieleni w Parku im. dr. Henryka Jordana stoi smok z latawcem, spędzając czas na radosnej zabawie. Wybrał idealne miejsce! Park założył i współfinansował krakowski społecznik, lekarz i radny miejski dr Henryk Jordan (1842-1907). Dzięki dr. Jordanowi, od 1889 r. krakowskie dzieci i młodzież mają możliwość spędzania wolnego czasu na grach i zabawach na świeżym powietrzu.', 50.060537, 19.917885, 'https://www.krakow.pl/instcbi/277531,inst,109880,2721,instcbi.html', false),
                                                                            ('5e09e9b8-fcc0-4cb2-a639-f1334f5624a7', 'Smok z literą K', 'Smok trzyma w ręku tarczę ze stylizowaną literą „K”. Wiele osób przypuszcza, że jest to litera symbolizująca Kraków, zapewne utwierdzani w tym przez planszę tytułową wyświetlaną przez wiele lat przed programami emitowanymi przez TVP Kraków, na której widniały litery z drzwi wejściowych do Katedry Wawelskiej. Jednak tak naprawdę taka właśnie litera jest trzymana przez smoka nie bez powodu. Znajdowała się w herbie miasta Kazimierza, funkcjonującego przez prawie 500 lat koło Krakowa i była inicjałem króla Kazimierza Wielkiego – założyciela tego miasta. ', 50.046117, 19.944187, 'https://www.krakow.pl/instcbi/277531,inst,114913,2721,instcbi.html', false),
                                                                            ('c9c44cce-8c0a-4123-8840-d87d3857d297', 'Smok z mapą', 'Znajduje się w parku Krakowskim na jednym ze skrzyżowań dróżek dla pieszych. Smok pogrążony jest w rozmyślaniach, w którym kierunku podążyć, gdyż ta część Krakowa obfituje w ciekawe miejsca, w tym pobliskie muzea: fotografii (MuFo) i historii Krakowa (Muzeum Krakowa – Oddział: Ulica Pomorska). Dużą atrakcją jest sam park Krakowski wzorowany na wiedeńskich ogrodach ludowych. Został założony przez Stanisława Rehmana – krakowskiego przedsiębiorcę, restauratora i radnego miejskiego.', 50.069009, 19.925240, 'https://www.krakow.pl/instcbi/277531,inst,109878,2721,instcbi.html', false),
                                                                            ('c9505e10-0798-4d37-8148-47d0d8059eac', 'Smok metrem', 'Smok nie ma łatwego zadania, gdyż pragnie odwiedzającym przypomnieć o postaci niemal zupełnie zapomnianej. Mowa o Stanisławie Pudłowskim – fizyku i astronomie, rektorze Akademii Krakowskiej, który działał naukowo w XVII w. Do dyspozycji miał obserwatorium i pracownię fizyczno-astronomiczną w zabudowaniach probostwa kościoła św. Mikołaja. Sformułował koncepcję uniwersalnej długości, badając przebiegający przez Kraków południk. Wynaleziony przez krakowskiego uczonego metr wynosił 0,994 metra obecnie używanego, którego wzorzec znajduje się w Sevres pod Paryżem.', 50.061145, 19.947272, 'https://www.krakow.pl/instcbi/277531,inst,114915,2721,instcbi.html', false),
                                                                            ('f988ad0e-f31f-492b-a179-529af4130499', 'Smok Żołnierz CK', 'Tego smoka nie należy zagadywać – pełni wartę. Jest wyekwipowany w karabin Mannlicher, magazynki do niego w ładownicach przy pasie, plecak oraz wojskową czapkę z okresu Twierdzy Kraków. Smok pilnuje reliktów bastionu V „Lubicz” wyeksponowanych częściowo na terenie ronda. Cześć jest w formie murów, a część jedynie zaznaczona na płycie ronda. ', 50.065917, 19.959173, 'https://www.krakow.pl/instcbi/277531,inst,114918,2721,instcbi.html', false);


-- Games
INSERT INTO "games" (game_id, route_id, start_time, is_completed) VALUES
                                                                      ('1f95377a-10ed-4cc4-9b18-58a48e3e5e8a', '47835401-fad3-4817-bd76-3ae8c222943f', CURRENT_TIMESTAMP, FALSE), --Zwiedzanie miasta
                                                                      ('e97c1b6b-c1a8-4625-bc8f-9e8cf3e9f2a0', '72b49ff2-f07f-4b7b-b7ce-7a938017b983', CURRENT_TIMESTAMP, FALSE), --Szlak górski
                                                                      ('3d1f0f1a-c7c3-4ff0-b6e7-6a7be0a41d4a', '47835401-fad3-4817-bd76-3ae8c222943f', CURRENT_TIMESTAMP, FALSE); --Zwiedzanie miasta

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
                                                     ('72b49ff2-f07f-4b7b-b7ce-7a938017b983','8d6cba81-8c39-4c8e-94b4-9fc6384df87e'),

                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '3524f55f-f20e-43f0-955a-f6a1518042f7'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', 'f62d9573-f89d-4852-b298-ba2c8f7912ab'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '6e9610b8-aad9-4081-9cec-b33747cfe97f'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '4cb24611-a6c8-46d4-8289-c57f13e2a8b5'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', 'b54c53f6-826a-480d-951e-c6db609c4cb8'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '5ce84b2a-fd89-4315-ba17-7f2cfce7c2ee'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', 'afb340e3-1d89-41cd-b804-fb6a8ca53bdf'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', 'ead3c570-a52e-400e-a6e8-b9e1e79218ce'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '8fb7f26c-3fe4-4d0c-a28c-806754f799e7'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '591e510e-490d-48b9-906e-f96bf13a698d'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '4e437898-e9ec-45d8-b943-d1ca76ecf558'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '9127f23d-44b3-40a3-9226-7329b2c592ec'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '3c543300-b15a-4cf0-80c6-1db72a9a2ad1'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', '5e09e9b8-fcc0-4cb2-a639-f1334f5624a7'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', 'c9c44cce-8c0a-4123-8840-d87d3857d297'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', 'c9505e10-0798-4d37-8148-47d0d8059eac'),
                                                     ('174bcf58-bdfc-4d39-910d-61f0f62675b7', 'f988ad0e-f31f-492b-a179-529af4130499');

-- Users_Games
INSERT INTO "users_games" (user_id, game_id) VALUES
                                                 ('b3683311-a2e5-4546-b3e3-742f303b2d13', '1f95377a-10ed-4cc4-9b18-58a48e3e5e8a'),  -- Anna Nowak
                                                 ('b3683311-a2e5-4546-b3e3-742f303b2d13', 'e97c1b6b-c1a8-4625-bc8f-9e8cf3e9f2a0'),  -- Anna Nowak
                                                 ('b39289b0-b88a-4f09-b8fd-38ab15071acf', '3d1f0f1a-c7c3-4ff0-b6e7-6a7be0a41d4a');  -- Jan Kowalski

-- Visited_Places
INSERT INTO "visited_places" (visited_places_id, user_id, game_id, place_id, visited_at) VALUES
                                                                             ('430e8c3f-7085-4bee-bae6-d27d5608bc12','b3683311-a2e5-4546-b3e3-742f303b2d13','1f95377a-10ed-4cc4-9b18-58a48e3e5e8a', 'c9f39e58-d9bb-47c8-b032-0d01339df459', CURRENT_TIMESTAMP),  -- Zamek Królewski na Wawelu
                                                                             ('d4cd5ad7-f770-411c-b9da-2715c31189ed','b3683311-a2e5-4546-b3e3-742f303b2d13','1f95377a-10ed-4cc4-9b18-58a48e3e5e8a', 'c5291a74-15e0-4a45-9030-7a87e1e06817', CURRENT_TIMESTAMP),  -- Sukiennice
                                                                             ('339cc237-154c-4b03-a8ff-2e7fa87842f0','b3683311-a2e5-4546-b3e3-742f303b2d13','1f95377a-10ed-4cc4-9b18-58a48e3e5e8a', '4c7576b6-4477-4c5f-9eed-b41539c9fabc', CURRENT_TIMESTAMP),  -- Kościół Mariacki
                                                                             ('66d394b4-8088-490b-8384-924a07ff1303','b39289b0-b88a-4f09-b8fd-38ab15071acf','e97c1b6b-c1a8-4625-bc8f-9e8cf3e9f2a0', '27b9a75f-ece8-4975-b89c-b614e312e388', CURRENT_TIMESTAMP),  -- Kopiec Kościuszki
                                                                             ('e2c8e0ec-a9e7-4b48-878a-bd6b4fc7d8b4','b39289b0-b88a-4f09-b8fd-38ab15071acf','3d1f0f1a-c7c3-4ff0-b6e7-6a7be0a41d4a', '40f24aa2-8af7-4a5f-920f-eeb1a6ac3736', CURRENT_TIMESTAMP),  -- Barbakan
                                                                             ('7ea543e2-1d79-42a7-8c38-f89b67a5375b', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, 'c9f39e58-d9bb-47c8-b032-0d01339df459', '2024-10-24 13:00:00'),
                                                                             ('e87ffa32-7266-47cd-9389-db54e365cbfc', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, 'c5291a74-15e0-4a45-9030-7a87e1e06817', '2024-10-24 13:00:00'),
                                                                             ('886c1edf-c278-4163-8f7c-161564c1881c', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, '4c7576b6-4477-4c5f-9eed-b41539c9fabc', '2024-11-14 13:00:00'),
                                                                             ('ca7189ab-74d7-4fa7-8016-0c722142487a', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, '40f24aa2-8af7-4a5f-920f-eeb1a6ac3736', '2024-11-04 13:00:00'),
                                                                             ('7e370708-decd-4c0f-83c2-951b5453b825', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, 'f6c6ce14-c9ca-4758-90e4-a1a68f9cc803', '2024-11-20 19:30:00'),
                                                                             ('02d99589-53ba-4d22-8198-99fcd85d52e9', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, '27b9a75f-ece8-4975-b89c-b614e312e388', '2024-11-02 10:15:00'),
                                                                             ('4e483f58-6f36-44ad-a065-d39f72a65933', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, '8931cf12-6258-4ff9-9701-3b8e1b3ac179', '2024-11-18 16:00:00'),
                                                                             ('ee1d43d9-de9b-46e9-9063-4aaab63d49be', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, '77cbbf6d-4b7b-4d38-bd86-201330a50194', '2024-11-12 09:45:00'),
                                                                             ('98b7f6e1-258a-407f-925e-f4e6c1cd9cc8', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, 'b1b65f65-2a7f-4da9-9826-fb5bf0991625', '2024-11-14 11:20:00'),
                                                                             ('b6008196-1389-4f92-8016-fda70a410aff', 'b3683311-a2e5-4546-b3e3-742f303b2d13', null, '8d6cba81-8c39-4c8e-94b4-9fc6384df87e', '2024-11-10 14:35:00');
-- Leagues
INSERT INTO "leagues" (league_id, name, min_points, max_points) VALUES
                                                                    ('e2419a24-fd87-447b-bf62-d831e3d70da4', 'Drewniana liga', 0, 999),
                                                                    ('7eb2db2e-8d2e-41fc-9ba1-7236cd09b9a3', 'Srebrna liga', 1000, 4999),
                                                                    ('2bd51da3-3102-453c-a877-a6d35d939ddf', 'Złota liga', 5000, 9999),
                                                                    ('01eba262-6372-4e28-94ae-35e118286e34', 'Diamentowa liga', 10000, 2147483647);
-- Messages
INSERT INTO "messages" (message_id, sender_id, topic, content, created_at) VALUES
                                                                    ('a5f2c76a-99c6-4d83-bc9d-3d5b6f489d57', 'b39289b0-b88a-4f09-b8fd-38ab15071acf', 'Zapytanie o trasę', 'Cześć! Jakie są polecane szlaki górskie na zimę?', CURRENT_TIMESTAMP),
                                                                    ('bb23c58d-217f-4a67-bc98-98d34b9c5f4e', 'b3683311-a2e5-4546-b3e3-742f303b2d13', 'Propozycja trasy', 'Polecam wybrać się na Smoczy Szlak w Krakowie, świetna atrakcja dla rodzin.', CURRENT_TIMESTAMP),
                                                                    ('cc73b5dd-8e22-42a8-8c26-982dd4b6b8a1', '46c520c6-8467-437b-9518-8126bc49cbd8', 'Zgłoszenie problemu', 'Mam problem z zaliczeniem punktu na trasie. Czy mogę otrzymać pomoc techniczną?', CURRENT_TIMESTAMP),
                                                                    ('dd12a8a4-32c5-47cb-98ed-4a2b7894c1f5', 'd42e011d-966c-4e16-837f-0e7f3952c039', 'Pytanie o punkty', 'Ile punktów mogę zdobyć za ukończenie Szlaku Górskiego?', CURRENT_TIMESTAMP),
                                                                    ('ee54c89d-4ba6-4df3-8df2-7e6e6e3bfc93', 'fc93bedd-290d-4061-8e39-4eeeb073190e', 'Podziękowanie', 'Dziękuję za świetną organizację wydarzenia! Trasy były wspaniałe.', CURRENT_TIMESTAMP);
