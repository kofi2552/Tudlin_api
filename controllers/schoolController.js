// /controllers/schoolController.js
import School from "../models/School.js";

export const createSchool = async (req, res) => {
  const { name, address, type } = req.body;
  console.log("new school:", req.body);
  try {
    const newSchool = await School.create({
      name,
      address,
      type,
    });
    res
      .status(201)
      .json({ message: "School added successfully!", school: newSchool });
  } catch (error) {
    console.error("Error creating school:", error);
    res.status(500).json({ error: "Failed to add school. Please try again." });
  }
};

export const getSchool = async (req, res) => {
  try {
    const school = await School.findAll();
    //console.log(school);
    res.status(200).json({ school: school });
  } catch (error) {
    console.error("Error fetching school:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch schools. Please try again." });
  }
};

export const updateSchool = async (req, res) => {
  const { id } = req.params; // School ID from the URL
  const { name, address, type } = req.body; // Data sent from the client
  console.log("updated sch id:", id);

  try {
    // Find the school by ID
    const school = await School.findByPk(id);

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Update school details
    await school.update({
      name: name || school.name,
      address: address || school.address,
      type: type || school.type,
    });

    // Send a success response
    res.status(200).json({ message: "School updated successfully", school });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({ error: "Failed to update school" });
  }
};

export const deleteSchool = async (req, res) => {
  const { id } = req.params; // School ID from the URL
  console.log("deleted sch id:", id);
  try {
    const school = await School.findByPk(id);

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    await school.destroy(); // Delete the school
    res.status(200).json({ message: "School deleted successfully" });
  } catch (error) {
    console.error("Error deleting school:", error);
    res.status(500).json({ error: "Failed to delete school" });
  }
};
