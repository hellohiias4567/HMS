const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AdminModel = require('./models/admin')
const DoctorModel = require('./models/doctor')
const ReceptionistModel = require('./models/receptionist')
const MessageModel = require('./models/message')
const DepartmentModel = require('./models/department')
const AppointmentModel = require('./models/appointment')
const result = await uploadToCloudinary(req.file.buffer);
const imageUrl = result.secure_url;

// const path = require('path');
const uploadRoutes = require('./routes/upload');
const multer = require('multer');
const router = express.Router();







const SCREAT_KEY = "Umair"
const app = express(

)
app.use(cors({
    origin: 'https://sunshinehospital-six.vercel.app',

    credentials: true
}));
app.use(express.json(

))
mongoose.connect('mongodb+srv://hmsadmin:Password@hms-cluster.aqgv3kh.mongodb.net/?appName=HMS-Cluster')

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify upload directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // unique file name
    }
});

const upload = multer({ storage: storage });

// ****
app.use('/api', uploadRoutes);

// Public Requests

app.post('/message', async (req, res) => {
    try {

        const { name, email, message, title } = req.body;
        const ress = new MessageModel({
            name, email, message, title
        })
        await ress.save();
        res.json({ status: 'success' })
    } catch (err) {
        console.error(err);
        res.json({ 'status': 'Server error' });
    }

})
app.get('/getmessages', (req, res) => {
    MessageModel.find()
        .then(ress => res.json(ress))
        .catch(err => res.json(err))
}
)
app.post('/messagedel', async (req, res) => {
    const { id } = req.body
    try {
        const admin = await MessageModel.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ error: 'Message not found' });
        }

        return res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
    }
})
// HM Departments
app.post('/adddep', async (req, res) => {
    try {

        const { name, description } = req.body;
        const ress = new DepartmentModel({
            name, description
        })
        await ress.save();
        res.json({ status: 'success' })
    } catch (err) {
        console.error(err);
        res.json({ 'status': 'Server error' });
    }


})
app.get('/getdep', (req, res) => {
    DepartmentModel.find()
        .then(ress => res.json(ress))
        .catch(err => res.json(err))
}
)
app.post('/depdel', async (req, res) => {
    const { id } = req.body
    try {
        const admin = await DepartmentModel.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ error: 'Department not found' });
        }

        return res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
    }
})

// Appointment 
app.post('/appointment', async (req, res) => {
    try {

        const { name, fatherName, phoneNumber, maritalStatus, gender, bloodGroup, age, department, doctor, appointmentDate, appointmentTime } = req.body.formData;
        const status = 'Pending'

        const data = new AppointmentModel({
            name,
            fatherName,
            phoneNumber,
            maritalStatus,
            gender,
            bloodGroup,
            age,
            department,
            doctor,
            appointmentDate,
            appointmentTime,
            status
        });
        await data.save();
        res.json({ status: 'success' })

    }
    catch (err) {
        console.error(err);
        res.json({ 'status': 'Server error' });
    }
})
app.get('/apointcount', async (req, res) => {
    AppointmentModel.find()
        .then(ress => res.json(ress))
        .catch(err => res.json(err))
})
app.post('/appointdel', async (req, res) => {
    const { id } = req.body
    try {
        const admin = await AppointmentModel.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ error: 'Message not found' });
        }

        return res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
    }
})
app.post('/apointupdate', async (req, res) => {
    const { id, status } = req.body;
    try {


        const apoint = await AppointmentModel.findByIdAndUpdate(id, { status }, { new: true })
        if (apoint) {
            res.json({ status: 'success' })
        }
        else {
            res.json({ 'error': '303' })

        }


    }
    catch (err) {
        console.log(err)
        res.json({ status: 'Server error' });

    }
})
// Admin Setup
app.get('/', (req, res) => {
    return res.json({ 'status': 'work' })
})
app.post('/adminrigister', upload.single('profilePic'), async (req, res) => {
    try {

        const { name, email, password, phonenumber, gender } = req.body;
        const existingUser = await AdminModel.findOne({ email })
        



        if (existingUser) {
            return res.json({ 'status': 'already' })
        } else {


            const passwordhash = await bcrypt.hash(password, 10)


            let imageUrl = null;

            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer);
                imageUrl = result.secure_url;
            }

            const admin = new AdminModel({
                name,
                email,
                phonenumber,
                password: passwordhash,
                gender,
                // image: req.file ? req.file.filename : null
                image: imageUrl
            });
            await admin.save();
            res.json({ status: 'success' })
        }
    }
    catch (err) {
        console.error(err);
        res.json({ 'status': 'Server error' });
    }
})
app.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body;
    const existingadmin = await AdminModel.findOne({ email })

    if (existingadmin) {
        const pass = await bcrypt.compare(password, existingadmin.password)

        if (!pass) {
            return res.json({ 'status': 'nopass' })
        }
        const token = jwt.sign({ adminid: existingadmin._id, admin: existingadmin }, SCREAT_KEY, { expiresIn: '5h' })
        console.log(token)
        res.json({ token, adminid: existingadmin._id, type: 'admin' });

    } else {
        const doc = await DoctorModel.findOne({ email })
        if (doc) {
            const pass = await bcrypt.compare(password, doc.password)

            if (!pass) {
                return res.json({ 'status': 'nopass' })
            }
            const token = jwt.sign({ docid: doc._id, doctor: doc }, SCREAT_KEY, { expiresIn: '5h' })
            // console.log(token)
            res.json({ token, docid: doc._id, type: 'doctor' });
        } else {
            const rep = await ReceptionistModel.findOne({ email })
            if (rep) {
                const pass = await bcrypt.compare(password, rep.password)

                if (!pass) {
                    return res.json({ 'status': 'nopass' })
                }
                const token = jwt.sign({ repid: rep._id, receptionist: doc }, SCREAT_KEY, { expiresIn: '5h' })
                // console.log(token)
                res.json({ token, repid: rep._id, type: 'receptionist' });
            } else {
                return res.json({ 'status': 'invalid' });

            }


        }


    }
})
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.json({ 'Status': 'fail1' });
    }

    jwt.verify(token, SCREAT_KEY, (err, user) => {
        if (err) {
            return res.json({ 'Status': 'fail2' });
        }

        req.user = user;

        next();
    });
};

