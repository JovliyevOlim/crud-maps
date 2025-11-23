import Dexie from "dexie";

export interface LatLng {
    lat: number;
    lng: number
}

export interface PolygonData {
    id?: number;
    vertices: [number, number][];
    area: number;
}

class MapsDB extends Dexie {
    polygons!: Dexie.Table<PolygonData, number>;

    constructor() {
        super("MapsDB");
        this.version(1).stores({
            polygons: "++id",
        });
    }
}

export const db = new MapsDB();