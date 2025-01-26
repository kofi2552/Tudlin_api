import Curriculum from "../models/Curriculum.js";
import Class from "../models/Class.js";
import CurriculumToClasses from "../models/CurriculumToClasses.js";
import ClassToSubjects from "../models/ClassToSubject.js";
import CurriculumSubject from "../models/CurriculumSubject.js";
import Subject from "../models/Subjects.js";
import StudyArea from "../models/StudyAreas.js";
import sequelize from "../database.js";

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
  console.log("fetching classess for curr id: ", curriculumId);
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

// Controller to get all subjects for a specific curriculum
// export const getSubjectsByClass = async (req, res) => {
//   const { curriculumId, classId } = req.params;
//   console.log("class subjects req.params: ", req.params);
//   console.log(
//     "Fetching subjects for curriculum and class:",
//     curriculumId,
//     classId
//   );

//   try {
//     // Check if the curriculum exists
//     const curriculum = await Curriculum.findByPk(curriculumId);
//     if (!curriculum) {
//       return res.status(404).send("Curriculum not found");
//     }

//     const curriculumSubjects = await CurriculumSubject.findAll({
//       where: { curriculumId },
//       include: {
//         model: Subject, // Ensure subjects are included
//         as: "subject", // Match the alias defined in associations
//       },
//     });

//     // Fetch class subjects with related subject and study area data
//     const classSubjects = await ClassToSubjects.findAll({
//       where: { classId },
//       include: [
//         {
//           model: Subject, // Assuming Subject is associated with ClassToSubjects
//           include: [
//             {
//               model: StudyArea, // Assuming StudyArea is associated with Subject
//               as: "studyarea",
//               attributes: ["id", "name"], // Include specific fields of StudyArea
//             },
//           ],
//           attributes: ["id", "name"], // Include specific fields of Subject
//         },
//       ],
//     });

//     // Format the response data
//     const formattedSubjects = classSubjects.map((classSubject) => {
//       const subject = classSubject.Subject;
//       console.log("classSubject: ", subject);
//       return {
//         id: subject.id,
//         name: subject.name,
//         studyArea: subject.studyarea?.name || "Unknown", // Study area details included
//       };
//     });

//     res.status(200).json({ subjects: formattedSubjects });
//   } catch (err) {
//     console.error("Error fetching subjects and study areas:", err);
//     res.status(500).send("Error fetching subjects and study areas");
//   }
// };

// export const getSubjectsByClass = async (req, res) => {
//   const { curriculumId, classId } = req.params;
//   console.log("class subjects req.params: ", req.params);

//   try {
//     // Check if the curriculum exists
//     const curriculum = await Curriculum.findByPk(curriculumId);
//     if (!curriculum) {
//       return res.status(404).send("Curriculum not found");
//     }

//     if (classId === "undefined") {
//       return res.status(404).send("Class not available");
//     }

//     // Fetch all subjects in the curriculum
//     const curriculumSubjects = await CurriculumSubject.findAll({
//       where: { curriculumId },
//       attributes: ["subjectId"],
//     });

//     // Fetch all subjects already linked to the class in ClassToSubjects
//     const classSubjectIds = await ClassToSubjects.findAll({
//       where: { classId },
//       attributes: ["subjectId"], // Only fetch the subjectId
//     }).then((records) => records.map((record) => record.subjectId));

//     // Filter curriculum subjects to find the ones not in ClassToSubjects
//     const missingSubjects = curriculumSubjects.filter(
//       (curriculumSubject) =>
//         !classSubjectIds.includes(curriculumSubject.subjectId)
//     );

//     if (missingSubjects) {
//       // Create entries in ClassToSubjects for the missing subjects
//       const newClassSubjects = missingSubjects.map((subject) => ({
//         classId,
//         subjectId: subject.subjectId,
//       }));

//       if (newClassSubjects.length > 0) {
//         await ClassToSubjects.bulkCreate(newClassSubjects);
//         console.log("ClassToSubjects updated with new entries.");
//       }
//     }
//     // Fetch all class subjects with related data for response
//     const classSubjects = await ClassToSubjects.findAll({
//       where: { classId },
//       include: [
//         {
//           model: Subject, // Assuming Subject is associated with ClassToSubjects
//           include: [
//             {
//               model: StudyArea, // Assuming StudyArea is associated with Subject
//               as: "studyarea",
//               attributes: ["id", "name"], // Include specific fields of StudyArea
//             },
//           ],
//           attributes: ["id", "name"], // Include specific fields of Subject
//         },
//       ],
//     });

