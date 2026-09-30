const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const gradenstrandService = require("../services/grade_n_strands-service.js");

const createGradeNStrand = async (req, res) => {
  try {
    const { grade_level, strand, description } = req.body;

    const result = await gradenstrandService.createGradeNStrand(grade_level, strand, description);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Grade N Strand created successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Create grade N strand error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const findAllGradeNStrands = async (req, res) => {
  try {
    const result = await gradenstrandService.findAllGradeNStrands();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "All grade N strands fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Find all grade N strands error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const findGradeNStrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await gradenstrandService.findGradeNStrandById(id);

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Grade N Strand not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Grade N Strand fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Find grade N strand by ID error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const findGradeNStrand = async (req, res) => {
  try {
    const { grade_level, strand } = req.params;

    const result = await gradenstrandService.findGradeNStrand(grade_level, strand);

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Grade N Strand not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Grade N Strand fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Find grade N strand error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateGradeNStrand = async (req, res) => {
  try {
    const { id } = req.params;

    const { grade_level, strand, description } = req.body;

    const result = await gradenstrandService.updateGradeNStrand(id, grade_level, strand, description);

    if (!result || result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Grade N Strand not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Grade N Strand updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Update grade N strand error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteGradeNStrand = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await gradenstrandService.deleteGradeNStrand(id);

    if (!result || result.affectedRows === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Grade N Strand not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Grade N Strand deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Delete grade N strand error:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  createGradeNStrand,
  findAllGradeNStrands,
  findGradeNStrandById,
  findGradeNStrand,
  updateGradeNStrand,
  deleteGradeNStrand,
};
