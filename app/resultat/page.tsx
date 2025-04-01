"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Volume2, VolumeX, InfinityIcon } from "lucide-react"
import Image from "next/image"

// Types pour les segments de narration
interface NarrationSegment {
  id: number
  text: string
  duration: number
  image?: string
  imageAlt?: string
  audioUrl?: string // URL préchargée pour l'audio
}

// Enum pour les différentes images à afficher
enum CircleImage {
  None = 0,
  CheminDeVie = 1,
  NombreAnniversaire = 2,
  NombreAme = 3,
  NombreExpression = 4,
  NombrePersonnalite = 5,
}

// Fonction pour calculer le chiffre de vie selon la numérologie
const calculerChiffreVie = (date: string) => {
  if (!date) return null

  const [annee, mois, jour] = date.split("-")

  // Conversion des chaînes en nombres
  const jourNum = Number.parseInt(jour)
  const moisNum = Number.parseInt(mois)
  const anneeNum = Number.parseInt(annee)

  // Réduction du jour
  const jourReduit = jourNum > 9 ? Math.floor(jourNum / 10) + (jourNum % 10) : jourNum

  // Réduction du mois
  const moisReduit = moisNum > 9 ? Math.floor(moisNum / 10) + (jourNum % 10) : moisNum

  // Réduction de l'année (somme des chiffres)
  let sommeAnnee = 0
  for (const chiffre of annee) {
    sommeAnnee += Number.parseInt(chiffre)
  }

  // Somme totale
  const sommeNonReduite = jourReduit + moisReduit + sommeAnnee

  // Réduction finale à un seul chiffre
  let sommeFinale = sommeNonReduite
  while (sommeFinale > 9) {
    let nouvelleValeur = 0
    sommeFinale
      .toString()
      .split("")
      .forEach((chiffre) => {
        nouvelleValeur += Number.parseInt(chiffre)
      })
    sommeFinale = nouvelleValeur
  }

  return {
    jour: jourNum,
    jourReduit,
    mois: moisNum,
    moisReduit,
    annee: anneeNum,
    sommeAnnee,
    sommeNonReduite,
    sommeFinale,
    moisNom: getNomMois(moisNum),
  }
}

// Fonction pour obtenir le nom du mois en français
const getNomMois = (mois: number) => {
  const moisFrancais = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]
  return moisFrancais[mois - 1]
}

