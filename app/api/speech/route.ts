import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Récupérer le texte à synthétiser depuis les paramètres de requête
    const searchParams = request.nextUrl.searchParams
    const text = searchParams.get("text")

    if (!text) {
      return NextResponse.json({ error: "Le paramètre text est requis" }, { status: 400 })
    }

    // Récupérer les clés d'API Azure Speech
    const speechKey = process.env.AZURE_SPEECH_KEY
    const speechRegion = process.env.AZURE_SPEECH_REGION

    if (!speechKey || !speechRegion) {
      console.error("Clés API Azure Speech manquantes")
      return NextResponse.json({ error: "Configuration du service de synthèse vocale manquante" }, { status: 500 })
    }

    // Préparer le texte pour la synthèse vocale (remplacer certains textes pour une meilleure prononciation)
    let textToSpeech = text

    // Remplacer "lanumerologie.co" par "la numérologie point co" pour la prononciation
    textToSpeech = textToSpeech.replace(/lanumerologie\.co/g, "la numérologie point co")

    // Construire le SSML
    const ssml = `
      <speak version='1.0' xml:lang='fr-FR'>
        <voice xml:lang='fr-FR' xml:gender='Female' name='fr-FR-VivienneNeural'>
          ${textToSpeech}
        </voice>
      </speak>
    `

    // Appeler l'API Azure Speech
    const response = await fetch(`https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        "User-Agent": "Numerologist",
      },
      body: ssml,
    })

    if (!response.ok) {
      console.error(`Erreur API Azure Speech: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `Erreur du service de synthèse vocale: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    // Récupérer les données audio
    const audioData = await response.arrayBuffer()

    // Retourner l'audio
    return new NextResponse(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Erreur lors de la synthèse vocale:", error)
    return NextResponse.json(
      { error: `Erreur interne: ${error instanceof Error ? error.message : "Erreur inconnue"}` },
      { status: 500 },
    )
  }
}

