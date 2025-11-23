import {create} from "zustand";
import {PolygonData, db} from "@/db/mapsDb";

interface MapState {
    polygons: PolygonData[];
    loadPolygons: () => Promise<void>;
    addPolygon: (polygon: Omit<PolygonData, "id">) => Promise<void>;
    updatePolygon: (id: number, polygon: Omit<PolygonData, "id">) => Promise<void>;
    removePolygon: (id: number) => Promise<void>;
    reset: () => Promise<void>;
}

export const useMapStore = create<MapState>((set, get) => ({
    polygons: [],

    loadPolygons: async () => {
        const data = await db.polygons.toArray();
        set({polygons: data});
    },

    addPolygon: async (polygon) => {
        const id = await db.polygons.add(polygon);
        set({polygons: [...get().polygons, {...polygon, id}]});
    },

    updatePolygon: async (id, polygon) => {
        await db.polygons.update(id, polygon);
        set({
            polygons: get().polygons.map(p => p.id === id ? {...p, ...polygon} : p)
        });
    },

    removePolygon: async (id) => {
        await db.polygons.delete(id);
        set({polygons: get().polygons.filter(p => p.id !== id)});
    },

    reset: async () => {
        await db.polygons.clear();
        set({polygons: []});
    }
}));