import dotenv from "dotenv";
dotenv.config();
import transporter from "./transporter.js";

const hostEmail = process.env.EMAIL_HOST_USER;
const baseUrl = process.env.BASE_URL;
const currentYear = new Date().getFullYear();

const sendMail = (
  userEmail,
  subject,
  header,
  greetings,
  paragraph,
  body,
  buttonText
) => {
  // Define email options
  const mailOptions = {
    from: `Tudlin" <${hostEmail}>`,
    to: userEmail,
    subject: subject,
    html: `
    <html>
          <head>
          <link
            href="https://fonts.googleapis.com/css?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
            rel="stylesheet"
            type="text/css"
          />
            </head>
          <style type="text/css">
          
            body {
              margin: 0;
              padding: 0;
            }

            table,
            tr,
            td {
              vertical-align: top;
              border-collapse: collapse;
            }

            p {
              margin: 0;
            }

            .ie-container table,
            .mso-container table {
              table-layout: fixed;
            }

            * {
              line-height: inherit;
            }

            a[x-apple-data-detectors="true"] {
              color: inherit !important;
              text-decoration: none !important;
            }

            table,
            td {
              color: #000000;
            }
            #u_body a {
              color: #0000ee;
              text-decoration: underline;
            }
            #u_content_text_4 a {
              color: #1677ff;
            }
              
            @media only screen and (min-width: 620px) {
              .u-row {
                width: 600px !important;
              }
              .u-row .u-col {
                vertical-align: top;
              }

              .u-row .u-col-50 {
                width: 300px !important;
              }

              .u-row .u-col-100 {
                width: 600px !important;
              }
            }

            @media (max-width: 620px) {
              .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
              }
              .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
              }
              .u-row {
                width: 100% !important;
              }
              .u-col {
                width: 100% !important;
              }
              .u-col > div {
                margin: 0 auto;
              }
            }
              
            @media (max-width: 480px) {
              #u_content_image_1 .v-src-width {
                width: auto !important;
              }
              #u_content_image_1 .v-src-max-width {
                max-width: 25% !important;
              }
              #u_content_text_3 .v-container-padding-padding {
                padding: 10px 20px 20px !important;
              }
              #u_content_button_1 .v-size-width {
                width: 65% !important;
              }
              #u_content_text_2 .v-container-padding-padding {
                padding: 20px 20px 60px !important;
              }
              #u_content_text_4 .v-container-padding-padding {
                padding: 60px 20px !important;
              }
              #u_content_heading_2 .v-container-padding-padding {
                padding: 30px 10px 0px !important;
              }
              #u_content_heading_2 .v-text-align {
                text-align: center !important;
              }
              #u_content_social_1 .v-container-padding-padding {
                padding: 10px 10px 10px 98px !important;
              }
              #u_content_text_5 .v-container-padding-padding {
                padding: 10px 20px 30px !important;
              }
              #u_content_text_5 .v-text-align {
                text-align: center !important;
              }
            }
              
              .header {
                  background-color: #f1f7ff;
                  width: 100% !important;
                  height: 80px !important;
                  background-image: url(https://res.cloudinary.com/loyke/image/upload/v1742167061/koyarr/cgm1c03g1tr8pnnbbxqp.png);
                  border-bottom: 1px solid #fafafa;      
              }
              .header img {
                  object-fit: contain;
                  display: block;
              }
          </style>
        <body
          class="clean-body u_body"
          style="
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            display: flex;
            justify-content: center;
            align-items: start;
            border-radius: 20px;
          "
        >
          <table
            id="u_body"
            style="
              border-collapse: collapse;
              table-layout: fixed;
              border-spacing: 0;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              vertical-align: top;
              max-width: 320px;
              margin: 0 auto;
            "
            cellpadding="0"
            cellspacing="0"
          >
            <tbody>
              <tr style="vertical-align: top">
                <td
                  style="
                    word-break: break-word;
                    border-collapse: collapse !important;
                    vertical-align: top;
                  "
                >
                  <div
                    class="u-row-container"
                    style="padding: 20px; background-color: transparent"
                  >
                   
                    <div
                      class="u-row-container"
                      style="
                        padding: 0px;
                        background-color: transparent;
                        margin-top: 4%;
                        border: 1px solid #efefef;
                        border-radius: 10px;
                      "
                    >
                    <div class="header" style="
                        display: flex;
                        align-items: center;
                        height: 80px;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                    ">
                        <img 
                            style="width: 80px; height: 43px; margin-left: 20px"
                         src="https://res.cloudinary.com/loyke/image/upload/v1742167304/koyarr/w8rrjbopu4n7zanbh5cg.png" 
                        />
                    </div>

                      <div
                        class="u-row"
                        style="
                          margin: 0 auto;
                          min-width: 320px;
                          max-width: 600px;
                          overflow-wrap: break-word;
                          word-wrap: break-word;
                          word-break: break-word;
                          background-color: transparent;
                        "
                      >
                        <div
                          style="
                            border-collapse: collapse;
                            display: table;
                            width: 100%;
                            height: 100%;
                            background-repeat: no-repeat;
                            background-position: center top;
                            background-color: transparent;
                          "
                        >
                          <div
                            class="u-col u-col-100"
                            style="
                              max-width: 320px;
                              min-width: 600px;
                              display: table-cell;
                              vertical-align: top;
                            "
                          >
                            <div
                              style="
                                height: 100%;
                                width: 100% !important;
                                border-radius: 5px;
                              "
                            >
                              <div
                                style="
                                  box-sizing: border-box;
                                  height: 100%;
                                  padding: 0px;
                                  border-top: 0px solid transparent;
                                  border-left: 0px solid transparent;
                                  border-right: 0px solid transparent;
                                  border-bottom: 0px solid transparent;
                                  border-radius: 0px;
                                  -webkit-border-radius: 0px;
                                  -moz-border-radius: 0px;
                                "
                              >
                              
      <!--                            header 1-->
                                  ${
                                    header
                                      ? `
                                <table
                                  style="font-family: 'Open Sans', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 20px 10px 0px;
                                          font-family: 'Open Sans', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            line-height: 150%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p
                                            style="font-size: 14px; line-height: 150%"
                                          >
                                            <span
                                              ><span
                                                  style="
                                                    line-height: 34px;
                                                    font-size: 16px;
                                                  "
                                                  >${header},</span
                                                ></span
                                            >
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                  `
                                      : ""
                                  }
      <!--                            header 2-->
                                  
                                  ${
                                    paragraph
                                      ? `
                                <table
                                  id="u_content_text_3"
                                  style="font-family: 'Open Sans', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px 100px 20px;
                                          font-family: 'Open Sans', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            line-height: 170%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                          <p
                                            style="font-size: 20px; font-weight: 700; line-height: 150%">
                                            ${greetings}
                                              </p>
                                              <br>
                                          <p
                                            style="font-size: 14px; line-height: 170%"
                                          >
                                          ${paragraph}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                  `
                                      : ""
                                  }

                                  
                                  ${
                                    buttonText
                                      ? `
                                <table
                                  id="u_content_button_1"
                                  style="font-family: 'Open Sans', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 10px;
                                          font-family: 'Open Sans', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div class="v-text-align" align="center">
                                            
                                          <a
                                            href="https://tudlin-client.onrender.com/${action}/${token}"
                                            target="_blank"
                                            class="v-button v-size-width"
                                            style="
                                              box-sizing: border-box;
                                              display: inline-block;
                                              text-decoration: none;
                                              -webkit-text-size-adjust: none;
                                              text-align: center;
                                              color: #ffffff;
                                              background-color: #1677ff;
                                              border-radius: 4px;
                                              -webkit-border-radius: 4px;
                                              -moz-border-radius: 4px;
                                              width: 30%;
                                              max-width: 100%;
                                              overflow-wrap: break-word;
                                              word-break: break-word;
                                              word-wrap: break-word;
                                              mso-border-alt: none;
                                              font-size: 14px;
                                            "
                                          >
                                            <span
                                              style="
                                                display: block;
                                                padding: 10px 20px;
                                                line-height: 120%;
                                              "
                                              ><span
                                                style="
                                                  font-size: 16px;
                                                  line-height: 19.2px;
                                                "
                                                ><strong
                                                  ><span
                                                    style="
                                                      line-height: 19.2px;
                                                      font-size: 16px;
                                                    "
                                                    >${buttonText}</span
                                                  ></strong
                                                ></span
                                              ></span
                                            >
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                  `
                                      : ""
                                  }
                                  

                                  
                                  ${
                                    body
                                      ? `
                                <table
                                  id="u_content_text_2"
                                  style="font-family: 'Open Sans', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 20px 20px 40px;
                                          font-family: 'Open Sans', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 14px;
                                            line-height: 170%;
                                            text-align: center;
                                            word-wrap: break-word;
                                          "
                                        >
                                        
                                          <p style="font-size: 14px; line-height: 170%">${body}</p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                  `
                                      : ""
                                  }
                                  
                                  
                                  
                                  <table
                                  id="u_content_text_4"
                                  style="font-family: 'Open Sans', sans-serif"
                                  role="presentation"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        class="v-container-padding-padding"
                                        style="
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          padding: 20px 80px;
                                          font-family: 'Open Sans', sans-serif;
                                        "
                                        align="left"
                                      >
                                        <div
                                          class="v-text-align"
                                          style="
                                            font-size: 12px;
                                            color: #000;
                                            line-height: 170%;
                                            text-align: center;
                                            word-wrap: break-word;
                                            border: 0.5px solid #fff;
                                            border-top-color: #9bc9e2;
                                            padding-top: 18px;
                                          "
                                        >
                                          <p
                                            style="font-size: 14px; line-height: 170%;"
                                          >
                                            Need help?
                                            <a
                                              rel="noopener"
                                              href="mailto:kyde@tudlin.com"
                                              target="_blank"
                                              >Contact our support team</a
                                            >
                                                  </p>
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>

                              </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>      
        </body>
      </html>

    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error.message);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

export default sendMail;
