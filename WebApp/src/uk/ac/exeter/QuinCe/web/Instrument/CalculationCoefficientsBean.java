package uk.ac.exeter.QuinCe.web.Instrument;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

import uk.ac.exeter.QuinCe.data.Dataset.DataSet;
import uk.ac.exeter.QuinCe.data.Instrument.Calibration.CalculationCoefficient;
import uk.ac.exeter.QuinCe.data.Instrument.Calibration.CalculationCoefficientDB;
import uk.ac.exeter.QuinCe.data.Instrument.Calibration.Calibration;
import uk.ac.exeter.QuinCe.data.Instrument.Calibration.CalibrationDB;
import uk.ac.exeter.QuinCe.jobs.Job;
import uk.ac.exeter.QuinCe.jobs.files.DataReductionJob;

@ManagedBean
@SessionScoped
public class CalculationCoefficientsBean extends CalibrationBean {

  /**
   * The navigation string for the external standards list
   */
  private static final String NAV_LIST = "calculation_coefficients";

  public CalculationCoefficientsBean() {
    super();
  }

  @Override
  protected String getPageNavigation() {
    return NAV_LIST;
  }

  @Override
  protected int getReprocessStatus() {
    return DataSet.STATUS_DATA_REDUCTION;
  }

  @Override
  protected Class<? extends Job> getReprocessJobClass() {
    return DataReductionJob.class;
  }

  @Override
  protected CalibrationDB getDbInstance() {
    return CalculationCoefficientDB.getInstance();
  }

  @Override
  protected String getCalibrationType() {
    return CalculationCoefficientDB.CALCULATION_COEFFICIENT_CALIBRATION_TYPE;
  }

  @Override
  public String getHumanReadableCalibrationType() {
    return "Calculation Coefficient";
  }

  @Override
  protected Calibration initNewCalibration() {
    return new CalculationCoefficient(instrument);
  }

  @Override
  public String getTargetLabel() {
    return "Coefficient";
  }

}
