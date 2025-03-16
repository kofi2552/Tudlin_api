import {
  Subject,
  Class,
  StudyAreas,
  Curriculum,
} from "../models/associations.js";

// Create a new class
export const createSubject = async (req, res) => {
  const { name, content } = req.body;
  console.log("new subject name:", name, content);

  try {
    const newSubject = await Subject.create({
      name,
      content,
    });
    res
      .status(201)
      .json({ message: "Subject added successfully!", Subject: newSubject });
  } catch (error) {
    console.error("Error creating Subject:", error);
    res.status(500).json({ error: "Failed to add Subject. Please try again." });
  }
};

// Get a subject
export const getSubject = async (req, res) => {
  const { id } = req.params;
  console.log("subject to be fetched id: ", id);
  try {
    const subject = await Subject.findByPk(id, {
      include: [
        {
          model: Class,
          as: "class",
          attributes: ["id", "name"],
        },
        {
          model: Curriculum,
          as: "curriculum",
        },
        {
          model: StudyAreas,
          as: "studyarea",
        },
      ],
    });

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json({ subject });
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ error: "Failed to fetch subject" });
  }
};

// Get all subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
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
  const { subjectName, curriculumId, content } = req.body;
  console.log("Updated subject id:", id, req.body);

  try {
    const subjectToUpdate = await Subject.findByPk(id);

    if (!subjectToUpdate) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Update subject details
    await subjectToUpdate.update({
      name: subjectName || subjectToUpdate.subjectName,
      content: content || subjectToUpdate.content,
      curriculumId: curriculumId || subjectToUpdate.curriculumId,
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
  console.log("Subject ID to delete:", id);

  try {
    const subjectToDelete = await Subject.findByPk(id);

    if (!subjectToDelete) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Check if the 'isArchive' field is set to true
    if (!subjectToDelete.isArchive) {
      return res
        .status(400)
        .json({ error: "Only archived subjects can be deleted" });
    }

    await subjectToDelete.destroy(); // Delete the subject
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Failed to delete subject" });
  }
};
