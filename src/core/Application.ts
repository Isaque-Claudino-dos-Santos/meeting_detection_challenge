import { calcDistance } from "../utils";

export type Response = {
  tipo: "generico" | "faccao" | "protetiva";
  monitoradosEncontro: number[];
  timestamp: string;
  posicoes: Record<number, { lat: number; lon: number }>;
  distanciaMetros: number;
};

export default class Application {
  async getCsvRows(fileName: string) {
    const file = Bun.file(fileName);
    return await file
      .text()
      .then((text) => text.split("\n").map((row) => row.split(";")));
  }

  async processMeetings($dataSet: string) {
    const rows = await this.getCsvRows($dataSet);
    const response: Response[] = [];

    for (let row = 0; row < rows.length; row++) {
      const [
        idA,
        factionIdA,
        timestampA,
        latitudeA,
        longitudeA,
        hasProtectiveMeasureA,
        idsMeasureRestrionA,
      ] = rows[row] ?? [];

      rows.forEach(
        ([
          idB,
          factionIdB,
          timestampB,
          latitudeB,
          longitudeB,
          hasProtectiveMeasureB,
          idsMeasureRestrionB,
        ]) => {
          if (idA == idB || timestampA != timestampB) return;

          const distance = calcDistance(
            {
              latitude: Number(latitudeA),
              longitude: Number(longitudeA),
            },
            {
              latitude: Number(latitudeB),
              longitude: Number(longitudeB),
            },
          );

          if (distance > 20) return;

          let tipo: Response["tipo"] =
            factionIdA == factionIdB
              ? "faccao"
              : hasProtectiveMeasureA &&
                  idsMeasureRestrionA?.split(",")?.includes(idB!)
                ? "protetiva"
                : "generico";

          const data: Response = {
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
            timestamp: String(timestampA).replaceAll('\"', ""),
            monitoradosEncontro: [Number(idA), Number(idB)],
          };

          response.push(data);
        },
      );
    }

    const outFile = `temp/out-${Date.now()}.json`;

    await Bun.write(outFile, JSON.stringify(response));
  }

  async run() {
    this.processMeetings('dataset1.txt')
  }
}