// Fonction pour déterminer si un prénom est masculin ou féminin
const determinerGenre = (prenom: string): "masculin" | "feminin" => {
  // Normaliser le prénom pour la comparaison (minuscules, sans accents)
  const prenomNormalise = prenom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  // Liste très étendue de prénoms féminins français
  const prenomsFeminins = [
    // Prénoms féminins français traditionnels et modernes
    "marie",
    "jeanne",
    "francoise",
    "monique",
    "catherine",
    "nathalie",
    "isabelle",
    "sylvie",
    "anne",
    "martine",
    "sophie",
    "christine",
    "madeleine",
    "celine",
    "veronique",
    "lucie",
    "chantal",
    "nicole",
    "jacqueline",
    "aurelie",
    "sandrine",
    "patricia",
    "claire",
    "camille",
    "julie",
    "emma",
    "lea",
    "chloe",
    "manon",
    "sarah",
    "laura",
    "pauline",
    "mathilde",
    "oceane",
    "lilou",
    "clara",
    "eva",
    "jade",
    "lola",
    "anais",
    "maelys",
    "ambre",
    "louise",
    "juliette",
    "zoe",
    "alice",
    "charlotte",
    "ines",
    "lina",
    "mila",
    "rose",
    "anna",
    "clemence",
    "margaux",
    "leonie",
    "romane",
    "agathe",
    "lou",
    "gabrielle",
    "valentine",
    "adele",
    "nina",
    "maelle",
    "elisa",
    "margot",
    "victoria",
    "amandine",
    "elodie",
    "marine",
    "amelie",
    "emilie",
    "laetitia",
    "stephanie",
    "audrey",
    "caroline",
    "delphine",
    "laurence",
    "karine",
    "virginie",
    "florence",
    "valerie",
    "brigitte",
    "annie",
    "dominique",
    "danielle",
    "michelle",
    "simone",
    "claudine",
    "odette",
    "lucienne",
    "germaine",
    "marcelle",
    "suzanne",
    "yvette",
    "josette",
    "denise",
    "bernadette",
    "therese",
    "christiane",
    "yvonne",
    "renee",

    // Liste étendue de prénoms féminins français
    "abigaelle",
    "adelaide",
    "adele",
    "adelie",
    "adeline",
    "adrienne",
    "agathe",
    "agenor",
    "aglae",
    "agnes",
    "agrippine",
    "aimee",
    "albane",
    "alberte",
    "albertine",
    "alexandra",
    "alexandrine",
    "alexane",
    "alexia",
    "alicia",
    "alida",
    "alienor",
    "aliette",
    "aline",
    "alix",
    "alizee",
    "alphonsine",
    "ambre",
    "amedee",
    "amelia",
    "ameline",
    "anaelle",
    "anais",
    "anastasie",
    "andrea",
    "andree",
    "anemone",
    "ange",
    "angele",
    "angeline",
    "angelique",
    "anita",
    "annabelle",
    "anne",
    "annette",
    "annicette",
    "annick",
    "anouk",
    "antoinette",
    "antonine",
    "apolline",
    "ariane",
    "arielle",
    "arlette",
    "armande",
    "armelle",
    "astrid",
    "athenais",
    "aube",
    "aude",
    "audrey",
    "augustine",
    "aurelie",
    "auriane",
    "aurore",
    "ava",
    "axelle",
    "baptistine",
    "barbara",
    "bastienne",
    "beatrice",
    "benedicte",
    "benjamine",
    "benoite",
    "berangere",
    "berengere",
    "berenice",
    "bernardine",
    "berthe",
    "bertille",
    "betanie",
    "betty",
    "blanche",
    "blandine",
    "brune",
    "calie",
    "calliopee",
    "camelia",
    "candice",
    "canelle",
    "capucine",
    "carine",
    "carole",
    "caroline",
    "cassandre",
    "cassiopee",
    "cathel",
    "catherine",
    "cathy",
    "cecile",
    "cecilia",
    "celeste",
    "celestine",
    "celia",
    "celimene",
    "celine",
    "cerise",
    "cesarine",
    "chantal",
    "charlene",
    "charlie",
    "charline",
    "charlotte",
    "chimene",
    "chloe",
    "christele",
    "christelle",
    "christiane",
    "christine",
    "cindy",
    "clara",
    "clarisse",
    "claude",
    "claudette",
    "claudie",
    "claudine",
    "clea",
    "clemence",
    "clementine",
    "cleo",
    "clothilde",
    "clotilde",
    "colette",
    "coline",
    "colombe",
    "colombine",
    "constance",
    "coralie",
    "corentine",
    "corine",
    "corinne",
    "cybille",
    "cynthia",
    "cyrielle",
    "daniele",
    "danielle",
    "daphne",
    "deborah",
    "delphine",
    "desiree",
    "diane",
    "domitille",
    "doriane",
    "dorine",
    "dorothee",
    "douce",
    "eden",
    "edith",
    "edmee",
    "edwige",
    "eglantine",
    "elea",
    "eleonore",
    "eleanore",
    "eliane",
    "eliette",
    "elina",
    "eline",
    "elisa",
    "elisabeth",
    "elise",
    "ella",
    "elodie",
    "eloise",
    "elsa",
    "elvire",
    "elya",
    "emeline",
    "emilie",
    "emilienne",
    "emma",
    "emmanuelle",
    "emmy",
    "emy",
    "enola",
    "enora",
    "esther",
    "ernestine",
    "estelle",
    "eugenie",
    "eulalie",
    "eurydice",
    "eva",
    "eve",
    "eveline",
    "evelyne",
    "fabienne",
    "fanny",
    "faustine",
    "felicie",
    "felicienne",
    "felicite",
    "fernande",
    "flavie",
    "fleur",
    "flora",
    "flore",
    "florence",
    "florentine",
    "floriane",
    "florine",
    "france",
    "francine",
    "francoise",
    "frederique",
    "gabrielle",
    "gaelle",
    "gaetane",
    "garance",
    "genevieve",
    "georgette",
    "geraldine",
    "germaine",
    "gertrude",
    "ghislaine",
    "gilberte",
    "ginette",
    "gisele",
    "gladys",
    "grace",
    "guilaine",
    "guillemette",
    "guylaine",
    "guylene",
    "gwenaelle",
    "gwendoline",
    "gwladys",
    "harmonie",
    "helena",
    "helene",
    "heloise",
    "henriette",
    "hermine",
    "honorine",
    "hortense",
    "huguette",
    "hyacinthe",
    "ida",
    "ilona",
    "imogene",
    "ines",
    "ingrid",
    "irene",
    "irenee",
    "iris",
    "isaure",
    "jacinte",
    "jacinthe",
    "jacqueline",
    "jade",
    "janine",
    "jannick",
    "jasmine",
    "jeannette",
    "jeannine",
    "jennifer",
    "jessica",
    "joanne",
    "jocelyne",
    "joelle",
    "johanna",
    "johanne",
    "josee",
    "josephe",
    "josephine",
    "josette",
    "josiane",
    "jude",
    "judith",
    "julia",
    "julienne",
    "juliette",
    "justine",
    "karine",
    "laetitia",
    "laly",
    "larissa",
    "laura",
    "laure",
    "laurence",
    "laurene",
    "laurette",
    "lauriane",
    "laurie",
    "lea",
    "leana",
    "leane",
    "lena",
    "leonce",
    "leone",
    "leonie",
    "leontine",
    "leopoldine",
    "lila",
    "liliane",
    "lilou",
    "lily",
    "lina",
    "line",
    "lisa",
    "lise",
    "lison",
    "loane",
    "lola",
    "lolita",
    "lorette",
    "lorine",
    "lorraine",
    "lou",
    "louane",
    "louisa",
    "louise",
    "louisette",
    "louison",
    "louna",
    "loup",
    "luce",
    "lucette",
    "lucie",
    "lucienne",
    "lucile",
    "lucy",
    "ludivine",
    "luna",
    "lyana",
    "lydia",
    "lydie",
    "lylou",
    "lyna",
    "lysandre",
    "madeleine",
    "maelle",
    "maelys",
    "maeva",
    "magali",
    "magalie",
    "maia",
    "mailys",
    "maite",
    "maiwenn",
    "malaurie",
    "malorie",
    "manon",
    "marceline",
    "marcelle",
    "marcelline",
    "margaux",
    "margot",
    "marguerite",
    "marianne",
    "marie",
    "marielle",
    "mariette",
    "marina",
    "marine",
    "marinette",
    "marion",
    "marjolaine",
    "marjorie",
    "marlene",
    "marthe",
    "martine",
    "marylene",
    "maryline",
    "marylise",
    "maryse",
    "maryvonne",
    "mathilde",
    "maud",
    "mauricette",
    "maxence",
    "maximilienne",
    "maya",
    "maylis",
    "megane",
    "melaine",
    "melanie",
    "melina",
    "meline",
    "melissa",
    "melodie",
    "mia",
    "michele",
    "micheline",
    "mila",
    "milene",
    "mireille",
    "monique",
    "morgane",
    "muguette",
    "muriel",
    "murielle",
    "mylene",
    "myriam",
    "nadege",
    "nadia",
    "nadine",
    "naelle",
    "natacha",
    "nathalie",
    "nathanaelle",
    "nelly",
    "nicole",
    "nina",
    "nine",
    "ninon",
    "noelie",
    "noelle",
    "noemie",
    "nolwenn",
    "oceane",
    "octavie",
    "odette",
    "odile",
    "olga",
    "olive",
    "olivia",
    "olympe",
    "ondine",
    "ophelie",
    "oriane",
    "orlane",
    "pascale",
    "pascaline",
    "patricia",
    "paule",
    "paulette",
    "pauline",
    "pelagie",
    "penelope",
    "perrine",
    "petronille",
    "philippine",
    "philomene",
    "pierrette",
    "prisca",
    "priscille",
    "prudence",
    "prune",
    "quitterie",
    "rachel",
    "raissa",
    "raphaelle",
    "raymonde",
    "rebecca",
    "regine",
    "reine",
    "rejane",
    "renee",
    "rita",
    "rolande",
    "romane",
    "romy",
    "rosalie",
    "rose",
    "roseline",
    "rosette",
    "rosine",
    "roxane",
    "roxanne",
    "sabine",
    "sabrina",
    "sacha",
    "salome",
    "sandra",
    "sandrine",
    "sara",
    "sarah",
    "sasha",
    "segolene",
    "selena",
    "seraphine",
    "serena",
    "servane",
    "severine",
    "sibylle",
    "sidonie",
    "simone",
    "sixte",
    "sixtine",
    "soazic",
    "sofia",
    "soizic",
    "solange",
    "solene",
    "solenne",
    "soline",
    "sonia",
    "sophia",
    "sophie",
    "stella",
    "stephanie",
    "suzanne",
    "suzette",
    "suzon",
    "sybille",
    "sylvaine",
    "sylviane",
    "sylvie",
    "tatiana",
    "tessa",
    "thais",
    "thea",
    "thecle",
    "therese",
    "tiffany",
    "tiphaine",
    "tiphanie",
    "tristane",
    "urielle",
    "valentine",
    "valeriane",
    "valerie",
    "vanessa",
    "veronique",
    "victoire",
    "victoria",
    "victorine",
    "violaine",
    "violette",
    "virginie",
    "viviane",
    "vivienne",
    "xaviere",
    "yaelle",
    "yannick",
    "yolaine",
    "ysaure",
    "yveline",
    "yvette",
    "yvonne",
    "zelie",
    "zoe",

    // Prénoms féminins du 20ème siècle et contemporains
    "aalimah",
    "aaliyah",
    "abbie",
    "abby",
    "abbygail",
    "abigail",
    "abigaelle",
    "abigail",
    "abinaya",
    "abygaelle",
    "achouak",
    "adela",
    "adelais",
    "adija",
    "adlyne",
    "adriana",
    "adrianna",
    "adrienne",
    "aelys",
    "aelig",
    "aelis",
    "aeris",
    "aelyne",
    "aely",
    "aelyn",
    "afnan",
    "afnane",
    "aglaee",
    "agrippine",
    "ahna",
    "aicha",
    "aichatou",
    "aida",
    "aideen",
    "ailee",
    "aileen",
    "aimee",
    "aimeline",
    "ainhoa",
    "aisha",
    "aissata",
    "aissatou",
    "aita",
    "aiyanna",
    "ajla",
    "akira",
    "alana",
    "alanis",
    "alanna",
    "alayna",
    "alba",
    "alegria",
    "aleksandra",
    "alena",
    "alessandra",
    "alessia",
    "alexa",
    "alexandra",
    "alexane",
    "alexia",
    "aleyna",
    "alia",
    "aliana",
    "alice",
    "alicia",
    "alima",
    "alina",
    "aline",
    "alisa",
    "alisee",
    "alisha",
    "alison",
    "alissa",
    "alisson",
    "alixe",
    "aliya",
    "aliyah",
    "alizee",
    "allegra",
    "allie",
    "ally",
    "allyson",
    "alma",
    "almass",
    "almaz",
    "alois",
    "alwena",
    "alwenn",
    "alya",
    "alyah",
    "alycia",
    "alyona",
    "alysa",
    "alyson",
    "alyssa",
    "alyssia",
    "alyx",
    "amaia",
    "amal",
    "amalia",
    "amalya",
    "amanda",
    "amandine",
    "amara",
    "amarante",
    "amaryllis",
    "amaya",
    "ambre",
    "ambrine",
    "amedy",
    "amelia",
    "amelie",
    "amely",
    "amicie",
    "amina",
    "aminata",
    "amira",
    "amorine",
    "amour",
    "amoun",
    "amy",
    "ana",
    "anabelle",
    "anae",
    "anael",
    "anaelle",
    "anais",
    "anaisse",
    "anaya",
    "anayah",
    "anays",
    "anastacia",
    "anastasia",
    "anastazia",
    "anatole",
    "anavaï",
    "anaya",
    "anayah",
    "anca",
    "andgie",
    "andrea",
    "andree",
    "andreea",
    "andgelyna",
    "andjouza",
    "anette",
    "ange",
    "angela",
    "angelica",
    "angelina",
    "angeline",
    "angelique",
    "angie",
    "anggun",
    "ania",
    "anika",
    "anissa",
    "anita",
    "anjelica",
    "anjuli",
    "ann",
    "anna",
    "annabelle",
    "annaelle",
    "annaig",
    "anne",
    "anneli",
    "annick",
    "annie",
    "annouchka",
    "anouck",
    "anouk",
    "anoushka",
    "anta",
    "antoinette",
    "antonia",
    "antonella",
    "antonine",
    "anya",
    "anziza",
    "apolline",
    "apoline",
    "april",
    "arabelle",
    "arabesque",
    "areej",
    "aria",
    "ariadne",
    "ariana",
    "ariane",
    "arianna",
    "ariel",
    "arielle",
    "arij",
    "arletty",
    "arlette",
    "armance",
    "armande",
    "armelle",
    "arsinoé",
    "artemis",
    "arwa",
    "arwen",
    "arya",
    "arzhelenn",
    "ashanty",
    "ashley",
    "ashwarya",
    "asia",
    "asma",
    "asmaa",
    "assetou",
    "assil",
    "assya",
    "astou",
    "astree",
    "astrid",
    "asuncion",
    "asya",
    "athenais",
    "athena",
    "athenaïs",
    "athina",
    "atika",
    "aubrey",
    "aude",
    "audrey",
    "audry",
    "augusta",
    "augustine",
    "aurely",
    "aurelia",
    "aurelie",
    "auriane",
    "aurianne",
    "aurore",
    "autumn",
    "auxane",
    "auxence",
    "avannah",
    "avery",
    "awa",
    "axelle",
    "aya",
    "ayah",
    "ayako",
    "ayat",
    "ayata",
    "ayem",
    "ayesha",
    "ayia",
    "ayla",
    "ayleen",
    "aylin",
    "aylï",
    "ayna",
    "ayoub",
    "ayse",
    "aysima",
    "ayumi",
    "azalée",
    "azaya",
    "azeliz",
    "azeline",
    "azilys",
    "azra",
    "azucena",
    "azura",
    "azélie",
    "azély",
    "açelya",
    "aélia",
    "aélig",
    "aélis",
    "aélys",
    "aïcha",
    "aïda",
    "aïleen",
    "aïlyn",
    "aïna",
    "aïnhoa",
    "aïsha",
    "aïssata",
    "aïssatou",
    "bachira",
    "bahia",
    "balkis",
    "barbara",
    "basma",
    "baya",
    "beata",
    "beatrice",
    "beatrix",
    "becky",
    "begonia",
    "bella",
    "belle",
    "bellinda",
    "bença",
    "berenice",
    "bernadette",
    "bernardine",
    "berthe",
    "bertille",
    "beryl",
    "beryl",
    "bess",
    "bethsabee",
    "betul",
    "beya",
    "bianca",
    "billie",
    "bintou",
    "blessing",
    "bleuwenn",
    "bleuzenn",
    "bleuenn",
    "blanche",
    "blandine",
    "bonnie",
    "bonny",
    "bouchra",
    "brenda",
    "brianna",
    "brigitte",
    "brithany",
    "brook",
    "brune",
    "brunehilde",
    "bryanna",
    "caecilia",
    "caitlinn",
    "cali",
    "caliana",
    "calista",
    "callista",
    "calypso",
    "camelia",
    "camilla",
    "camille",
    "camilia",
    "candy",
    "capucine",
    "capucïne",
    "carla",
    "carlotta",
    "carlie",
    "carmilla",
    "carmen",
    "carol",
    "carole",
    "caroline",
    "cassandra",
    "cassandre",
    "cassie",
    "cassiopee",
    "castille",
    "catalina",
    "cate",
    "catherine",
    "cathy",
    "cattleya",
    "cecile",
    "cecilia",
    "cedrine",
    "celeste",
    "celestine",
    "celia",
    "celina",
    "celine",
    "cerise",
    "cesarine",
    "chahinez",
    "chahrazed",
    "chaima",
    "chana",
    "chanez",
    "chanel",
    "chantal",
    "charline",
    "charlize",
    "charlie",
    "charlotte",
    "charlène",
    "chayma",
    "cheina",
    "chelsea",
    "chelsy",
    "cheryl",
    "cheyenne",
    "chiara",
    "chimene",
    "chirine",
    "chjara",
    "chlea",
    "chloe",
    "chloelia",
    "chloey",
    "chochana",
    "christelle",
    "christiane",
    "christine",
    "chrislaine",
    "ciara",
    "ciella",
    "cindy",
    "cipriana",
    "clara",
    "clare",
    "clarence",
    "clarisse",
    "clarke",
    "claude",
    "claudia",
    "claudiane",
    "claudie",
    "claudine",
    "clea",
    "clelie",
    "clelia",
    "clemence",
    "clementine",
    "cleo",
    "cleophee",
    "clothilde",
    "clotilde",
    "cloé",
    "colette",
    "colombe",
    "colombine",
    "coline",
    "concepcion",
    "conchita",
    "constance",
    "constancia",
    "constantine",
    "constanza",
    "cora",
    "coralia",
    "coralie",
    "cordelia",
    "corentine",
    "corinne",
    "cosima",
    "cristal",
    "crystal",
    "cunegonde",
    "cyana",
    "cyann",
    "cybele",
    "cylia",
    "cynthia",
    "cyrielle",
    "daalya",
    "dahlia",
    "dalila",
    "dalinda",
    "dalia",
    "dana",
    "danae",
    "danaé",
    "dani",
    "daniela",
    "daniella",
    "danielle",
    "danika",
    "daphne",
    "daphney",
    "daria",
    "darya",
    "dauriane",
    "dayana",
    "daëna",
    "daïna",
    "deborah",
    "deizil",
    "delphine",
    "denise",
    "denitsa",
    "diana",
    "diane",
    "dikel",
    "dilara",
    "dila",
    "dina",
    "dinah",
    "divine",
    "djeneba",
    "djenebou",
    "djolia",
    "djulya",
    "dolores",
    "dominique",
    "domitille",
    "dora",
    "doriane",
    "dorine",
    "dorothee",
    "douce",
    "dounia",
    "dune",
    "dyna",
    "ebony",
    "edda",
    "eden",
    "edith",
    "edmee",
    "edwige",
    "eglantine",
    "eileen",
    "elaïs",
    "eleanor",
    "eleanore",
    "electre",
    "elena",
    "eleonora",
    "eleonore",
    "eliana",
    "elianore",
    "elikiah",
    "elina",
    "eline",
    "eliora",
    "elisa",
    "elisabeth",
    "elise",
    "elissa",
    "eliza",
    "elizabeth",
    "ella",
    "elle",
    "elly",
    "ellyne",
    "elodie",
    "eloise",
    "eloha",
    "eloïse",
    "elsa",
    "elsie",
    "elsie",
    "elvire",
    "elya",
    "elyana",
    "elyanna",
    "elyne",
    "elynna",
    "elsie",
    "elvire",
    "elya",
    "elyana",
    "elyanna",
    "elyne",
    "elynna",
    "elyssa",
    "ema",
    "emeline",
    "emeraude",
    "emie",
    "emilia",
    "emilie",
    "emilienne",
    "emma",
    "emmanuelle",
    "emmeline",
    "emmie",
    "emmy",
    "emnah",
    "emylie",
    "enaya",
    "enayah",
    "enea",
    "enguunerdene",
    "ennaline",
    "ennaya",
    "enola",
    "enora",
    "erell",
    "erica",
    "erika",
    "erin",
    "ernestine",
    "esma",
    "esme",
    "esmeralda",
    "esperanza",
    "estee",
    "estelle",
    "esther",
    "ethel",
    "etiennette",
    "eugenie",
    "eulalie",
    "eurydice",
    "eva",
    "evangeline",
    "eve",
    "eveline",
    "evelyne",
    "evie",
    "evy",
    "ewa",
    "excel",
    "excellent",
    "eylul",
    "ezgi",
    "eziah",
    "fabienne",
    "fallone",
    "fanny",
    "fanta",
    "farah",
    "farida",
    "fatima",
    "fatimata",
    "fatma",
    "fatna",
    "fatou",
    "fatouma",
    "fatoumata",
    "favour",
    "felicie",
    "felicienne",
    "felicite",
    "fernanda",
    "fernande",
    "feriel",
    "feryel",
    "fiona",
    "firdaws",
    "firouz",
    "flavia",
    "flavie",
    "fleur",
    "fleurette",
    "flora",
    "flore",
    "florence",
    "florentine",
    "floriane",
    "florine",
    "founé",
    "framboise",
    "france",
    "francesca",
    "francine",
    "francoise",
    "frederique",
    "freya",
    "freyja",
    "frieda",
    "frida",
    "gabie",
    "gabriela",
    "gabriele",
    "gabriella",
    "gabrielle",
    "gaelle",
    "gaia",
    "gaïa",
    "gaïlys",
    "gamze",
    "garance",
    "gemma",
    "genevieve",
    "gentiane",
    "georgette",
    "georgina",
    "geraldine",
    "germaine",
    "gertrude",
    "ghislaine",
    "gianna",
    "gilberte",
    "gina",
    "ginette",
    "gisele",
    "giselle",
    "giulia",
    "giuliana",
    "gladys",
    "gloria",
    "goundo",
    "grace",
    "graziella",
    "greta",
    "guilaine",
    "guillemette",
    "guina",
    "guylaine",
    "guylene",
    "gwen",
    "gwenaelle",
    "gwendoline",
    "gwladys",
  ]

  // Si le prénom est dans la liste des prénoms féminins, retourner 'feminin'
  if (prenomsFeminins.includes(prenomNormalise)) {
    return "feminin"
  }

  // Par défaut, considérer le prénom comme masculin
  return "masculin"
}

