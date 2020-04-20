package uk.ac.exeter.QuinCe.data.Dataset.QC.Routines;

import java.util.List;
import java.util.stream.Collectors;

import uk.ac.exeter.QuinCe.data.Dataset.SensorValue;
import uk.ac.exeter.QuinCe.data.Dataset.QC.Flag;
import uk.ac.exeter.QuinCe.utils.RecordNotFoundException;

/**
 * The base class for a QC routine. These classes will be called to check the
 * data after it's been read and processed for missing/ out of range values.
 */
public abstract class Routine {

  /**
   * The parameters for the routine
   */
  protected List<String> parameters;

  /**
   * Basic constructor
   *
   * @param parameters
   *          The parameters
   * @throws RoutineException
   *           If the parameters are invalid
   */
  public Routine(List<String> parameters) throws RoutineException {
    this.parameters = parameters;
    validateParameters();
  }

  /**
   * Add a QC flag to a value. The QC message is generated by calling
   * {@link #getShortMessage()} or {@link #getShortMessage()}.
   *
   * @param value
   *          The value
   * @param flag
   *          The flag
   */
  protected void addFlag(SensorValue value, Flag flag, String requiredValue,
    String actualValue) throws RoutineException {

    try {
      value
        .addAutoQCFlag(new RoutineFlag(this, flag, requiredValue, actualValue));
    } catch (RecordNotFoundException e) {
      throw new RoutineException("Sensor Value ID is not stored in database");
    }
  }

  /**
   * Add a QC flag to a value. The QC message is generated by calling
   * {@link #getShortMessage()} or {@link #getShortMessage()}.
   *
   * @param value
   *          The value
   * @param flag
   *          The flag
   */
  protected void addFlag(SensorValue value, Flag flag, Double requiredValue,
    Double actualValue) throws RoutineException {
    addFlag(value, flag, String.valueOf(requiredValue),
      String.valueOf(actualValue));
  }

  /**
   * Add a QC flag to a value. The QC message is generated by calling
   * {@link #getShortMessage()} or {@link #getShortMessage()}.
   *
   * @param value
   *          The value
   * @param flag
   *          The flag
   */
  protected void addFlag(SensorValue value, Flag flag, Double requiredValue,
    long actualValue) throws RoutineException {
    addFlag(value, flag, String.valueOf(requiredValue),
      String.valueOf(actualValue));
  }

  /**
   * Add a QC flag to a value. The QC message is generated by calling
   * {@link #getShortMessage()} or {@link #getShortMessage()}.
   *
   * @param value
   *          The value
   * @param flag
   *          The flag
   */
  protected void addFlag(SensorValue value, Flag flag, String requiredValue,
    Double actualValue) throws RoutineException {
    addFlag(value, flag, requiredValue, String.valueOf(actualValue));
  }

  /**
   * Validate the parameters
   *
   * @throws RoutineException
   *           If the parameters are invalid
   */
  protected abstract void validateParameters() throws RoutineException;

  /**
   * Perform the QC
   *
   * @param values
   *          The values to be QCed
   */
  public abstract void qcValues(List<SensorValue> values)
    throws RoutineException;

  /**
   * Get the short form message for this routine
   *
   * @return The short QC message
   */
  public static String getShortMessage() {
    return "DEFAULT SHORT MESSAGE. YOU SHOULD NOT BE SEEING THIS!";
  }

  /**
   * Get the long form message for this routine
   *
   * @param requiredValue
   *          The value required be the routine
   * @param actualValue
   *          The actual data value
   * @return The short QC message
   */
  public static String getLongMessage(String requiredValue,
    String actualValue) {
    return "DEFAULT LONG MESSAGE. YOU SHOULD NOT BE SEEING THIS!";
  }

  /**
   * Filter a list of {@link SensorValue} objects to remove any NaN values.
   *
   * @param values
   *          The values to be filtered.
   * @return The filtered list.
   */
  protected List<SensorValue> filterMissingValues(List<SensorValue> values) {
    return values.stream().filter(x -> !x.isNaN()).collect(Collectors.toList());
  }
}
