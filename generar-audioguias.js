const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');const fs = require('fs');
const path = require('path');

const carpetaAudio = path.join(__dirname, 'assets', 'audio');

if (!fs.existsSync(carpetaAudio)) {
    fs.mkdirSync(carpetaAudio, { recursive: true });
}

const destinos = [
    {
        archivo: 'cahuita-guia.mp3',
        voz: 'es-CR-MariaNeural',
        texto: `
Bienvenido al Parque Nacional Cahuita, una de las joyas naturales más importantes del Caribe costarricense.

Mientras recorre este maravilloso parque podrá observar playas de arena blanca, aguas cristalinas y una extraordinaria biodiversidad.

Cahuita alberga uno de los arrecifes coralinos más importantes del país, convirtiéndose en un destino ideal para practicar snorkel y observación marina.

Durante el recorrido es común encontrar monos carablanca, perezosos, iguanas, mapaches y una gran variedad de aves tropicales.

Además de su riqueza natural, Cahuita posee una fuerte influencia afrocaribeña que se refleja en la gastronomía, la música y las tradiciones locales.

Le recomendamos caminar por los senderos autorizados, respetar la flora y fauna y disfrutar cada momento de esta experiencia única en el Caribe de Costa Rica.
`
    },

    {
        archivo: 'puerto-viejo-guia.mp3',
        voz: 'es-CR-MariaNeural',
        texto: `
Bienvenido a Puerto Viejo de Talamanca.

Este pintoresco destino del Caribe Sur es reconocido por su ambiente relajado, sus impresionantes playas y su riqueza cultural.

Puerto Viejo combina tradiciones afrocaribeñas, indígenas y extranjeras que han dado forma a una identidad única dentro de Costa Rica.

Entre sus principales atractivos destacan Playa Cocles, Playa Chiquita y Punta Uva, lugares ideales para disfrutar del mar y la naturaleza.

La región también es famosa por su biodiversidad y por la posibilidad de observar numerosas especies de animales y plantas tropicales.

Disfrute de la hospitalidad local, la gastronomía caribeña y la tranquilidad que convierten a Puerto Viejo en uno de los destinos favoritos del país.
`
    },

    {
        archivo: 'tamarindo-guia.mp3',
        voz: 'es-CR-JuanNeural',
        texto: `
Bienvenido a Tamarindo, uno de los destinos más populares de Guanacaste.

Ubicado en la costa pacífica, este lugar es reconocido internacionalmente por sus playas y excelentes condiciones para la práctica del surf.

Tamarindo ofrece una combinación perfecta entre naturaleza, entretenimiento y servicios turísticos.

Sus impresionantes atardeceres atraen visitantes de todo el mundo y crean escenarios inolvidables para quienes recorren la zona.

Muy cerca se encuentra el Parque Nacional Marino Las Baulas, un importante sitio de conservación de tortugas marinas.

Le invitamos a disfrutar de sus playas, su gastronomía y el espíritu aventurero que caracteriza a Tamarindo.
`
    },

    {
        archivo: 'rincon-vieja-guia.mp3',
        voz: 'es-CR-JuanNeural',
        texto: `
Bienvenido al Parque Nacional Rincón de la Vieja.

Este impresionante destino natural protege una de las zonas volcánicas más importantes de Costa Rica.

Durante su visita podrá observar fumarolas, volcanes de lodo, aguas termales y una gran variedad de ecosistemas.

Los senderos del parque permiten descubrir cascadas, ríos cristalinos y una biodiversidad excepcional.

Además de su belleza escénica, este parque desempeña un papel fundamental en la conservación de recursos naturales y fuentes de agua.

Disfrute de la aventura, respete las indicaciones de seguridad y descubra la majestuosidad de la naturaleza guanacasteca.
`
    },

    {
        archivo: 'poas-guia.mp3',
        voz: 'es-ES-AlvaroNeural',
        texto: `
Bienvenido al Parque Nacional Volcán Poás.

Este volcán es uno de los más visitados de Costa Rica y posee uno de los cráteres activos más impresionantes del mundo.

La actividad volcánica ha moldeado el paisaje durante miles de años, creando un entorno único para la investigación científica y el turismo.

Desde los miradores podrá apreciar vistas panorámicas excepcionales y conocer la famosa Laguna Botos.

El parque también alberga bosques nubosos y una rica biodiversidad adaptada a las condiciones de altura.

Esperamos que disfrute de esta experiencia geológica y natural en uno de los volcanes más emblemáticos del país.
`
    },

    {
        archivo: 'orosi-guia.mp3',
        voz: 'es-ES-ElviraNeural',
        texto: `
Bienvenido al Valle de Orosi.

Este hermoso valle ubicado en la provincia de Cartago destaca por sus paisajes montañosos, su riqueza histórica y su tranquilidad.

Orosi alberga una de las iglesias coloniales más antiguas de Costa Rica y numerosos sitios de interés cultural.

Sus montañas, ríos y plantaciones agrícolas crean un paisaje único que atrae a visitantes nacionales e internacionales.

La región es ideal para quienes buscan descanso, historia y contacto con la naturaleza.

Le invitamos a descubrir la esencia de este encantador rincón costarricense.
`
    },

    {
        archivo: 'manuel-antonio-guia.mp3',
        voz: 'es-MX-DaliaNeural',
        texto: `
Bienvenido al Parque Nacional Manuel Antonio.

Considerado uno de los parques más hermosos del mundo, este destino combina playas paradisíacas con exuberantes bosques tropicales.

Durante su recorrido podrá observar monos, perezosos, iguanas y numerosas especies de aves.

Los senderos ofrecen vistas espectaculares del océano Pacífico y acceso a playas protegidas de gran belleza.

La biodiversidad presente en Manuel Antonio convierte cada visita en una experiencia única.

Disfrute de la naturaleza, respete la vida silvestre y descubra por qué este parque es uno de los principales símbolos turísticos de Costa Rica.
`
    },

    {
        archivo: 'uvita-guia.mp3',
        voz: 'es-MX-JorgeNeural',
        texto: `
Bienvenido a Uvita, uno de los tesoros naturales del Pacífico Sur costarricense.

Este destino es famoso por el Parque Nacional Marino Ballena y por la impresionante formación natural conocida como la Cola de Ballena.

Durante determinadas épocas del año es posible observar ballenas jorobadas en su proceso migratorio.

La zona también ofrece cascadas, senderos naturales y una extraordinaria riqueza biológica.

Uvita representa un ejemplo destacado de turismo sostenible y conservación marina.

Esperamos que disfrute de la belleza natural, la tranquilidad y la magia que hacen de Uvita un destino verdaderamente especial.
`
    }
];


