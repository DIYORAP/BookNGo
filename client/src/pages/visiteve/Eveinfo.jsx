import React from 'react'
import { MdLocationOn } from "react-icons/md";
import MapComponent from '../../components/MapComponent';
import { MdDateRange } from "react-icons/md";

function Eveinfo() {
    const datetime = "2020-03-16";

    return (
        <div className='ml-32 mr-32'>

            <time className="text-gray-500">
                {datetime}
            </time>

            <h1 className='font-serif text-6xl font-semibold'> ahmedabad visiting thank you are visiting sardardham</h1>
            <div className='text-sm m-4'>
                Discover the UK's investment hotspots and learn which location you should invest in this year.
            </div>

            <div className='font-semibold text-3xl mt-4'>Date and time</div>
            <MdDateRange className='mr-3 w-6 h-6 m-3' />

            <div className=' font-semibold text-3xl mt-5'>Location</div>
            <div className='flex mt-3'> <MdLocationOn className='mr-3 w-6 h-6 m-3' />
                <p className='font-semibold m-3' >Ahmedabad</p>
            </div>

            <div className='ml-40 mt-4'>
                <MapComponent location={"surat,india"} />
            </div>


            <div className='m-2 mt-4'>
                <h2 className='text-3xl'> About event</h2>
                <p> event info: </p>
                <p> eevnt price</p>
            </div>

        </div>
    )
}

export default Eveinfo
