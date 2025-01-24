import Curriculum from "../models/Curriculum.js";
import Subject from "../models/Subjects.js";
import CurriculumSubject from "../models/CurriculumSubject.js";
import StudyAreas from "../models/StudyAreas.js";
import CurrDivision from "../models/CurrDivision.js";
import CurriculumToDivision from "../models/CurriculumToDivision.js";

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
export const getSubjectsByCurriculum = async (req, res) => {
  const { curriculumId } = req.params;

  console.log("curriculums subjects id:", curriculumId);

  try {
    const curriculum = await Curriculum.findByPk(curriculumId, {
      include: {
        model: Subject,
        as: "subjects", // Alias used in the association
        include: {
          model: StudyAreas,
          as: "studyarea", // Alias used in the Subject -> StudyAreas association
        },
      },
    });

    if (!curriculum) return res.status(404).send("Curriculum not found");

    res.status(200).json({
      subjects: curriculum.subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        studyArea: subject.studyarea?.name, // Study area details included
      })),
    });
  } catch (err) {
    console.log("Error fetching subjects and study areas:", err);
    res.status(500).send("Error fetching subjects and study areas");
  }
};

// Controller to add a subject to a curriculum
export const addSubjectToCurriculum = async (req, res) => {
  const { curriculumId } = req.params;
  const { name, studyareaid } = req.body;
  console.log("body: ", req.body);
  console.log(
    "recieved subject to be added data: ",
    curriculumId,
    " : ",
    name,
    " : ",
    studyareaid
  );

  try {
    // Check if the curriculum exists
    const studyarea = await StudyAreas.findByPk(studyareaid);
    if (!studyarea) {
      return res.status(404).json({ error: "studyarea not found" });
    }

    // Check if the curriculum exists
    const curriculum = await Curriculum.findByPk(curriculumId);
    if (!curriculum) {
      return res.status(404).json({ error: "Curriculum not found" });
    }

    // Create the new subject in the Subject table
    const newSubject = await Subject.create({
      name,
      studyareaid: studyareaid,
      curriculumId: curriculumId,
    });

    if (!newSubject) {
      return res.status(404).json({ error: "New Subject was not added" });
    } else {
      console.log("newSubject: ", newSubject);
    }
    // Create the new subject in the CurriculumSubjects table
    const newCurriculumSubject = await CurriculumSubject.create({
      name: newSubject.name,
      subjectId: newSubject.id,
      studyArea: studyarea.name,
      studyAreaId: studyareaid,
      curriculumId: curriculumId,
    });

    //console.log("Subject added", newCurriculumSubject);

    return res.status(201).json({
      message: "Subject added to curriculum successfully",
      subject: newCurriculumSubject,
    });
  } catch (err) {
    console.error("Error adding subject to curriculum:", err);
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

export const deleteCurriculumSubject = async (req, res) => {
  const { subjectId } = req.params;
  //console.log("Subject to delete:", subjectId);

  try {
    // Find the subject in the Subject table
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json({ error: "Subject not found in the Subject table" });
    }

    // Delete the subject from the Subject table
    await subject.destroy();
    //console.log("Subject deleted from Subject table:", subject);

    // Delete the associated record from the CurriculumSubject table
    const curriculumSubject = await CurriculumSubject.findOne({
      where: { subjectId },
    });
    if (curriculumSubject) {
      await curriculumSubject.destroy();
      // console.log(
      //   "Subject deleted from CurriculumSubject table:",
      //   curriculumSubject
      // );
    }

    return res
      .status(200)
      .json({ message: "Subject deleted successfully from both tables" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the subject" });
  }
};