// Protected Route (e.g., Dashboard)
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!', user: req.user });

});

/// Making Changes for Admin 

// app.post('/adminupdate', upload.single('profilePic'), async (req, res) => {
//     const { id, name, email, phonenumber } = req.body;
//     try {
//         const admindata = await AdminModel.findById(id)
//         if (admindata) {

//             const admin = await AdminModel.findByIdAndUpdate(id, { name, email, phonenumber, image: req.file ? req.file.filename : admindata.image }, { new: true })
//             if (admin) {
//                 res.json(admin)
//             }
//             else {
//                 res.json({ 'error': '303' })

//             }
//         }

//     }
//     catch (err) {
//         console.log(err)
//         res.json({ status: 'Server error' });

//     }
// })


app.post('/adminupdate', upload.single('profilePic'), async (req, res) => {

    try {

        const {
            id,
            name,
            email,
            phonenumber
        } = req.body;

        const admindata = await AdminModel.findById(id);

        if (!admindata) {
            return res.status(404).json({
                error: 'Admin not found'
            });
        }

        let imageUrl = admindata.image;

        if (req.file) {

            const result = await uploadToCloudinary(
                req.file.buffer
            );

            imageUrl = result.secure_url;
        }

        const admin = await AdminModel.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phonenumber,
                image: imageUrl
            },
            {
                new: true
            }
        );

        return res.json(admin);

    } catch (err) {

        console.error('ADMIN UPDATE ERROR:', err);

        return res.status(500).json({
            status: 'Server error',
            error: err.message
        });
    }
});



app.post('/adminpass', async (req, res) => {
    const { id, password, newpassword } = req.body;
    try {

        const admin = await AdminModel.findOne({ _id: id })
        if (admin) {
            const pass = await bcrypt.compare(password, admin.password);
            if (pass) {
                const hashedNewPassword = await bcrypt.hash(newpassword, 10);
                admin.password = hashedNewPassword;
                await admin.save(); // Save the updated admin document

                return res.json({ message: 'success' });

            } else {
                res.json({ 'status': 'nopass' })
            }
        }
        else {
            res.json({ 'error': '303' })

        }
    }
    catch (err) {
        console.log(err)
        res.json({ status: 'Server error', 'error': err });

    }
})

app.post('/admindata', async (req, res) => {
    const { id } = req.body
    const admin = await AdminModel.findOne({ _id: id })
    if (admin) {
        res.json(admin)
    }
    else {
        return res.json({ 'status': 'invalid' });

    }

})
app.post('/admindelete', async (req, res) => {
    const { id } = req.body
    try {
        const admin = await AdminModel.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        return res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
    }
})
app.get('/getadmin', (req, res) => {
    AdminModel.find()
        .then(ress => res.json(ress))
        .catch(err => res.json(err))
}
)
/// Doctor Addition via Admin
// app.post('/docrigister', upload.single('profilePic'), async (req, res) => {
//     try {

