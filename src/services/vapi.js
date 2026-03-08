const VAPI_KEY = process.env.REACT_APP_VAPI_KEY;
const PHONE_NUMBER_ID = process.env.REACT_APP_VAPI_PHONE_ID;
const RANGER_NUMBER = process.env.REACT_APP_RANGER_NUMBER;

export async function dispatchRangerAlert(location, fireData, species, brief) {
  const shortBrief = brief.slice(0, 200);

  const res = await fetch("https://api.vapi.ai/call/phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${VAPI_KEY}`,
    },
    body: JSON.stringify({
      phoneNumberId: PHONE_NUMBER_ID,
      customer: {
        number: RANGER_NUMBER,
        name: "Wildlife Ranger",
      },
      assistant: {
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
        },
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are WildGuard ThreatCore, an emergency wildlife evacuation AI.
Deliver this briefing in 2 sentences. Be urgent and direct.
Once they acknowledge say "Copy. Stay safe." and end the call.
Briefing: ${brief}`,
            },
          ],
        },
        endCallPhrases: ["understood", "got it", "yes thanks", "thank you", "roger", "acknowledged"],
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM",
        },
        firstMessage: `WILDGUARD ALERT. ThreatCore AI. ${shortBrief}. Please acknowledge`,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("VAPI error:", JSON.stringify(err, null, 2));
    throw new Error("VAPI call failed");
  }

  const data = await res.json();
  console.log("📞 VAPI call initiated:", JSON.stringify(data, null, 2));
  return data;
}