
export type MeetingResponse = {
  tipo: "generico" | "faccao" | "protetiva";
  monitoradosEncontro: number[];
  timestamp: string;
  posicoes: Record<number, { lat: number; lon: number }>;
  distanciaMetros: number;
};
