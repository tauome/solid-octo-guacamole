import axios from "axios";
import { useState } from "react";
import Perks from "../Perks";
import { Navigate } from "react-router-dom";

export default function PlacesFormPage() {
    const [photos, setPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState(''); 
    const [title, setTitle] = useState(''); 
    const [address, setAddress] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [perks, setPerks] = useState(''); 
    const [checkIn, setCheckIn] = useState('');
    const [checkout, setCheckout] = useState(''); 
    const [maxGuests, setMaxGuests] = useState(1); 
    const [redirect, setRedirect] = useState(false); 

    async function addPhotoByLink(ev){
        ev.preventDefault(); 
        const {data: filename} = await axios.post('/upload-by-link', {link: photoLink}); 
        setPhotos(prev => {
            return [...prev, filename]
        });
        setPhotoLink(''); 
    };

    
    async function uploadPhoto(ev){
        const files = ev.target?.files;
        const data = new FormData(); 
        for (const file of files){    
            data.append('photos', file)
        };
        const res = await axios.post('/upload', data, {
            headers: {'Content-type': 'multipart/form-data'},
        })
        setPhotos(prev => {
            return [...prev, ...res.data]
        })
    };

    async function addNewPlace(ev) {
        ev.preventDefault(); 
        const res = await axios.post('/place', {
            title,
            address,
            photos,
            description,
            perks,
            checkIn,
            checkout,
            maxGuests
        }, {withCredentials: true}); 
        setRedirect(true); 
        console.log(res); 
    }

    if (redirect) {
        return <Navigate to={'/account/accommodations'}/>
    }

    return (
        <div>
            <form onSubmit={addNewPlace}>
                <h2>Title</h2>
                <input type="text" placeholder="title. For example: My lovely apartment" 
                value={title}
                onChange={ev => setTitle(ev.target.value)}></input>
                <h2>Address</h2>
                <input type="text" placeholder="address" 
                value={address} 
                onChange={ev => setAddress(ev.target.value)}></input>
                <h2>Photos</h2>
                <p className="text-gray-500">Upload photos here</p>
                <div className="flex gap-2">
                        <input type="text" placeholder="Add using a link ...jpg" 
                        value={photoLink} 
                        onChange={ev => setPhotoLink(ev.target.value)}></input>
                        <button className="bg-gray-200 rounded-2xl px-4" onClick={addPhotoByLink}>Add Photo</button>
                </div>
                <div className="mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                    {photos.length > 0 && photos.map((photo, idx) => {
                        return (
                            <div className="h-32 flex" key={idx}>
                               <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/'+photo}></img> 
                            </div>
                        )
                    })}
                    <label className="flex items-center justify-center cursor-pointer border bg-transparent rounded-2xl p-2 text-2xl">+ Upload
                    <input multiple type="file" className="hidden" onChange={uploadPhoto}></input>
                    </label>
                </div>
                <h2>Description</h2>
                <p className="text-gray-500">Add a description here</p>
                <textarea className="" 
                value={description} 
                onChange={ev => setDescription(ev.target.value)}/>
                <Perks perks={perks} setPerks={setPerks}/>
                <h2>Check In/Check Out</h2>
                <p className="text-gray-500">add check in and checkout times </p>
                <div className="grid sm:grid-cols-3 gap-2">
                    <div className="mt-2 -mb-1">
                        <h3>Check-In Time</h3>
                        <input type="text" 
                        placeholder="14.00" 
                        value={checkIn} 
                        onChange={ev => setCheckIn(ev.target.value)}/>
                    </div>
                    <div className="mt-2 -mb-1">
                        <h3>Check-out Time</h3>
                        <input type="text" 
                        placeholder="14.00" 
                        value={checkout} 
                        onChange={ev => setCheckout(ev.target.value)}/>
                    </div>
                    <div className="mt-2 -mb-1">
                        <h3>Max Guests</h3>
                        <input type="number" 
                        value={maxGuests} 
                        onChange={ev => setMaxGuests(ev.target.value)} />
                    </div>
                </div>
                <button className="primary my-4">Save</button>
            </form>
        </div>
    ); 
}