//     // Format the response data
//     const formattedSubjects = classSubjects.map((classSubject) => {
//       const subject = classSubject.Subject;
//       return {
//         id: subject.id,
//         name: subject.name,
//         studyArea: subject.studyarea?.name || "Unknown",
//       };
//     });

//     res.status(200).json({ subjects: formattedSubjects });
//   } catch (err) {
//     console.error("Error fetching subjects and updating ClassToSubjects:", err);
//     res
//       .status(500)
//       .send("Error fetching subjects and updating ClassToSubjects");
//   }
// };

// Add a class to a curriculum
// export const addClassToCurriculum = async (req, res) => {
//   const { curriculumId } = req.params;
//   const { className, years } = req.body;

//   console.log("curr class to be added: ", req.body, "  currId: ", curriculumId);

//   try {
//     const curriculum = await Curriculum.findByPk(curriculumId);

//     if (!curriculum) {
//       return res.status(404).send("Curriculum not found");
//     }

//     // Create or find the class by name
//     const [classInstance, created] = await Class.findOrCreate({
//       where: { name: className },
//       defaults: { years },
//     });

//     // Check if the association already exists
//     const existingAssociation = await CurriculumToClasses.findOne({
//       where: {
//         curriculumId,
//         classId: classInstance.id,
//       },
//     });

//     if (existingAssociation) {
//       return res
//         .status(400)
//         .send("Class is already associated with this curriculum");
//     }

//     // Create the association between the class and the curriculum
//     await CurriculumToClasses.create({
//       curriculumId,
//       classId: classInstance.id,
//     });

//     // Step 2: Fetch all subjects for the curriculum
//     const curriculumSubjects = await CurriculumSubject.findAll({
//       where: { curriculumId },
//       include: {
//         model: Subject, // Ensure subjects are included
//         as: "subject", // Match the alias defined in associations
//       },
//     });

//     console.log("curriculumSubjects: ", curriculumSubjects);

//     // Check for missing subjects
//     const invalidSubjects = curriculumSubjects.filter((cs) => !cs.subject);
//     if (invalidSubjects.length) {
//       console.error("Invalid subjects found:", invalidSubjects);
//       return res
//         .status(400)
//         .send("Some curriculum subjects do not have valid linked subjects.");
//     }

// // Step 3: Map subjects into ClassToSubjects
// const classSubjects = curriculumSubjects.map((curriculumSubject) => ({
//   classId: classInstance.id,
//   subjectId: curriculumSubject.subject?.id, // Ensure valid subjectId
// }));

// // Validate that all subjects exist in the database
// if (classSubjects.some((cs) => !cs.subjectId)) {
//   return res.status(400).send("Invalid subject data in curriculum");
// }

// // Step 4: Bulk create records in ClassToSubjects
// await ClassToSubjects.bulkCreate(classSubjects);

//     res.status(200).json({
//       message: "Class added to curriculum",
//       class: classInstance,
//       createdNewClass: created,
//       subjects: curriculumSubjects,
//     });
//   } catch (error) {
//     console.error("Error adding class to curriculum:", error);
//     res.status(500).send("Error adding class to curriculum");
//   }
// };

// export const addClassToCurriculum = async (req, res) => {
//   const { curriculumId } = req.params;
//   const { className, years } = req.body;

//   console.log("curr class to be added: ", req.body, "  currId: ", curriculumId);

//   const transaction = await sequelize.transaction(); // Start a transaction

//   try {
//     const curriculum = await Curriculum.findByPk(curriculumId, { transaction });

//     if (!curriculum) {
//       await transaction.rollback(); // Rollback if curriculum is not found
//       return res.status(404).send("Curriculum not found");
//     }

//     // Create or find the class by name
//     const [classInstance, created] = await Class.findOrCreate({
//       where: { name: className },
//       defaults: { years },
//       transaction,
//     });

//     // Check if the association already exists
//     const existingAssociation = await CurriculumToClasses.findOne({
//       where: {
//         curriculumId,
//         classId: classInstance.id,
//       },
//       transaction,
//     });

