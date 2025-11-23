import './App.css'
import {BrowserRouter, Link, Navigate, NavLink, Route, Routes} from "react-router-dom";
import Users from "@/pages/Users";
import MapPage from "@/pages/Maps";

function App() {

    return (
        <>

            <BrowserRouter>
                <div className="flex gap-4">
                    <NavLink
                        to="/users"
                        className={({isActive}) =>
                            `px-3 py-2 rounded-md text-sm font-medium transition 
       ${isActive ? "bg-primary text-white" : "text-foreground hover:bg-accent"}`
                        }
                    >
                        Users
                    </NavLink>

                    <NavLink
                        to="/maps"
                        className={({isActive}) =>
                            `px-3 py-2 rounded-md text-sm font-medium transition 
       ${isActive ? "bg-primary text-white" : "text-foreground hover:bg-accent"}`
                        }
                    >
                        Map
                    </NavLink>
                </div>
                <Routes>
                    <Route path="/" element={<Navigate to="/users" replace/>}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route path="/maps" element={<MapPage/>}/>
                </Routes>
            </BrowserRouter>
        </>

    )
}

export default App
