INSERT INTO sensor_types (name, vargroup, parent) VALUES ('Test Parent', 'Group', null);

INSERT INTO sensor_types (name, vargroup, parent)
  VALUES ('Test Child', 'Group', (SELECT id FROM sensor_types WHERE name = 'Test Parent'));

  INSERT INTO sensor_types (name, vargroup, parent)
  VALUES ('Sibling 1', 'Group', (SELECT id FROM sensor_types WHERE name = 'Test Parent'));
INSERT INTO sensor_types (name, vargroup, parent)
  VALUES ('Sibling 2', 'Group', (SELECT id FROM sensor_types WHERE name = 'Test Parent'));