import { NextRequest } from "next/server";
const tr = require("googletrans").default;
const langsModule = require("googletrans/lib/languages");

const extraLangs: Record<string, string> = {
  wo: "Wolof",
  fon: "Fon",
  ber: "Tamazight",
  luo: "Luo",
  dyu: "Dioula",
  ff: "Fulfulde",
  kr: "Kanuri",
  mos: "Mossi",
  ses: "Songhay",
  bba: "Baatonum",
  ndc: "Ndau",
  bem: "Bemba",
  tum: "Tumbuka",
  crs: "Seychellois Creole",
  lua: "Luba-Lulua",
  tn: "Tswana",
  ve: "Venda",
  ss: "Swati",
  nr: "South Ndebele",
};

const origIsSupported = langsModule.isSupported;
const origGetCode = langsModule.getCode;

langsModule.isSupported = function (lang: string) {
    if (origIsSupported(lang))  {
        return true
    } else if (lang.toLowerCase() in extraLangs)  {
        return extraLangs[lang.toLowerCase()]
    }
}

langsModule.getCode = function (lang: string) {
    const value = origGetCode(lang)
    if (value !== "UNSUPPORTED")  {
        return value
    } else if (lang.toLowerCase() in extraLangs)  {
        return lang.toLowerCase()
    } else {
        return "UNSUPPORTED"
    }
}

export async function POST(request: NextRequest) {
    const { text, target } = await request.json();
    if (!text || !target) {
        return Response.json({ error: "Missing 'text' or 'target' parameter" }, { status: 400 });
    }
    try {
        const result = await tr(text, target);
        return Response.json({ textArray: result.textArray, src: result.src });
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}

/*
import { NextRequest } from "next/server";

const extraLangs: Record<string, string> = {
  wo: "Wolof",
  fon: "Fon",
  ber: "Tamazight",
  luo: "Luo",
  dyu: "Dioula",
  ff: "Fulfulde",
  kr: "Kanuri",
  mos: "Mossi",
  ses: "Songhay",
  bba: "Baatonum",
  ndc: "Ndau",
  bem: "Bemba",
  tum: "Tumbuka",
  crs: "Seychellois Creole",
  lua: "Luba-Lulua",
  tn: "Tswana",
  ve: "Venda",
  ss: "Swati",
  nr: "South Ndebele",
};

const langsModule = require("googletrans/lib/languages");
const origIsSupported = langsModule.isSupported;
const origGetCode = langsModule.getCode;

langsModule.isSupported = function (lang: string) {
  if (origIsSupported(lang)) return true;
  const lower = lang.toLowerCase();
  return lower in extraLangs || Object.values(extraLangs).some(
    (name: string) => name.toLowerCase() === lower
  );
};

langsModule.getCode = function (lang: string) {
  const original = origGetCode(lang);
  if (original !== "UNSUPPORTED") return original;
  const lower = lang.toLowerCase();
  if (lower in extraLangs) return lower;
  const entry = Object.entries(extraLangs).find(
    ([, name]) => name.toLowerCase() === lower
  );
  return entry ? entry[0] : "UNSUPPORTED";
};

const tr = require("googletrans").default;

export async function POST(request: NextRequest) {
  const { text, target } = await request.json();

  if (!text || !target) {
    return Response.json(
      { error: "Missing 'text' or 'target' parameter" },
      { status: 400 }
    );
  }

  const result = await tr(text, target);
  return Response.json({ textArray: result.textArray, src: result.src });
}
*/