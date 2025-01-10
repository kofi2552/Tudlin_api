import StudyAreas from "../models/StudyAreas.js";
import Curriculum from "../models/Curriculum.js";
import CurriculumStudyAreas from "../models/CurriculumStudyAreas.js";

// Create a new study area
export const createStudyAreaWithCurriculum = async (req, res) => {
  // const { id } = req.params;
  const { name, curriculumId } = req.body;
  console.log("add study area: ", req.body);
  try {
    // Check if the curriculum exists
    const curriculum = await Curriculum.findByPk(curriculumId);

    if (!curriculum) {
      return res.status(404).json({ message: "Curriculum not found." });
    }

    // Create the new Study Area
    const newStudyArea = await StudyAreas.create({ name });

    // Create the association between the Study Area and the Curriculum
    await CurriculumStudyAreas.create({
      studyAreaId: newStudyArea.id,
      curriculumId,
    });

    res.status(201).json({
      message: "Study Area created and linked to Curriculum successfully.",
      studyArea: newStudyArea,
    });
  } catch (err) {
    console.error("Error creating Study Area with Curriculum:", err);
    res.status(500).json({
      message: "Failed to create Study Area and link it to Curriculum.",
    });
  }
};

// Get all study areas for a specific curriculum
export const getStudyAreasForCurriculum = async (req, res) => {
  const { curriculumId } = req.params;

  try {
    // Check if the curriculum exists
    const curriculum = await Curriculum.findByPk(curriculumId);

    if (!curriculum) {
      return res.status(404).json({ message: "Curriculum not found." });
    }

    // Fetch the study areas associated with this curriculum
    const studyAreas = await StudyAreas.findAll({
      include: {
        model: Curriculum,
        as: "curriculums", // Alias defined in the association
        where: { id: curriculumId },
        through: { attributes: [] }, // Exclude through table attributes
      },
    });

    res.status(200).json({ studyAreas: studyAreas });
  } catch (err) {
    console.error("Error fetching Study Areas for Curriculum:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch Study Areas for Curriculum." });
  }
};

// Get all study areas with associated curriculums
export const getStudyAreas = async (req, res) => {
  try {
    const studyAreas = await StudyAreas.findAll({
      include: {
        model: Curriculum,
        as: "curriculums", // Define the alias for associated curriculums
        through: { attributes: [] }, // Exclude through table attributes from response
      },
    });

    console.log(studyAreas);
    res.status(200).json({ studyAreas });
  } catch (error) {
    console.error("Error fetching Study Areas:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch Study Areas. Please try again." });
  }
};

// Update study area details with curriculum association
export const updateStudyArea = async (req, res) => {
  const { id } = req.params; // Study Area ID from the URL
  const { name, curriculumIds } = req.body; // Data sent from the client
  console.log("Updated Study Area ID:", id);

  try {
    const studyAreaToUpdate = await StudyAreas.findByPk(id, {
      include: { model: Curriculum, as: "curriculums" }, // Include curriculums in the search
    });

    if (!studyAreaToUpdate) {
      return res.status(404).json({ error: "Study Area not found" });
    }

    // Update study area details
    await studyAreaToUpdate.update({
      name: name || studyAreaToUpdate.name,
    });

    // Manage curriculum associations (add or remove)
    if (curriculumIds && curriculumIds.length > 0) {
      const curriculums = await Curriculum.findAll({
        where: {
          id: curriculumIds,
        },
      });
      await studyAreaToUpdate.setCurriculums(curriculums); // Set new associations
    }

    res.status(200).json({
      message: "Study Area updated successfully",
      studyArea: studyAreaToUpdate,
    });
  } catch (error) {
    console.error("Error updating Study Area:", error);
    res.status(500).json({ error: "Failed to update Study Area" });
  }
};

// Delete a study area and its associated curriculums
export const deleteStudyArea = async (req, res) => {
  const { id } = req.params; // Study Area ID from the URL
  console.log("Deleted Study Area ID:", id);

  try {
    const studyAreaToDelete = await StudyAreas.findByPk(id, {
      include: {
        model: Curriculum,
        as: "curriculums",
      },
    });

    if (!studyAreaToDelete) {
      return res.status(404).json({ error: "Study Area not found" });
    }

    // Optionally, remove associations before deleting
    await studyAreaToDelete.setCurriculums([]); // Remove all associated curriculums

    await studyAreaToDelete.destroy(); // Delete the study area
    res.status(200).json({ message: "Study Area deleted successfully" });
  } catch (error) {
    console.error("Error deleting Study Area:", error);
    res.status(500).json({ error: "Failed to delete Study Area" });
  }
};