// Fonction pour formater la date en français
const formatDate = (date: string) => {
  if (!date) return ""
  const [annee, mois, jour] = date.split("-")
  return `${jour} ${getNomMois(Number.parseInt(mois))} ${annee}`
}

// Modifier la fonction getSalutation pour n'avoir que "Bonjour" ou "Bonsoir"

// Remplacer la fonction getSalutation actuelle par celle-ci:
const getSalutation = () => {
  const heure = new Date().getHours()

  if (heure >= 5 && heure < 18) {
    return "Bonjour"
  } else {
    return "Bonsoir"
  }
}

// Modifier la fonction genererScriptNarration pour utiliser le nouveau texte et corriger la prononciation de "lanumerologie.co"

// Remplacer la fonction genererScriptNarration actuelle par celle-ci:
const genererScriptNarration = (prenom: string, dateNaissance: string, chiffreVie: number) => {
  const salutation = getSalutation()
  const dateFormatee = formatDate(dateNaissance)
  const genre = determinerGenre(prenom)
  const estMasculin = genre === "masculin"

  return `${salutation} ${prenom}. Merci d'avoir demandé votre lecture gratuite de numérologie sur lanumerologie.co.

Dans quelques instants, je vais vous offrir une analyse rapide mais profondément révélatrice de votre profil numérologique unique, basée sur votre prénom ${prenom} et votre date de naissance ${dateFormatee}.

Cinq éléments constituent le cœur de votre profil et influencent massivement votre vie.

Il s'agit du Chemin de Vie, du Nombre d'Anniversaire, du Nombre de l'Âme, du Nombre d'Expression et du Nombre de Personnalité.

En comprenant intimement ces nombres, vous découvrirez de nombreuses vérités fascinantes sur vous-même, la façon dont les autres vous perçoivent et les opportunités uniques qui vous attendent.

Le nombre le plus important de votre profil numérologique est votre Chemin de Vie.

Il révèle la direction qui vous apportera le plus d'épanouissement ainsi que les grandes leçons que vous êtes ${estMasculin ? "venu" : "venue"} apprendre.

Il met en lumière les opportunités et défis que vous rencontrerez, ainsi que les traits uniques de votre personnalité qui vous aideront dans votre parcours.

Votre Chemin de Vie est calculé en additionnant simplement les chiffres de votre date de naissance.

Vous êtes ${estMasculin ? "né" : "née"} le ${dateFormatee}, votre nombre de Chemin de Vie ${prenom}, est donc ${chiffreVie}, et cela m'en dit beaucoup sur vous.

Vous êtes ${estMasculin ? "un leader né" : "une leader née"}, une autorité absolue dans votre domaine.

Comme l'indique votre Chemin de Vie, vous êtes ${estMasculin ? "destiné" : "destinée"} à être numéro un.

Vous êtes ${estMasculin ? "ambitieux" : "ambitieuse"}, ${estMasculin ? "confiant" : "confiante"} et ${estMasculin ? "autonome" : "autonome"}.

Vous possédez un talent rare qui vous mettra sous le feu des projecteurs au moins une fois dans votre vie.

Vous excellez dans le lancement de nouveaux projets, mais vous vous lassez vite de la routine et des tâches trop chronophages que vous êtes ${estMasculin ? "confronté" : "confrontée"}.

Votre force intérieure et votre forte identité inspire naturellement les autres à vous suivre.

Votre nature et votre détermination vous placent toujours en tête et sont la clé de votre réussite.

Il se peut que vous ayez souvent l'impression de rencontrer plus de défis que les autres, mais c'est uniquement parce que vous êtes plus ${estMasculin ? "prêt" : "prête"} et plus ${estMasculin ? "apte" : "apte"} à prendre des risques.

Votre mission est de sortir des sentiers battus et d'inspirer ceux qui vous entourent.

Faites-le ${prenom}, et vous réaliserez pleinement votre potentiel.

Passons maintenant à votre Nombre d'Anniversaire.

C'est un autre élément extrêmement important de votre carte numérologique, car il met en lumière vos talents et aptitudes naturels, dont certains que vous ne soupçonniez même pas.

On l'appelle souvent le Nombre du Destin, car il révèle votre potentiel et ce que vous êtes ${estMasculin ? "censé" : "censée"} accomplir dans cette vie.

Contrairement à votre Chemin de Vie, qui est calculé à partir de votre date de naissance, votre Nombre d'Expression est déterminé en analysant les lettres de votre nom de naissance complet.

Pourquoi votre nom ?

Parce qu'il représente l'héritage de votre histoire personnelle jusqu'au moment de votre naissance.

Chaque lettre et son nombre correspondant s'assemblent comme une mosaïque pour former l'image complète de qui vous êtes et de qui vous êtes ${estMasculin ? "destiné" : "destinée"} à devenir.

Votre nom de naissance est la clé de votre potentiel ${prenom}

Pour obtenir une lecture personnalisée gratuite de votre Nombre d'Expression, basée sur votre nom complet, veuillez l'écrire ci-dessus.

A tout de suite ${prenom}`
}