//     if (existingAssociation) {
//       await transaction.rollback(); // Rollback if association already exists
//       return res
//         .status(400)
//         .send("Class is already associated with this curriculum");
//     }

//     // Create the association between the class and the curriculum
//     await CurriculumToClasses.create(
//       {
//         curriculumId,
//         classId: classInstance.id,
//       },
//       { transaction }
//     );

//     // Fetch all subjects for the curriculum
//     const curriculumSubjects = await CurriculumSubject.findAll({
//       where: { curriculumId },
//       include: {
//         model: Subject,
//         as: "subject", // Match the alias defined in associations
//       },
//       transaction,
//     });

//     //console.log("curriculumSubjects: ", curriculumSubjects);

//     // Check for missing subjects
//     const invalidSubjects = curriculumSubjects.filter((cs) => !cs.subject);
//     if (invalidSubjects.length) {
//       await transaction.rollback(); // Rollback if invalid subjects are found
//       console.error("Invalid subjects found:", invalidSubjects);
//       return res
//         .status(400)
//         .send("Some curriculum subjects do not have valid linked subjects.");
//     }

//     // Map subjects into ClassToSubjects
//     const classSubjects = curriculumSubjects.map((curriculumSubject) => ({
//       classId: classInstance.id,
//       subjectId: curriculumSubject.subject?.id, // Ensure valid subjectId
//     }));

//     // Validate that all subjects exist in the database
//     if (classSubjects.some((cs) => !cs.subjectId)) {
//       await transaction.rollback(); // Rollback if invalid subject data is found
//       return res.status(400).send("Invalid subject data in curriculum");
//     }

//     // Bulk create records in ClassToSubjects
//     await ClassToSubjects.bulkCreate(classSubjects, { transaction });

//     // Commit the transaction if everything succeeds
//     await transaction.commit();

//     res.status(200).json({
//       message: "Class added to curriculum",
//       class: classInstance,
//       createdNewClass: created,
//       subjects: curriculumSubjects,
//     });
//   } catch (error) {
//     console.error("Error adding class to curriculum:", error);
//     await transaction.rollback(); // Rollback the transaction on error
//     res.status(500).send("Error adding class to curriculum");
//   }
// };

// Remove a class from a curriculum

// export const addClassToCurriculum = async (req, res) => {
//   const { curriculumId } = req.params;
//   const { className, years } = req.body;

//   console.log("curr class to be added: ", req.body, "  currId: ", curriculumId);

//   const transaction = await sequelize.transaction(); // Start a transaction

//   try {
//     const curriculum = await Curriculum.findByPk(curriculumId, { transaction });

//     if (!curriculum) {
//       await transaction.rollback(); // Rollback if curriculum is not found
//       return res.status(404).send("Curriculum not found");
//     }

//     // Create or find the class by name
//     const [classInstance, created] = await Class.findOrCreate({
//       where: { name: className },
//       defaults: { years },
//       transaction,
//     });

//     // Check if the association already exists
//     const existingAssociation = await CurriculumToClasses.findOne({
//       where: {
//         curriculumId,
//         classId: classInstance.id,
//       },
//       transaction,
//     });

//     if (existingAssociation) {
//       await transaction.rollback(); // Rollback if association already exists
//       return res
//         .status(400)
//         .send("Class is already associated with this curriculum");
//     }

//     // Create the association between the class and the curriculum
//     await CurriculumToClasses.create(
//       {
//         curriculumId,
//         classId: classInstance.id,
//       },
//       { transaction }
//     );

//     // Fetch all subjects for the curriculum
//     const curriculumSubjects = await CurriculumSubject.findAll({
//       where: { curriculumId },
//       include: {
//         model: Subject,
//         as: "subject", // Match the alias defined in associations
//       },
//       transaction,
//     });

//     // Check for missing subjects
//     const invalidSubjects = curriculumSubjects.filter((cs) => !cs.subject);
//     if (invalidSubjects.length) {
//       await transaction.rollback(); // Rollback if invalid subjects are found
//       console.error("Invalid subjects found:", invalidSubjects);
//       return res
//         .status(400)
//         .send("Some curriculum subjects do not have valid linked subjects.");
//     }

//     // Map subjects into ClassToSubjects
//     const classSubjects = curriculumSubjects.map((curriculumSubject) => ({
//       classId: classInstance.id,
//       subjectId: curriculumSubject.subject?.id, // Ensure valid subjectId
//     }));

