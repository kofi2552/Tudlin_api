import Curriculum from "../models/Curriculum.js";
import StudyAreas from "../models/StudyAreas.js";
import CurriculumStudyAreas from "../models/CurriculumStudyAreas.js";

// Add a StudyArea to a Curriculum
export const addStudyAreaToCurriculum = async (req, res) => {
  const { curriculumId, studyAreaId } = req.body;

  try {
    const curriculum = await Curriculum.findByPk(curriculumId);
    const studyArea = await StudyAreas.findByPk(studyAreaId);

    if (!curriculum || !studyArea) {
      return res.status(404).json({
        error: "Curriculum or Study Area not found.",
      });
    }

    await curriculum.addStudyArea(studyArea);

    res.status(201).json({
      message: "Study Area added to Curriculum successfully.",
    });
  } catch (error) {
    console.error("Error adding Study Area to Curriculum:", error);
    res.status(500).json({
      error: "Failed to add Study Area to Curriculum. Please try again.",
    });
  }
};

// Get all Study Areas for a Curriculum
export const getStudyAreasForCurriculum = async (req, res) => {
  const { curriculumId } = req.params;

  try {
    const curriculum = await Curriculum.findByPk(curriculumId, {
      include: {
        model: StudyAreas,
        as: "studyAreas",
        through: { attributes: [] }, // Exclude through table data
      },
    });

    if (!curriculum) {
      return res.status(404).json({
        error: "Curriculum not found.",
      });
    }

    res.status(200).json({
      studyAreas: curriculum.studyAreas,
    });
  } catch (error) {
    console.error("Error fetching Study Areas for Curriculum:", error);
    res.status(500).json({
      error: "Failed to fetch Study Areas for Curriculum. Please try again.",
    });
  }
};

// Get all Curriculums for a Study Area
export const getCurriculumsForStudyArea = async (req, res) => {
  const { studyAreaId } = req.params;

  try {
    const studyArea = await StudyAreas.findByPk(studyAreaId, {
      include: {
        model: Curriculum,
        as: "curriculums",
        through: { attributes: [] }, // Exclude through table data
      },
    });

    if (!studyArea) {
      return res.status(404).json({
        error: "Study Area not found.",
      });
    }

    res.status(200).json({
      curriculums: studyArea.curriculums,
    });
  } catch (error) {
    console.error("Error fetching Curriculums for Study Area:", error);
    res.status(500).json({
      error: "Failed to fetch Curriculums for Study Area. Please try again.",
    });
  }
};

// Remove a Study Area from a Curriculum
export const removeStudyAreaFromCurriculum = async (req, res) => {
  const { curriculumId, studyAreaId } = req.body;

  try {
    const curriculum = await Curriculum.findByPk(curriculumId);
    const studyArea = await StudyAreas.findByPk(studyAreaId);

    if (!curriculum || !studyArea) {
      return res.status(404).json({
        error: "Curriculum or Study Area not found.",
      });
    }

    await curriculum.removeStudyArea(studyArea);

    res.status(200).json({
      message: "Study Area removed from Curriculum successfully.",
    });
  } catch (error) {
    console.error("Error removing Study Area from Curriculum:", error);
    res.status(500).json({
      error: "Failed to remove Study Area from Curriculum. Please try again.",
    });
  }
};