// Classe pour gérer la file d'attente audio
class AudioQueue {
  private queue: HTMLAudioElement[] = []
  private isPlaying = false
  private currentAudio: HTMLAudioElement | null = null
  private onTextChange: (text: string) => void
  private onComplete: () => void
  private textMap: Map<HTMLAudioElement, string> = new Map()

  constructor(onTextChange: (text: string) => void, onComplete: () => void) {
    this.onTextChange = onTextChange
    this.onComplete = onComplete
  }

  add(audio: HTMLAudioElement, text: string): void {
    this.textMap.set(audio, text)
    this.queue.push(audio)

    // Si rien n'est en cours de lecture, démarrer la lecture
    if (!this.isPlaying) {
      this.playNext()
    }
  }

  private playNext(): void {
    if (this.queue.length === 0) {
      this.isPlaying = false
      this.onComplete()
      return
    }

    this.isPlaying = true
    this.currentAudio = this.queue.shift() || null

    if (this.currentAudio) {
      const text = this.textMap.get(this.currentAudio) || ""
      this.onTextChange(text)

      // Configurer l'événement de fin
      this.currentAudio.onended = () => {
        // Jouer le suivant immédiatement
        this.playNext()
      }

      // Démarrer la lecture
      this.currentAudio.play().catch((err) => {
        console.error("Erreur lors de la lecture audio:", err)
        // En cas d'erreur, passer au suivant
        this.playNext()
      })
    }
  }

