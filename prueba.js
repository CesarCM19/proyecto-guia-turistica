const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");
const fs = require("fs");

async function main() {

    if (!fs.existsSync("./salida")) {
        fs.mkdirSync("./salida", { recursive: true });
    }

    const tts = new MsEdgeTTS();

    await tts.setMetadata(
        "es-CR-MariaNeural",
        OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );

    await tts.toFile(
        "./salida",
        "Hola Bryan. Esta es una prueba."
    );

    console.log("Audio generado");
}

main().catch(console.error);