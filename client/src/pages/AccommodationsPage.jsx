import { Link, Navigate, useParams } from "react-router-dom";
import PlacesFormPage from "./PlacesFormPage";
import { useEffect, useState } from "react";


export default function AccommodationsPage() {
    const {action} = useParams();
    const [places, setPlaces] = useState([]); 

    useEffect(async () => {
        const res = await axios.get('places');
        setPlaces(res.data)
    }, []);
    
    return (
        <div>
        {action !== 'new' && (
            <div className="text-center">
                List of all added places
                <br/>
                <Link className='inline-flex gap-1 bg-primary text-white rounded-full py-2 px-6' to={'/account/accommodations/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    Add New Accommodation</Link>
            </div>
        )}
        {action === 'new' && (
            <PlacesFormPage/>
         )}
    </div> 
    ); 
}