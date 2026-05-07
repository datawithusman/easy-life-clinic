export interface EmailBookingData {
  patientName: string;
  patientEmail: string;
  date: string;
  serviceType: string;
  queueNumber: number;
}

function isDemo() {
  const user = process.env.GMAIL_USER || "";
  const pass = process.env.GMAIL_APP_PASSWORD || "";
  return !user || !pass || user.includes("demo") || pass.includes("demo") || pass.includes("placeholder");
}

function buildConfirmationHtml(data: EmailBookingData) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f9fa;margin:0;padding:20px}
  .container{max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)}
  .header{background:#0E7C6E;padding:32px;text-align:center}
  .header h1{color:white;margin:0;font-size:24px}
  .header p{color:#c5e8e3;margin:8px 0 0}
  .body{padding:32px}
  .queue{text-align:center;background:#0E7C6E;color:white;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;font-weight:bold;margin:20px auto}
  .info-card{background:#f0faf8;border:1px solid #c5e8e3;border-radius:8px;padding:20px;margin:20px 0}
  .info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0f0ed}
  .info-row:last-child{border-bottom:none}
  .label{color:#666;font-size:14px}.value{color:#0E7C6E;font-weight:600}
  .notes{background:#fff8e6;border-left:4px solid #B8680A;padding:16px;border-radius:0 8px 8px 0;margin:20px 0}
  .notes h3{color:#B8680A;margin:0 0 8px;font-size:14px}
  .notes ul{margin:0;padding-left:16px;color:#555;font-size:14px;line-height:1.8}
  .footer{background:#f8f9fa;padding:20px;text-align:center;color:#999;font-size:12px}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Easy Life Aesthetic Clinic</h1>
    <p>Dr. Zakia Noor — Lahore, Pakistan</p>
  </div>
  <div class="body">
    <p style="font-size:18px;color:#1a1a1a">Assalam o Alaikum, <strong>${data.patientName}</strong>!</p>
    <p style="color:#444">Your appointment has been confirmed.</p>
    <div style="text-align:center"><p style="color:#666;font-size:13px;margin-bottom:4px">Your Queue Number</p>
    <div class="queue">#${data.queueNumber}</div></div>
    <div class="info-card">
      <div class="info-row"><span class="label">Date</span><span class="value">${data.date}</span></div>
      <div class="info-row"><span class="label">Service</span><span class="value">${data.serviceType}</span></div>
      <div class="info-row"><span class="label">Clinic</span><span class="value">Easy Life Aesthetic Clinic, Lahore</span></div>
      <div class="info-row"><span class="label">Doctor</span><span class="value">Dr. Zakia Noor</span></div>
    </div>
    <div class="notes">
      <h3>Important Instructions</h3>
      <ul>
        <li>Doctor arrives at clinic: <strong>7:15 PM</strong></li>
        <li>Patients begin being seen: <strong>7:30 PM</strong></li>
        <li>First-time patients must arrive by <strong>7:00 PM</strong></li>
        <li>Otherwise: arrive <strong>20 minutes before</strong> your queue number</li>
        <li>If you miss your turn, next patient gets preference</li>
      </ul>
    </div>
  </div>
  <div class="footer"><p>Easy Life Aesthetic Clinic | Lahore, Pakistan | Instagram: @doctor_zakk</p></div>
</div>
</body></html>`;
}

export async function sendBookingConfirmationEmail(data: EmailBookingData) {
  if (isDemo()) {
    console.log("[DEMO] Email confirmation skipped for:", data.patientEmail);
    return;
  }

  const nodemailer = (await import("nodemailer")).default;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  return transporter.sendMail({
    from: `"Easy Life Aesthetic Clinic" <${process.env.GMAIL_USER}>`,
    to: data.patientEmail,
    subject: "Appointment Confirmed — Easy Life Aesthetic Clinic",
    html: buildConfirmationHtml(data),
  });
}

export async function sendBookingRejectionEmail(patientName: string, patientEmail: string) {
  if (isDemo()) {
    console.log("[DEMO] Email rejection skipped for:", patientEmail);
    return;
  }

  const nodemailer = (await import("nodemailer")).default;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  return transporter.sendMail({
    from: `"Easy Life Aesthetic Clinic" <${process.env.GMAIL_USER}>`,
    to: patientEmail,
    subject: "Booking Update — Easy Life Aesthetic Clinic",
    html: `<p>Assalam o Alaikum ${patientName}, your booking could not be confirmed. Please contact us on WhatsApp.</p>`,
  });
}