//     // Validate that all subjects exist in the database
//     if (classSubjects.some((cs) => !cs.subjectId)) {
//       await transaction.rollback(); // Rollback if invalid subject data is found
//       return res.status(400).send("Invalid subject data in curriculum");
//     }

//     // Bulk create records in ClassToSubjects
//     await ClassToSubjects.bulkCreate(classSubjects, { transaction });

//     // Update the class_id for each subject linked to the curriculum
//     const subjectIds = curriculumSubjects.map((cs) => cs.subject?.id); // Extract valid subject IDs
//     await Subject.update(
//       { class_id: classInstance.id }, // Set the class_id for all subjects
//       {
//         where: {
//           id: subjectIds, // Match subjects by their IDs
//         },
//         transaction,
//       }
//     );

//     // Commit the transaction if everything succeeds
//     await transaction.commit();

//     res.status(200).json({
//       message: "Class added to curriculum",
//       class: classInstance,
//       createdNewClass: created,
//       subjects: curriculumSubjects,
//     });
//   } catch (error) {
//     console.error("Error adding class to curriculum:", error);
//     await transaction.rollback(); // Rollback the transaction on error
//     res.status(500).send("Error adding class to curriculum");
//   }
// };

export const getSubjectsByClass = async (req, res) => {
  const { curriculumId, classId } = req.params;
  console.log("class subjects req.params: ", req.params);

  try {
    // Check if the curriculum exists
    const curriculum = await Curriculum.findByPk(curriculumId);
    if (!curriculum) {
      return res.status(404).send("Curriculum not found");
    }

    if (!classId || classId === "undefined") {
      return res.status(404).send("Class not available");
    }

    // Fetch all subjects already linked to the class in ClassToSubjects
    const classSubjects = await ClassToSubjects.findAll({
      where: { classId }, // Directly filter by classId
      include: [
        {
          model: Subject, // Assuming Subject is associated with ClassToSubjects
          where: { isArchive: false }, // Filter by truthy isArchive field
          include: [
            {
              model: StudyArea, // Assuming StudyArea is associated with Subject
              as: "studyarea",
              attributes: ["id", "name"], // Include specific fields of StudyArea
            },
          ],
          attributes: ["id", "name", "class_id", "isArchive"], // Include specific fields of Subject
        },
      ],
    });

    // Format the response
    const formattedSubjects = classSubjects.map((classSubject) => {
      const subject = classSubject.Subject;
      return {
        id: subject.id,
        name: subject.name,
        studyArea: subject.studyarea?.name || "Unknown",
        classId: subject.class_id, // Include classId for context
        isArchive: subject.isArchive, // Include isArchive for clarity
      };
    });

    res.status(200).json({ subjects: formattedSubjects });
  } catch (err) {
    console.error("Error fetching subjects for the class:", err);
    res.status(500).send("Error fetching subjects for the class");
  }
};

// export const addClassToCurriculum = async (req, res) => {
//   const { curriculumId } = req.params;
//   const { className, years } = req.body;

//   console.log("curr class to be added: ", req.body, "  currId: ", curriculumId);

//   const transaction = await sequelize.transaction(); // Start a transaction

//   try {
//     const curriculum = await Curriculum.findByPk(curriculumId, { transaction });

//     if (!curriculum) {
//       await transaction.rollback(); // Rollback if curriculum is not found
//       return res.status(404).send("Curriculum not found");
//     }

//     // Create or find the class by name
//     const [classInstance, created] = await Class.findOrCreate({
//       where: { name: className },
//       defaults: { years },
//       transaction,
//     });

//     // Check if the association already exists
//     const existingAssociation = await CurriculumToClasses.findOne({
//       where: {
//         curriculumId,
//         classId: classInstance.id,
//       },
//       transaction,
//     });

//     if (existingAssociation) {
//       await transaction.rollback(); // Rollback if association already exists
//       return res
//         .status(400)
//         .send("Class is already associated with this curriculum");
//     }

//     // Create the association between the class and the curriculum
//     await CurriculumToClasses.create(
//       {
//         curriculumId,
//         classId: classInstance.id,
//       },
//       { transaction }
//     );

