import Curriculum from "../models/Curriculum.js";
import Subject from "../models/Subjects.js";
import CurriculumSubject from "../models/CurriculumSubject.js";
import StudyAreas from "../models/StudyAreas.js";
import CurrDivision from "../models/CurrDivision.js";
import CurriculumToDivision from "../models/CurriculumToDivision.js";
import School from "../models/School.js";
import sequelize from "../database.js";

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

export const getAllCurriculumDivisionsBySchool = async (req, res) => {
  const { schoolId } = req.params;

  console.log("Fetching curriculum divisions for school ID:", schoolId);
  try {
    const divisionCurricula = await CurrDivision.findAll({
      where: { specialId: schoolId },
      include: Curriculum,
    });

    res.status(200).json({ curriculumdiv: divisionCurricula });
  } catch (error) {
    console.error("Error fetching curriculum divisions:", error);
    res.status(500).json({ message: "Error fetching division's curriculums." });
  }
};

export const getAllCurriculaBySchool = async (req, res) => {
  const { schoolId } = req.params;

  console.log("Fetching curricula for school ID:", schoolId);

  try {
    const school = await School.findOne({ where: { specialId: schoolId } });

    if (!school) {
      return res.status(401).json({ message: "No School Found with this id." });
    }

    // Step 1: Fetch all divisions for the given school
    const divisions = await CurrDivision.findAll({
      where: { specialId: schoolId },
      attributes: ["id"], // Fetch only division IDs
    });

    // Step 2: Extract division IDs
    const divisionIds = divisions.map((division) => division.id);

    if (divisionIds.length === 0) {
      return res
        .status(404)
        .json({ message: "No Curriculum divisions found." });
    }

    // Step 3: Fetch curriculums associated with these divisions
    const curriculums = await Curriculum.findAll({
      include: [
        {
          model: CurrDivision,
          through: { attributes: [] }, // Ignore join table data
          where: { id: divisionIds }, // Filter by division IDs
          attributes: [], // Ignore division attributes
        },
      ],
      attributes: ["id", "name"], // Fetch only required curriculum fields
    });

    // Step 4: Return the fetched curriculums
    res.status(200).json({ curriculums });
  } catch (error) {
    console.error("Error fetching curriculums for school:", error);
    res.status(500).json({
      error: "Failed to fetch curriculums for the school",
      details: error.message,
    });
  }
};

