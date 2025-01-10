import Class from "../models/Class.js";
import Subject from "../models/Subjects.js";
import ClassToSubjects from "../models/ClassToSubject.js";

// Controller to get all classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.status(200).json({ classes });
    console.log("classes: ", classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching classes." });
  }
};

// Controller to get a specific class by ID and its associated subjects
export const getClassById = async (req, res) => {
  const { id } = req.params;
  //console.log("class id to fetch that class: ", id);

  try {
    const classInstance = await Class.findByPk(id, {
      include: {
        model: Subject,
        as: "Subjects", // Alias for subjects associated with this class
        through: { attributes: [] }, // Exclude join table data
      },
    });

    console.log("class found: ", classInstance);

    if (!classInstance) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(classInstance);
  } catch (error) {
    console.error("Error fetching class by ID:", error);
    res.status(500).json({ message: "Error fetching class." });
  }
};

// Controller to get all subjects for a specific class
export const getSubjectsByClass = async (req, res) => {
  const { id } = req.params;
  //console.log("class ID to fetch its subjects:", id);
  try {
    const classInstance = await Class.findByPk(id, {
      include: {
        model: Subject,
        as: "Subjects", // Correct alias as per the association
      },
    });

    if (!classInstance) return res.status(204).send("Class not found");
    res.status(200).json(classInstance.Subjects); // Return subjects associated with the class
  } catch (err) {
    console.error("Error fetching subjects", err);
    res.status(500).send("Error fetching subjects");
  }
};

// Controller to add a subject to a class
export const addSubjectToClass = async (req, res) => {
  const { classId, curriculumId } = req.params;
  const { subjectName, studyarea } = req.body; // Expect subject name to be passed in the request body

  console.log(
    "creating subj data: ",
    classId,
    subjectName,
    studyarea,
    curriculumId
  );

  try {
    // Find the class by ID
    const classInstance = await Class.findByPk(classId);
    if (!classInstance) {
      return res.status(404).send("Class not found");
    }

    // Create or find the subject by name
    const [subject, created] = await Subject.findOrCreate({
      where: {
        name: subjectName,
        studyareaid: studyarea,
        class_id: classId,
        curriculumId: curriculumId,
      },
    });

    // Check if the association already exists
    const existingAssociation = await ClassToSubjects.findOne({
      where: { classId, subjectId: subject.id },
    });
    if (existingAssociation) {
      return res
        .status(400)
        .send("Subject is already associated with this class");
    }

    // Create the association between the subject and the class
    await ClassToSubjects.create({
      classId,
      subjectId: subject.id,
    });

    // Fetch the updated list of subjects for the class (isArchive: false)
    const updatedSubjects = await classInstance.getSubjects({
      where: { isArchive: false }, // Only include non-archived subjects
    });

    // Send the updated list of subjects
    return res.status(200).json({
      message: created
        ? "Subject created and added to class successfully"
        : "Subject added to class successfully",
      subjects: updatedSubjects,
    });
  } catch (err) {
    console.error("Error adding subject to class: ", err);
    res.status(500).send("Error adding subject to class");
  }
};

//Controller to delete a subject from a class

export const deleteSubjectFromClass = async (req, res) => {
  const { classId, subjectId } = req.params;

  console.log("del subject ids: ", req.params);

  try {
    // Check if the association exists
    const association = await ClassToSubjects.findOne({
      where: {
        classId,
        subjectId,
      },
    });

    if (!association) {
      return res.status(404).send("Subject is not associated with this class");
    }

    // Remove the association
    await association.destroy();

    // Toggle the `isArchive` field of the subject to `true`
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).send("Subject not found");
    }

    subject.isArchive = true;
    await subject.save();

    res.status(200).send({
      message: "Subject successfully removed from class and archived",
      subject, // Include the updated subject in the response if needed
    });
  } catch (error) {
    console.error("Error deleting subject from class: ", error);
    res.status(500).send("Error deleting subject from class");
  }
};

// Controller to update a subject in a class (update subject name and subject area)
export const updateSubjectInClass = async (req, res) => {
  const { classId, subjectId } = req.params;
  const { subjectName, studyArea } = req.body;

  console.log("Received details to update subject:", req.params, req.body);

  try {
    // Validate that the association exists in ClassToSubjects
    const association = await ClassToSubjects.findOne({
      where: {
        classId,
        subjectId,
      },
    });

    if (!association) {
      return res.status(404).json({
        message: "Subject is not associated with this class",
      });
    }

    // Update the subject's name and/or study area
    const [updated] = await Subject.update(
      {
        name: subjectName, // Update subject name if provided
        studyAreaId: studyArea, // Update study area if provided
      },
      { where: { id: subjectId } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Fetch the updated list of subjects for the class
    const updatedSubjects = await Class.findByPk(classId, {
      include: [
        {
          model: Subject,
          as: "Subjects", // Match the alias defined in your associations
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    return res.status(200).json({
      message: "Subject successfully updated",
      subjects: updatedSubjects?.Subjects || [],
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    return res.status(500).json({
      message: "An error occurred while updating the subject",
      error: error.message,
    });
  }
};