//         const { name, email, password, phonenumber, gender, spcialization, age, bg, address } = req.body;
//         const existingUser = await DoctorModel.findOne({ email })
//         if (existingUser) {
//             return res.json({ 'status': 'already' })
//         } else {


//             const passwordhash = await bcrypt.hash(password, 10)

//             const doc = new DoctorModel({
//                 name,
//                 email,
//                 phonenumber,
//                 password: passwordhash,
//                 gender, spcialization, age, bg, address,
//                 // image: req.file ? req.file.filename : null
//                 image: imageUrl
//             });
//             await doc.save();
//             res.json({ status: 'success' })
//         }
//     }
//     catch (err) {
//         console.error(err);
//         res.json({ 'status': 'Server error' });
//     }
// })




app.post('/docrigister', upload.single('profilePic'), async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            phonenumber,
            gender,
            spcialization,
            age,
            bg,
            address
        } = req.body;

        const existingUser = await DoctorModel.findOne({ email });

        if (existingUser) {
            return res.json({ status: 'already' });
        }

        const passwordhash = await bcrypt.hash(password, 10);

        let imageUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
        }

        const doc = new DoctorModel({
            name,
            email,
            password: passwordhash,
            phonenumber,
            gender,
            spcialization,
            age,
            bg,
            address,
            image: imageUrl
        });

        await doc.save();

        res.json({
            status: 'success'
        });

    } catch (err) {

        console.error('DOCTOR REGISTER ERROR:', err);

        res.status(500).json({
            status: 'Server error',
            error: err.message
        });
    }
});

app.get('/getdoctor', (req, res) => {
    DoctorModel.find()
        .then(ress => res.json(ress))
        .catch(err => res.json(err))
}
)
app.post('/doctordata', async (req, res) => {
    const { id } = req.body
    const doc = await DoctorModel.findOne({ _id: id })
    if (doc) {
        res.json(doc)
    }
    else {
        return res.json({ 'status': 'invalid' });

    }

})
// app.post('/docupdate', upload.single('profilePic'), async (req, res) => {
//     const { id, name, email, phonenumber, spcialization, age } = req.body;
//     try {
//         const doc = await DoctorModel.findById(id)
//         if (doc) {

//             const admin = await DoctorModel.findByIdAndUpdate(id, { name, email, phonenumber, spcialization, age, image: req.file ? req.file.filename : doc.image }, { new: true })
//             if (admin) {
//                 res.json(admin)
//             }
//             else {
//                 res.json({ 'error': '303' })

//             }
//         }

//     }
//     catch (err) {
//         console.log(err)
//         res.json({ status: 'Server error' });

//     }
// })



app.post('/docupdate', upload.single('profilePic'), async (req, res) => {
    try {
        const {
            id,
            name,
            email,
            phonenumber,
            spcialization,
            age
        } = req.body;

        const doc = await DoctorModel.findById(id);

        if (!doc) {
            return res.status(404).json({
                error: 'Doctor not found'
            });
        }

        let image = doc.image;

        // Upload new image only if user selected one
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            image = result.secure_url;
        }

        const updatedDoctor = await DoctorModel.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phonenumber,
                spcialization,
                age,
                image
            },
            {
                new: true
            }
        );

        return res.json(updatedDoctor);

    } catch (err) {
        console.error('DOCUPDATE ERROR:', err);

        return res.status(500).json({
            status: 'Server error',
            error: err.message
        });
    }
});




