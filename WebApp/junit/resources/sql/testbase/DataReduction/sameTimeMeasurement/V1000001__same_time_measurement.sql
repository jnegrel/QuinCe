-- Create sensor values and a measurement all for a single timestamp

-- SST value
INSERT INTO sensor_values
  (id, dataset_id, file_column, date, value, auto_qc, user_qc_flag, user_qc_message)
  VALUES
  (1, 1, 1, 1704067200000, '20', NULL, -2, NULL);
  
-- Salinity value
INSERT INTO sensor_values
  (id, dataset_id, file_column, date, value, auto_qc, user_qc_flag, user_qc_message)
  VALUES
  (2, 1, 2, 1704067200000, '35', NULL, -2, NULL);

-- CO2 value
INSERT INTO sensor_values
  (id, dataset_id, file_column, date, value, auto_qc, user_qc_flag, user_qc_message)
  VALUES
  (3, 1, 3, 1704067200000, '375', NULL, -2, NULL);
