INSERT INTO sensor_types (name, vargroup, parent) VALUES ('Test Parent', 'Group', null);
INSERT INTO sensor_types (name, vargroup, parent)
  VALUES ('Test Child', 'Group', (SELECT id FROM sensor_types WHERE name = 'Test Parent'));