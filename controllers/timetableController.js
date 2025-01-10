import Curriculum from "../models/Curriculum.js";
import Subject from "../models/Subjects.js";
import Class from "../models/Class.js";

// export const generateCrashExamTimetable = async (req, res, next) => {
//   try {
//     const { curriculumId, startDate } = req.body;

//     // Validate input
//     if (!curriculumId || !startDate) {
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     // Fetch subjects under the selected curriculum
//     const curriculum = await Curriculum.findByPk(curriculumId, {
//       include: { model: Subject },
//     });

//     if (!curriculum) {
//       return res.status(404).json({ error: "Curriculum not found." });
//     }

//     const subjects = curriculum.Subjects;

//     if (subjects.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No subjects found for the selected curriculum." });
//     }

//     // Calculate all Fridays in the selected month
//     const start = new Date(startDate);
//     const year = start.getFullYear();
//     const month = start.getMonth();

//     const fridays = [];
//     const date = new Date(year, month, 1);

//     while (date.getMonth() === month) {
//       if (date.getDay() === 5) {
//         fridays.push(new Date(date)); // Add Friday
//       }
//       date.setDate(date.getDate() + 1);
//     }

//     // Generate timetable
//     const timetable = [];
//     fridays.forEach((friday) => {
//       subjects.forEach((subject) => {
//         timetable.push({
//           date: friday.toISOString(),
//           className: curriculum.name,
//           subject: subject.name,
//         });
//       });
//     });

//     res.status(200).json({ timetable });
//   } catch (error) {
//     console.error("Error generating timetable:", error);
//     next(error);
//   }
// };

// export const generateCrashExamTimetable = async (req, res, next) => {
//   try {
//     const { curriculumId, startDate } = req.body;

//     // Validate input
//     if (!curriculumId || !startDate) {
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     // Fetch curriculum with classes and subjects
//     const curriculum = await Curriculum.findByPk(curriculumId, {
//       include: {
//         model: Class,
//         as: "Classes",
//         include: {
//           model: Subject,
//           as: "Subjects",
//         },
//       },
//     });

//     if (!curriculum) {
//       return res.status(404).json({ error: "Curriculum not found." });
//     }

//     const classes = curriculum.Classes;

//     if (classes.length === 0) {
//       return res.status(404).json({ error: "No classes found." });
//     }

//     // Parse start date and calculate Fridays
//     const start = new Date(startDate); // Provided start date
//     const year = start.getFullYear();
//     const month = start.getMonth();

//     const fridays = [];
//     let date = new Date(start); // Start from the provided date

//     // Loop through days, starting from the given date
//     while (date.getMonth() === month) {
//       if (date.getDay() === 5) {
//         // If the current date is a Friday, add it
//         fridays.push(new Date(date));
//       }
//       date.setDate(date.getDate() + 1); // Move to the next day
//     }

//     // Generate timetable with class and subject info
//     const timetable = [];
//     fridays.forEach((friday) => {
//       classes.forEach((cls) => {
//         cls.Subjects.forEach((subject) => {
//           timetable.push({
//             date: friday.toISOString(),
//             className: cls.name,
//             subject: subject.name,
//             classId: cls.id, // Add class ID
//             subjectId: subject.id, // Add subject ID
//             curriculumId: curriculumId, // Include curriculum ID
//           });
//         });
//       });
//     });

//     res.status(200).json({ timetable });
//   } catch (error) {
//     console.error("Error generating timetable:", error);
//     next(error);
//   }
// };

export const generateCrashExamTimetable = async (req, res, next) => {
  try {
    const { curriculumId, startDate } = req.body;

    // Validate input
    if (!curriculumId || !startDate) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Fetch curriculum with classes and subjects
    const curriculum = await Curriculum.findByPk(curriculumId, {
      include: {
        model: Class,
        as: "Classes",
        include: {
          model: Subject,
          as: "Subjects",
        },
      },
    });

    if (!curriculum) {
      return res.status(404).json({ error: "Curriculum not found." });
    }

    const classes = curriculum.Classes;

    if (classes.length === 0) {
      return res.status(404).json({ error: "No classes found." });
    }

    // Parse start date and calculate Fridays
    const start = new Date(startDate);
    const year = start.getFullYear();
    const month = start.getMonth();

    const fridays = [];
    let date = new Date(start);

    // Find all Fridays in the given month
    while (date.getMonth() === month) {
      if (date.getDay() === 5) {
        fridays.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }

    // Generate timetable with one random subject per class for each Friday
    const timetable = [];
    fridays.forEach((friday) => {
      classes.forEach((cls) => {
        const subjects = cls.Subjects;

        if (subjects.length > 0) {
          // Pick a random subject for the class
          const randomIndex = Math.floor(Math.random() * subjects.length);
          const randomSubject = subjects[randomIndex];

          timetable.push({
            date: friday.toISOString(),
            className: cls.name,
            subject: randomSubject.name,
            classId: cls.id,
            subjectId: randomSubject.id,
            curriculumId: curriculumId,
          });
        }
      });
    });

    res.status(200).json({ timetable });
  } catch (error) {
    console.error("Error generating timetable:", error);
    next(error);
  }
};