async function generarAudios() {

    console.log('\n🎙️ Generando audioguías...\n');

    for (const destino of destinos) {

        try {

            const tts = new MsEdgeTTS();

            await tts.setMetadata(
                destino.voz,
                OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
            );

            const carpetaTemporal = path.join(
                carpetaAudio,
                path.parse(destino.archivo).name
            );

            if (!fs.existsSync(carpetaTemporal)) {
                fs.mkdirSync(carpetaTemporal, {
                    recursive: true
                });
            }

            await tts.toFile(
                carpetaTemporal,
                destino.texto
            );

            const audioGenerado = path.join(
                carpetaTemporal,
                'audio.mp3'
            );

            const audioFinal = path.join(
                carpetaAudio,
                destino.archivo
            );

            if (fs.existsSync(audioFinal)) {
                fs.unlinkSync(audioFinal);
            }

            fs.renameSync(
                audioGenerado,
                audioFinal
            );

            fs.rmSync(
                carpetaTemporal,
                {
                    recursive: true,
                    force: true
                }
            );

            console.log(`✅ ${destino.archivo}`);

        } catch (error) {

            console.error(
                `❌ Error generando ${destino.archivo}`
            );

            console.error(error);
        }
    }

    console.log('\n🎉 Todas las audioguías fueron generadas.');
}

generarAudios();