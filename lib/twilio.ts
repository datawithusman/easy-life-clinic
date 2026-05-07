export interface WhatsAppBookingData {
  patientName: string;
  patientPhone: string;
  date: string;
  serviceType: string;
  queueNumber: number;
}

function isDemo() {
  const sid = process.env.TWILIO_ACCOUNT_SID || "";
  return !sid || sid.includes("demo") || sid.includes("placeholder");
}

export async function sendBookingConfirmationWhatsApp(data: WhatsAppBookingData) {
  if (isDemo()) {
    console.log("[DEMO] WhatsApp confirmation skipped for:", data.patientName);
    return;
  }

  const twilio = (await import("twilio")).default;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

  const message = `Assalam o Alaikum ${data.patientName}!

Aapki appointment confirm hogayi hai.

Clinic: Easy Life Aesthetic Clinic, Lahore
Date: ${data.date}
Service: ${data.serviceType}
Queue Number: #${data.queueNumber}

Please note:
- Doctor 7:15 PM par clinic pohanchti hain
- 7:30 PM se patients dekha jana shuru hoga
- Agar aap PEHLI baar aa rahe hain: 7:00 PM tak zaroor aa jayein
- Otherwise: apni bari se 20 minutes pehle clinic mein maujood rahein
- Agar aap apni bari tak nahi pohanche, aglay number wale ko preference di jayegi

Shukriya — Easy Life Aesthetic Clinic Team`;

  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${data.patientPhone}`,
    body: message,
  });
}

export async function sendBookingRejectionWhatsApp(patientName: string, patientPhone: string) {
  if (isDemo()) {
    console.log("[DEMO] WhatsApp rejection skipped for:", patientName);
    return;
  }

  const twilio = (await import("twilio")).default;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${patientPhone}`,
    body: `Assalam o Alaikum ${patientName}!\n\nAfsos ke saath inform karna pad raha hai ke aapki payment verify nahi ho saki. Agar masla ho, please hamein WhatsApp karein.\n\nShukriya — Easy Life Aesthetic Clinic Team`,
  });
}
