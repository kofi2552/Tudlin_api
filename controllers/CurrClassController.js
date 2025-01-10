import Curriculum from "../models/Curriculum.js";
import Class from "../models/Class.js";
import CurriculumToClasses from "../models/CurriculumToClasses.js";

// Fetch all curriculums
export const getCurriculums = async (req, res) => {
  try {
    const curriculums = await Curriculum.findAll();
    res.status(200).json({ curriculums });
  } catch (error) {
    console.error("Error fetching curriculums:", error);
    res.status(500).json({ message: "Error fetching curriculums." });
  }
};

// Fetch a specific curriculum by ID
export const getCurriculumById = async (req, res) => {
  const { id } = req.params;
  console.log("curr by id: ", id);
  try {
    const curriculum = await Curriculum.findByPk(id, {
      include: {
        model: Class,
        as: "Classes", // Ensure alias matches the association
        through: { attributes: [] }, // Exclude join table data if not needed
      },
    });

    if (!curriculum) {
      return res.status(404).json({ message: "Curriculum not found" });
    }
    console.log("curr by id: ", id + " " + curriculum);
    res.status(200).json({ curriculum });
  } catch (error) {
    console.error("Error fetching curriculum by ID:", error);
    res.status(500).json({ message: "Error fetching curriculum." });
  }
};

// Add a new curriculum
export const addCurriculum = async (req, res) => {
  const { name } = req.body;

  try {
    const newCurriculum = await Curriculum.create({ name });
    res.status(201).json(newCurriculum);
  } catch (error) {
    console.error("Error creating curriculum:", error);
    res.status(500).json({ message: "Error creating curriculum." });
  }
};

// Fetch all classes for a specific curriculum
export const getClassesByCurriculum = async (req, res) => {
  const { curriculumId } = req.params;

  try {
    const curriculum = await Curriculum.findByPk(curriculumId, {
      include: {
        model: Class,
        as: "Classes", // Ensure alias matches the association
      },
    });

    if (!curriculum) return res.status(404).send("Curriculum not found");
    res.status(200).json(curriculum.Classes); // Return associated classes
  } catch (error) {
    console.error("Error fetching classes for curriculum:", error);
    res.status(500).json({ message: "Error fetching classes." });
  }
};

// Add a class to a curriculum
export const addClassToCurriculum = async (req, res) => {
  const { curriculumId } = req.params;
  const { className, years } = req.body; // Expect class details in request body

  console.log("curr class to be added: ", req.body);

  try {
    const curriculum = await Curriculum.findByPk(curriculumId);

    if (!curriculum) {
      return res.status(404).send("Curriculum not found");
    }

    // Create or find the class by name
    const [classInstance, created] = await Class.findOrCreate({
      where: { name: className },
      defaults: { years },
    });

    // Check if the association already exists
    const existingAssociation = await CurriculumToClasses.findOne({
      where: {
        curriculumId,
        classId: classInstance.id,
      },
    });

    if (existingAssociation) {
      return res
        .status(400)
        .send("Class is already associated with this curriculum");
    }

    // Create the association between the class and the curriculum
    await CurriculumToClasses.create({
      curriculumId,
      classId: classInstance.id,
    });

    res.status(200).json({
      message: "Class added to curriculum",
      class: classInstance,
      createdNewClass: created,
    });
  } catch (error) {
    console.error("Error adding class to curriculum:", error);
    res.status(500).send("Error adding class to curriculum");
  }
};

// Remove a class from a curriculum
export const deleteClassFromCurriculum = async (req, res) => {
  const { curriculumId, classId } = req.params;

  try {
    const association = await CurriculumToClasses.findOne({
      where: {
        curriculumId,
        classId,
      },
    });

    if (!association) {
      return res
        .status(404)
        .send("Class is not associated with this curriculum");
    }

    await association.destroy();

    res.status(200).send({
      message: "Class successfully removed from curriculum.",
    });
  } catch (error) {
    console.error("Error deleting class from curriculum:", error);
    res.status(500).send("Error deleting class from curriculum.");
  }
};

// Update a class in a curriculum
export const updateClassInCurriculum = async (req, res) => {
  const { curriculumId, classId } = req.params;
  const { name, years } = req.body;

  try {
    const association = await CurriculumToClasses.findOne({
      where: {
        curriculumId,
        classId,
      },
    });

    if (!association) {
      return res
        .status(404)
        .send("Class is not associated with this curriculum");
    }

    const [updated] = await Class.update(
      { name, years },
      { where: { id: classId } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Class not found" });
    }

    const updatedClass = await Class.findByPk(classId);

    return res.status(200).json({
      message: "Class successfully updated",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).send("Error updating class");
  }
};
