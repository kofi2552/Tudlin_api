import Curriculum from "../models/Curriculum.js";
import Subject from "../models/Subjects.js";
import CurriculumToSubjects from "../models/ClassToSubject.js";

export const getCurriculums = async (req, res) => {
  try {
    const curriculums = await Curriculum.findAll();
    res.status(200).json({ curriculums });
    // console.log("curriculums: ", curriculums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching curriculums." });
  }
};

//getcurrbyID
export const getCurriculumById = async (req, res) => {
  const { id } = req.params;
  console.log("curr id: ", id);

  try {
    const curriculum = await Curriculum.findByPk(id, {
      include: {
        model: Subject,
        as: "Subject", // Alias used in the association
        through: { attributes: [] }, // Exclude join table data if not needed
      },
    });

    if (!curriculum) {
      return res.status(404).json({ message: "Curriculum not found" });
    }

    res.status(200).json(curriculum);
  } catch (error) {
    console.error("Error fetching curriculum by ID:", error);
    res.status(500).json({ message: "Error fetching curriculum." });
  }
};

export const addCurriculum = async (req, res) => {
  const { name } = req.body;
  try {
    const newCurriculum = await Curriculum.create({ name });
    res.status(201).json(newCurriculum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating curriculum." });
  }
};

// Controller to get all subjects for a specific curriculum
export const getSubjectsByCurriculum = async (req, res) => {
  const { curriculumId } = req.params;

  try {
    const curriculum = await Curriculum.findByPk(curriculumId, {
      include: {
        model: Subject,
        as: "curriculum", // Alias used in the association
      },
    });

    if (!curriculum) return res.status(404).send("Curriculum not found");
    res.status(200).json(curriculum.curriculum); // Return subjects associated with curriculum
  } catch (err) {
    res.status(500).send("Error fetching subjects");
  }
};

// Controller to add a subject to a curriculum
export const addSubjectToCurriculum = async (req, res) => {
  const { curriculumId } = req.params;
  const { subjectName } = req.body; // Expect subject name to be passed in the request body

  // console.log("curr create subj data: ", curriculumId, subjectName);

  try {
    // Find the curriculum by ID
    const curriculum = await Curriculum.findByPk(curriculumId);

    if (!curriculum) {
      return res.status(404).send("Curriculum not found");
    }

    // Create or find the subject by name
    const [subject, created] = await Subject.findOrCreate({
      where: { name: subjectName },
    });

    // Check if the association already exists
    const existingAssociation = await CurriculumToSubjects.findOne({
      where: {
        curriculumId,
        subjectId: subject.id,
      },
    });

    if (existingAssociation) {
      return res
        .status(400)
        .send("Subject is already associated with this curriculum");
    }

    // Create the association between the subject and the curriculum
    await CurriculumToSubjects.create({
      curriculumId,
      subjectId: subject.id,
    });

    res.status(200).send({
      message: "Subject added to curriculum",
      subject,
      createdNewSubject: created, // Indicates if a new subject was created
    });
  } catch (err) {
    console.error("Error adding subject to curriculum: ", err);
    res.status(500).send("Error adding subject to curriculum");
  }
};

export const deleteSubjectFromCurriculum = async (req, res) => {
  const { curriculumId, subjectId } = req.params;

  try {
    // Check if the association exists
    const association = await CurriculumToSubjects.findOne({
      where: {
        curriculumId,
        subjectId,
      },
    });

    if (!association) {
      return res
        .status(404)
        .send("Subject is not associated with this curriculum");
    }

    // Remove the association
    await association.destroy();

    // Delete the subject from the subject table
    const deletedSubject = await Subject.destroy({
      where: {
        id: subjectId,
      },
    });

    if (!deletedSubject) {
      return res.status(404).send("Subject not found in the subject table");
    }

    res.status(200).send({
      message:
        "Subject successfully removed from curriculum and deleted from the database",
    });
  } catch (error) {
    console.error(
      "Error deleting subject from curriculum and database: ",
      error
    );
    res.status(500).send("Error deleting subject from curriculum and database");
  }
};

//update subject
export const updateSubjectInCurriculum = async (req, res) => {
  const { curriculumId, subjectId } = req.params;
  const { name } = req.body;

  try {
    // Check if the association exists
    const association = await CurriculumToSubjects.findOne({
      where: {
        curriculumId,
        subjectId,
      },
    });

    if (!association) {
      return res
        .status(404)
        .send("Subject is not associated with this curriculum");
    }

    // Update the subject name
    const [updated] = await Subject.update(
      { name },
      { where: { id: subjectId } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Fetch the updated subject
    const updatedSubject = await Subject.findByPk(subjectId);

    return res.status(200).json({
      message: "Subject successfully updated",
      subject: updatedSubject, // Return the updated subject data
    });
  } catch (error) {
    console.error("Error updating subject: ", error);
    res.status(500).send("Error updating subject");
  }
};