  clear(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.onended = null
    }
    this.queue = []
    this.isPlaying = false
    this.currentAudio = null
    this.textMap.clear()
  }
}

export default function Resultat() {
  const searchParams = useSearchParams()
  const prenom = searchParams.get("prenom") || ""
  const dateStr = searchParams.get("date") || ""

  // État pour le calcul numérologique
  const [calcul, setCalcul] = useState<Record<string, any>>({})
  const [etapeAnimation, setEtapeAnimation] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showRing, setShowRing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // État pour la narration
  const [mounted, setMounted] = useState(false)
  const [narrationSegments, setNarrationSegments] = useState<NarrationSegment[]>([])
  const [isNarrationComplete, setIsNarrationComplete] = useState(false)
  const [currentNarrationText, setCurrentNarrationText] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [narrationStarted, setNarrationStarted] = useState(false)
  const [audioPreloaded, setAudioPreloaded] = useState(false)

  // État pour suivre quelle image afficher dans le cercle
  const [currentCircleImage, setCurrentCircleImage] = useState<CircleImage>(CircleImage.None)

  // État pour l'audio
  const [isMuted, setIsMuted] = useState(false)
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null)

  // Références
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioQueueRef = useRef<AudioQueue | null>(null)
  const preloadedAudiosRef = useRef<Map<number, HTMLAudioElement>>(new Map())

  // Initialiser la file d'attente audio
  useEffect(() => {
    audioQueueRef.current = new AudioQueue(
      (text) => {
        setCurrentNarrationText(text)

        // Vérifier si le texte actuel contient la phrase clé pour déclencher la transition vers le cercle
        if (text.includes("Cinq éléments constituent le cœur de votre profil")) {
          setShouldShowRing(true)
        }

        // Vérifier les phrases clés pour afficher les différentes images
        if (text.includes("Il s'agit du Chemin de Vie")) {
          setCurrentCircleImage(CircleImage.CheminDeVie)
        } else if (text.includes("Passons maintenant à votre Nombre d'Anniversaire")) {
          setCurrentCircleImage(CircleImage.NombreAnniversaire)
        } else if (text.includes("du Nombre de l'Âme")) {
          setCurrentCircleImage(CircleImage.NombreAme)
        } else if (text.includes("du Nombre d'Expression")) {
          setCurrentCircleImage(CircleImage.NombreExpression)
        } else if (text.includes("du Nombre de Personnalité")) {
          setCurrentCircleImage(CircleImage.NombrePersonnalite)
        }
      },
      () => {
        setIsNarrationComplete(true)
        // Remettre le volume normal pour la musique de fond
        if (backgroundAudio) {
          backgroundAudio.volume = 0.8
        }
      },
    )

    return () => {
      if (audioQueueRef.current) {
        audioQueueRef.current.clear()
      }
    }
  }, [backgroundAudio])

  // Générer le script de narration complet
  useEffect(() => {
    if (calcul) {
      const script = genererScriptNarration(prenom, dateStr, calcul.sommeFinale)

      // Diviser le script en segments pour la narration
      const segments: NarrationSegment[] = []
      const phrases = script.split("\n\n")

      phrases.forEach((phrase, index) => {
        if (phrase.trim()) {
          segments.push({
            id: index + 1,
            text: phrase.trim(),
            duration: 5 + phrase.length / 20, // Durée approximative basée sur la longueur du texte
            image: index % 3 === 0 ? "/images/space-bg-mixed.jpg" : undefined,
            imageAlt: "Illustration numérologique",
          })
        }
      })

      setNarrationSegments(segments)
    }
  }, [calcul, prenom, dateStr])

  // Précharger tous les segments audio
  useEffect(() => {
    if (narrationSegments.length > 0 && !audioPreloaded) {
      const preloadAudio = async () => {
        try {
          // Précharger tous les segments en parallèle
          const preloadPromises = narrationSegments.map(async (segment) => {
            try {
              const audio = new Audio()
              audio.src = `/api/speech?text=${encodeURIComponent(segment.text)}&t=${Date.now()}`
              audio.volume = 0.8
              audio.preload = "auto"

              // Stocker l'élément audio préchargé
              preloadedAudiosRef.current.set(segment.id, audio)

              // Attendre que l'audio soit suffisamment chargé
              return new Promise<void>((resolve) => {
                audio.oncanplaythrough = () => resolve()
                audio.onerror = () => {
                  console.error(`Erreur lors du préchargement du segment ${segment.id}`)
                  resolve() // Continuer même en cas d'erreur
                }

                // Timeout de sécurité pour éviter de bloquer indéfiniment
                setTimeout(resolve, 1000)
              })
            } catch (error) {
              console.error(`Erreur lors du préchargement du segment ${segment.id}:`, error)
              return Promise.resolve() // Continuer même en cas d'erreur
            }
          })

          // Attendre que tous les préchargements soient terminés
          await Promise.all(preloadPromises)

          setAudioPreloaded(true)

          // Démarrer la narration une fois tous les segments préchargés
          if (!narrationStarted) {
            setNarrationStarted(true)
            startNarration()
          }
        } catch (error) {
          console.error("Erreur lors du préchargement des segments audio:", error)
          // En cas d'erreur, démarrer quand même la narration
          if (!narrationStarted) {
            setNarrationStarted(true)
            startNarration()
          }
        }
      }

      preloadAudio()
    }
  }, [narrationSegments, audioPreloaded, narrationStarted])

  // Initialisation
  useEffect(() => {
    setMounted(true)

    // Calculer immédiatement
    if (dateStr) {
      const resultat = calculerChiffreVie(dateStr)
      setCalcul(resultat || {})
    }

    // Animation de chargement très courte
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Initialiser l'audio de fond avec l'URL exacte fournie
    const audio = new Audio("https://sonback.blob.core.windows.net/son12/background-sound-low-gain (mp3cut.net).mp3")
    audio.loop = true
    audio.volume = 0.8 // Augmenté à 80%
    setBackgroundAudio(audio)

    // Vérifier si l'utilisateur a déjà interagi avec le site
    const hasInteracted = localStorage.getItem("userInteracted") === "true"
    if (hasInteracted) {
      // Essayer de jouer l'audio après un court délai
      setTimeout(() => {
        audio.play().catch((err) => {
          console.error("Erreur lors de la lecture de l'audio de fond:", err)
        })
      }, 500)
    }

    // Nettoyage lors du démontage du composant
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (audio) {
        audio.pause()
        audio.src = ""
      }

      // Nettoyer les audios préchargés
      preloadedAudiosRef.current.forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
      preloadedAudiosRef.current.clear()
    }
  }, [dateStr])

  // Animation du calcul
  useEffect(() => {
    if (!calcul || isLoading) return

    const timer = setTimeout(() => {
      if (etapeAnimation < 13) {
        setEtapeAnimation(etapeAnimation + 1)
      } else {
        // Animation terminée
        setAnimationComplete(true)
      }
    }, 1000)

    timerRef.current = timer

    return () => clearTimeout(timer)
  }, [etapeAnimation, calcul, isLoading])

  // Effet pour montrer le cercle cosmique quand shouldShowRing devient true
  const [shouldShowRing, setShouldShowRing] = useState(false)

  useEffect(() => {
    if (shouldShowRing && animationComplete) {
      setShowRing(true)
    }
  }, [shouldShowRing, animationComplete])

  // Fonction pour démarrer la narration
  const startNarration = () => {
    try {
      setErrorMessage(null)

      // Baisser le volume de la musique de fond pendant la narration
      if (backgroundAudio) {
        backgroundAudio.volume = 0.4 // Baissé à 40% pendant la narration
      }

      // Ajouter tous les segments préchargés à la file d'attente
      if (audioQueueRef.current) {
        narrationSegments.forEach((segment) => {
          const audio = preloadedAudiosRef.current.get(segment.id)
          if (audio) {
            audioQueueRef.current?.add(audio, segment.text)
          } else {
            // Fallback si l'audio n'est pas préchargé
            const fallbackAudio = new Audio()
            fallbackAudio.src = `/api/speech?text=${encodeURIComponent(segment.text)}&t=${Date.now()}`
            fallbackAudio.volume = 0.8
            audioQueueRef.current?.add(fallbackAudio, segment.text)
          }
        })
      }
    } catch (error) {
      console.error("Erreur lors du démarrage de la narration:", error)
      setErrorMessage(`Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`)
    }
  }

  // Gestion du son de fond
  const toggleMute = () => {
    if (backgroundAudio) {
      if (isMuted) {
        backgroundAudio.volume = isNarrationComplete ? 0.8 : 0.4
      } else {
        backgroundAudio.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }

  // Générer les chiffres flottants
  const [leftNumbers] = useState(() =>
    Array.from({ length: 25 }, () => ({
      value: Math.floor(Math.random() * 9) + 1,
      size: Math.random() * 0.7 + 0.3,
      top: Math.random() * 90 + 5,
      left: Math.random() * 25 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    })),
  )

  const [rightNumbers] = useState(() =>
    Array.from({ length: 25 }, () => ({
      value: Math.floor(Math.random() * 9) + 1,
      size: Math.random() * 0.7 + 0.3,
      top: Math.random() * 90 + 5,
      right: Math.random() * 25 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    })),
  )

  // Animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  }

  const fadeInRight = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  }

  const resultAnimation = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 120,
        damping: 8,
      },
    },
  }

  // Fonction pour obtenir l'image à afficher dans le cercle
  const getCircleImage = () => {
    switch (currentCircleImage) {
      case CircleImage.CheminDeVie:
        return "/images/chemin-de-vie.jpeg"
      case CircleImage.NombreAnniversaire:
        return "/images/nombre-anniversaire.jpeg"
      case CircleImage.NombreAme:
        return "/images/nombre-ame.jpeg"
      case CircleImage.NombreExpression:
        return "/images/nombre-expression.jpeg"
      case CircleImage.NombrePersonnalite:
        return "/images/nombre-personnalite.jpeg"
      default:
        return null
    }
  }

  // Animation de chargement/branding
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="relative">
          {/* Logo animé */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8 flex items-center justify-center"
          >
            <InfinityIcon className="h-20 w-20 text-teal-400" />
            <motion.h1
              className="text-5xl font-bold text-white ml-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Numérologie
            </motion.h1>
          </motion.div>

          {/* Cercle lumineux qui pulse */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(147, 51, 234, 0) 70%)",
              zIndex: -1,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Texte de chargement */}
          <motion.div
            className="mt-8 text-white text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Préparation de votre analyse numérologique...
          </motion.div>

          {/* Points de chargement animés */}
          <div className="flex justify-center mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 mx-1 rounded-full bg-teal-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!mounted || !calcul || !narrationSegments.length) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/space-bg-mixed.jpg"
          alt="Fond spatial"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Overlay pour assurer la lisibilité */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Chiffres flottants à gauche */}
      {leftNumbers.map((num, idx) => (
        <motion.div
          key={`left-${idx}`}
          className="absolute text-white font-bold z-10"
          style={{
            top: `${num.top}%`,
            left: `${num.left}%`,
            fontSize: `${Math.floor(num.size * 40)}px`,
            opacity: 0.7,
            textShadow: "0 0 5px rgba(255,255,255,0.7)",
            willChange: "transform",
          }}
          initial={{ opacity: 0 }}
          animate={{
            transform: ["translate(0px, 0px)", "translate(10px, 5px)", "translate(-5px, -10px)", "translate(0px, 0px)"],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: num.duration,
            delay: num.delay,
            repeat: 999999,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          {num.value}
        </motion.div>
      ))}

      {/* Chiffres flottants à droite */}
      {rightNumbers.map((num, idx) => (
        <motion.div
          key={`right-${idx}`}
          className="absolute text-white font-bold z-10"
          style={{
            top: `${num.top}%`,
            right: `${num.right}%`,
            fontSize: `${Math.floor(num.size * 40)}px`,
            opacity: 0.7,
            textShadow: "0 0 5px rgba(255,255,255,0.7)",
            willChange: "transform",
          }}
          initial={{ opacity: 0 }}
          animate={{
            transform: ["translate(0px, 0px)", "translate(-10px, 5px)", "translate(5px, -10px)", "translate(0px, 0px)"],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: num.duration,
            delay: num.delay,
            repeat: 999999,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          {num.value}
        </motion.div>
      ))}

      {/* Contenu principal */}
      <div className="relative z-20 container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        <header className="mb-8 flex items-center justify-between w-full max-w-3xl">
          <div className="flex items-center">
            <InfinityIcon className="h-8 w-8 text-teal-400 mr-2" />
            <h1 className="text-3xl font-bold text-white">Numérologie</h1>
          </div>
          <div className="flex gap-2">
            {/* Bouton pour couper/activer le son */}
            <Button
              variant="outline"
              size="sm"
              className="border-teal-500 text-teal-300"
              onClick={toggleMute}
              type="button"
            >
              {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
              {isMuted ? "Activer le son" : "Couper le son"}
            </Button>
          </div>
        </header>

        {/* Sous-titres de narration */}
        {currentNarrationText && (
          <motion.div
            className="fixed bottom-8 left-0 right-0 z-50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/80 text-white p-4 mx-auto max-w-3xl rounded-lg">{currentNarrationText}</div>
          </motion.div>
        )}

        {/* Affichage conditionnel: soit le calcul, soit l'anneau */}
        <AnimatePresence mode="wait">
          {!showRing ? (
            /* Animation du calcul */
            <motion.div
              className="grid grid-cols-1 gap-8 w-full max-w-3xl"
              key="calcul"
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              {/* Ligne 1: Mois */}
              <div className="flex items-center justify-center gap-4">
                {/* Étape 1: Nom du mois */}
                <AnimatePresence>
                  {etapeAnimation >= 0 && (
                    <motion.div
                      className="bg-pink-600/80 text-yellow-300 px-6 py-3 rounded-lg text-center min-w-[120px] text-xl font-bold"
                      variants={fadeInRight}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {calcul.moisNom}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Flèche 1 */}
                <AnimatePresence>
                  {etapeAnimation >= 1 && (
                    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit">
                      <ArrowRight className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Étape 2: Valeur du mois */}
                <AnimatePresence>
                  {etapeAnimation >= 2 && (
                    <motion.div
                      className="bg-pink-600/80 text-yellow-300 px-6 py-3 rounded-lg text-center min-w-[60px] text-xl font-bold"
                      variants={fadeInRight}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {calcul.moisReduit}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ligne 2: Jour - n'apparaît qu'après la ligne du mois complète */}
              {etapeAnimation >= 4 && (
                <div className="flex items-center justify-center gap-4">
                  {/* Étape 1: Jour */}
                  <AnimatePresence>
                    {etapeAnimation >= 4 && (
                      <motion.div
                        className="bg-pink-600/80 text-yellow-300 px-6 py-3 rounded-lg text-center min-w-[60px] text-xl font-bold"
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {calcul.jour}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Flèche 1 */}
                  <AnimatePresence>
                    {etapeAnimation >= 5 && (
                      <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit">
                        <ArrowRight className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Étape 2: Valeur du jour */}
                  <AnimatePresence>
                    {etapeAnimation >= 6 && (
                      <motion.div
                        className="bg-pink-600/80 text-yellow-300 px-6 py-3 rounded-lg text-center min-w-[60px] text-xl font-bold"
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {calcul.jourReduit}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Ligne 3: Année - n'apparaît qu'après la ligne du jour complète */}
              {etapeAnimation >= 8 && (
                <div className="flex items-center justify-center gap-4">
                  {/* Étape 1: Année */}
                  <AnimatePresence>
                    {etapeAnimation >= 8 && (
                      <motion.div
                        className="bg-pink-600/80 text-yellow-300 px-6 py-3 rounded-lg text-center min-w-[100px] text-xl font-bold"
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {calcul.annee}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Flèche 1 */}
                  <AnimatePresence>
                    {etapeAnimation >= 9 && (
                      <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit">
                        <ArrowRight className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Étape 2: Valeur de l'année */}
                  <AnimatePresence>
                    {etapeAnimation >= 10 && (
                      <motion.div
                        className="bg-pink-600/80 text-yellow-300 px-6 py-3 rounded-lg text-center min-w-[60px] text-xl font-bold"
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {calcul.sommeAnnee}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Signe égal et résultat final - n'apparaît qu'après la ligne de l'année complète */}
              {etapeAnimation >= 12 && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <AnimatePresence>
                    {etapeAnimation >= 12 && (
                      <motion.div
                        variants={scaleIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-yellow-300 text-3xl font-bold"
                      >
                        =
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Résultat final (chemin de vie) */}
              <AnimatePresence>
                {etapeAnimation >= 13 && (
                  <motion.div
                    className="flex justify-center mt-2"
                    variants={resultAnimation}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div
                      className="bg-yellow-400 text-white font-bold text-6xl px-8 py-6 rounded-lg text-center min-w-[100px]"
                      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(255,215,0,0.5)",
                          "0 0 20px rgba(255,215,0,0.8)",
                          "0 0 10px rgba(255,215,0,0.5)",
                        ],
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: 999999,
                          repeatType: "reverse",
                        },
                      }}
                    >
                      {calcul.sommeFinale}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Cercle cosmique avec contour lumineux et animation tournante */
            <motion.div
              className="relative w-full max-w-3xl h-[500px] flex items-center justify-center"
              key="anneau"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {/* Bordure polygonale tournante */}
              <motion.div
                className="absolute w-[450px] h-[450px]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 60,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                {/* Créer une bordure avec des triangles pointant vers l'extérieur */}
                {Array.from({ length: 24 }).map((_, idx) => {
                  const angle = (idx * 15 * Math.PI) / 180
                  const x = Math.cos(angle) * 225
                  const y = Math.sin(angle) * 225

                  return (
                    <motion.div
                      key={`polygon-${idx}`}
                      className="absolute"
                      style={{
                        width: "20px",
                        height: "20px",
                        top: "50%",
                        left: "50%",
                        transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${idx * 15 + 90}deg)`,
                        background: "rgba(255, 255, 255, 0.95)",
                        clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                        boxShadow: "0 0 5px rgba(255, 255, 255, 0.7)",
                      }}
                    />
                  )
                })}
              </motion.div>

              {/* Cercle principal avec contour lumineux */}
              <div className="absolute w-[450px] h-[450px] rounded-full">
                {/* Contour lumineux blanc */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "3px solid rgba(255, 255, 255, 0.95)",
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.5)",
                  }}
                ></div>

                {/* Image cosmique à l'intérieur du cercle - transparente quand aucune image n'est affichée */}
                <div className="absolute inset-[3px] rounded-full overflow-hidden">
                  {getCircleImage() && (
                    <Image
                      src={(getCircleImage() as string) || "/placeholder.svg"}
                      alt="Image numérologique"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{errorMessage}</div>
        )}
      </div>
    </main>
  )
}