//     // Fetch all subjects for the curriculum
//     const curriculumSubjects = await CurriculumSubject.findAll({
//       where: { curriculumId },
//       include: {
//         model: Subject,
//         as: "subject", // Match the alias defined in associations
//       },
//       transaction,
//     });

//     // Check for missing subjects
//     const invalidSubjects = curriculumSubjects.filter((cs) => !cs.subject);
//     if (invalidSubjects.length) {
//       await transaction.rollback(); // Rollback if invalid subjects are found
//       console.error("Invalid subjects found:", invalidSubjects);
//       return res
//         .status(400)
//         .send("Some curriculum subjects do not have valid linked subjects.");
//     }

//     // Duplicate subjects for the new class
//     const newSubjects = await Promise.all(
//       curriculumSubjects.map(async (curriculumSubject) => {
//         const originalSubject = curriculumSubject.subject;
//         if (!originalSubject) return null;

//         // Create a new subject with the same study area and updated name
//         const duplicatedSubject = await Subject.create(
//           {
//             name: `${originalSubject.name}_${classInstance.name}`, // Add class initials to subject name
//             description: originalSubject.description,
//             curriculumId, // Associate with the same curriculum
//             class_id: classInstance.id, // Associate with the new class
//             studyareaid: originalSubject.studyareaid, // Maintain the same study area
//           },
//           { transaction }
//         );

//         return duplicatedSubject;
//       })
//     );

//     // Step 5: Link new subjects to the class using ClassToSubjects
//     const classSubjects = newSubjects.map((subject) => ({
//       classId: classInstance.id,
//       subjectId: subject.id, // Use the ID of the newly created subject
//     }));

//     // Validate that all subjects exist in the database
//     if (classSubjects.some((cs) => !cs.subjectId)) {
//       await transaction.rollback(); // Rollback if invalid subject data is found
//       return res.status(400).send("Invalid subject data in curriculum");
//     }

//     // Bulk create records in ClassToSubjects
//     await ClassToSubjects.bulkCreate(classSubjects, { transaction });

//     // Commit the transaction if everything succeeds
//     await transaction.commit();

//     res.status(200).json({
//       message: "Class added to curriculum with unique subjects",
//       class: classInstance,
//       createdNewClass: created,
//       subjects: newSubjects,
//     });
//   } catch (error) {
//     console.error("Error adding class to curriculum:", error);
//     await transaction.rollback(); // Rollback the transaction on error
//     res.status(500).send("Error adding class to curriculum");
//   }
// };

export const addClassToCurriculum = async (req, res) => {
  const { curriculumId } = req.params;
  const { className, years } = req.body;

  console.log("curr class to be added: ", req.body, "  currId: ", curriculumId);

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const curriculum = await Curriculum.findByPk(curriculumId, { transaction });

    if (!curriculum) {
      await transaction.rollback(); // Rollback if curriculum is not found
      return res.status(404).send("Curriculum not found");
    }

    // Create or find the class by name
    const [classInstance, created] = await Class.findOrCreate({
      where: { name: className },
      defaults: { years },
      transaction,
    });

    // Check if the association already exists
    const existingAssociation = await CurriculumToClasses.findOne({
      where: {
        curriculumId,
        classId: classInstance.id,
      },
      transaction,
    });

    if (existingAssociation) {
      await transaction.rollback(); // Rollback if association already exists
      return res
        .status(400)
        .send("Class is already associated with this curriculum");
    }

    // Create the association between the class and the curriculum
    await CurriculumToClasses.create(
      {
        curriculumId,
        classId: classInstance.id,
      },
      { transaction }
    );

    // Fetch all subjects for the curriculum
    const curriculumSubjects = await CurriculumSubject.findAll({
      where: { curriculumId },
      include: {
        model: Subject,
        as: "subject", // Match the alias defined in associations
      },
      transaction,
    });

    // Filter out archived subjects
    const validCurriculumSubjects = curriculumSubjects.filter(
      (cs) => cs.subject && !cs.subject.isArchive
    );

    if (validCurriculumSubjects.length === 0) {
      await transaction.rollback(); // Rollback if no valid subjects are found
      return res
        .status(400)
        .send("No valid subjects to duplicate for this class");
    }

    // Duplicate subjects for the new class
    const newSubjects = await Promise.all(
      validCurriculumSubjects.map(async (curriculumSubject) => {
        const originalSubject = curriculumSubject.subject;
        if (!originalSubject) return null;

        // Create a new subject with the same study area and updated name
        const duplicatedSubject = await Subject.create(
          {
            name: `${originalSubject.name}_${classInstance.name}`, // Add class initials to subject name
            description: originalSubject.description,
            curriculumId, // Associate with the same curriculum
            class_id: classInstance.id, // Associate with the new class
            studyareaid: originalSubject.studyareaid, // Maintain the same study area
          },
          { transaction }
        );

        return duplicatedSubject;
      })
    );

    // Step 5: Link new subjects to the class using ClassToSubjects
    const classSubjects = newSubjects
      .map((subject) =>
        subject
          ? {
              classId: classInstance.id,
              subjectId: subject.id, // Use the ID of the newly created subject
            }
          : null
      )
      .filter(Boolean); // Filter out any null values

    // Validate that all subjects exist in the database
    if (classSubjects.some((cs) => !cs.subjectId)) {
      await transaction.rollback(); // Rollback if invalid subject data is found
      return res.status(400).send("Invalid subject data in curriculum");
    }

    // Bulk create records in ClassToSubjects
    await ClassToSubjects.bulkCreate(classSubjects, { transaction });

    // Commit the transaction if everything succeeds
    await transaction.commit();

    res.status(200).json({
      message: "Class added to curriculum with unique subjects",
      class: classInstance,
      createdNewClass: created,
      subjects: newSubjects,
    });
  } catch (error) {
    console.error("Error adding class to curriculum:", error);
    await transaction.rollback(); // Rollback the transaction on error
    res.status(500).send("Error adding class to curriculum");
  }
};

