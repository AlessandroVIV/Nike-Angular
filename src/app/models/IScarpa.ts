export interface IScarpa {
  id: number;
  nome: string;
  categoria: string;
  prezzo: number;
  taglieDisponibili: { taglia: string }[];
  coloriDisponibili: { colore: string }[];
  descrizione: string;
  immagine: { url: string }[];
  nuovoArrivi?: boolean;
  bestSeller?: number;
  recensioni: any;
  genere: any;
  taglia: any;
  colore: any;
}
  