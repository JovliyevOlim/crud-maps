"use client"

import * as React from "react";
import {MapContainer, TileLayer, Polygon, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {polygon as turfPolygon, area as turfArea, booleanIntersects} from "@turf/turf";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "@/hooks/use-toast";

type LatLng = [number, number];

export default function Maps() {
    const [vertices, setVertices] = React.useState<LatLng[]>([]);
    const [polygons, setPolygons] = React.useState<LatLng[][]>([]);
    const [areas, setAreas] = React.useState<number[]>([]);
    const [intersections, setIntersections] = React.useState<boolean[]>([]);

    const addVertex = (latlng: LatLng) => {
        setVertices(prev => [...prev, latlng]);
    };

    const clearVertices = () => setVertices([]);

    const savePolygon = () => {
        if (vertices.length < 3) {
            toast({title: "Xatolik", description: "Polygon uchun kamida 3 vertex kerak!", variant: "destructive"});
            return;
        }

        // Turf uchun [lng, lat]
        const coords = vertices.map(([lat, lng]) => [lng, lat]);
        const newPolyTurf = turfPolygon([[...coords, coords[0]]]); // polygonni yopish
        const newArea = turfArea(newPolyTurf);

        let intersects = false;

        polygons.forEach(existingPoly => {
            const existingCoords = existingPoly.map(([lat, lng]) => [lng, lat]);
            const existingPolygon = turfPolygon([[...existingCoords, existingCoords[0]]]);
            if (booleanIntersects(newPolyTurf, existingPolygon)) {
                intersects = true;
            }
        });

        setPolygons(prev => [...prev, vertices]);
        setAreas(prev => [...prev, newArea]);
        setIntersections(prev => [...prev, intersects]);

        toast({
            title: "Saqlash muvaffaqiyatli",
            description: `Polygon saqlandi. Area: ${(newArea / 1_000_000).toFixed(3)} km²${intersects ? " (Intersection bor!)" : ""}`
        });

        clearVertices();
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
                {/* Saqlangan polygonlar */}
                {polygons.map((poly, idx) => (
                    <Polygon
                        key={idx}
                        positions={poly}
                        pathOptions={{color: intersections[idx] ? "red" : "green"}}
                    />
                ))}
                {/* Hozir chizilayotgan polygon */}
                {vertices.length > 0 && <Polygon positions={vertices} pathOptions={{color: "blue"}}/>}
            </MapContainer>

            <div className="flex gap-2">
                <Button onClick={savePolygon} disabled={vertices.length < 3}>Save Polygon</Button>
                <Button variant="outline" onClick={clearVertices} disabled={vertices.length === 0}>Clear</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {polygons.map((poly, idx) => (
                    <Card key={idx} className="border">
                        <CardHeader>
                            <CardTitle>Polygon #{idx + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Vertices: {poly.length}</p>
                            <p>Area: {(areas[idx] / 1_000_000).toFixed(3)} km²</p>
                            {intersections[idx] && <p className="text-red-500 font-bold">Intersection detected!</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}