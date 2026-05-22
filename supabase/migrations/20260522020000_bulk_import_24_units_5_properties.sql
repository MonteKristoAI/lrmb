-- Bulk import of 24 active TRACK units (recent operational activity) + 5 new properties.
-- Applied live 2026-05-22 via direct INSERT — this migration captures it in repo.
--
-- Context: Initial AiiA seeding had 79 units. TRACK has 232 active units total.
-- The polling worker was silently filtering work orders for the 153 unmapped
-- active units as severity=info ("Unit not yet mapped"). Of those, 41 had
-- operational activity in the last 7 days. After classifying by TRACK isActive
-- and skipping admin/conflict cases (track_ids 81, 115, 247), 24 units were
-- imported.
--
-- Catch-up of historical work orders for these 24 units was performed via
-- track-catchup-units edge function (one-off): 2,649 tasks processed, 0 errors.
--
-- Skipped (need human review):
--   track_id=247 (unit_code 1H1222 conflicts with existing track_id=183 in AiiA)
--   track_id=81  (zz - Sublease A - Miami Beach — internal admin unit)
--   track_id=115 (Square for Lux Handyman — vendor admin unit, no address)
--
-- 5 new properties:
INSERT INTO public.properties (name, address, active, external_source) VALUES
  ('Ritz Carlton',  '10295 Collins Ave',  true, 'track'),
  ('Hyde',          '4111 S Ocean Drive', true, 'track'),
  ('Casa Oleta',    '323 Atlantic Avenue', true, 'track'),
  ('Villa Sophie',  '242 Meridian Avenue', true, 'track'),
  ('Boulan',        '2000 Collins Avenue', true, 'track')
ON CONFLICT DO NOTHING;

-- 24 new units linked to existing or just-created properties:
WITH props AS (
  SELECT id, name FROM public.properties WHERE name IN (
    '1 Hotel & Homes','The Setai','Ritz Carlton','Decoplage','Hyde',
    'W South Beach','Casa Oleta','Fontainebleau','Roney Palace','Villa Sophie','Boulan'
  )
)
INSERT INTO public.units (property_id, external_source, external_id, unit_code, track_id, short_name, active)
SELECT props.id, 'track', v.external_id, v.unit_code, v.track_id, v.short_name, true
FROM (VALUES
  ('1 Hotel & Homes',   '7',   '1H0919',   7,   '1HH 919'),
  ('1 Hotel & Homes',   '85',  '1H1522',   85,  '1HH 1522'),
  ('1 Hotel & Homes',   '25',  '1H1220',   25,  '1HH 1220'),
  ('1 Hotel & Homes',   '337', '1H1112',   337, '1HH 1112'),
  ('1 Hotel & Homes',   '213', '1H1144L',  213, '1HH 1144L'),
  ('1 Hotel & Homes',   '340', '1HPH1718', 340, '1HH PH1718'),
  ('The Setai',         '55',  'S3601',    55,  'Setai 3601'),
  ('The Setai',         '52',  'S2606',    52,  'Setai 2606'),
  ('The Setai',         '252', 'S1707',    252, 'Setai 1707'),
  ('The Setai',         '224', 'S1706',    224, 'Setai 1706'),
  ('Ritz Carlton',      '41',  'RC310/311', 41, 'Ritz 310/311 (combined)'),
  ('Ritz Carlton',      '43',  'RC410/411', 43, 'Ritz 410/411 (combined)'),
  ('Ritz Carlton',      '42',  'RC410',    42,  'Ritz 410'),
  ('Decoplage',         '35',  'DP1242',   35,  'Decoplage 1242'),
  ('Hyde',              '40',  'H1509',    40,  'Hyde 1509'),
  ('W South Beach',     '87',  'W1215',    87,  'W 1215'),
  ('W South Beach',     '205', 'W0804L',   205, 'W 804L'),
  ('W South Beach',     '69',  'W3B828',   69,  'W 828 3B'),
  ('Casa Oleta',        '60',  'VCO0323',  60,  'Casa Oleta'),
  ('Fontainebleau',     '38',  'FB903',    38,  'Fontainebleau 903'),
  ('Roney Palace',      '338', 'RP1533',   338, 'Roney 1533 (1B+Den)'),
  ('Roney Palace',      '268', 'RP1128/1129', 268, 'Roney 1128/1129 (combined)'),
  ('Villa Sophie',      '94',  'VillaSophie242', 94, 'Villa Sophie 242'),
  ('Boulan',            '80',  'B401',     80,  'Boulan 401')
) AS v(property_name, external_id, unit_code, track_id, short_name)
JOIN props ON props.name = v.property_name
ON CONFLICT DO NOTHING;
