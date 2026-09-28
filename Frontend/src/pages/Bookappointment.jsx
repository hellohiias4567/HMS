import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios'

const Bookappointment = () => {
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [profile, setProfile] = useState('')


    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        phoneNumber: '',
        maritalStatus: '',
        gender: '',
        bloodGroup: '',
        age: '',
        department: '',
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
    });
    const [data, setData] = useState([])
    const [docdata, setDocData] = useState([])

    const getdata = () => {
        axios.get('http://localhost:3001/getdep')
            .then((res) => {
                console.log(res)
                setData(res.data)
            })
            .catch((err) => { console.log(err) })
    }
    const getdocdata = () => {
        axios.get('http://localhost:3001/getdoctor')
            .then((res) => {
                console.log(res)
                setDocData(res.data)
            })
            .catch((er) => { console.log(err) })
    }
    useEffect(() => {
        getdata()
        getdocdata()

    }, [])
    useEffect(() => {
        if (formData.department) {
            setFilteredDoctors(docdata.filter(doctor => doctor.spcialization === formData.department));
        } else {
            setFilteredDoctors([]);
        }
    }, [formData.department]);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here (e.g., API call)
        console.log(formData);
        const data = new FormData();
        for (let key in formData) {
          data.append(key, formData[key]);
        }
        console.log(formData)
        axios.post('http://localhost:3001/appointment',{formData})
        .then((res)=>{
            console.log(res)
            if (res.data.status === 'success') {
                setProfile('Appointment Booked Successfully!')
            } else {
                setProfile('Server Error')
            }

        })
        .catch((err) => { console.log(err) })
    };
    useEffect(() => {
        if (profile !== '') {
            window.scroll(0, 0)
            setTimeout(() => {
                setProfile('')
                setFormData({
                    name: '',
                    fatherName: '',
                    phoneNumber: '',
                    maritalStatus: '',
                    gender: '',
                    bloodGroup: '',
                    age: '',
                    department: '',
                    doctor: '',
                    appointmentDate: null,
                    appointmentTime: ''
                })
            }, 2000);
        }
    }, [profile])
    return (

        <>
            <Navbar />
            <div className="max-w-lg mx-auto p-6  shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Book an Appointment</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="" className="text-xl text-red-600">{profile}</label>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                            placeholder="Enter full name"
                        />
                    </div>

                    {/* Father's Name */}
                    <div>
                        <label className="block text-sm font-medium">Father's Name</label>
                        <input
                            type="text"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                            placeholder="Enter father's name"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label className="block text-sm font-medium">Marital Status</label>
                        <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                        >
                            <option value="">Select status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                        </select>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="block text-sm font-medium">Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                        >
                            <option value="">Select blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                            placeholder="Enter age"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium">Department</label>
                        <select name="department" value={formData.department} onChange={handleChange} className="p-3 border dark:border-none w-full dark:border dark:border-none-none rounded-lg" required>
                            <option value="">Select Department</option>
                            {data.map((department) => (
                                <option key={department.name} value={department.name}>{department.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Doctor */}
                    <div>
                        <label className="block text-sm font-medium">Doctor</label>
                        <select name="doctor" value={formData.doctor} onChange={handleChange} className="p-3 w-full border dark:border-none dark:border dark:border-none-none rounded-lg" required>

                            {!formData.department ? <option value="">Choose Department First</option> : <option value="">Select Doctor</option>}
                            {filteredDoctors.map((doctor) => (
                                <option key={doctor.name} value={doctor.name}>{doctor.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Appointment Date */}
                    <div>
                        <label className="block text-sm font-medium">Appointment Date</label>
                        <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                        />
                    </div>

                    {/* Appointment Time */}
                    <div>
                        <label className="block text-sm font-medium">Appointment Time</label>
                        <input
                            type="time"
                            name="appointmentTime"
                            value={formData.appointmentTime}
                            onChange={handleChange}
                            required
                            className="w-full border dark:border-none px-4 py-2 rounded"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-500 w-full text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Book Appointment
                        </button>
                    </div>
                </form>
            </div>
        </>

    );
};

export default Bookappointment;