export const addSubjectToClass = async (req, res) => {
  const { curriculumId, classId } = req.params;
  const { subjectId } = req.body;

  console.log("Duplicate subject request received: ", {
    curriculumId,
    classId,
    subjectId,
  });

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // Fetch the curriculum
    const curriculum = await Curriculum.findByPk(curriculumId, { transaction });
    if (!curriculum) {
      await transaction.rollback(); // Rollback if curriculum is not found
      return res.status(404).send("Curriculum not found");
    }

    // Check if the subject is part of the curriculum in the CurriculumSubject table
    const curriculumSubject = await CurriculumSubject.findOne({
      where: { curriculumId, subjectId },
      transaction,
    });
    if (!curriculumSubject) {
      await transaction.rollback(); // Rollback if subject is not linked to the curriculum
      return res
        .status(404)
        .send("Subject is not associated with the specified curriculum");
    }

    // Fetch the class
    const classInstance = await Class.findByPk(classId, { transaction });
    if (!classInstance) {
      await transaction.rollback(); // Rollback if class is not found
      return res.status(404).send("Class not found");
    }

    // Fetch the subject to duplicate
    const originalSubject = await Subject.findByPk(subjectId, { transaction });
    if (!originalSubject) {
      await transaction.rollback(); // Rollback if subject is not found
      return res.status(404).send("Subject not found");
    }

    // if (originalSubject) {
    //   await Subject.update(
    //     { class_id: classInstance.id },
    //     { where: { class_id: classId } }
    //   );
    // }

    // Check if the subject is already associated with the class
    const existingAssociation = await ClassToSubjects.findOne({
      where: {
        classId,
        subjectId,
      },
      transaction,
    });

    if (existingAssociation) {
      await transaction.rollback(); // Rollback if association already exists
      return res
        .status(400)
        .send("Subject is already associated with this class");
    }

    // Duplicate the subject for the class
    const duplicatedSubject = await Subject.create(
      {
        name: `${originalSubject.name}_${classInstance.name}`, // Add class initials to subject name
        description: originalSubject.description,
        curriculumId, // Associate with the same curriculum
        class_id: classId, // Associate with the specified class
        studyareaid: originalSubject.studyareaid, // Maintain the same study area
      },
      { transaction }
    );

    // Link the new subject to the class in ClassToSubjects
    await ClassToSubjects.create(
      {
        classId,
        subjectId: duplicatedSubject.id, // Link the duplicated subject
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({
      message: "Subject duplicated successfully for the class",
      duplicatedSubject,
    });
  } catch (error) {
    console.error("Error duplicating subject to class:", error);
    await transaction.rollback(); // Rollback the transaction on error
    res.status(500).send("Error duplicating subject to class");
  }
};

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
