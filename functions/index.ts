// firebase config
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

// sendgrid config
import * as sgMail from "@sendgrid/mail";
const API_Key = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_Key);

// send email when registation is custom
export const newRegistration = functions.firestore
  .document("subscribers/{subscriberId}")
  .onCreate(async (change, context) => {
    // read the data of that registration
    const data = await db
      .collection("subscribers")
      .doc(context.params.subscriberId)
      .get();

    // raw data error prevention
    const content = data.data() || {};

    // the email
    const msg = {
      to: content.email,
      from: "business@nerbuy.ca",
      templateId: TEMPLATE_ID,
      dynamic_template_data: {
        name: content.name
      }
    };

    // send the email
    return sgMail.send(msg);
  });