export const getCurriculumsByDivision = async (req, res) => {
  const { divisionId } = req.params;
  try {
    const divisionWithCurricula = await CurrDivision.findByPk(divisionId, {
      include: Curriculum,
    });
    console.log("divisionWithCurricula: ", divisionWithCurricula);

    res.status(200).json({ curriculums: divisionWithCurricula.Curricula });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching division's curriculums." });
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
  const { divisionId } = req.params;
  const { name } = req.body;

  console.log("creating curr details: ", req.params, req.body);

  try {
    const division = await CurrDivision.findByPk(divisionId);

    if (!division) {
      res.status(401).json("Curriculum division not found!");
    }

    const newCurriculum = await Curriculum.create({ name });

    await CurriculumToDivision.create({
      curriculumId: newCurriculum.id,
      divisionId: division.id,
    });

    res.status(201).json(newCurriculum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating curriculum." });
  }
};

export const deleteCurriculum = async (req, res) => {
  const { divisionId, curriculumId } = req.params;

  console.log("deleting curriculum: ", { divisionId, curriculumId });

  try {
    // Check if division exists
    const division = await CurrDivision.findByPk(divisionId);
    if (!division) {
      return res
        .status(404)
        .json({ message: "Curriculum division not found!" });
    }

    // Check if curriculum exists
    const curriculum = await Curriculum.findByPk(curriculumId);
    if (!curriculum) {
      return res.status(404).json({ message: "Curriculum not found!" });
    }

    // Remove association between curriculum and division
    const deletedAssociation = await CurriculumToDivision.destroy({
      where: {
        divisionId,
        curriculumId,
      },
    });

    if (deletedAssociation === 0) {
      return res.status(404).json({ message: "Association not found!" });
    }

    // Optionally, delete curriculum if it has no other associations
    const remainingAssociations = await CurriculumToDivision.findOne({
      where: { curriculumId },
    });

    if (!remainingAssociations) {
      await Curriculum.destroy({ where: { id: curriculumId } });
    }

    res.status(200).json({ message: "Curriculum successfully deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting curriculum." });
  }
};

export const updateCurriculum = async (req, res) => {
  const { divisionId, curriculumId } = req.params;
  const { name } = req.body;

  console.log("updating curriculum: ", { divisionId, curriculumId, name });

  try {
    // Check if division exists
    const division = await CurrDivision.findByPk(divisionId);
    if (!division) {
      return res
        .status(404)
        .json({ message: "Curriculum division not found!" });
    }

    // Check if curriculum exists
    const curriculum = await Curriculum.findByPk(curriculumId);
    if (!curriculum) {
      return res.status(404).json({ message: "Curriculum not found!" });
    }

    // Update the curriculum name
    curriculum.name = name;
    await curriculum.save();

    res
      .status(200)
      .json({ message: "Curriculum successfully updated.", curriculum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating curriculum." });
  }
};

export const addCurrDivision = async (req, res) => {
  const { specialId } = req.params;
  const { name } = req.body;
  try {
    const newCurriculum = await CurrDivision.create({ name, specialId });
    res.status(201).json(newCurriculum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating curriculum." });
  }
};

export const DeleteCurrDivision = async (req, res) => {
  const { divisionId } = req.params;
  console.log("curr division id to be deleted: ", divisionId);
  try {
    const division = await CurrDivision.findByPk(divisionId);
    if (division) {
      await CurrDivision.destroy({ where: { id: divisionId } });
    }
    res.status(201).json({ message: "Curriculum successfully deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting curriculum." });
  }
};

export const updateCurrDivision = async (req, res) => {
  const { divisionId } = req.params;
  const { name } = req.body;
  console.log("updating curr id: ", divisionId);

  try {
    const division = await CurrDivision.findByPk(divisionId);
    if (division) {
      division.name = name;
      await division.save();
    }
    res.status(201).json({ message: "Curriculum updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating curriculum." });
  }
};

// Controller to get all subjects for a specific curriculum
// export const getSubjectsByCurriculum = async (req, res) => {
//   const { curriculumId } = req.params;

//   console.log("curriculums subjects id:", curriculumId);

//   try {
//     const curriculum = await Curriculum.findByPk(curriculumId, {
//       include: {
//         model: Subject,
//         as: "subjects", // Alias used in the association
//         include: {
//           model: StudyAreas,
//           as: "studyarea", // Alias used in the Subject -> StudyAreas association
//         },
//       },
//     });

//     if (!curriculum) return res.status(404).send("Curriculum not found");

//     res.status(200).json({
//       subjects: curriculum.subjects.map((subject) => ({
//         id: subject.id,
//         name: subject.name,
//         studyArea: subject.studyarea?.name, // Study area details included
//       })),
//     });
//   } catch (err) {
//     console.log("Error fetching subjects and study areas:", err);
//     res.status(500).send("Error fetching subjects and study areas");
//   }
// };

export const getSubjectsByCurriculum = async (req, res) => {
  const { curriculumId } = req.params;

  console.log("Fetching subjects for curriculum ID:", curriculumId);

  try {
    // Fetch curriculum subjects directly from the CurriculumSubject table
    const curriculumSubjects = await CurriculumSubject.findAll({
      where: { curriculumId },
      include: [
        {
          model: Subject,
          as: "subject", // Alias used in the association
          include: {
            model: StudyAreas,
            as: "studyarea", // Alias used in the Subject -> StudyAreas association
            attributes: ["id", "name"], // Include specific fields of StudyAreas
          },
          attributes: ["id", "name", "isArchive"], // Include id, name, and isArchive fields of Subject
        },
      ],
    });

    if (!curriculumSubjects.length) {
      return res.status(404).send("No subjects found for this curriculum");
    }

    // Format the subjects for the response
    const subjects = curriculumSubjects.map((curriculumSubject) => {
      const subject = curriculumSubject.subject; // Access the linked subject
      return {
        id: subject.id,
        name: subject.name,
        studyArea: subject.studyarea?.name || "Unknown", // Include study area details
        isArchive: subject.isArchive, // Include isArchive value
      };
    });

    res.status(200).json({ subjects });
  } catch (err) {
    console.error("Error fetching subjects for curriculum:", err);
    res.status(500).send("Error fetching subjects for curriculum");
  }
};

// Controller to add a subject to a curriculum
export const addSubjectToCurriculum = async (req, res) => {
  const { curriculumId } = req.params;
  const { name, studyareaid } = req.body;
  console.log("body: ", req.body);
  console.log(
    "received subject to be added data: ",
    curriculumId,
    " : ",
    name,
    " : ",
    studyareaid
  );

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Check if the study area exists
    const studyarea = await StudyAreas.findByPk(studyareaid, { transaction });
    if (!studyarea) {
      await transaction.rollback(); // Rollback if studyarea is not found
      return res.status(404).json({ error: "Study area not found" });
    }

    // Check if the curriculum exists
    const curriculum = await Curriculum.findByPk(curriculumId, { transaction });
    if (!curriculum) {
      await transaction.rollback(); // Rollback if curriculum is not found
      return res.status(404).json({ error: "Curriculum not found" });
    }

    // Create the new subject in the Subject table
    const newSubject = await Subject.create(
      {
        name,
        studyareaid: studyareaid,
        curriculumId: curriculumId,
      },
      { transaction }
    );

    if (!newSubject) {
      await transaction.rollback(); // Rollback if newSubject creation fails
      return res.status(404).json({ error: "New Subject was not added" });
    } else {
      console.log("newSubject: ", newSubject);
    }

    // Create the new subject in the CurriculumSubjects table
    const newCurriculumSubject = await CurriculumSubject.create(
      {
        name: newSubject.name,
        subjectId: newSubject.id,
        studyArea: studyarea.name,
        studyAreaId: studyareaid,
        curriculumId: curriculumId,
      },
      { transaction }
    );

    console.log("Subject added", newCurriculumSubject);

    // Commit the transaction if everything is successful
    await transaction.commit();

    return res.status(201).json({
      message: "Subject added to curriculum successfully",
      subject: newCurriculumSubject,
    });
  } catch (err) {
    console.error("Error adding subject to curriculum:", err);
    await transaction.rollback(); // Rollback the transaction on error
    res
      .status(500)
      .json({ error: "An error occurred while adding the subject" });
  }
};

export const editCurriculumSubject = async (req, res) => {
  const { subjectId, curriculumId } = req.params;
  const { name, studyareaid } = req.body;

  console.log("Subject to Update: ", subjectId, name, studyareaid);

  try {
    // Update the associated record in the CurriculumSubject table
    const curriculumSubject = await CurriculumSubject.findOne({
      where: { subjectId, curriculumId },
    });

    // Find the subject in the Subject table
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json({ error: "Subject not found in the Subject table" });
    }

    const StudyArea = await StudyAreas.findByPk(studyareaid);
    if (!StudyArea) {
      return res.status(404).json({ error: "studyArea not found" });
    }

    // Update the subject in the Subject table
    await subject.update({
      id: subjectId,
      name,
      studyareaid: studyareaid,
    });
    console.log("Subject updated in Subject table:", subject);

    if (curriculumSubject) {
      await curriculumSubject.update({
        name,
        subjectId: subject?.id,
        studyAreaId: studyareaid,
        studyArea: StudyArea?.name,
      });
      console.log(
        "Subject updated in CurriculumSubject table:",
        curriculumSubject
      );
    }

    return res.status(200).json({
      message: "Subject updated successfully in both tables",
      subject: curriculumSubject,
    });
  } catch (err) {
    console.error("Error updating subject:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the subject" });
  }
};

// export const deleteCurriculumSubject = async (req, res) => {
//   const { subjectId } = req.params;
//   console.log("Subject to be deleted:", subjectId);

//   try {
//     // Find the subject in the Subject table
//     const subject = await Subject.findByPk(subjectId);
//     if (!subject) {
//       return res
//         .status(404)
//         .json({ error: "Subject not found in the Subject table" });
//     }

//     // Delete the associated record from the CurriculumSubject table
//     const curriculumSubject = await CurriculumSubject.findOne({
//       where: { subjectId },
//     });
//     if (curriculumSubject) {
//       await curriculumSubject.destroy();
//       // console.log(
//       //   "Subject deleted from CurriculumSubject table:",
//       //   curriculumSubject
//       // );
//     }

//     await subject.destroy();

//     return res
//       .status(200)
//       .json({ message: "Subject deleted successfully from both tables" });
//   } catch (err) {
//     console.error("Error deleting subject:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while deleting the subject" });
//   }
// };

export const deleteCurriculumSubject = async (req, res) => {
  const { subjectId } = req.params;
  console.log("Subject to be archived:", subjectId);

  try {
    // Find the subject in the Subject table
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json({ error: "Subject not found in the Subject table" });
    }

    // Remove associations from the CurriculumSubject table
    const curriculumSubject = await CurriculumSubject.findOne({
      where: { subjectId },
    });

    if (curriculumSubject) {
      await curriculumSubject.destroy();
      console.log(
        "Subject association removed from CurriculumSubject table:"
        // curriculumSubject
      );
    }

    // Set the `isArchive` field to true instead of deleting the subject
    await subject.update({ isArchive: true });

    return res.status(200).json({
      message: "Subject archived successfully and associations removed",
    });
  } catch (err) {
    console.error("Error archiving subject:", err);
    res
      .status(500)
      .json({ error: "An error occurred while archiving the subject" });
  }
};

export const unarchiveSubject = async (req, res) => {
  const { subjectId } = req.params;
  console.log("Subject to be unarchived:", subjectId);

  try {
    // Find the subject in the Subject table
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Check if the subject is already unarchived (optional, but can prevent unnecessary update)
    if (!subject.isArchive) {
      return res.status(400).json({ error: "Subject is already unarchived" });
    }

    // Unarchive the subject by setting isArchive to false
    await subject.update({ isArchive: false });
    console.log("Subject unarchived successfully:", subject);

    const stdyArea = await StudyAreas.findByPk(subject?.studyareaid);

    // Assuming you have the curriculumId to associate the subject back
    const curriculumSubject = await CurriculumSubject.findOne({
      where: { subjectId }, // Find the existing relationship
    });

    if (!curriculumSubject) {
      // Create a new CurriculumSubject association if not found
      const newCurriculumSubject = await CurriculumSubject.create({
        subjectId: subject.id,
        curriculumId: subject.curriculumId,
        name: subject.name,
        studyAreaId: subject.studyareaid,
        studyArea: stdyArea.name,
      });
      console.log("New CurriculumSubject created:", newCurriculumSubject);
    }

    return res.status(200).json({
      message: "Subject unarchived and association restored successfully",
      subject: {
        id: subject.id,
        name: subject.name,
        isArchive: subject.isArchive,
      },
    });
  } catch (err) {
    console.error("Error unarchiving subject:", err);
    res
      .status(500)
      .json({ error: "An error occurred while unarchiving the subject" });
  }
};
