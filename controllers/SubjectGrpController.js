import SubjectGroup from "../models/SubjectGroups.js";

// Create a new class
export const createSubject = async (req, res) => {
  const { name } = req.body;
  console.log("new subjectGrp:", req.body);

  try {
    const newSubjectGrp = await SubjectGroup.create({
      name,
    });
    res.status(201).json({
      message: "Subject added successfully!",
      SubjectGrp: newSubjectGrp,
    });
  } catch (error) {
    console.error("Error creating Subject:", error);
    res.status(500).json({ error: "Failed to add Subject. Please try again." });
  }
};

// Get all subjects
export const getSubjectGrps = async (req, res) => {
  try {
    const subjects = await SubjectGroup.findAll();
    console.log(subjects);
    res.status(200).json({ subjects: subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch subjects. Please try again." });
  }
};

// Update subject details
export const updateSubject = async (req, res) => {
  const { id } = req.params; // Subject ID from the URL
  const { name, class_id } = req.body; // Data sent from the client
  console.log("Updated subject id:", id);

  try {
    const subjectToUpdate = await SubjectGroup.findByPk(id);

    if (!subjectToUpdate) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Update subject details
    await subjectToUpdate.update({
      name: name || subjectToUpdate.name,
      class_id: class_id || subjectToUpdate.class_id,
    });

    res.status(200).json({
      message: "Subject updated successfully",
      subject: subjectToUpdate,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Failed to update subject" });
  }
};

// Delete a subject
export const deleteSubject = async (req, res) => {
  const { id } = req.params; // Subject ID from the URL
  console.log("Deleted subject id:", id);

  try {
    const subjectToDelete = await SubjectGroup.findByPk(id);

    if (!subjectToDelete) {
      return res.status(404).json({ error: "Subject not found" });
    }

    await subjectToDelete.destroy(); // Delete the subject
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Failed to delete subject" });
  }
};
