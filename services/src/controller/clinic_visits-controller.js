const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const clinicVisitsService = require("../services/clinic_visits-service.js");

const createClinicVisit = async (req, res) => {
  try {
    const { health_record_id, visit_date, time_in, time_out, reason, symptoms, treatment, remarks, recorded_by } =
      req.body;

    const result = await clinicVisitsService.createClinicVisit(
      health_record_id,
      visit_date,
      time_in,
      time_out,
      reason,
      symptoms,
      treatment,
      remarks,
      recorded_by,
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Clinic visit created successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Create clinic visit error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const findAllClinicVisits = async (req, res) => {
  try {
    const result = await clinicVisitsService.findAllClinicVisits();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "All clinic visits fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Find all clinic visits error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const findClinicVisitById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await clinicVisitsService.findClinicVisitById(id);

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Clinic visit not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Clinic visit fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Find clinic visit by ID error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const findClinicVisitsByHealthRecordId = async (req, res) => {
  try {
    const { health_record_id } = req.params;

    const result = await clinicVisitsService.findClinicVisitsByHealthRecordId(health_record_id);

    if (!result || result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No clinic visits found for the specified health record.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Clinic visits by health record ID fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Find clinic visits by health record ID error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const findClinicVisitsByRecordedBy = async (req, res) => {
  try {
    const { recorded_by } = req.params;

    const result = await clinicVisitsService.findClinicVisitsByRecordedBy(recorded_by);

    if (!result || result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No clinic visits found for the specified staff member.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Clinic visits by recorded by fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Find clinic visits by recorded by error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateClinicVisit = async (req, res) => {
  try {
    const { id } = req.params;

    const { health_record_id, visit_date, time_in, time_out, reason, symptoms, treatment, remarks, recorded_by } =
      req.body;

    const result = await clinicVisitsService.updateClinicVisit(
      id,
      health_record_id,
      visit_date,
      time_in,
      time_out,
      reason,
      symptoms,
      treatment,
      remarks,
      recorded_by,
    );

    if (!result || result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Clinic visit not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Clinic visit updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Update clinic visit error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteClinicVisit = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await clinicVisitsService.deleteClinicVisit(id);

    if (!result || result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Clinic visit not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Clinic visit deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Delete clinic visit error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  createClinicVisit,
  findAllClinicVisits,
  findClinicVisitsByRecordedBy,
  findClinicVisitById,
  findClinicVisitsByHealthRecordId,
  updateClinicVisit,
  deleteClinicVisit,
};
