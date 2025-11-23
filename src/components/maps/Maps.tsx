"use client"

import * as React from "react";
import {MapContainer, TileLayer, Polygon, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {polygon as turfPolygon, area as turfArea, booleanIntersects} from "@turf/turf";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "@/hooks/use-toast";
import {useMapStore} from "@/store/maps.store";

type LatLng = [number, number];

export default function Maps() {
    const [vertices, setVertices] = React.useState<LatLng[]>([]);
    const [editingId, setEditingId] = React.useState<number | null>(null);
    const {polygons, loadPolygons, addPolygon, updatePolygon, removePolygon, reset} = useMapStore();

    React.useEffect(() => {
        loadPolygons();
    }, []);

    const addVertex = (latlng: LatLng) => setVertices(prev => [...prev, latlng]);
    const clearVertices = () => {
        setVertices([]);
        setEditingId(null);
    };

    const savePolygonHandler = async () => {
        if (vertices.length < 3) {
            toast({description: "Polygon uchun kamida 3 vertex kerak!", variant: "destructive"});
            return;
        }

        const coordsTurf = vertices.map(([lat, lng]) => [lng, lat]);
        const newPolyTurf = turfPolygon([[...coordsTurf, coordsTurf[0]]]);
        const newArea = turfArea(newPolyTurf);

        try {
            if (editingId !== null) {
                await updatePolygon(editingId, {vertices, area: newArea});
                toast({description: "Polygon muvaffaqiyatli yangilandi", variant: "success"});
            } else {
                await addPolygon({vertices, area: newArea});
                toast({
                    description: `Polygon saqlandi. Area: ${(newArea / 1_000_000).toFixed(3)} km²`,
                    variant: "success"
                });
            }
        } catch (e) {
            toast({description: "Polygon saqlashda xato yuz berdi", variant: "destructive"});
        }

        clearVertices();
    };

    const editPolygon = (poly: any) => {
        setEditingId(poly.id!);
        setVertices(poly.vertices);
    };

    const removePolygonHandler = async (id: number) => {
        await removePolygon(id);
        toast({title: "O‘chirildi", description: "Polygon muvaffaqiyatli o‘chirildi"});
    };

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                addVertex([e.latlng.lat, e.latlng.lng]);
            }
        });
        return null;
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <MapContainer center={[41.3111, 69.2797]} zoom={12} style={{height: "500px", width: "100%"}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <MapClickHandler/>
                {polygons.map(poly => (
                    <Polygon key={poly.id} positions={poly.vertices} pathOptions={{color: "green"}}/>
                ))}
                {vertices.length > 0 && <Polygon positions={vertices} pathOptions={{color: "blue"}}/>}
            </MapContainer>

            <div className="flex gap-2">
                <Button onClick={savePolygonHandler} disabled={vertices.length < 3}>
                    {editingId !== null ? "Update Polygon" : "Save Polygon"}
                </Button>
                <Button variant="outline" onClick={clearVertices} disabled={vertices.length === 0}>Clear</Button>
                <Button variant="destructive" onClick={reset}>Reset All</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {polygons.map(poly => (
                    <Card key={poly.id} className="border">
                        <CardHeader>
                            <CardTitle>Polygon #{poly.id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Vertices: {poly.vertices.length}</p>
                            <p>Area: {(poly.area / 1_000_000).toFixed(3)} km²</p>
                            <div className="flex gap-2 mt-2">
                                <Button size="sm" onClick={() => editPolygon(poly)}>Edit</Button>
                                <Button size="sm" variant="destructive"
                                        onClick={() => removePolygonHandler(poly.id!)}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}