-- Seed data for Spiritual Streams MVP

-- Insert sermons
INSERT INTO sermons (id, title, preacher, image_url, date) VALUES
('1', 'Ghadeer', 'Imam Ali (as)', '/cover-images/1.jpg', '10 AH'),
('2', 'Bibi Zainab in Sham', 'Sayyeda Zainab (as)', '/cover-images/2.jpg', '61 AH'),
('3', 'Hazrat Abbas (as) in Mecca', 'Hazrat Abbas (as)', '/cover-images/3.jpg', '61 AH');

-- Insert sermon parts for Ghadeer
INSERT INTO sermon_parts (id, sermon_id, title, audio_url, duration, transcript, part_number) VALUES
('1_1', '1', 'Ghadeer - Part 1', 'sermons/ghadeer/en/ghadeer-en.mp3', 200, 'All Praise is due to Allah Who is Exalted in His Unity, Near in His Uniqueness, Sublime in His Authority, Magnanimous in His Dominance. He knows everything; He subdues all creation through His might and evidence. He is Praised always and forever, Glorified and has no end. He begins and He repeats, and to Him every matter is referred.', 1),
('1_2', '1', 'Ghadeer - Part 2', 'sermons/ghadeer/en/ghadeer-en.mp3', 233, 'All Praise is due to Allah Who is Exalted in His Unity, Near in His Uniqueness, Sublime in His Authority, Magnanimous in His Dominance. He knows everything; He subdues all creation through His might and evidence. He is Praised always and forever, Glorified and has no end. He begins and He repeats, and to Him every matter is referred.', 2),
('1_3', '1', 'Ghadeer - Part 3', 'sermons/ghadeer/en/ghadeer-en.mp3', 209, 'All Praise is due to Allah Who is Exalted in His Unity, Near in His Uniqueness, Sublime in His Authority, Magnanimous in His Dominance. He knows everything; He subdues all creation through His might and evidence. He is Praised always and forever, Glorified and has no end. He begins and He repeats, and to Him every matter is referred.', 3);

-- Insert sermon parts for Bibi Zainab in Sham
INSERT INTO sermon_parts (id, sermon_id, title, audio_url, duration, transcript, part_number) VALUES
('2_1', '2', 'Bibi Zainab in Sham - Part 1', 'sermons/ghadeer/en/ghadeer-en.mp3', 200, 'All Praise is due to Allah Who is Exalted in His Unity, Near in His Uniqueness, Sublime in His Authority, Magnanimous in His Dominance. He knows everything; He subdues all creation through His might and evidence. He is Praised always and forever, Glorified and has no end. He begins and He repeats, and to Him every matter is referred.', 1),
('2_2', '2', 'Bibi Zainab in Sham - Part 2', 'sermons/ghadeer/en/ghadeer-en.mp3', 233, 'All Praise is due to Allah Who is Exalted in His Unity, Near in His Uniqueness, Sublime in His Authority, Magnanimous in His Dominance. He knows everything; He subdues all creation through His might and evidence. He is Praised always and forever, Glorified and has no end. He begins and He repeats, and to Him every matter is referred.', 2);

-- Insert sermon parts for Hazrat Abbas (as) in Mecca
INSERT INTO sermon_parts (id, sermon_id, title, audio_url, duration, transcript, part_number) VALUES
('3_1', '3', 'Hazrat Abbas (as) in Mecca - Part 1', 'sermons/ghadeer/en/ghadeer-en.mp3', 200, 'All Praise is due to Allah Who is Exalted in His Unity, Near in His Uniqueness, Sublime in His Authority, Magnanimous in His Dominance. He knows everything; He subdues all creation through His might and evidence. He is Praised always and forever, Glorified and has no end. He begins and He repeats, and to Him every matter is referred.', 1); 