app.post('/docdelete', async (req, res) => {
    const { id } = req.body
    try {
        const admin = await DoctorModel.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ error: 'doctor not found' });
        }

        return res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
    }
})
app.get('/doctorscount', async (req, res) => {
    try {
        const doctorCount = await DoctorModel.countDocuments();
        res.json({ count: doctorCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get doctor count' });
    }
})

// receptionist Addition via Admin
app.post('/reprigister', upload.single('profilePic'), async (req, res) => {
    try {

        const { name, email, password, phonenumber, gender, shiftTiming, age, bg, address } = req.body;
        const existingUser = await ReceptionistModel.findOne({ email })
        if (existingUser) {
            return res.json({ 'status': 'already' })
        } else {


            const passwordhash = await bcrypt.hash(password, 10)

            let imageUrl = null;

            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer);
                imageUrl = result.secure_url;
            }

            const doc = new ReceptionistModel({
                name,
                email,
                phonenumber,
                password: passwordhash,
                gender, shiftTiming, age, bg, address,
                // image: req.file ? req.file.filename : null
                image: imageUrl
            });
            await doc.save();
            res.json({ status: 'success' })
        }
    }
    catch (err) {
        console.error(err);
        res.json({ 'status': 'Server error' });
    }
})
app.get('/getrep', (req, res) => {
    ReceptionistModel.find()
        .then(ress => res.json(ress))
        .catch(err => res.json(err))
}
)
app.post('/repupdate', upload.single('profilePic'), async (req, res) => {
    const { id, name, email, phonenumber, shiftTiming, age } = req.body;
    try {
        const doc = await ReceptionistModel.findById(id)
        if (doc) {

            const admin = await ReceptionistModel.findByIdAndUpdate(id, { name, email, phonenumber, shiftTiming, age, image: req.file ? req.file.filename : doc.image }, { new: true })
            if (admin) {
                res.json(admin)
            }
            else {
                res.json({ 'error': '303' })

            }
        }

    }
    catch (err) {
        console.log(err)
        res.json({ status: 'Server error' });

    }
})
app.post('/repdata', async (req, res) => {
    const { id } = req.body
    const doc = await ReceptionistModel.findOne({ _id: id })
    if (doc) {
        res.json(doc)
    }
    else {
        return res.json({ 'status': 'invalid' });

    }

})
app.post('/repdelete', async (req, res) => {
    const { id } = req.body
    try {
        const admin = await ReceptionistModel.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ error: 'doctor not found' });
        }

        return res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
    }
})
app.get('/repcount', async (req, res) => {
    try {
        const doctorCount = await ReceptionistModel.countDocuments();
        res.json({ count: doctorCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get doctor count' });
    }
})


/// Doctor config
app.post('/doctorupdate', upload.single('profilePic'), async (req, res) => {
    const { id, name, email, phonenumber, age } = req.body;
    try {
        const doc = await DoctorModel.findById(id)
        if (doc) {

            const admin = await DoctorModel.findByIdAndUpdate(id, { name, email, phonenumber, age, image: req.file ? req.file.filename : doc.image }, { new: true })
            if (admin) {
                res.json(admin)
            }
            else {
                res.json({ 'error': '303' })

            }
        }

    }
    catch (err) {
        console.log(err)
        res.json({ status: 'Server error' });

    }
})
app.post('/docpass', async (req, res) => {
    const { id, password, newpassword } = req.body;
    try {

        const doc = await DoctorModel.findOne({ _id: id })
        if (doc) {
            const pass = await bcrypt.compare(password, doc.password);
            if (pass) {
                const hashedNewPassword = await bcrypt.hash(newpassword, 10);
                doc.password = hashedNewPassword;
                await doc.save(); // Save the updated admin document

                return res.json({ message: 'success' });

            } else {
                res.json({ 'status': 'nopass' })
            }
        }
        else {
            res.json({ 'error': '303' })

        }
    }
    catch (err) {
        console.log(err)
        res.json({ status: 'Server error', 'error': err });

    }
})


/// Receptionist config
app.post('/repupdate', upload.single('profilePic'), async (req, res) => {
    const { id, name, email, phonenumber,  age } = req.body;
    try {
        const doc = await ReceptionistModel.findById(id)
        if (doc) {
            let imageUrl = doc.image;

            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer);
                imageUrl = result.secure_url;
            }
            const admin = await ReceptionistModel.findByIdAndUpdate(id, { name, email, phonenumber, age, 
                // image: req.file ? req.file.filename : doc.image
                image: imageUrl
             }, { new: true })
            if (admin) {
                res.json(admin)
            }
            else {
                res.json({ 'error': '303' })

            }
        }

    }
    catch (err) {
        console.log(err)
        res.json({ status: 'Server error' });

    }
})
app.post('/reppass', async (req, res) => {
    const { id, password, newpassword } = req.body;
    try {

        const doc = await ReceptionistModel.findOne({ _id: id })
        if (doc) {
            const pass = await bcrypt.compare(password, doc.password);
            if (pass) {
                const hashedNewPassword = await bcrypt.hash(newpassword, 10);
                doc.password = hashedNewPassword;
                await doc.save(); // Save the updated admin document

                return res.json({ message: 'success' });

            } else {
                res.json({ 'status': 'nopass' })
            }
        }
        else {
            res.json({ 'error': '303' })

        }
    }
    catch (err) {
        console.log(err)
        res.json({ status: 'Server error', 'error': err });

    }
})





app.listen(3001, () => {
    console.log("server is running")

})