import Subscription from "../models/subscription.model.js";
import Package from "../models/package.model.js";
import User from "../models/user.model.js";
import scheduleSubscriptionRevert from "../cron/scheduleSubscriptionRevert.js";
import sendMail from "../utils/sendMail.js";

import https from "https";

export const initiatePayment = async (req, res) => {
  const { email, amount, packageId } = req.body;
  const userId = req.user._id;
  const currentDate = new Date();
  //console.log("subscription data:", req.body);

  try {
    // Check if the user is a seller
    const user = await User.findById(userId);
    // console.log(user)

    if (!user.isSeller) {
      return res.status(400).json({
        success: false,
        message: "Only instructors can subscribe to a package.",
      });
    }

    // Check if the email already has a subscription
    const existingSubscription = await Subscription.findOne({ email });

    const ghAmount = amount * 100;
    // const ghAmount = amount;

    const params = JSON.stringify({
      email: email,
      amount: ghAmount,
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const reqpaystack = https.request(options, (respaystk) => {
      let data = "";

      respaystk.on("data", (chunk) => {
        data += chunk;
      });

      respaystk.on("end", async () => {
        console.log(data);

        const responseData = JSON.parse(data);
        const authorizationUrl = responseData.data.authorization_url;
        const reference = responseData.data.reference;

        try {
          let subscription;
          // if (existingSubscription && existingSubscription.status !== "expired" && existingSubscription.status !== "pending") {
          if (
            existingSubscription &&
            new Date(existingSubscription.expirationDate) > currentDate
          ) {
            // Update existing subscription
            subscription = existingSubscription;
            subscription.referenceId = reference;
            subscription.amountPaid = amount;
            subscription.status = "pending";
            subscription.expirationDate = new Date();
            await subscription.save();
          } else {
            // Create a new subscription
            subscription = new Subscription({
              userId: req.user._id,
              packageId: packageId,
              email: email,
              referenceId: reference,
              amountPaid: amount,
            });

            await subscription.save();
          }

          res.status(201).json({
            success: true,
            message: "Subscription processed successfully",
            subscription: subscription,
            authorizationUrl: authorizationUrl,
          });
        } catch (err) {
          console.log(err);
          res.status(500).json({
            success: false,
            message: "Error processing subscription",
            error: err,
          });
        }

        //console.log("BACK payUrl:", authorizationUrl);
      });
    });

    reqpaystack.on("error", (error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred during the Paystack transaction" });
    });

    reqpaystack.write(params);
    reqpaystack.end();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the transaction" });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    // Log the received webhook data
    console.log("Paystack Webhook Data:", req.body);

    const { event, data } = req.body;
    const updateOps = {};

    // Check the event type to ensure it's a successful payment event
    if (event === "charge.success") {
      // Get the payment reference from the data
      const { reference } = data;

      // Define the options for the HTTP GET request
      const options = {
        hostname: "api.paystack.co",
        path: `/transaction/verify/${encodeURIComponent(reference)}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      };

      // Make an HTTP GET request to the Paystack API to verify the payment
      const verifyRequest = https.request(options, async (verifyResponse) => {
        let dataBuffer = "";

        // Accumulate the response data
        verifyResponse.on("data", (chunk) => {
          dataBuffer += chunk;
        });

        // Handle the response when it's complete
        verifyResponse.on("end", async () => {
          try {
            const verificationData = JSON.parse(dataBuffer);

            if (verificationData.status === true) {
              // Payment was successful and verified
              updateOps.updatedAt = new Date();

              const subscription = await Subscription.findOne({
                referenceId: reference,
                status: { $ne: "deleted" },
              })
                .populate("packageId")
                .populate("userId")
                .exec();

              if (!subscription) {
                return res.status(404).json({
                  success: false,
                  message: "Subscription not found",
                  subscription: {},
                });
              }

              // Check if a new packageId is provided
              let packageId = subscription.packageId._id;
              if (req.body.packageId) {
                packageId = req.body.packageId;
                updateOps.packageId = packageId;
              }

              // Fetch the package details
              const subscribedPackage = await Package.findById(packageId);

              if (!subscribedPackage) {
                return res.status(404).json({
                  success: false,
                  message: "Package not found",
                  subscription: {},
                });
              }

              // Calculate the new expiration date
              let newExpirationDate;
              if (subscription.expirationDate) {
                // If there is an existing expiration date, add the package duration to it
                newExpirationDate = new Date(subscription.expirationDate);
              } else {
                // If there is no existing expiration date, use the current date
                newExpirationDate = new Date();
              }
              newExpirationDate.setDate(
                newExpirationDate.getDate() + subscribedPackage.duration
              );

              // Update the expirationDate field
              updateOps.expirationDate = newExpirationDate;
              updateOps.status = "success";
              updateOps.isActive = true;

              // Update the subscription with the new fields
              const updatedSubscription = await Subscription.findOneAndUpdate(
                { referenceId: reference, status: { $ne: "deleted" } },
                { $set: updateOps },
                { new: true }
              )
                .populate("userId")
                .exec();

              // Send user email here
              sendMail(
                subscription.userId.email,
                "Package Subscription and Payment Successful",
                "Thank you for subscribing to a package with Koyarr",
                "Your payment has been successfully processed, and your subscription is now active.",
                "If you have any questions or did not authorize this payment, please contact our support team.",
                "View Subscription Details"
              );

              // Send admin email here
              sendMail(
                "admin@koyarr.com",
                "User Package Subscription and Payment Successful",
                "A user has successfully subscribed to a package on Koyarr",
                `User ${subscription.userId.username} (${subscription.userId.email}) has successfully subscribed to the ${subscription.packageId.name} package.`,
                "If you have any questions or need to take any action, please contact the support team.",
                "View Subscription Details"
              );

              return res.status(200).json({
                success: true,
                message: "Subscription updated",
                subscription: updatedSubscription,
              });
            } else {
              // Payment failed or could not be verified
              console.log(
                "Payment verification failed:",
                verificationData.message
              );
              return res
                .status(400)
                .json({ status: "failure to verify payment" });
            }
          } catch (error) {
            console.error("Error parsing verification data:", error);
            return res.status(500).json({ status: "internal server error" });
          }
        });
      });

      // Handle any errors during the HTTP request
      verifyRequest.on("error", (error) => {
        console.error("Error making Paystack verification request:", error);
        return res.status(500).json({ status: "internal server error" });
      });

      // Send the HTTP request
      verifyRequest.end();
    } else {
      return res.status(400).json({ status: "invalid event type" });
    }
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return res.status(500).json({ status: "internal server error" });
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    const filters = []; // Initialize an array to store all filters
    filters.push({ status: { $ne: "deleted" } });
    const filter = { $and: filters };

    const subscriptions = await Subscription.find(filter)
      .populate("userId")
      .populate("packageId")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      count: subscriptions.length,
      success: true,
      subscriptions: subscriptions,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

// export const createSubscription = async (req, res, next) => {
//   try {
//     const subscription = new Subscription({
//       userId: req.user._id,
//       packageId: req.body.packageId,
//       // subscriptionId: req.body.subscriptionId,
//       referenceId: req.body.referenceId,
//       amountPaid: req.body.amountPaid,
//     });

//     const result = await subscription.save();

//     res.status(200).json({
//       success: true,
//       message: "Subscription created successfully",
//       subscription: result,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Error creating subscription",
//       error: err,
//     });
//   }
// };

export const getSubscriptionById = async (req, res, next) => {
  try {
    const id = req.params.subscriptionId;
    const doc = await Subscription.findById(id)
      .populate("userId")
      .populate("packageId")
      .exec();

    if (doc) {
      res.status(200).json({
        success: true,
        message: "Subscription found",
        subscription: doc,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No valid entry found for provided ID",
        subscription: {},
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

export const getSubscriptionsByUser = async (req, res, next) => {
  const userId = req.user._id;
  console.log("Subscription UserId:", userId);
  try {
    const subscriptions = await Subscription.find({
      userId: userId,
      status: { $ne: "deleted" },
    })
      .populate("packageId")
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();
    res.status(200).json({
      success: true,
      subscription: subscriptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.subscriptionId,
      req.body,
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      subscription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating subscription",
      error: err.message,
    });
  }
};

export const updateSubscriptionByReference = async (req, res, next) => {
  const referenceId = req.params.referenceId;
  console.log("BK referenceId:", referenceId);
  const updateOps = {};

  // Iterate over the properties of req.body
  for (const propName in req.body) {
    if (Object.prototype.hasOwnProperty.call(req.body, propName)) {
      updateOps[propName] = req.body[propName];
    }
  }

  // Update the updatedAt field to the current date and time
  updateOps.updatedAt = new Date();
  updateOps.status = "success";

  let emailSent = false;

  try {
    const subscription = await Subscription.findOne({
      referenceId: referenceId,
      status: { $ne: "deleted" },
    })
      .populate("packageId")
      .populate("userId")
      .exec();

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
        subscription: {},
      });
    }

    // Check if a new packageId is provided
    let packageId = subscription.packageId._id;
    if (req.body.packageId) {
      packageId = req.body.packageId;
      updateOps.packageId = packageId;
    }

    // Fetch the package details
    const subscribedPackage = await Package.findById(packageId);

    if (!subscribedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
        subscription: {},
      });
    }

    // Calculate the new expiration date
    let newExpirationDate;
    if (subscription.expirationDate) {
      // If there is an existing expiration date, add the package duration to it
      newExpirationDate = new Date(subscription.expirationDate);
    } else {
      // If there is no existing expiration date, use the current date
      newExpirationDate = new Date();
    }
    newExpirationDate.setDate(
      newExpirationDate.getDate() + subscribedPackage.duration
    );

    // Update the expirationDate field
    updateOps.expirationDate = newExpirationDate;

    // Update the subscription with the new fields
    const updatedSubscription = await Subscription.findOneAndUpdate(
      { referenceId: referenceId, status: { $ne: "deleted" } },
      { $set: updateOps },
      { new: true }
    )
      .populate("userId")
      .exec();

    if (updatedSubscription && updatedSubscription.userId && !emailSent) {
      const userId = updatedSubscription.userId._id;

      await User.findByIdAndUpdate(userId, {
        isSubscribed: true,
        subscriptionStartDate: new Date(),
      });

      console.log("User subscription updated successfully.");
      scheduleSubscriptionRevert(userId, new Date());
      console.log("Subscription has started");

      // Send email only if it hasn't been sent already
      sendMail(
        updatedSubscription.userId.email,
        "Package Subscription and Payment Successful",
        `Thank you for subscribing to the ${subscription.packageId.name} package with Koyarr`,
        "Your payment has been successfully processed, and your subscription is now active.",
        "If you have any questions or did not authorize this payment, please contact our support team.",
        "View Subscription Details"
      );

      // send admin email here
      sendMail(
        "admin@koyarr.com",
        "User Package Subscription and Payment Successful",
        "A user has successfully subscribed to a package on Koyarr",
        `User ${subscription.userId.username} (${subscription.userId.email}) has successfully subscribed to the ${subscription.packageId.name} package.`,
        "If you have any questions or need to take any action, please contact the support team.",
        "View Subscription Details"
      );

      console.log("Email Sent");
      // Set emailSent to true to prevent multiple emails
      emailSent = true;
    }
    res.status(200).json({
      success: true,
      message: "Subscription updated & Email Sent",
      subscription: updatedSubscription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

export const deleteSubscription = async (req, res, next) => {
  const id = req.params.subscriptionId;

  try {
    const result = await Subscription.deleteOne({ _id: id }).exec();
    res.status(200).json({
      success: true,
      message: "Subscription deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

export const getRemainingBalance = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the active subscription for the user
    const subscription = await Subscription.findOne({
      userId: userId,
      status: "success", // Consider only active subscriptions
    })
      .populate("packageId")
      .exec();

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found",
      });
    }

    // Calculate the total number of days for the subscription duration
    const totalDays = Math.ceil(
      (subscription.expirationDate - subscription.activationDate) /
        (1000 * 60 * 60 * 24)
    );

    // Calculate the number of days elapsed since the subscription started
    const currentDate = new Date();
    const elapsedDays = Math.ceil(
      (currentDate - subscription.activationDate) / (1000 * 60 * 60 * 24)
    );

    // Ensure elapsed days do not exceed total days
    const effectiveElapsedDays = Math.min(elapsedDays, totalDays);

    // Calculate the daily rate
    const dailyRate = subscription.amountPaid / totalDays;

    // Calculate the remaining balance
    const remainingBalance =
      subscription.amountPaid - dailyRate * effectiveElapsedDays;

    return res.status(200).json({
      success: true,
      remainingBalance: remainingBalance,
      subscription: subscription,
    });
  } catch (error) {
    console.error("Error fetching remaining balance:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
