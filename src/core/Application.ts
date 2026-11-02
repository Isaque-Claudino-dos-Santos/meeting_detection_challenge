import type { MeetingResponse } from "../definitions";
import { calcDistance, unique } from "../utils";

export default class Application {
  async processMeetings(csv: string) {
    const response: MeetingResponse[] = [];
    const timestamps =
      csv.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/gm)?.filter(unique) ??
      [];

    for (const timestamp of timestamps) {
      const regex = new RegExp(`^(.*)(${timestamp})(.*)$`, "gm");
      const rows = csv.match(regex) ?? [];

      for (let i = 0; i < rows.length; i++) {
        for (let j = i + 1; j < rows.length; j++) {
          const [
            idA,
            factionIdA,
            timestampA,
            latitudeA,
            longitudeA,
            hasProtectiveMeasureA,
            idsMeasureRestrionA,
          ] = rows[i]?.split(";") ?? [];
          const [idB, factionIdB, _, latitudeB, longitudeB] =
            rows[j]?.split(";") ?? [];

          const distance = calcDistance(
            Number(latitudeA),
            Number(longitudeA),
            Number(latitudeB),
            Number(longitudeB),
          );

          if (distance >= 20) continue;

          let tipo: MeetingResponse["tipo"] =
            factionIdA == factionIdB
              ? "faccao"
              : hasProtectiveMeasureA &&
                  idsMeasureRestrionA?.split(",")?.includes(idB!)
                ? "protetiva"
                : "generico";

          response.push({
            tipo,
            distanciaMetros: distance,
            posicoes: {
              [Number(idA)]: {
                lat: Number(latitudeA),
                lon: Number(longitudeA),
              },
              [Number(idB)]: {
                lat: Number(latitudeB),
                lon: Number(longitudeB),
              },
            },
            timestamp: timestampA?.replaceAll('\"', "")!,
            monitoradosEncontro: [Number(idA), Number(idB)],
          });
        }
      }
    }
    const outFile = `temp/out-${Date.now()}.json`;
    await Bun.write(outFile, JSON.stringify(response));
  }

  async run(urlOrFile: string) {
    let csv;

    if (urlOrFile.includes("http")) {
      csv = await fetch(urlOrFile).then((res) => res.text());
    } else {
      csv = await Bun.file(urlOrFile).text();
    }

    if (!csv) {
      throw new Error("erro ao procurar arquivo CSV");
    }

    this.processMeetings(csv);
  }
}
